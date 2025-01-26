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

async function addDashboardToPrisma(dashboardName, cardId) {
    try {
      const newDashboard = await prisma.metabaseDashboards.upsert({
        where: { dashboardName }, // Unique constraint on the dashboardName
        update: { cardId }, // Update cardId if the dashboard already exists
        create: {
          dashboardName,
          cardId,
        }, // Create a new record if it doesn't exist
      });
      console.log("Dashboard added/updated in database:", newDashboard);
    } catch (error) {
      console.error("Error upserting dashboard in Prisma:", error);
    }
}
  
async function createMetabaseFormsDashboard() {

    const sessionToken = await authenticate();
    console.log("sessionToken",sessionToken)
    const apiUrl = "http://localhost:3002/api/card";
    
    const requestBody = {
        name: "Form Dashboard",
        type: "question",
        dataset_query: {
            database: 2,
            type: "native",
            native: {
                "template-tags": {
                    "form_id": {
                        "type": "text",
                        "name": "form_id",
                        "id": "6e0c591f-caf9-487a-bb58-df97c4ee849f",
                        "display-name": "Form ID"
                    }
                },
                "query": `WITH LatestInteractions AS (
                  SELECT DISTINCT ON ("sessionId", "field_name") 
                    "id", 
                    "field_name", 
                    "form_id", 
                    "field_rank", 
                    "sessionId", 
                    "createdAt"
                  FROM "FormFieldInteraction"
                  ORDER BY "sessionId", "field_name", "createdAt" DESC
                )
                SELECT 
                  COUNT("id") AS "count",
                  "field_name",
                  "form_id",
                  "field_rank"
                FROM LatestInteractions
                WHERE form_id = {{form_id}}
                GROUP BY "field_name", "form_id", "field_rank"
                ORDER BY "field_rank";`
            }
        },
        display: "table",
        description: null,
        visualization_settings: {
            "table.pivot_column": "form_id",
            "table.cell_column": "count"
        },
        parameters: [
            {
                id: "6e0c591f-caf9-487a-bb58-df97c4ee849f",
                type: "category",
                target: [
                    "variable",
                    [
                        "template-tag",
                        "form_id"
                    ]
                ],
                name: "Form ID",
                slug: "form_id"
            }
        ],
        collection_id: null,
        collection_position: null,
        result_metadata: [
            {
                display_name: "count",
                field_ref: [
                    "field",
                    "count",
                    {
                        "base-type": "type/BigInteger"
                    }
                ],
                base_type: "type/BigInteger",
                effective_type: "type/BigInteger",
                name: "count",
                semantic_type: "type/Quantity",
                fingerprint: {
                    global: {
                        "distinct-count": 3,
                        "nil%": 0
                    },
                    type: {
                        "type/Number": {
                            "min": 2,
                            "q1": 2.25,
                            "q3": 3.75,
                            "max": 4,
                            "sd": 1,
                            "avg": 3
                        }
                    }
                }
            },
            {
                display_name: "field_name",
                field_ref: [
                    "field",
                    "field_name",
                    {
                        "base-type": "type/Text"
                    }
                ],
                base_type: "type/Text",
                effective_type: "type/Text",
                name: "field_name",
                semantic_type: null,
                fingerprint: {
                    global: {
                        "distinct-count": 3,
                        "nil%": 0
                    },
                    type: {
                        "type/Text": {
                            "percent-json": 0,
                            "percent-url": 0,
                            "percent-email": 0,
                            "percent-state": 0,
                            "average-length": 7.333333333333333
                        }
                    }
                }
            },
            {
                display_name: "form_id",
                field_ref: [
                    "field",
                    "form_id",
                    {
                        "base-type": "type/Text"
                    }
                ],
                base_type: "type/Text",
                effective_type: "type/Text",
                name: "form_id",
                semantic_type: null,
                fingerprint: {
                    global: {
                        "distinct-count": 1,
                        "nil%": 0
                    },
                    type: {
                        "type/Text": {
                            "percent-json": 0,
                            "percent-url": 0,
                            "percent-email": 0,
                            "percent-state": 0,
                            "average-length": 11
                        }
                    }
                }
            },
            {
                display_name: "field_rank",
                field_ref: [
                    "field",
                    "field_rank",
                    {
                        "base-type": "type/Integer"
                    }
                ],
                base_type: "type/Integer",
                effective_type: "type/Integer",
                name: "field_rank",
                semantic_type: null,
                fingerprint: {
                    global: {
                        "distinct-count": 3,
                        "nil%": 0
                    },
                    type: {
                        "type/Number": {
                            "min": 1,
                            "q1": 1.25,
                            "q3": 2.75,
                            "max": 3,
                            "sd": 1,
                            "avg": 2
                        }
                    }
                }
            }
        ]
    };
    try {
        // Step 1: Fetch card ID from the API
        const response = await axios.post(apiUrl, requestBody, {
            headers: {
              "Content-Type": "application/json",
              "X-Metabase-Session": sessionToken
            }});   
        
        await addDashboardToPrisma("Form Dashboard", response.data.id);
        return response.data.id;
    } catch (error) {
        console.error("Error creating dashboard:", error);
        return null;
    } finally {
        await prisma.$disconnect(); // Ensure Prisma disconnects after the operation
    }
}

async function createUninteractedTimeDashboard() {
        const sessionToken = await authenticate();
        console.log("sessionToken", sessionToken);
        const apiUrl = "http://localhost:3002/api/card";
      
        const requestBody = {
          "name": "Uninteracted Time Dashboard",
          "type": "question",
          "dataset_query": {
              "database": 2,
              "type": "native",
              "native": {
                  "template-tags": {
                      "url": {
                          "type": "text",
                          "name": "url",
                          "id": "a2085210-0dfb-4d8c-a700-432b1d89fba1",
                          "display-name": "URL"
                      },
                      "conversion_status": {
                          "type": "text",
                          "name": "conversion_status",
                          "id": "cf08e1ec-f7a0-4f48-96bb-a714f7286670",
                          "display-name": "Conversion Status"
                      }
                  },
                  "query": "WITH RankedEvents AS (\n  SELECT\n    \"sessionId\",\n    \"url\",\n    \"traceEvent\",\n    \"createdAt\",\n    LAG(\"traceEvent\") OVER (\n      PARTITION BY \"sessionId\", \"url\"\n      ORDER BY \"createdAt\"\n    ) AS \"previousEvent\",\n    LAG(\"createdAt\") OVER (\n      PARTITION BY \"sessionId\", \"url\"\n      ORDER BY \"createdAt\"\n    ) AS \"previousEventTime\"\n  FROM \"Event\"\n  WHERE \"traceEvent\" IN ('page-visit', 'page-in', 'page-out')\n),\nFilteredEvents AS (\n  SELECT\n    \"sessionId\",\n    \"url\",\n    \"traceEvent\",\n    \"createdAt\",\n    \"previousEvent\",\n    \"previousEventTime\"\n  FROM RankedEvents\n  WHERE \"traceEvent\" != \"previousEvent\" OR \"previousEvent\" IS NULL\n),\nPageVisitTimes AS (\n  SELECT\n    \"sessionId\",\n    \"url\",\n    MIN(\"createdAt\") AS \"pageVisitedAt\"\n  FROM FilteredEvents\n  WHERE \"traceEvent\" = 'page-visit'\n  GROUP BY \"sessionId\", \"url\"\n),\nUninteractedTime AS (\n  SELECT\n    \"sessionId\",\n    \"url\",\n    SUM(EXTRACT(EPOCH FROM (\"createdAt\" - \"previousEventTime\"))) AS uninteractedTime\n  FROM FilteredEvents\n  WHERE \"traceEvent\" = 'page-in'\n    AND \"previousEvent\" = 'page-out'\n  GROUP BY \"sessionId\", \"url\"\n),\nNextUrl AS (\n  SELECT\n    \"sessionId\",\n    \"url\",\n    LEAD(\"url\") OVER (\n      PARTITION BY \"sessionId\"\n      ORDER BY MIN(\"pageVisitedAt\")\n    ) AS nextUrl\n  FROM PageVisitTimes\n  GROUP BY \"sessionId\", \"url\"\n),\nConversionStatus AS (\n  SELECT\n    v.\"sessionId\",\n    v.\"url\",\n    v.\"pageVisitedAt\",\n    COALESCE(u.uninteractedTime, 0) AS \"uninteractedTime\",\n    CASE\n      WHEN n.nextUrl IS NOT NULL AND v.\"url\" != n.nextUrl THEN 'converted'\n      ELSE 'non-converted'\n    END AS conversion_status\n  FROM PageVisitTimes v\n  LEFT JOIN UninteractedTime u\n    ON v.\"sessionId\" = u.\"sessionId\" AND v.\"url\" = u.\"url\"\n  LEFT JOIN NextUrl n\n    ON v.\"sessionId\" = n.\"sessionId\" AND v.\"url\" = n.\"url\"\n)\nSELECT\n  ROUND(AVG(\"uninteractedTime\") / 60, 2) AS average_uninteracted_time -- in minutes\nFROM ConversionStatus\nGROUP BY \"url\", \"conversion_status\"\nHAVING \"url\" LIKE {{url}} and conversion_status = {{conversion_status}}\nORDER BY \"url\", \"conversion_status\";\n"
              }
          },
          "display": "table",
          "description": null,
          "visualization_settings": {},
          "parameters": [
              {
                  "id": "a2085210-0dfb-4d8c-a700-432b1d89fba1",
                  "type": "category",
                  "target": [
                      "variable",
                      [
                          "template-tag",
                          "url"
                      ]
                  ],
                  "name": "URL",
                  "slug": "url"
              },
              {
                  "id": "cf08e1ec-f7a0-4f48-96bb-a714f7286670",
                  "type": "category",
                  "target": [
                      "variable",
                      [
                          "template-tag",
                          "conversion_status"
                      ]
                  ],
                  "name": "Conversion Status",
                  "slug": "conversion_status"
              }
          ],
          "collection_id": null,
          "collection_position": null,
          "result_metadata": null
      };

        try {
            // Step 1: Fetch card ID from the API
            const response = await axios.post(apiUrl, requestBody, {
                headers: {
                  "Content-Type": "application/json",
                  "X-Metabase-Session": sessionToken
                }});   
            
            await addDashboardToPrisma("Uninteracted Time Dashboard", response.data.id);
            return response.data.id;
        } catch (error) {
            console.error("Error creating dashboard:", error);
            return null;
        } finally {
            await prisma.$disconnect(); // Ensure Prisma disconnects after the operation
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
      
          await addDashboardToPrisma("PLT Dashboard", response.data.id);      
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
          await addDashboardToPrisma("Time Spent on Page by Converted Customers", response.data.id);    
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
          "name": "Page Exits Count Dashboard",
          "type": "question",
          "dataset_query": {
              "database": 2,
              "type": "native",
              "native": {
                  "template-tags": {
                      "url": {
                          "type": "text",
                          "name": "url",
                          "id": "60652958-e881-4d85-9442-1c8e13127b3a",
                          "display-name": "URL"
                      }
                  },
                  "query": "  WITH RankedEvents AS (\n    SELECT\n      \"sessionId\",\n      \"url\",\n      \"traceEvent\",\n      \"createdAt\",\n      LAG(\"traceEvent\") OVER (\n        PARTITION BY \"sessionId\", \"url\"\n        ORDER BY \"createdAt\"\n      ) AS \"previousEvent\",\n      LAG(\"createdAt\") OVER (\n        PARTITION BY \"sessionId\", \"url\"\n        ORDER BY \"createdAt\"\n      ) AS \"previousEventTime\"\n    FROM \"Event\"\n    WHERE \"traceEvent\" IN ('page-visit', 'page-in', 'page-out')\n  ),\n  FilteredEvents AS (\n    SELECT\n      \"sessionId\",\n      \"url\",\n      \"traceEvent\",\n      \"createdAt\",\n      \"previousEvent\",\n      \"previousEventTime\"\n    FROM RankedEvents\n    WHERE (\"traceEvent\" != \"previousEvent\" OR \"previousEvent\" IS NULL) AND \"traceEvent\" = 'page-out'\n  ),\n  NextUrl AS (\n    SELECT\n      \"sessionId\",\n      \"url\",\n      LEAD(\"url\") OVER (\n        PARTITION BY \"sessionId\"\n        ORDER BY \"createdAt\"\n      ) AS next_url\n    FROM FilteredEvents\n  ),\n  SessionExits AS (\n    SELECT\n      f.\"sessionId\",\n      f.\"url\",\n      CASE\n        WHEN n.next_url IS NOT NULL THEN 'converted'\n        ELSE 'non-converted'\n      END AS conversion_status,\n      COUNT(*) AS page_exits\n    FROM FilteredEvents f\n    LEFT JOIN NextUrl n\n      ON f.\"sessionId\" = n.\"sessionId\" AND f.\"url\" = n.\"url\"\n    GROUP BY f.\"sessionId\", f.\"url\", conversion_status\n  )\n  SELECT\n    \"url\",\n    conversion_status,\n    ROUND(AVG(page_exits)::NUMERIC, 0) AS avg_page_exits_per_session\n  FROM SessionExits\n  WHERE \"url\" = {{url}}\n  GROUP BY \"url\", conversion_status\n  ORDER BY \"url\", conversion_status;\n"
              }
          },
          "display": "bar",
          "description": null,
          "visualization_settings": {
              "graph.dimensions": [
                  "conversion_status",
                  "url"
              ],
              "graph.metrics": [
                  "avg_page_exits_per_session"
              ]
          },
          "parameters": [
              {
                  "id": "60652958-e881-4d85-9442-1c8e13127b3a",
                  "type": "category",
                  "target": [
                      "variable",
                      [
                          "template-tag",
                          "url"
                      ]
                  ],
                  "name": "URL",
                  "slug": "url"
              }
          ],
          "collection_id": null,
          "collection_position": null,
          "result_metadata": [
              {
                  "display_name": "url",
                  "field_ref": [
                      "field",
                      "url",
                      {
                          "base-type": "type/Text"
                      }
                  ],
                  "base_type": "type/Text",
                  "effective_type": "type/Text",
                  "name": "url",
                  "semantic_type": "type/URL",
                  "fingerprint": {
                      "global": {
                          "distinct-count": 1,
                          "nil%": 0
                      },
                      "type": {
                          "type/Text": {
                              "percent-json": 0,
                              "percent-url": 1,
                              "percent-email": 0,
                              "percent-state": 0,
                              "average-length": 22
                          }
                      }
                  }
              },
              {
                  "display_name": "conversion_status",
                  "field_ref": [
                      "field",
                      "conversion_status",
                      {
                          "base-type": "type/Text"
                      }
                  ],
                  "base_type": "type/Text",
                  "effective_type": "type/Text",
                  "name": "conversion_status",
                  "semantic_type": null,
                  "fingerprint": {
                      "global": {
                          "distinct-count": 2,
                          "nil%": 0
                      },
                      "type": {
                          "type/Text": {
                              "percent-json": 0,
                              "percent-url": 0,
                              "percent-email": 0,
                              "percent-state": 0,
                              "average-length": 11
                          }
                      }
                  }
              },
              {
                  "display_name": "avg_page_exits_per_session",
                  "field_ref": [
                      "field",
                      "avg_page_exits_per_session",
                      {
                          "base-type": "type/Decimal"
                      }
                  ],
                  "base_type": "type/Decimal",
                  "effective_type": "type/Decimal",
                  "name": "avg_page_exits_per_session",
                  "semantic_type": null,
                  "fingerprint": {
                      "global": {
                          "distinct-count": 2,
                          "nil%": 0
                      },
                      "type": {
                          "type/Number": {
                              "min": 17,
                              "q1": 17,
                              "q3": 159,
                              "max": 159,
                              "sd": 100.40916292848975,
                              "avg": 88
                          }
                      }
                  }
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
          
          await addDashboardToPrisma("Page Exits Count Dashboard", response.data.id);
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