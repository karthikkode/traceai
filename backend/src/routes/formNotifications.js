const express = require("express");
const { PrismaClient } = require("@prisma/client");
const sendEmail = require("../utilities/sendEmail"); // Import the email utility
const cron = require("node-cron"); // To run the task
const axios = require("axios");

const prisma = new PrismaClient();
const router = express.Router();

let scheduledJobs = {}; // Store cron jobs for each form_id

// Get all Form Notification Configs
router.get("/formNotificationConfigs", async (req, res) => {
  try {
    const configs = await prisma.formNotificationConfig.findMany();
    res.status(200).json({ success: true, data: configs });
  } catch (error) {
    console.error("Error fetching form notification configs:", error);
    res.status(500).json({ success: false, error: "Failed to fetch configs." });
  }
});

// Create a new Form Notification Config
router.post("/formNotificationConfigs", async (req, res) => {
  const { formId, dropOffPercentage, notificationFrequency } = req.body;

  if (!formId || !dropOffPercentage || !notificationFrequency) {
    return res.status(400).json({
      success: false,
      error:
        "Form ID, Drop-off Percentage, and Notification Frequency are required.",
    });
  }

  try {
    const newConfig = await prisma.formNotificationConfig.create({
      data: {
        formId,
        dropOffPercentage,
        notificationFrequency,
      },
    });

    scheduleFormJob(newConfig); // Schedule the new form job
    res.status(201).json({ success: true, data: newConfig });
  } catch (error) {
    console.error("Error creating form notification config:", error);
    res.status(500).json({ success: false, error: "Failed to create config." });
  }
});

// Update an existing Form Notification Config
router.put("/formNotificationConfigs/:id", async (req, res) => {
  const { id } = req.params;
  const { formId, dropOffPercentage, notificationFrequency } = req.body;

  if (!formId || !dropOffPercentage || !notificationFrequency) {
    return res.status(400).json({
      success: false,
      error:
        "Form ID, Drop-off Percentage, and Notification Frequency are required.",
    });
  }

  try {
    const updatedConfig = await prisma.formNotificationConfig.update({
      where: { id },
      data: {
        formId,
        dropOffPercentage,
        notificationFrequency,
      },
    });

    rescheduleFormJob(updatedConfig); // Reschedule the job
    res.status(200).json({ success: true, data: updatedConfig });
  } catch (error) {
    console.error("Error updating form notification config:", error);
    res.status(500).json({ success: false, error: "Failed to update config." });
  }
});

// Delete a Form Notification Config
router.delete("/formNotificationConfigs/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedConfig = await prisma.formNotificationConfig.delete({
      where: { id },
    });

    cancelScheduledJob(deletedConfig.formId); // Cancel the scheduled job
    res.status(200).json({ success: true, message: "Config deleted successfully." });
  } catch (error) {
    console.error("Error deleting form notification config:", error);
    res.status(500).json({ success: false, error: "Failed to delete config." });
  }
});

// Function to execute the formSQL and send email
const analyzeFormDropOffs = async (dropOffPercentage, formId) => {
  const formSQL = `
    WITH LatestInteractions AS (
      SELECT DISTINCT ON ("sessionId", "field_name") 
        "id", 
        "field_name", 
        "form_id", 
        "field_rank", 
        "sessionId", 
        "createdAt"
      FROM "FormFieldInteraction"
      ORDER BY "sessionId", "field_name", "createdAt" DESC
    ),
    FieldCounts AS (
      SELECT 
        COUNT("id") AS "user_count",
        "field_name",
        "form_id",
        "field_rank"
      FROM LatestInteractions
      GROUP BY "field_name", "form_id", "field_rank"
    ),
    DropOffAnalysis AS (
      SELECT
        f1."form_id",
        f1."field_name" AS "current_field",
        f1."user_count" AS "current_users",
        f2."user_count" AS "previous_users",
        ROUND(((f2."user_count" - f1."user_count")::numeric / NULLIF(f2."user_count", 0)) * 100, 2) AS "drop_off_percentage"
      FROM FieldCounts f1
      LEFT JOIN FieldCounts f2
        ON f1."form_id" = f2."form_id" AND f1."field_rank" = f2."field_rank" + 1
      ORDER BY f1."field_rank"
    )
    SELECT * FROM DropOffAnalysis 
    WHERE "drop_off_percentage" >= ${dropOffPercentage} 
    AND form_id = '${formId}'
  `;

  try {
    const result = await prisma.$queryRawUnsafe(formSQL);

    if (result.length > 0) {
      const formattedFields = result
        .map(
          (field) =>
            `- Field: ${field.current_field}, Drop-Off Percentage: ${field.drop_off_percentage}%`
        )
        .join("\n");

      const emailContent = `
      Dear User,

      The following fields in form "${formId}" have exceeded the drop-off threshold (${dropOffPercentage}%):

      ${formattedFields}

      Please review and take necessary action.

      Thank you,
      TraceAI
      `;

      // Send email
      await sendEmail("tsaikarthik@yahoo.in", `Form "${formId}" Drop-Off Alert`, emailContent);
      console.log(`Email sent for form "${formId}".`);
    } else {
      console.log(`No fields exceeded drop-off percentage for form "${formId}".`);
    }
  } catch (error) {
    console.error("Error analyzing form drop-offs:", error);
  }
};

// Function to schedule a job for a specific form
const scheduleFormJob = (config) => {
  const { formId, dropOffPercentage, notificationFrequency } = config;

  // Cancel any existing job for this formId
  cancelScheduledJob(formId);

  // Schedule the new job
  const cronExpression = `*/${notificationFrequency} * * * *`; // Run every notificationFrequency minutes
  const job = cron.schedule(cronExpression, async () => {
    console.log(`Running drop-off analysis for form "${formId}".`);
    await analyzeFormDropOffs(dropOffPercentage, formId);
  });

  scheduledJobs[formId] = job; // Store the job reference
  console.log(`Scheduled job for form "${formId}" to run every ${notificationFrequency} minutes.`);
};

// Function to cancel a scheduled job
const cancelScheduledJob = (formId) => {
  if (scheduledJobs[formId]) {
    scheduledJobs[formId].stop();
    delete scheduledJobs[formId];
    console.log(`Cancelled job for form "${formId}".`);
  }
};

// Function to reschedule a job for a specific form
const rescheduleFormJob = (config) => {
  scheduleFormJob(config);
};

// Initialize scheduler for all existing configs on server start
const initializeSchedulers = async () => {
  try {
    const configs = await prisma.formNotificationConfig.findMany();
    configs.forEach(scheduleFormJob);
  } catch (error) {
    console.error("Error initializing schedulers:", error);
  }
};

// Call the initialize function on startup
initializeSchedulers();

module.exports = router;
