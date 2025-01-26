const express = require("express");
const { PrismaClient } = require("@prisma/client");
const sendEmail = require("../utilities/sendEmail");
const cron = require("node-cron");

const prisma = new PrismaClient();
const router = express.Router();

let scheduledJobs = {}; // Store scheduled jobs for each URL or configuration

// Utility function for URL match type
function getWhereClause(urlMatchType, column) {
  switch (urlMatchType) {
    case "exact":
      return `${column} = $1`;
    case "contains":
      return `${column} ILIKE '%' || $1 || '%'`;
    case "startsWith":
      return `${column} ILIKE $1 || '%'`;
    case "endsWith":
      return `${column} ILIKE '%' || $1`;
    default:
      throw new Error("Invalid urlMatchType");
  }
}

// Function to execute SQL for PLT insights
const executePltAnalysis = async (config) => {
  const { urlPath, urlMatchType } = config;

  const whereClause = getWhereClause(urlMatchType, `"url"`);
  const pltSQL = `
    WITH SessionUrlFlow AS (
      SELECT
        "sessionId",
        "url",
        "createdAt",
        LEAD("url") OVER (PARTITION BY "sessionId" ORDER BY "createdAt") AS next_url
      FROM "Event"
      WHERE "traceEvent" = 'page-visit'
    ),
    SessionConversion AS (
      SELECT
        "sessionId",
        "url",
        CASE
          WHEN next_url IS NOT NULL THEN 'converted'
          ELSE 'non-converted'
        END AS conversion_status
      FROM SessionUrlFlow
    ),
    PLTByConversion AS (
      SELECT
        e."url",
        CONCAT(ROUND(AVG(CAST(e."additionalData"->>'pageLoadTime' AS NUMERIC)), 2), 'ms') AS pageLoadTime,
        sc.conversion_status
      FROM "Event" e
      JOIN SessionConversion sc
        ON e."sessionId" = sc."sessionId" AND e."url" = sc."url"
      WHERE e."traceEvent" = 'page-visit'
      GROUP BY e."url", sc.conversion_status
    )
    SELECT *
    FROM PLTByConversion
    WHERE ${whereClause};
  `;

  try {
    const result = await prisma.$queryRawUnsafe(pltSQL, urlPath);
    if (result.length > 0) {
      const emailContent = `
        Dear User,
        Here are the Page Load Time insights for ${urlPath}:

        ${result
          .map(
            (row) => `
          - ${row.conversion_status === "converted" ? "Converted" : "Non-Converted"} Users:
            URL: ${row.url}
            PLT: ${row.pageloadtime}`
          )
          .join("\n\n")}

        Thank you,
        TraceAI
      `;

      await sendEmail("tsaikarthik@yahoo.in", "PLT Insights", emailContent);
      console.log(`PLT Insights email sent for ${urlPath}.`);
    }
  } catch (error) {
    console.error(`Error fetching PLT insights for ${urlPath}:`, error);
  }
};

// Function to execute uninteracted time analysis
const executeUninteractedTimeAnalysis = async (config) => {
  const { urlPath, urlMatchType } = config;

  const whereClause = getWhereClause(urlMatchType, `"url"`);
  const uninteractedTimeSQL = `
    WITH RankedEvents AS (
      SELECT
        "sessionId",
        "url",
        "traceEvent",
        "createdAt",
        LAG("traceEvent") OVER (
          PARTITION BY "sessionId", "url"
          ORDER BY "createdAt"
        ) AS "previousEvent",
        LAG("createdAt") OVER (
          PARTITION BY "sessionId", "url"
          ORDER BY "createdAt"
        ) AS "previousEventTime"
      FROM "Event"
      WHERE "traceEvent" IN ('page-visit', 'page-in', 'page-out')
    ),
    FilteredEvents AS (
      SELECT
        "sessionId",
        "url",
        "traceEvent",
        "createdAt",
        "previousEvent",
        "previousEventTime"
      FROM RankedEvents
      WHERE "traceEvent" != "previousEvent" OR "previousEvent" IS NULL
    ),
    PageVisitTimes AS (
      SELECT
        "sessionId",
        "url",
        MIN("createdAt") AS "pageVisitedAt"
      FROM FilteredEvents
      WHERE "traceEvent" = 'page-visit'
      GROUP BY "sessionId", "url"
    ),
    UninteractedTime AS (
      SELECT
        "sessionId",
        "url",
        SUM(EXTRACT(EPOCH FROM ("createdAt" - "previousEventTime"))) AS uninteractedTime
      FROM FilteredEvents
      WHERE "traceEvent" = 'page-in'
        AND "previousEvent" = 'page-out'
      GROUP BY "sessionId", "url"
    ),
    NextUrl AS (
      SELECT
        "sessionId",
        "url",
        LEAD("url") OVER (
          PARTITION BY "sessionId"
          ORDER BY MIN("pageVisitedAt")
        ) AS nextUrl
      FROM PageVisitTimes
      GROUP BY "sessionId", "url"
    ),
    ConversionStatus AS (
      SELECT
        v."sessionId",
        v."url",
        v."pageVisitedAt",
        COALESCE(u.uninteractedTime, 0) AS "uninteractedTime",
        CASE
          WHEN n.nextUrl IS NOT NULL AND v."url" != n.nextUrl THEN 'converted'
          ELSE 'non-converted'
        END AS conversion_status
      FROM PageVisitTimes v
      LEFT JOIN UninteractedTime u
        ON v."sessionId" = u."sessionId" AND v."url" = u."url"
      LEFT JOIN NextUrl n
        ON v."sessionId" = n."sessionId" AND v."url" = n."url"
    )
    SELECT
      "url",
      "conversion_status",
      ROUND(AVG("uninteractedTime") / 60, 2) AS average_uninteracted_time
    FROM ConversionStatus
    WHERE ${whereClause}
    GROUP BY "url", "conversion_status";
  `;

  try {
    const result = await prisma.$queryRawUnsafe(uninteractedTimeSQL, urlPath);
    if (result.length > 0) {
      const emailContent = `
        Dear User,
        Here are the Uninteracted Time insights for ${urlPath}:

        ${result
          .map(
            (row) => `
          - ${row.conversion_status === "converted" ? "Converted" : "Non-Converted"} Users:
            URL: ${row.url}
            Average Uninteracted Time: ${row.average_uninteracted_time} minutes`
          )
          .join("\n\n")}

        Thank you,
        TraceAI
      `;

      await sendEmail("tsaikarthik@yahoo.in", "Uninteracted Time Insights", emailContent);
      console.log(`Uninteracted Time Insights email sent for ${urlPath}.`);
    }
  } catch (error) {
    console.error(`Error fetching Uninteracted Time insights for ${urlPath}:`, error);
  }
};

// Function to schedule tasks dynamically
const scheduleTask = (config, taskExecutor) => {
  const { id, notificationFrequency } = config;

  if (scheduledJobs[id]) {
    scheduledJobs[id].stop();
  }

  const cronExpression = `*/${notificationFrequency} * * * *`; // Run every `notificationFrequency` minutes
  const job = cron.schedule(cronExpression, async () => {
    await taskExecutor(config);
  });

  scheduledJobs[id] = job;
  console.log(`Scheduled task for config ID ${id}.`);
};

// Initialize all scheduled tasks on server start
const initializeSchedulers = async () => {
  try {
    const configs = await prisma.dropoffNotificationConfig.findMany();
    configs.forEach((config) => {
      scheduleTask(config, executePltAnalysis); // Schedule PLT Analysis
      scheduleTask(config, executeUninteractedTimeAnalysis); // Schedule Uninteracted Time Analysis
    });
  } catch (error) {
    console.error("Error initializing schedulers:", error);
  }
};

// Run the scheduler on start
initializeSchedulers();

module.exports = router;
