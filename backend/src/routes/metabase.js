const axios = require("axios");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function authenticate() {
  const url = 'http://localhost:3002/api/session'; // Replace with your Metabase API URL
  const credentials = {
    username: 'Karthiktumusai@gmail.com', // Replace with your Metabase username
    password: 'Karthik123@' // Replace with your Metabase password
  };

  try {
    const response = await axios.post(url, credentials, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response.data.id; // Return the session token
  } catch (error) {
    console.error("Error authenticating:", error.response?.data || error.message);
    throw new Error("Authentication failed");
  }
}

async function createMetabaseFormsDashboard() {
  const sessionToken = await authenticate();
  console.log("sessionToken", sessionToken);
  const apiUrl = "http://localhost:3002/api/card";

  const requestBody = {
    // ... Form Dashboard request body
  };

  try {
    const response = await axios.post(apiUrl, requestBody, {
      headers: {
        "Content-Type": "application/json",
        "X-Metabase-Session": sessionToken
      }
    });

    try {
      const newDashboard = await prisma.metabaseDashboards.create({
        data: {
          dashboardName: "Form Dashboard",
          cardId: response.data.id,
        },
      });

      console.log("New Dashboard Created:", newDashboard);
    } catch (error) {
      console.error("Error inserting dashboard:", error);
    } finally {
      await prisma.$disconnect();
    }

    return response.data.id;
  } catch (error) {
    console.error("Error creating dashboard:", error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

async function createUninteractedTimeDashboard() {
  const sessionToken = await authenticate();
  console.log("sessionToken", sessionToken);
  const apiUrl = "http://localhost:3002/api/card";

  const requestBody = {
    name: "Uninteracted Time Dashboard",
    type: "question",
    dataset_query: {
      database: 2,
      type: "native",
      native: {
        "template-tags": {
          "url": {
            "type": "text",
            "name": "url",
            "id": "b4d330e3-ae1b-45a4-8167-e2acdf8a78e6",
            "display-name": "URL"
          },
          "conversion_status": {
            "type": "text",
            "name": "conversion_status",
            "id": "a4a05392-ae43-4dbd-8fdb-eb862f74ea2d",
            "display-name": "Conversion Status"
          }
        },
        "query": `WITH RankedEvents AS (
          SELECT ...
        )
        SELECT ...`
      }
    },
    display: "table",
    visualization_settings: {},
    parameters: [
      {
        id: "b4d330e3-ae1b-45a4-8167-e2acdf8a78e6",
        type: "category",
        target: ["variable", ["template-tag", "url"]],
        name: "URL",
        slug: "url"
      },
      {
        id: "a4a05392-ae43-4dbd-8fdb-eb862f74ea2d",
        type: "category",
        target: ["variable", ["template-tag", "conversion_status"]],
        name: "Conversion Status",
        slug: "conversion_status"
      }
    ]
  };

  try {
    const response = await axios.post(apiUrl, requestBody, {
      headers: {
        "Content-Type": "application/json",
        "X-Metabase-Session": sessionToken
      }
    });

    try {
      const newDashboard = await prisma.metabaseDashboards.create({
        data: {
          dashboardName: "Uninteracted Time Dashboard",
          cardId: response.data.id,
        },
      });

      console.log("New Dashboard Created:", newDashboard);
    } catch (error) {
      console.error("Error inserting dashboard:", error);
    } finally {
      await prisma.$disconnect();
    }

    return response.data.id;
  } catch (error) {
    console.error("Error creating dashboard:", error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

async function createPLTDashboard() {
    const sessionToken = await authenticate();
    console.log("sessionToken", sessionToken);
    const apiUrl = "http://localhost:3002/api/card";
  
    const requestBody = {
      name: "PLT Dashboard",
      type: "question",
      dataset_query: {
        database: 2,
        type: "native",
        native: {
          "template-tags": {
            "url": {
              "type": "text",
              "name": "url",
              "id": "f95370e4-1e5b-48c5-8fca-26b6ee94f87a",
              "display-name": "URL"
            },
            "conversion_status": {
              "type": "text",
              "name": "conversion_status",
              "id": "3415e84c-297c-4843-834f-73709661cd55",
              "display-name": "Conversion Status"
            }
          },
          "query": `WITH SessionUrlFlow AS (
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
          WHERE "url" = {{url}}
            AND conversion_status = {{conversion_status}};`
        }
      },
      display: "table",
      visualization_settings: {},
      parameters: [
        {
          id: "f95370e4-1e5b-48c5-8fca-26b6ee94f87a",
          type: "category",
          target: ["variable", ["template-tag", "url"]],
          name: "URL",
          slug: "url"
        },
        {
          id: "3415e84c-297c-4843-834f-73709661cd55",
          type: "category",
          target: ["variable", ["template-tag", "conversion_status"]],
          name: "Conversion Status",
          slug: "conversion_status"
        }
      ]
    };
  
    try {
      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          "Content-Type": "application/json",
          "X-Metabase-Session": sessionToken
        }
      });
  
      try {
        const newDashboard = await prisma.metabaseDashboards.create({
          data: {
            dashboardName: "PLT Dashboard",
            cardId: response.data.id,
          },
        });
  
        console.log("New Dashboard Created:", newDashboard);
      } catch (error) {
        console.error("Error inserting dashboard:", error);
      } finally {
        await prisma.$disconnect();
      }
  
      return response.data.id;
    } catch (error) {
      console.error("Error creating dashboard:", error);
      return null;
    } finally {
      await prisma.$disconnect();
    }
}

async function createTimeSpentOnPageDashboard() {
    const sessionToken = await authenticate();
    console.log("sessionToken", sessionToken);
    const apiUrl = "http://localhost:3002/api/card";
  
    const requestBody = {
      name: "Time Spent on Page by Converted Customers",
      type: "question",
      dataset_query: {
        database: 2,
        type: "native",
        native: {
          "template-tags": {
            "url": {
              "type": "text",
              "name": "url",
              "id": "4a8393e0-699c-4578-bea6-d76dd4cc7fe4",
              "display-name": "URL"
            }
          },
          "query": `WITH TimeSpentData AS (
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
          WHERE prev_url = {{url}};`
        }
      },
      display: "table",
      visualization_settings: {},
      parameters: [
        {
          id: "4a8393e0-699c-4578-bea6-d76dd4cc7fe4",
          type: "category",
          target: ["variable", ["template-tag", "url"]],
          name: "URL",
          slug: "url"
        }
      ]
    };
  
    try {
      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          "Content-Type": "application/json",
          "X-Metabase-Session": sessionToken
        }
      });
  
      try {
        const newDashboard = await prisma.metabaseDashboards.create({
          data: {
            dashboardName: "Time Spent on Page by Converted Customers",
            cardId: response.data.id,
          },
        });
  
        console.log("New Dashboard Created:", newDashboard);
      } catch (error) {
        console.error("Error inserting dashboard:", error);
      } finally {
        await prisma.$disconnect();
      }
  
      return response.data.id;
    } catch (error) {
      console.error("Error creating dashboard:", error);
      return null;
    } finally {
      await prisma.$disconnect();
    }
}
  
async function createPageExitsCountDashboard() {
    const sessionToken = await authenticate();
    console.log("sessionToken", sessionToken);
    const apiUrl = "http://localhost:3002/api/card";
  
    const requestBody = {
      name: "Page Exits Count Dashboard",
      type: "question",
      dataset_query: {
        database: 2,
        type: "native",
        native: {
          "template-tags": {
            "url": {
              "type": "text",
              "name": "url",
              "id": "f50e5b07-973f-49bf-8957-66780bb45bfd",
              "display-name": "URL"
            }
          },
          "query": `WITH RankedEvents AS (
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
          )
          SELECT "url", COUNT(1) AS average_page_exits
          FROM FilteredEvents
          WHERE "url" LIKE {{url}}
          GROUP BY "url";`
        }
      },
      display: "table",
      visualization_settings: {},
      parameters: [
        {
          id: "f50e5b07-973f-49bf-8957-66780bb45bfd",
          type: "category",
          target: ["variable", ["template-tag", "url"]],
          name: "URL",
          slug: "url"
        }
      ]
    };
  
    try {
      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          "Content-Type": "application/json",
          "X-Metabase-Session": sessionToken
        }
      });
  
      try {
        const newDashboard = await prisma.metabaseDashboards.create({
          data: {
            dashboardName: "Page Exits Count Dashboard",
            cardId: response.data.id,
          },
        });
  
        console.log("New Dashboard Created:", newDashboard);
      } catch (error) {
        console.error("Error inserting dashboard:", error);
      } finally {
        await prisma.$disconnect();
      }
  
      return response.data.id;
    } catch (error) {
      console.error("Error creating dashboard:", error);
      return null;
    } finally {
      await prisma.$disconnect();
    }
  }
  
module.exports = {
  createMetabaseFormsDashboard,
  createUninteractedTimeDashboard,
  createPLTDashboard,
  createTimeSpentOnPageDashboard,
  createPageExitsCountDashboard
};