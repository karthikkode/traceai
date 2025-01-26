const axios = require("axios");
const { PrismaClient } = require("@prisma/client");


const prisma = new PrismaClient();


async function authenticate() {
  const url = 'http://localhost:3002/api/session'; // Replace with your Metabase API URL
  const credentials = {
    username: 'Karthiktumusai@gmail.com', // Replace with your Metabase username
    password: 'Karthik123@'  // Replace with your Metabase password
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
console.log("sessionToken",sessionToken)
  const apiUrl = "http://localhost:3002/api/card";
  const dashboardName = "Forms";

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
    await prisma.$disconnect(); // Ensure Prisma disconnects after the operation
  }
}

module.exports = {createMetabaseFormsDashboard}