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
        "name": "Form Dashboard",
        "cache_ttl": null,
        "type": "question",
        "dataset_query": {
            "database": 2,
            "type": "native",
            "native": {
                "template-tags": {
                    "form_id": {
                        "type": "text",
                        "name": "form_id",
                        "id": "6e0c591f-caf9-487a-bb58-df97c4ee849f",
                        "display-name": "Form ID"
                    },
                    "start_date": {
                        "type": "date",
                        "name": "start_date",
                        "id": "8376ae8a-ea8a-48f0-a6c3-5f6e1f21feed",
                        "display-name": "Start Date",
                        "default": "2024-11-01",
                        "widget-type": null,
                        "required": true
                    },
                    "end_date": {
                        "type": "date",
                        "name": "end_date",
                        "id": "8d3d6a26-ee1e-4726-a4ec-74f80dace98e",
                        "display-name": "End Date",
                        "default": "2025-01-31",
                        "widget-type": null,
                        "required": true
                    }
                },
                "query": "WITH LatestInteractions AS (\n    SELECT DISTINCT ON (\"sessionId\", \"field_name\") \n        \"id\", \n        \"field_name\", \n        \"form_id\", \n        \"field_rank\", \n        \"sessionId\", \n        \"createdAt\"\n    FROM \"FormFieldInteraction\"\n    WHERE \"createdAt\" BETWEEN {{start_date}} AND {{end_date}} -- Date range filter\n    ORDER BY \"sessionId\", \"field_name\", \"createdAt\" DESC\n)\nSELECT \n    COUNT(\"id\") AS \"count\",\n    \"field_name\",\n    \"form_id\",\n    \"field_rank\"\nFROM LatestInteractions\nWHERE \"form_id\" = {{form_id}} -- Form ID filter\nGROUP BY \"field_name\", \"form_id\", \"field_rank\"\nORDER BY \"field_rank\";\n"
            }
        },
        "display": "bar",
        "description": null,
        "visualization_settings": {
            "table.pivot_column": "form_id",
            "table.cell_column": "count",
            "graph.dimensions": [
                "field_name"
            ],
            "graph.metrics": [
                "count"
            ],
            "graph.series_order_dimension": null,
            "graph.series_order": null
        },
        "parameters": [
            {
                "id": "6e0c591f-caf9-487a-bb58-df97c4ee849f",
                "type": "category",
                "target": [
                    "variable",
                    [
                        "template-tag",
                        "form_id"
                    ]
                ],
                "name": "Form ID",
                "slug": "form_id"
            },
            {
                "id": "8376ae8a-ea8a-48f0-a6c3-5f6e1f21feed",
                "type": "date/single",
                "target": [
                    "variable",
                    [
                        "template-tag",
                        "start_date"
                    ]
                ],
                "name": "Start Date",
                "slug": "start_date",
                "default": "2024-11-01",
                "required": true
            },
            {
                "id": "8d3d6a26-ee1e-4726-a4ec-74f80dace98e",
                "type": "date/single",
                "target": [
                    "variable",
                    [
                        "template-tag",
                        "end_date"
                    ]
                ],
                "name": "End Date",
                "slug": "end_date",
                "default": "2025-01-31",
                "required": true
            }
        ],
        "parameter_mappings": [],
        "archived": false,
        "enable_embedding": false,
        "embedding_params": null,
        "collection_id": null,
        "collection_position": null,
        "collection_preview": true,
        "result_metadata": [
            {
                "display_name": "count",
                "field_ref": [
                    "field",
                    "count",
                    {
                        "base-type": "type/BigInteger"
                    }
                ],
                "base_type": "type/BigInteger",
                "effective_type": "type/BigInteger",
                "name": "count",
                "semantic_type": "type/Quantity",
                "fingerprint": {
                    "global": {
                        "distinct-count": 3,
                        "nil%": 0
                    },
                    "type": {
                        "type/Number": {
                            "min": 2,
                            "q1": 2.25,
                            "q3": 4.5,
                            "max": 5,
                            "sd": 1.5275252316519465,
                            "avg": 3.3333333333333335
                        }
                    }
                }
            },
            {
                "display_name": "field_name",
                "field_ref": [
                    "field",
                    "field_name",
                    {
                        "base-type": "type/Text"
                    }
                ],
                "base_type": "type/Text",
                "effective_type": "type/Text",
                "name": "field_name",
                "semantic_type": null,
                "fingerprint": {
                    "global": {
                        "distinct-count": 3,
                        "nil%": 0
                    },
                    "type": {
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
                "display_name": "form_id",
                "field_ref": [
                    "field",
                    "form_id",
                    {
                        "base-type": "type/Text"
                    }
                ],
                "base_type": "type/Text",
                "effective_type": "type/Text",
                "name": "form_id",
                "semantic_type": null,
                "fingerprint": {
                    "global": {
                        "distinct-count": 1,
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
                "display_name": "field_rank",
                "field_ref": [
                    "field",
                    "field_rank",
                    {
                        "base-type": "type/Integer"
                    }
                ],
                "base_type": "type/Integer",
                "effective_type": "type/Integer",
                "name": "field_rank",
                "semantic_type": null,
                "fingerprint": {
                    "global": {
                        "distinct-count": 3,
                        "nil%": 0
                    },
                    "type": {
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
          "cache_ttl": null,
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
                          "display-name": "Conversion Status",
                          "required": true
                      },
                      "start_date": {
                          "type": "date",
                          "name": "start_date",
                          "id": "59024a94-60b7-4d34-97d9-03a1b4cbbbea",
                          "display-name": "Start Date",
                          "default": "2024-11-01",
                          "required": true
                      },
                      "end_date": {
                          "type": "date",
                          "name": "end_date",
                          "id": "9b9391a3-33a5-4668-ab3d-48e35521d0d3",
                          "display-name": "End Date",
                          "default": "2025-01-31",
                          "required": true
                      }
                  },
                  "query": "WITH RankedEvents AS (\n  SELECT\n    \"sessionId\",\n    \"url\",\n    \"traceEvent\",\n    \"createdAt\",\n    LAG(\"traceEvent\") OVER (\n      PARTITION BY \"sessionId\", \"url\"\n      ORDER BY \"createdAt\"\n    ) AS \"previousEvent\",\n    LAG(\"createdAt\") OVER (\n      PARTITION BY \"sessionId\", \"url\"\n      ORDER BY \"createdAt\"\n    ) AS \"previousEventTime\"\n  FROM \"Event\"\n  WHERE \"traceEvent\" IN ('page-visit', 'page-in', 'page-out')\n    AND \"createdAt\" BETWEEN {{start_date}} AND {{end_date}} -- Date range filter\n),\nFilteredEvents AS (\n  SELECT\n    \"sessionId\",\n    \"url\",\n    \"traceEvent\",\n    \"createdAt\",\n    \"previousEvent\",\n    \"previousEventTime\"\n  FROM RankedEvents\n  WHERE \"traceEvent\" != \"previousEvent\" OR \"previousEvent\" IS NULL\n),\nPageVisitTimes AS (\n  SELECT\n    \"sessionId\",\n    \"url\",\n    MIN(\"createdAt\") AS \"pageVisitedAt\"\n  FROM FilteredEvents\n  WHERE \"traceEvent\" = 'page-visit'\n  GROUP BY \"sessionId\", \"url\"\n),\nUninteractedTime AS (\n  SELECT\n    \"sessionId\",\n    \"url\",\n    SUM(EXTRACT(EPOCH FROM (\"createdAt\" - \"previousEventTime\"))) AS uninteractedTime\n  FROM FilteredEvents\n  WHERE \"traceEvent\" = 'page-in'\n    AND \"previousEvent\" = 'page-out'\n  GROUP BY \"sessionId\", \"url\"\n),\nNextUrl AS (\n  SELECT\n    \"sessionId\",\n    \"url\",\n    LEAD(\"url\") OVER (\n      PARTITION BY \"sessionId\"\n      ORDER BY MIN(\"pageVisitedAt\")\n    ) AS nextUrl\n  FROM PageVisitTimes\n  GROUP BY \"sessionId\", \"url\"\n),\nConversionStatus AS (\n  SELECT\n    v.\"sessionId\",\n    v.\"url\",\n    v.\"pageVisitedAt\",\n    COALESCE(u.uninteractedTime, 0) AS \"uninteractedTime\",\n    CASE\n      WHEN n.nextUrl IS NOT NULL AND v.\"url\" != n.nextUrl THEN 'converted'\n      ELSE 'non-converted'\n    END AS conversion_status\n  FROM PageVisitTimes v\n  LEFT JOIN UninteractedTime u\n    ON v.\"sessionId\" = u.\"sessionId\" AND v.\"url\" = u.\"url\"\n  LEFT JOIN NextUrl n\n    ON v.\"sessionId\" = n.\"sessionId\" AND v.\"url\" = n.\"url\"\n)\nSELECT\n  date(\"pageVisitedAt\") as pageVisitedAt,\n  ROUND(AVG(\"uninteractedTime\") / 60, 2) AS average_uninteracted_time -- in minutes\nFROM ConversionStatus\nWHERE \"pageVisitedAt\" BETWEEN {{start_date}} AND {{end_date}} -- Date range filter\nGROUP BY \"url\", \"conversion_status\", date(\"pageVisitedAt\")\nHAVING \"url\" LIKE {{url}} AND conversion_status = {{conversion_status}}\nORDER BY \"url\", \"conversion_status\";"
              }
          },
          "display": "combo",
          "description": null,
          "visualization_settings": {
              "graph.series_order": null,
              "graph.series_order_dimension": null,
              "graph.metrics": [
                  "average_uninteracted_time"
              ],
              "graph.dimensions": [
                  "pagevisitedat"
              ],
              "series_settings": {
                  "average_uninteracted_time": {
                      "color": "#C8B4DA"
                  }
              }
          },
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
                  "slug": "conversion_status",
                  "required": true,
                  "values_query_type": "list",
                  "values_source_type": "static-list",
                  "values_source_config": {
                      "values": [
                          [
                              "converted",
                              "Converted"
                          ],
                          [
                              "non-converted",
                              "Non Converted"
                          ]
                      ]
                  }
              },
              {
                  "id": "59024a94-60b7-4d34-97d9-03a1b4cbbbea",
                  "type": "date/single",
                  "target": [
                      "variable",
                      [
                          "template-tag",
                          "start_date"
                      ]
                  ],
                  "name": "Start Date",
                  "slug": "start_date",
                  "default": "2024-11-01",
                  "required": true
              },
              {
                  "id": "9b9391a3-33a5-4668-ab3d-48e35521d0d3",
                  "type": "date/single",
                  "target": [
                      "variable",
                      [
                          "template-tag",
                          "end_date"
                      ]
                  ],
                  "name": "End Date",
                  "slug": "end_date",
                  "default": "2025-01-31",
                  "required": true
              }
          ],
          "parameter_mappings": [],
          "archived": false,
          "enable_embedding": false,
          "embedding_params": null,
          "collection_id": null,
          "collection_position": null,
          "collection_preview": true,
          "result_metadata": [
              {
                  "display_name": "pagevisitedat",
                  "field_ref": [
                      "field",
                      "pagevisitedat",
                      {
                          "base-type": "type/Date"
                      }
                  ],
                  "base_type": "type/Date",
                  "effective_type": "type/Date",
                  "name": "pagevisitedat",
                  "semantic_type": null,
                  "fingerprint": {
                      "global": {
                          "distinct-count": 88,
                          "nil%": 0
                      },
                      "type": {
                          "type/DateTime": {
                              "earliest": "2024-11-01",
                              "latest": "2025-01-27"
                          }
                      }
                  }
              },
              {
                  "display_name": "average_uninteracted_time",
                  "field_ref": [
                      "field",
                      "average_uninteracted_time",
                      {
                          "base-type": "type/Decimal"
                      }
                  ],
                  "base_type": "type/Decimal",
                  "effective_type": "type/Decimal",
                  "name": "average_uninteracted_time",
                  "semantic_type": null,
                  "fingerprint": {
                      "global": {
                          "distinct-count": 77,
                          "nil%": 0
                      },
                      "type": {
                          "type/Number": {
                              "min": 2.65,
                              "q1": 4.053076118445749,
                              "q3": 5.3427817459305205,
                              "max": 6.86,
                              "sd": 0.8605611692082943,
                              "avg": 4.693181818181819
                          }
                      }
                  }
              }
          ]
        }

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
          "name": "PLT Dashboard",
          "cache_ttl": null,
          "type": "question",
          "dataset_query": {
              "database": 2,
              "type": "native",
              "native": {
                  "template-tags": {
                      "url": {
                          "type": "text",
                          "name": "url",
                          "id": "f95370e4-1e5b-48c5-8fca-26b6ee94f87a",
                          "display-name": "URL",
                          "default": "http://localhost:3001/",
                          "required": true
                      },
                      "conversion_status": {
                          "type": "text",
                          "name": "conversion_status",
                          "id": "3415e84c-297c-4843-834f-73709661cd55",
                          "display-name": "Conversion Status",
                          "required": true,
                          "default": [
                              "converted"
                          ]
                      },
                      "start_date": {
                          "type": "date",
                          "name": "start_date",
                          "id": "10571e9a-6e24-4871-9c2a-779fdfe1e719",
                          "display-name": "Start Date",
                          "default": "2024-11-01",
                          "widget-type": null,
                          "required": true
                      },
                      "end_date": {
                          "type": "date",
                          "name": "end_date",
                          "id": "6ca07689-f088-4992-b63d-44375879f645",
                          "display-name": "End Date",
                          "default": "2025-01-31",
                          "widget-type": null,
                          "required": true
                      }
                  },
                  "query": "WITH SessionUrlFlow AS (\n    SELECT\n        \"sessionId\",\n        \"url\",\n        \"createdAt\",\n        LEAD(\"url\") OVER (PARTITION BY \"sessionId\" ORDER BY \"createdAt\") AS next_url\n    FROM \"Event\"\n    WHERE \"traceEvent\" = 'page-visit'\n),\nSessionConversion AS (\n    SELECT\n        \"sessionId\",\n        \"url\",\n        CASE\n            WHEN next_url IS NOT NULL THEN 'converted'\n            ELSE 'non-converted'\n        END AS conversion_status\n    FROM SessionUrlFlow\n),\nPLTByDay AS (\n    SELECT\n        e.\"url\",\n        DATE_TRUNC('day', e.\"createdAt\") AS event_date, -- Group by day\n        ROUND(AVG(CAST(e.\"additionalData\"->>'pageLoadTime' AS NUMERIC)), 2) AS avg_page_load_time,\n        COUNT(*) AS event_count,\n        sc.conversion_status\n    FROM \"Event\" e\n    JOIN SessionConversion sc\n        ON e.\"sessionId\" = sc.\"sessionId\" AND e.\"url\" = sc.\"url\"\n    WHERE e.\"traceEvent\" = 'page-visit'\n      AND e.\"createdAt\" BETWEEN {{start_date}} AND {{end_date}} -- Date range filter\n    GROUP BY e.\"url\", DATE_TRUNC('day', e.\"createdAt\"), sc.conversion_status\n)\nSELECT \n    \"url\",\n    event_date,\n    avg_page_load_time AS plt_ms,\n    conversion_status\nFROM PLTByDay\nWHERE \"url\" = {{url}}\n  AND conversion_status = {{conversion_status}}\nORDER BY event_date;\n"
              }
          },
          "display": "combo",
          "description": null,
          "visualization_settings": {
              "graph.show_goal": false,
              "graph.series_order": null,
              "graph.series_order_dimension": null,
              "graph.dimensions": [
                  "event_date"
              ],
              "table.cell_column": "conversion_status",
              "table.pivot_column": "url",
              "series_settings": {
                  "plt_ms": {
                      "color": "#88BF4D"
                  }
              },
              "graph.metrics": [
                  "plt_ms"
              ]
          },
          "parameters": [
              {
                  "id": "f95370e4-1e5b-48c5-8fca-26b6ee94f87a",
                  "type": "category",
                  "target": [
                      "variable",
                      [
                          "template-tag",
                          "url"
                      ]
                  ],
                  "name": "URL",
                  "slug": "url",
                  "default": "http://localhost:3001/",
                  "required": true
              },
              {
                  "id": "3415e84c-297c-4843-834f-73709661cd55",
                  "type": "category",
                  "target": [
                      "variable",
                      [
                          "template-tag",
                          "conversion_status"
                      ]
                  ],
                  "name": "Conversion Status",
                  "slug": "conversion_status",
                  "default": [
                      "converted"
                  ],
                  "required": true,
                  "values_query_type": "list",
                  "values_source_type": "static-list",
                  "values_source_config": {
                      "values": [
                          [
                              "converted",
                              "Converted"
                          ],
                          [
                              "non-converted",
                              "Non Converted"
                          ]
                      ]
                  }
              },
              {
                  "id": "10571e9a-6e24-4871-9c2a-779fdfe1e719",
                  "type": "date/single",
                  "target": [
                      "variable",
                      [
                          "template-tag",
                          "start_date"
                      ]
                  ],
                  "name": "Start Date",
                  "slug": "start_date",
                  "default": "2024-11-01",
                  "required": true
              },
              {
                  "id": "6ca07689-f088-4992-b63d-44375879f645",
                  "type": "date/single",
                  "target": [
                      "variable",
                      [
                          "template-tag",
                          "end_date"
                      ]
                  ],
                  "name": "End Date",
                  "slug": "end_date",
                  "default": "2025-01-31",
                  "required": true
              }
          ],
          "parameter_mappings": [],
          "archived": false,
          "enable_embedding": false,
          "embedding_params": null,
          "collection_id": null,
          "collection_position": null,
          "collection_preview": true,
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
                  "display_name": "event_date",
                  "field_ref": [
                      "field",
                      "event_date",
                      {
                          "base-type": "type/DateTime"
                      }
                  ],
                  "base_type": "type/DateTime",
                  "effective_type": "type/DateTime",
                  "name": "event_date",
                  "semantic_type": null,
                  "fingerprint": {
                      "global": {
                          "distinct-count": 88,
                          "nil%": 0
                      },
                      "type": {
                          "type/DateTime": {
                              "earliest": "2024-11-01T00:00:00Z",
                              "latest": "2025-01-27T00:00:00Z"
                          }
                      }
                  }
              },
              {
                  "display_name": "plt_ms",
                  "field_ref": [
                      "field",
                      "plt_ms",
                      {
                          "base-type": "type/Decimal"
                      }
                  ],
                  "base_type": "type/Decimal",
                  "effective_type": "type/Decimal",
                  "name": "plt_ms",
                  "semantic_type": null,
                  "fingerprint": {
                      "global": {
                          "distinct-count": 88,
                          "nil%": 0
                      },
                      "type": {
                          "type/Number": {
                              "min": 445.96,
                              "q1": 563.775,
                              "q3": 631.275,
                              "max": 744.26,
                              "sd": 55.47213896430971,
                              "avg": 596.3207954545454
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
                          "distinct-count": 1,
                          "nil%": 0
                      },
                      "type": {
                          "type/Text": {
                              "percent-json": 0,
                              "percent-url": 0,
                              "percent-email": 0,
                              "percent-state": 0,
                              "average-length": 9
                          }
                      }
                  }
              }
          ]
        }
      
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
          "name": "Time Spent on Page by Converted Customers",
          "cache_ttl": null,
          "type": "question",
          "dataset_query": {
              "database": 2,
              "type": "native",
              "native": {
                  "template-tags": {
                      "url": {
                          "type": "text",
                          "name": "url",
                          "id": "435abd4c-1e08-4cc4-bdd0-fd3a30407be5",
                          "display-name": "URL",
                          "required": true,
                          "default": "http://localhost:3001/"
                      },
                      "start_date": {
                          "type": "date",
                          "name": "start_date",
                          "id": "ce3ee7b8-b147-4340-bfd9-893148950a3f",
                          "display-name": "Start Date",
                          "default": "2024-11-01",
                          "widget-type": null,
                          "required": true
                      },
                      "end_date": {
                          "type": "date",
                          "name": "end_date",
                          "id": "56903732-7c34-444d-80b7-0b029d07c15d",
                          "display-name": "End Date",
                          "default": "2025-01-31",
                          "widget-type": null,
                          "required": true
                      }
                  },
                  "query": "WITH RankedPageVisits AS (\n    -- Step 1: Filter events to include only `page-visit` and rank them by session and createdAt\n    SELECT\n        \"sessionId\",\n        \"url\",\n        \"createdAt\",\n        LEAD(\"createdAt\") OVER (PARTITION BY \"sessionId\" ORDER BY \"createdAt\") AS next_event_time,\n        LEAD(\"url\") OVER (PARTITION BY \"sessionId\" ORDER BY \"createdAt\") AS next_url\n    FROM \"Event\"\n    WHERE \"traceEvent\" = 'page-visit'\n),\nPageSpentTime AS (\n    -- Step 2: Calculate time spent on the page (in seconds)\n    SELECT\n        \"sessionId\",\n        \"url\",\n        DATE_TRUNC('day', \"createdAt\") AS event_date, -- Grouping by day\n        CASE \n            WHEN LEAD(\"url\") OVER (PARTITION BY \"sessionId\" ORDER BY \"createdAt\") IS NOT NULL \n            THEN EXTRACT(EPOCH FROM (LEAD(\"createdAt\") OVER (PARTITION BY \"sessionId\" ORDER BY \"createdAt\") - \"createdAt\"))\n            ELSE NULL\n        END AS page_spent\n    FROM RankedPageVisits\n)\n-- Step 3: Aggregate data to calculate average time spent per day\nSELECT\n    event_date,\n    ROUND(AVG(page_spent)::NUMERIC, 2) AS avg_time_spent_seconds, -- Average time spent in seconds\n    \"url\"\nFROM PageSpentTime\nWHERE page_spent IS NOT NULL -- Exclude records without valid page_spent\nGROUP BY event_date, \"url\"\nHAVING \"url\" = {{url}} and event_date between {{start_date}} and {{end_date}}\nORDER BY event_date;\n"
              }
          },
          "display": "combo",
          "description": null,
          "visualization_settings": {
              "graph.dimensions": [
                  "event_date"
              ],
              "graph.series_order_dimension": null,
              "graph.series_order": null,
              "graph.metrics": [
                  "avg_time_spent_seconds"
              ]
          },
          "parameters": [
              {
                  "id": "435abd4c-1e08-4cc4-bdd0-fd3a30407be5",
                  "type": "category",
                  "target": [
                      "variable",
                      [
                          "template-tag",
                          "url"
                      ]
                  ],
                  "name": "URL",
                  "slug": "url",
                  "default": "http://localhost:3001/",
                  "required": true,
                  "values_query_type": "none"
              },
              {
                  "id": "ce3ee7b8-b147-4340-bfd9-893148950a3f",
                  "type": "date/single",
                  "target": [
                      "variable",
                      [
                          "template-tag",
                          "start_date"
                      ]
                  ],
                  "name": "Start Date",
                  "slug": "start_date",
                  "default": "2024-11-01",
                  "required": true
              },
              {
                  "id": "56903732-7c34-444d-80b7-0b029d07c15d",
                  "type": "date/single",
                  "target": [
                      "variable",
                      [
                          "template-tag",
                          "end_date"
                      ]
                  ],
                  "name": "End Date",
                  "slug": "end_date",
                  "default": "2025-01-31",
                  "required": true
              }
          ],
          "parameter_mappings": [],
          "archived": false,
          "enable_embedding": false,
          "embedding_params": null,
          "collection_id": null,
          "collection_position": null,
          "collection_preview": true,
          "result_metadata": [
              {
                  "display_name": "event_date",
                  "field_ref": [
                      "field",
                      "event_date",
                      {
                          "base-type": "type/DateTime"
                      }
                  ],
                  "base_type": "type/DateTime",
                  "effective_type": "type/DateTime",
                  "name": "event_date",
                  "semantic_type": null,
                  "fingerprint": {
                      "global": {
                          "distinct-count": 88,
                          "nil%": 0
                      },
                      "type": {
                          "type/DateTime": {
                              "earliest": "2024-11-01T00:00:00Z",
                              "latest": "2025-01-27T00:00:00Z"
                          }
                      }
                  }
              },
              {
                  "display_name": "avg_time_spent_seconds",
                  "field_ref": [
                      "field",
                      "avg_time_spent_seconds",
                      {
                          "base-type": "type/Decimal"
                      }
                  ],
                  "base_type": "type/Decimal",
                  "effective_type": "type/Decimal",
                  "name": "avg_time_spent_seconds",
                  "semantic_type": null,
                  "fingerprint": {
                      "global": {
                          "distinct-count": 88,
                          "nil%": 0
                      },
                      "type": {
                          "type/Number": {
                              "min": 231.46,
                              "q1": 285.634,
                              "q3": 325.61,
                              "max": 365.68,
                              "sd": 28.006477928764955,
                              "avg": 305.4278409090909
                          }
                      }
                  }
              },
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
          "cache_ttl": null,
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
                          "display-name": "URL",
                          "required": true
                      },
                      "start_date": {
                          "type": "date",
                          "name": "start_date",
                          "id": "edf326fd-581b-4ce1-9307-3537c4098f81",
                          "display-name": "Start Date",
                          "default": "2024-11-01",
                          "required": true
                      },
                      "end_date": {
                          "type": "date",
                          "name": "end_date",
                          "id": "5587f665-1e6a-4b38-b8e2-423f4f95c40d",
                          "display-name": "End Date",
                          "default": "2025-01-31",
                          "required": true
                      },
                      "conversion_status": {
                          "type": "text",
                          "name": "conversion_status",
                          "id": "a73eecad-ac85-40c8-9ec5-40b9b791dac9",
                          "display-name": "Conversion Status"
                      }
                  },
                  "query": "WITH RankedEvents AS (\n    SELECT\n      \"sessionId\",\n      \"url\",\n      \"traceEvent\",\n      \"createdAt\",\n      LAG(\"traceEvent\") OVER (\n        PARTITION BY \"sessionId\", \"url\"\n        ORDER BY \"createdAt\"\n      ) AS \"previousEvent\",\n      LAG(\"createdAt\") OVER (\n        PARTITION BY \"sessionId\", \"url\"\n        ORDER BY \"createdAt\"\n      ) AS \"previousEventTime\"\n    FROM \"Event\"\n    WHERE \"traceEvent\" IN ('page-visit', 'page-in', 'page-out')\n  ),\n  FilteredEvents AS (\n    SELECT\n      \"sessionId\",\n      \"url\",\n      \"traceEvent\",\n      \"createdAt\",\n      \"previousEvent\",\n      \"previousEventTime\"\n    FROM RankedEvents\n    WHERE (\"traceEvent\" != \"previousEvent\" OR \"previousEvent\" IS NULL) \n      AND \"traceEvent\" = 'page-out'\n  ),\n  NextUrl AS (\n    SELECT\n      \"sessionId\",\n      \"url\",\n      LEAD(\"url\") OVER (\n        PARTITION BY \"sessionId\"\n        ORDER BY \"createdAt\"\n      ) AS next_url\n    FROM FilteredEvents\n  ),\n  SessionExits AS (\n    SELECT\n      f.\"sessionId\",\n      f.\"url\",\n      date(\"createdAt\") AS time_group, -- Grouping by the selected time granularity\n      CASE\n        WHEN n.next_url IS NOT NULL THEN 'converted'\n        ELSE 'non-converted'\n      END AS conversion_status,\n      COUNT(*) AS page_exits\n    FROM FilteredEvents f\n    LEFT JOIN NextUrl n\n      ON f.\"sessionId\" = n.\"sessionId\" AND f.\"url\" = n.\"url\"\n    WHERE f.\"createdAt\" BETWEEN {{start_date}} AND {{end_date}} -- Date range filter\n    GROUP BY f.\"sessionId\", f.\"url\", time_group, conversion_status\n  )\n  SELECT\n    \"url\",\n    time_group,\n    conversion_status,\n    ROUND(AVG(page_exits)::NUMERIC, 2) AS avg_page_exits_per_session\n  FROM SessionExits\n  WHERE \"url\" = {{url}}\n    AND conversion_status = {{conversion_status}} -- Filter by conversion status\n  GROUP BY \"url\", time_group, conversion_status\n  ORDER BY time_group, \"url\", conversion_status;\n"
              }
          },
          "display": "combo",
          "description": null,
          "visualization_settings": {
              "graph.dimensions": [
                  "time_group"
              ],
              "graph.metrics": [
                  "avg_page_exits_per_session"
              ],
              "graph.series_order_dimension": null,
              "graph.series_order": null
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
                  "slug": "url",
                  "required": true
              },
              {
                  "id": "edf326fd-581b-4ce1-9307-3537c4098f81",
                  "type": "date/single",
                  "target": [
                      "variable",
                      [
                          "template-tag",
                          "start_date"
                      ]
                  ],
                  "name": "Start Date",
                  "slug": "start_date",
                  "default": "2024-11-01",
                  "required": true
              },
              {
                  "id": "5587f665-1e6a-4b38-b8e2-423f4f95c40d",
                  "type": "date/single",
                  "target": [
                      "variable",
                      [
                          "template-tag",
                          "end_date"
                      ]
                  ],
                  "name": "End Date",
                  "slug": "end_date",
                  "default": "2025-01-31",
                  "required": true
              },
              {
                  "id": "a73eecad-ac85-40c8-9ec5-40b9b791dac9",
                  "type": "category",
                  "target": [
                      "variable",
                      [
                          "template-tag",
                          "conversion_status"
                      ]
                  ],
                  "name": "Conversion Status",
                  "slug": "conversion_status",
                  "values_query_type": "list",
                  "values_source_type": "static-list",
                  "values_source_config": {
                      "values": [
                          [
                              "converted",
                              "Converted"
                          ],
                          [
                              "non-converted",
                              "Non Converted"
                          ]
                      ]
                  }
              }
          ],
          "parameter_mappings": [],
          "archived": false,
          "enable_embedding": false,
          "embedding_params": null,
          "collection_id": null,
          "collection_position": null,
          "collection_preview": true,
          "result_metadata": null
        }
      
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

async function createURLAnalysisDashboard() {
  const sessionToken = await authenticate();
  console.log("sessionToken", sessionToken);
  const apiUrl = "http://localhost:3002/api/card";

  const requestBody = {
    "name": "URL Analysis - All metrics",
    "cache_ttl": null,
    "type": "question",
    "dataset_query": {
        "database": 2,
        "type": "native",
        "native": {
            "template-tags": {
                "metric": {
                    "type": "text",
                    "name": "metric",
                    "id": "cb6a1219-84f0-4c2e-829d-656400af50f0",
                    "display-name": "Metric",
                    "default": [
                        "page-visit"
                    ]
                },
                "start_date": {
                    "type": "date",
                    "name": "start_date",
                    "id": "4da97e5c-a67b-4f77-a2d1-c9101ecd552d",
                    "display-name": "Start Date",
                    "required": true,
                    "default": "2024-11-01"
                },
                "end_date": {
                    "type": "date",
                    "name": "end_date",
                    "id": "f676e5c1-2873-450a-b145-f1657c1b8c41",
                    "display-name": "End Date",
                    "required": true,
                    "default": "2025-01-31"
                },
                "deviceType": {
                    "type": "text",
                    "name": "deviceType",
                    "id": "8ba30c16-d610-4789-915d-bbb57e9de0a3",
                    "display-name": "DeviceType",
                    "required": true,
                    "default": [
                        "desktop"
                    ]
                },
                "url": {
                    "type": "text",
                    "name": "url",
                    "id": "4cea595c-1717-468d-9ad6-5603d27c5176",
                    "display-name": "URL",
                    "default": "http://localhost:3001/",
                    "required": true
                },
                "conversion_status": {
                    "type": "text",
                    "name": "conversion_status",
                    "id": "6a4dee01-4276-4644-9730-60441725e8e8",
                    "display-name": "Conversion Status",
                    "required": true,
                    "default": [
                        "converted"
                    ]
                }
            },
            "query": "WITH SessionUrlFlow AS (\n    -- Step 1: Get the URL flow for each session\n    SELECT\n        e.\"sessionId\",\n        e.\"url\",\n        e.\"createdAt\",\n        LEAD(e.\"url\") OVER (PARTITION BY e.\"sessionId\" ORDER BY e.\"createdAt\") AS next_url\n    FROM \"Event\" e\n    WHERE e.\"traceEvent\" = {{metric}} -- Metric: page-visits, page-ins, page-outs\n),\nConversionStatus AS (\n    -- Step 2: Determine conversion status at the URL level\n    SELECT\n        s.\"sessionId\",\n        s.\"url\",\n        s.\"createdAt\",\n        CASE\n            WHEN s.next_url IS NOT NULL THEN 'converted'\n            ELSE 'non-converted'\n        END AS conversion_status\n    FROM SessionUrlFlow s\n),\nFilteredEvents AS (\n    -- Step 3: Filter events based on selected parameters\n    SELECT\n        e.\"id\",\n        e.\"sessionId\",\n        e.\"url\",\n        e.\"traceEvent\",\n        e.\"deviceType\",\n        e.\"createdAt\",\n        c.conversion_status\n    FROM \"Event\" e\n    JOIN ConversionStatus c ON e.\"sessionId\" = c.\"sessionId\" AND e.\"url\" = c.\"url\"\n    WHERE e.\"traceEvent\" = {{metric}} -- Metric: page-visits, page-ins, page-outs\n      AND e.\"createdAt\" BETWEEN {{start_date}} AND {{end_date}} -- Time range\n      AND e.\"deviceType\" = {{deviceType}} -- Device type filter\n      AND e.\"url\" = {{url}} -- URL filter\n      AND c.conversion_status = {{conversion_status}} -- Conversion status filter\n)\n-- Final aggregation\nSELECT\n    e.\"traceEvent\" AS metric,\n    COUNT(*) AS event_count,\n    e.\"conversion_status\",\n    e.\"deviceType\",\n    DATE_TRUNC('day', e.\"createdAt\") AS event_date\nFROM FilteredEvents e\nGROUP BY\n    e.\"traceEvent\",\n    e.\"conversion_status\",\n    e.\"deviceType\",\n    DATE_TRUNC('day', e.\"createdAt\")\nORDER BY event_date, metric;\n"
        }
    },
    "display": "combo",
    "description": null,
    "visualization_settings": {
        "graph.dimensions": [
            "event_date"
        ],
        "graph.series_order_dimension": null,
        "graph.series_order": null,
        "graph.show_trendline": true,
        "graph.show_goal": false,
        "graph.show_values": false,
        "graph.label_value_formatting": "auto",
        "graph.metrics": [
            "event_count"
        ]
    },
    "parameters": [
        {
            "id": "cb6a1219-84f0-4c2e-829d-656400af50f0",
            "type": "category",
            "target": [
                "variable",
                [
                    "template-tag",
                    "metric"
                ]
            ],
            "name": "Metric",
            "slug": "metric",
            "default": [
                "page-visit"
            ],
            "values_query_type": "list",
            "values_source_type": "static-list",
            "values_source_config": {
                "values": [
                    [
                        "page-visit",
                        "Page Visit"
                    ],
                    [
                        "page-in",
                        "Page In"
                    ],
                    [
                        "page-out",
                        "Page Out"
                    ]
                ]
            }
        },
        {
            "id": "4da97e5c-a67b-4f77-a2d1-c9101ecd552d",
            "type": "date/single",
            "target": [
                "variable",
                [
                    "template-tag",
                    "start_date"
                ]
            ],
            "name": "Start Date",
            "slug": "start_date",
            "default": "2024-11-01",
            "required": true
        },
        {
            "id": "f676e5c1-2873-450a-b145-f1657c1b8c41",
            "type": "date/single",
            "target": [
                "variable",
                [
                    "template-tag",
                    "end_date"
                ]
            ],
            "name": "End Date",
            "slug": "end_date",
            "default": "2025-01-31",
            "required": true
        },
        {
            "id": "8ba30c16-d610-4789-915d-bbb57e9de0a3",
            "type": "category",
            "target": [
                "variable",
                [
                    "template-tag",
                    "deviceType"
                ]
            ],
            "name": "DeviceType",
            "slug": "deviceType",
            "default": [
                "desktop"
            ],
            "required": true,
            "values_query_type": "list",
            "values_source_type": "static-list",
            "values_source_config": {
                "values": [
                    [
                        "mobile",
                        "Mobile"
                    ],
                    [
                        "desktop",
                        "Desktop"
                    ],
                    [
                        "tablet",
                        "Tablet"
                    ]
                ]
            }
        },
        {
            "id": "4cea595c-1717-468d-9ad6-5603d27c5176",
            "type": "category",
            "target": [
                "variable",
                [
                    "template-tag",
                    "url"
                ]
            ],
            "name": "URL",
            "slug": "url",
            "default": "http://localhost:3001/",
            "required": true
        },
        {
            "id": "6a4dee01-4276-4644-9730-60441725e8e8",
            "type": "category",
            "target": [
                "variable",
                [
                    "template-tag",
                    "conversion_status"
                ]
            ],
            "name": "Conversion Status",
            "slug": "conversion_status",
            "default": [
                "converted"
            ],
            "required": true,
            "values_query_type": "list",
            "values_source_type": "static-list",
            "values_source_config": {
                "values": [
                    [
                        "converted",
                        "Converted"
                    ],
                    [
                        "non-converted",
                        "Non Converted"
                    ]
                ]
            }
        }
    ],
    "parameter_mappings": [],
    "archived": false,
    "enable_embedding": false,
    "embedding_params": null,
    "collection_id": null,
    "collection_position": null,
    "collection_preview": true,
    "result_metadata": null
}


  try {
    const response = await axios.post(apiUrl, requestBody, {
      headers: {
        "Content-Type": "application/json",
        "X-Metabase-Session": sessionToken
      }
    });
    
    await addDashboardToPrisma("URL Analysis Dashboard", response.data.id);
    return response.data.id;
  } catch (error) {
    console.error("Error creating dashboard:", error);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

async function createPLTByBrowserDashboard() {
    const sessionToken = await authenticate();
    console.log("sessionToken", sessionToken);
    const apiUrl = "http://localhost:3002/api/card";

    const requestBody = {
        "name": "PLT by Browser",
        "type": "question",
        "dataset_query": {
            "database": 2,
            "type": "native",
            "native": {
                "template-tags": {
                    "start_date": {
                        "type": "date",
                        "name": "start_date",
                        "id": "7f7b272c-4e26-406d-b66d-22d239acfa20",
                        "display-name": "Start Date",
                        "default": "2024-11-01",
                        "required": true
                    },
                    "end_date": {
                        "type": "date",
                        "name": "end_date",
                        "id": "42b73492-31db-4dc9-9480-89b77c3f7352",
                        "display-name": "End Date",
                        "default": "2025-01-31",
                        "required": true
                    }
                },
                "query": "SELECT\n\"browser\",\n  ROUND(\n    AVG(\n      CAST(\"additionalData\" ->> 'pageLoadTime' AS NUMERIC)\n    ),\n    2\n  ) AS avg_page_load_time\nFROM\n  \"Event\"\nWHERE\n  \"createdAt\" BETWEEN {{start_date}} AND {{end_date}}\nGROUP BY\n  \"browser\""
            }
        },
        "display": "bar",
        "description": null,
        "visualization_settings": {
            "graph.dimensions": [
                "browser"
            ],
            "graph.metrics": [
                "avg_page_load_time"
            ]
        },
        "parameters": [
            {
                "id": "7f7b272c-4e26-406d-b66d-22d239acfa20",
                "type": "date/single",
                "target": [
                    "variable",
                    [
                        "template-tag",
                        "start_date"
                    ]
                ],
                "name": "Start Date",
                "slug": "start_date",
                "default": "2024-11-01",
                "required": true
            },
            {
                "id": "42b73492-31db-4dc9-9480-89b77c3f7352",
                "type": "date/single",
                "target": [
                    "variable",
                    [
                        "template-tag",
                        "end_date"
                    ]
                ],
                "name": "End Date",
                "slug": "end_date",
                "default": "2025-01-31",
                "required": true
            }
        ],
        "collection_id": null,
        "collection_position": null,
        "result_metadata": [
            {
                "display_name": "browser",
                "field_ref": [
                    "field",
                    "browser",
                    {
                        "base-type": "type/Text"
                    }
                ],
                "base_type": "type/Text",
                "effective_type": "type/Text",
                "name": "browser",
                "semantic_type": null,
                "fingerprint": {
                    "global": {
                        "distinct-count": 5,
                        "nil%": 0
                    },
                    "type": {
                        "type/Text": {
                            "percent-json": 0,
                            "percent-url": 0,
                            "percent-email": 0,
                            "percent-state": 0,
                            "average-length": 12.8
                        }
                    }
                }
            },
            {
                "display_name": "avg_page_load_time",
                "field_ref": [
                    "field",
                    "avg_page_load_time",
                    {
                        "base-type": "type/Decimal"
                    }
                ],
                "base_type": "type/Decimal",
                "effective_type": "type/Decimal",
                "name": "avg_page_load_time",
                "semantic_type": null,
                "fingerprint": {
                    "global": {
                        "distinct-count": 5,
                        "nil%": 0
                    },
                    "type": {
                        "type/Number": {
                            "min": 590.94,
                            "q1": 596.2875,
                            "q3": 608.35,
                            "max": 608.74,
                            "sd": 7.89984620103453,
                            "avg": 602.692
                        }
                    }
                }
            }
        ]
    }
  
  
    try {
      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          "Content-Type": "application/json",
          "X-Metabase-Session": sessionToken
        }
      });
      
      await addDashboardToPrisma("PLT By Browser Dashboard", response.data.id);
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
  createPageExitsCountDashboard,
  createURLAnalysisDashboard,
  createPLTByBrowserDashboard
};