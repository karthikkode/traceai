const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

// Create a new dropoff notification config
router.post("/dropoffConfig", async (req, res) => {
  try {
    const {
      urlPath,
      urlGroupName,
      dropoffPercentage,
      notificationFrequency,
      urlMatchType, // Include the new field
    } = req.body;

    const config = await prisma.dropoffNotificationConfig.create({
      data: {
        urlPath,
        urlGroupName,
        dropoffPercentage,
        notificationFrequency,
        urlMatchType, // Include the new field
      },
    });

    res.status(201).json({ success: true, data: config });
  } catch (error) {
    console.error("Error creating dropoff notification config:", error);
    res.status(500).json({ error: "Failed to create configuration" });
  }
});

// Get all dropoff notification configs
router.get("/dropoffConfig", async (req, res) => {
  try {
    const configs = await prisma.dropoffNotificationConfig.findMany();

    res.status(200).json({ success: true, data: configs });
  } catch (error) {
    console.error("Error fetching dropoff notification configs:", error);
    res.status(500).json({ error: "Failed to fetch configurations" });
  }
});

// Update an existing dropoff notification config
router.put("/dropoffConfig/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      urlPath,
      urlGroupName,
      dropoffPercentage,
      notificationFrequency,
      urlMatchType, // Include the new field
    } = req.body;

    const updatedConfig = await prisma.dropoffNotificationConfig.update({
      where: { id },
      data: {
        urlPath,
        urlGroupName,
        dropoffPercentage,
        notificationFrequency,
        urlMatchType, // Include the new field
      },
    });

    res.status(200).json({ success: true, data: updatedConfig });
  } catch (error) {
    console.error("Error updating configuration:", error);
    res.status(500).json({ error: "Failed to update configuration" });
  }
});

// Delete a config
router.delete("/dropoffConfig/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.dropoffNotificationConfig.delete({
      where: { id },
    });

    res.status(200).json({ success: true, message: "Configuration deleted successfully" });
  } catch (error) {
    console.error("Error deleting configuration:", error);
    res.status(500).json({ error: "Failed to delete configuration" });
  }
});

module.exports = router;
