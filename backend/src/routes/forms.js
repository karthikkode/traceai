const express = require("express");
const { PrismaClient } = require("@prisma/client");
const  sendEmail  = require("../utilities/sendEmail"); // Import the email utility
const cron = require("node-cron"); // To run the task every hour

const prisma = new PrismaClient();
const router = express.Router();

// POST API to log form field interaction
router.post("/logFormInteraction", async (req, res) => {
    const { form_id, field_name, field_content, field_rank, sessionId } = req.body;
  
    // Validate request payload
    if (!form_id || !field_name || field_rank === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }
  
    try {
      // Create a new record in the FormFieldInteraction table
      const newInteraction = await prisma.formFieldInteraction.create({
        data: {
          form_id,
          field_name,
          field_content,
          field_rank,
          sessionId
        },
      });
  
      return res
        .status(201)
        .json({ message: "Form interaction logged successfully", data: newInteraction });
    } catch (error) {
      console.error("Error logging form interaction:", error);
      return res.status(500).json({ error: "Failed to log form interaction" });
    }
  });

  // Drop-off analysis function
const analyzeFormDropOffs = async () => {
  try {
    // Drop-Off Analysis Query
    const dropOffData = await prisma.$queryRaw`
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
          f1."field_name" AS "current_field",
          f1."user_count" AS "current_users",
          f2."user_count" AS "previous_users",
          ROUND(((f2."user_count" - f1."user_count")::numeric / NULLIF(f2."user_count", 0)) * 100, 2) AS "drop_off_percentage"
        FROM FieldCounts f1
        LEFT JOIN FieldCounts f2
          ON f1."form_id" = f2."form_id" AND f1."field_rank" = f2."field_rank" + 1
        ORDER BY f1."field_rank"
      )
      SELECT * FROM DropOffAnalysis WHERE "drop_off_percentage" > 40; -- Only significant drop-offs
    `;

    if (dropOffData.length > 0) {
      dropOffData.forEach(async (drop) => {
        const { current_field, drop_off_percentage } = drop;

        const emailSubject = `Significant Drop-Off Alert: ${current_field}`;
        const emailText = `
          Alert: Significant drop-off detected in your form!
          Field: ${current_field}
          Drop-Off Rate: ${drop_off_percentage}%
          Suggestion: This field is causing a high drop-off rate. Consider simplifying or removing this field to encourage more users to complete the form.
        `;

        // Send Email Notification
        await sendEmail("tsaikarthik@yahoo.in", emailSubject, emailText);
      });
    }

    console.log("Drop-Off Analysis Completed");
  } catch (error) {
    console.error("Error analyzing drop-offs:", error);
  }
};

// Schedule the drop-off analysis to run every hour
cron.schedule("29 * * * *", async () => {
  console.log("Running hourly drop-off analysis...");
  await analyzeFormDropOffs();
});

module.exports = router;