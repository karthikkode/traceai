const express = require("express");
const { PrismaClient } = require("@prisma/client");
const sendEmail = require("../utilities/sendEmail");
const cron = require("node-cron");

const prisma = new PrismaClient();
const router = express.Router();

let scheduledJobs = {}; // Store scheduled jobs for each URL or configuration

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

const executeUninteractedTimeAnalysis = async (config) => {
  const { urlPath, urlMatchType } = config;
  console.log("executeUninteractedTimeAnalysis")

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

const executetimeSpentReportAnalysis = async (config) => {
  const { urlPath, urlMatchType } = config;

  const whereClause = getWhereClause(urlMatchType, `prev_url`);
  const timeSpentSQL =`
  WITH TimeSpentData AS (
    SELECT
      "additionalData"->>'prevUrl' AS prev_url,
      (CAST("additionalData"->>'prevUrlExitTime' AS BIGINT) - CAST("additionalData"->>'prevUrlEnterTime' AS BIGINT)) AS time_spent
    FROM "Event"
    WHERE "traceEvent" = 'page-visit'
      AND "additionalData"->>'prevUrl' IS NOT NULL
  ),
  AverageTimeSpent AS (
    SELECT
      prev_url,
      CONCAT(ROUND(AVG(time_spent)::NUMERIC / 1000, 2), 's') AS avg_time_spent
    FROM TimeSpentData
    GROUP BY prev_url
  )
  SELECT *
  FROM AverageTimeSpent
  WHERE ${whereClause};
  ;`

  try {
    const result = await prisma.$queryRawUnsafe(timeSpentSQL, urlPath);
    if (result.length > 0) {
      const emailContent = `
      Dear User,
  
      Here are the Time Spent insights for the requested URL: ${urlPath}:
      ${result
        .map(
          (row) => `
          URL: ${row.prev_url}
          Average Time Spent: ${row.avg_time_spent}`
        )
        .join("\n\n")}

        Thank you,
        TraceAI
      `;

      await sendEmail("tsaikarthik@yahoo.in", "Time Spent on Page Insights", emailContent);
      console.log(`Time Spent on Page Insights email sent for ${urlPath}.`);
    }
  } catch (error) {
    console.error(`Error fetching Uninteracted Time insights for ${urlPath}:`, error);
  }
};

const executePageExitsReportAnalysis = async (config) => {
  const { urlPath, urlMatchType } = config;

  const whereClause = getWhereClause(urlMatchType, `"url"`);
  const pageExitsSQL = `
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
    WHERE ("traceEvent" != "previousEvent" OR "previousEvent" IS NULL) AND "traceEvent" = 'page-out'
  ),
  NextUrl AS (
    SELECT
      "sessionId",
      "url",
      LEAD("url") OVER (
        PARTITION BY "sessionId"
        ORDER BY "createdAt"
      ) AS next_url
    FROM FilteredEvents
  ),
  SessionExits AS (
    SELECT
      f."sessionId",
      f."url",
      CASE
        WHEN n.next_url IS NOT NULL THEN 'converted'
        ELSE 'non-converted'
      END AS conversion_status,
      COUNT(*) AS page_exits
    FROM FilteredEvents f
    LEFT JOIN NextUrl n
      ON f."sessionId" = n."sessionId" AND f."url" = n."url"
    GROUP BY f."sessionId", f."url", conversion_status
  )
  SELECT
    "url",
    conversion_status,
    ROUND(AVG(page_exits)::NUMERIC, 0) AS avg_page_exits_per_session
  FROM SessionExits
  WHERE ${whereClause}
  GROUP BY "url", conversion_status
  ORDER BY "url", conversion_status;
;`

  try {
    const result = await prisma.$queryRawUnsafe(pageExitsSQL, urlPath);
    if (result.length > 0) {
      const emailContent = `
      Dear User,
  
      Here are the average page exits per session for the requested URL: ${urlPath}:
      ${result
        .map(
          (row) => `
          URL: ${row.url}
          Average Page Exits: ${row.avg_page_exits_per_session}`
        )
        .join("\n\n")}

        Thank you,
        TraceAI
      `;

      await sendEmail("tsaikarthik@yahoo.in", "Page Exit Insights", emailContent);
      console.log(`Page Exit Insights email sent for ${urlPath}.`);
    }
  } catch (error) {
    console.error(`Error fetching Uninteracted Time insights for ${urlPath}:`, error);
  }
};

// Function to calculate drop-off percentage and send notifications
const executeDropOffAnalysis = async (config) => {
  const { urlPath, urlMatchType, dropoffPercentage, urlGroupName } = config;

  const whereClause = getWhereClause(urlMatchType, `"url"`);

  const dropOffSQL = `
    WITH PageVisits AS (
      SELECT
        "sessionId",
        "url",
        MIN("createdAt") AS pageVisitedAt
      FROM "Event"
      WHERE "traceEvent" = 'page-visit'
      GROUP BY "sessionId", "url"
    ),
    SessionConversion AS (
      SELECT
        pv."sessionId",
        pv."url",
        CASE
          WHEN EXISTS (
            SELECT 1
            FROM "Event" e
            WHERE e."sessionId" = pv."sessionId"
              AND e."traceEvent" = 'page-visit'
              AND e."url" != pv."url"
              AND e."createdAt" > pv.pageVisitedAt
          ) THEN 'converted'
          ELSE 'non-converted'
        END AS conversion_status
      FROM PageVisits pv
    ),
    ConversionNumbers AS (
      SELECT
        "url",
        SUM(CASE WHEN conversion_status = 'converted' THEN 1 ELSE 0 END) AS converted_sessions,
        SUM(CASE WHEN conversion_status = 'non-converted' THEN 1 ELSE 0 END) AS non_converted_sessions,
        ROUND((SUM(CASE WHEN conversion_status = 'converted' THEN 1 ELSE 0 END)::decimal / COUNT(*)) * 100, 2) AS converted_percentage,
        ROUND((SUM(CASE WHEN conversion_status = 'non-converted' THEN 1 ELSE 0 END)::decimal / COUNT(*)) * 100, 2) AS non_converted_percentage
      FROM SessionConversion
      GROUP BY "url"
    )
    SELECT *
    FROM ConversionNumbers
    WHERE ${whereClause};
  `;

  try {
    const result = await prisma.$queryRawUnsafe(dropOffSQL, urlPath);

    if (result.length > 0) {
      const dropOffData = result[0]; // Assuming we have a single row for the URL

      // Check if drop-off percentage exceeds the threshold
      if (dropOffData.non_converted_percentage >= dropoffPercentage) {
        const emailContent = `
          Dear User,
          The drop-off rate for the URL "${urlPath}" has exceeded the configured threshold of ${dropoffPercentage}%.
          
          Drop-off Insights:
          - URL: ${dropOffData.url}
          - Converted Percentage: ${dropOffData.converted_percentage}%
          - Non-Converted Percentage: ${dropOffData.non_converted_percentage}%
          
          Please take appropriate actions to improve the user experience.
          
          Thank you,
          TraceAI
        `;

        await sendEmail(
          "tsaikarthik@yahoo.in",
          `${urlGroupName} Drop-off Alert`,
          emailContent
        );
        console.log(`Drop-off alert sent for URL: ${urlPath}`);
      } else {
        console.log(`Drop-off percentage for URL "${urlPath}" is within the acceptable range.`);
      }
    } else {
      console.log(`No data found for URL: ${urlPath}`);
    }
  } catch (error) {
    console.error(`Error calculating drop-off for URL ${urlPath}:`, error);
  }
};

// Function to schedule tasks dynamically
const scheduleTask = (config, taskExecutor, taskType) => {
  const { id, notificationFrequency, urlGroupName } = config;

  // Create a unique key for each task type
  const uniqueTaskKey = `${id}-${taskType}`;

  // Stop and remove any existing job for this unique task
  if (scheduledJobs[uniqueTaskKey]) {
    scheduledJobs[uniqueTaskKey].stop();
    delete scheduledJobs[uniqueTaskKey];
  }

  // Define cron expression (e.g., every `notificationFrequency` minutes)
  // const cronExpression = `*/${notificationFrequency} * * * *`;
  const cronExpression =  `16 * * * *`

  // Schedule the job
  const job = cron.schedule(cronExpression, async () => {
    console.log(`Executing ${taskType} for config ID ${id}, URL: ${config.urlPath}`);
    await taskExecutor(config);
  });

  // Store the job in the scheduledJobs object
  scheduledJobs[uniqueTaskKey] = job;

  console.log(`Scheduled ${taskType} for config ID ${id}. Cron Expression: ${cronExpression}.`);
};

// Update the scheduler to include drop-off analysis
const initializeSchedulers = async () => {
  try {
    const configs = await prisma.dropoffNotificationConfig.findMany();
    configs.forEach((config) => {
      scheduleTask(config, executePltAnalysis, "PLTAnalysis");
      scheduleTask(config, executeUninteractedTimeAnalysis, "UninteractedTimeAnalysis");
      scheduleTask(config, executePageExitsReportAnalysis, "PageExitsAnalysis");
      scheduleTask(config, executetimeSpentReportAnalysis, "TimeSpentReportAnalysis");
      scheduleTask(config, executeDropOffAnalysis, "DropOffAnalysis"); // Schedule drop-off analysis
    });
  } catch (error) {
    console.error("Error initializing schedulers:", error);
  }
};
initializeSchedulers()

module.exports = router;
