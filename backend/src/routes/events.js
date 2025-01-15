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

//get trending query
router.get("/trendingPhrases", async (req, res) => {
  try {
    const { timeRange, limit, traceEventName } = req.query;

    // Validate input
    if (!timeRange || !limit) {
      return res.status(400).json({
        error: "Missing required query parameters: timeRange and limit.",
      });
    }

    // Extract the numeric value and unit from the timeRange
    const match = timeRange.match(/^(\d+)([hmd])$/);
    if (!match) {
      return res.status(400).json({
        error: "Invalid timeRange format. Use formats like '2h', '12h', '1d', '1m'.",
      });
    }

    const [_, value, unit] = match; // Extracted numeric value and unit (h, d, m)

    // Convert to PostgreSQL interval
    let interval;
    switch (unit) {
      case "h":
        interval = `INTERVAL '${value} hour'`;
        break;
      case "d":
        interval = `INTERVAL '${value} day'`;
        break;
      case "m":
        interval = `INTERVAL '${value} month'`;
        break;
      default:
        return res.status(400).json({ error: "Invalid timeRange unit." });
    }

    // Query to fetch the top X trending phrases
    const trendingPhrasesQuery = `
      SELECT "elementContent" AS phrase, COUNT(*) AS count
      FROM "Event"
      WHERE "traceEvent" = 'trace-search' AND "createdAt" >= NOW() - ${interval} AND "traceEventName" = '${traceEventName}'
      GROUP BY "elementContent"
      ORDER BY count DESC
      LIMIT ${limit};
    `;

    console.log(trendingPhrasesQuery)
    
    const trendingPhrases = await prisma.$queryRawUnsafe(trendingPhrasesQuery, parseInt(limit, 10));
    const response = trendingPhrases.map((row) => ({
      ...row,
      count: row.count.toString(), // Convert BigInt to string
    }));
    res.status(200).json({ response });
  } catch (error) {
    console.error("Error fetching trending phrases:", error);
    res.status(500).json({ error: "Failed to fetch trending phrases." });
  } finally {
    await prisma.$disconnect();
  }
});


module.exports = router;