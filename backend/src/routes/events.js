const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

// Create Event
router.post("/", async (req, res) => {
  const {
    ipAddress,
    location,
    elementId,
    elementContent,
    traceEvent,
    traceEventName,
    url,
    deviceType,
    browser,
    additionalData,
  } = req.body;

  try {
    const event = await prisma.event.create({
      data: {
        ipAddress,
        location,
        elementId,
        elementContent,
        traceEvent,
        traceEventName,
        url,
        deviceType,
        browser,
        additionalData,
      },
    });
    res.status(201).json(event);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Failed to create event" });
  }
});

module.exports = router;