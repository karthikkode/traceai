const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

router.post("/", async (req, res) => {
  const { visitorId, eventType, elementId, url, deviceType, timestamp, additionalData, browser } = req.body;

  try {
    const event = await prisma.event.create({
      data: {
        visitorId,
        eventType,
        elementId,
        url,
        deviceType,
        timestamp: new Date(timestamp),
        additionalData,
        browser,
      },
    });
    res.status(201).json(event);
  } catch (error) {
    console.error("Error logging event:", error);
    res.status(500).json({ error: "Failed to log event" });
  }
});

router.get("/visitor/:visitorId", async (req, res) => {
  const { visitorId } = req.params;

  try {
    const events = await prisma.event.findMany({
      where: { visitorId },
    });
    res.status(200).json(events);
  } catch (error) {
    console.error("Error retrieving events:", error);
    res.status(500).json({ error: "Failed to retrieve events" });
  }
});

module.exports = router;