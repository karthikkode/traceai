const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();
const { createMetabaseFormsDashboard } = require("../routes/metabase")

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

router.post("/createFromsDashboard", async (req, res) => {
    try {
      const cardId = await createMetabaseFormsDashboard()
  
      return res
        .status(201)
        .json({ message: "Form Dashboard created successfully", cardId });
    } catch (error) {
      console.error("Error creating form dashboard:", error);
      return res.status(500).json({ error: "Failed to create form dashboard" });
    }
  });

module.exports = router;