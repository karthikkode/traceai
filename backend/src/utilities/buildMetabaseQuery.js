const axios = require('axios');

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

    console.log("Authenticated Successfully:", response.data.id);
    return response.data.id; // Return the session token
  } catch (error) {
    console.error("Error authenticating:", error.response?.data || error.message);
    throw new Error("Authentication failed");
  }
}

async function createCard(query, name) {
  const sessionToken = await authenticate(); // Fetch the session token dynamically

  const url = 'http://localhost:3002/api/card'; // Replace with your Metabase API URL

  const data = {
    name,
    type: "question",
    dataset_query: {
      database: 2,
      type: "native",
      native: {
        "template-tags": {
          "deviceType": {
            "type": "text",
            "name": "deviceType",
            "id": "2f5ecc7a-94e8-4507-a52a-fb1abb95e047",
            "display-name": "DeviceType"
          },
          "traceEvent": {
            "type": "text",
            "name": "traceEvent",
            "id": "d5c54723-037b-4d47-850b-f44afff0f52b",
            "display-name": "TraceEvent"
          }
        },
        query
      }
    },
    display: "bar",
    description: null,
    visualization_settings: {
      "funnel.dimension": "name",
      "funnel.metric": "value",
      "graph.metrics": ["value"],
      "graph.dimensions": ["name"],
      "graph.tooltip_columns": ["[\"name\",\"pageloadtime\"]"],
      "funnel.type": "funnel"
    },
    parameters: [
      {
        id: "2f5ecc7a-94e8-4507-a52a-fb1abb95e047",
        type: "category",
        target: ["variable", ["template-tag", "deviceType"]],
        name: "DeviceType",
        slug: "deviceType"
      },
      {
        id: "d5c54723-037b-4d47-850b-f44afff0f52b",
        type: "category",
        target: ["variable", ["template-tag", "traceEvent"]],
        name: "TraceEvent",
        slug: "traceEvent"
      }
    ],
    collection_id: null,
    collection_position: null,
    result_metadata: [
      {
        display_name: "name",
        field_ref: ["field", "name", { "base-type": "type/Text" }],
        base_type: "type/Text",
        effective_type: "type/Text",
        name: "name",
        semantic_type: "type/Name"
      },
      {
        display_name: "value",
        field_ref: ["field", "value", { "base-type": "type/Decimal" }],
        base_type: "type/Decimal",
        effective_type: "type/Decimal",
        name: "value",
        semantic_type: null
      },
      {
        display_name: "pageloadtime",
        field_ref: ["field", "pageloadtime", { "base-type": "type/Decimal" }],
        base_type: "type/Decimal",
        effective_type: "type/Decimal",
        name: "pageloadtime",
        semantic_type: null
      }
    ]
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        "X-Metabase-Session": sessionToken
      }
    });
    return response.data.id
  } catch (error) {
    console.error("Error creating card:", error.response?.data || error.message);
  }
}

async function updateCard(query, name, cardID) {
  const sessionToken = await authenticate(); // Fetch the session token dynamically

  const url = `http://localhost:3002/api/card/${cardID}`; // Replace with your Metabase API URL
  
  console.log("url",url)
  const data = {
    name,
    type: "question",
    dataset_query: {
      database: 2,
      type: "native",
      native: {
        "template-tags": {
          "deviceType": {
            "type": "text",
            "name": "deviceType",
            "id": "2f5ecc7a-94e8-4507-a52a-fb1abb95e047",
            "display-name": "DeviceType"
          },
          "traceEvent": {
            "type": "text",
            "name": "traceEvent",
            "id": "d5c54723-037b-4d47-850b-f44afff0f52b",
            "display-name": "TraceEvent"
          }
        },
        query
      }
    },
    display: "bar",
    description: null,
    visualization_settings: {
      "funnel.dimension": "name",
      "funnel.metric": "value",
      "graph.metrics": ["value"],
      "graph.dimensions": ["name"],
      "graph.tooltip_columns": ["[\"name\",\"pageloadtime\"]"],
      "funnel.type": "funnel"
    },
    parameters: [
      {
        id: "2f5ecc7a-94e8-4507-a52a-fb1abb95e047",
        type: "category",
        target: ["variable", ["template-tag", "deviceType"]],
        name: "DeviceType",
        slug: "deviceType"
      },
      {
        id: "d5c54723-037b-4d47-850b-f44afff0f52b",
        type: "category",
        target: ["variable", ["template-tag", "traceEvent"]],
        name: "TraceEvent",
        slug: "traceEvent"
      }
    ],
    collection_id: null,
    collection_position: null,
    collection_preview: true
  };

  try {
    const response = await axios.put(url, data, {
      headers: {
        "Content-Type": "application/json",
        "X-Metabase-Session": sessionToken
      }
    });
    return response.data.id
  } catch (error) {
    console.error("Error creating card:", error.response?.data || error.message);
  }
}


async function buildMetabaseQuery(steps, name, cardID) {
  let query = "WITH "; // Initialize the query with a WITH clause

  steps.forEach((step, stepIndex) => {
    const stepConditions = getGroupConditions(step.groups);
    const stepName = step.name;
    const groupByColumns = step.groupBy || ["deviceType", "traceEvent"]; // Default grouping columns

    query += `step${stepIndex + 1} AS (
      SELECT '${stepName}' as name, 
             COUNT(DISTINCT "${step.countDistinctBy || 'id'}") AS value, 
             ${groupByColumns.map((col) => `"${col}"`).join(", ")}, 
             AVG(CAST("additionalData"->>'pageLoadTime' as numeric)) as pageLoadTime
      FROM "Event"
      WHERE 1=1
      AND ${stepConditions}
      GROUP BY ${groupByColumns.map((col) => `"${col}"`).join(", ")}
    )`;

    if (stepIndex < steps.length - 1) {
      query += ",\n"; // Add a comma to separate CTEs
    }
  });

  // Build the final SELECT query with UNION ALL
  query += "\n";
  query += steps
    .map(
      (_, index) => `SELECT name, 
             SUM(value) as value, 
             AVG(pageLoadTime) as pageLoadTime 
      FROM step${index + 1} 
      WHERE "deviceType" = {{deviceType}} 
        AND "traceEvent" = {{traceEvent}} 
      GROUP BY name`
    )
    .join("\nUNION ALL\n");
  
  if(!cardID){
    console.log("cardID", cardID)
  cardID = await createCard(query, name);
  console.log("cardID", cardID)

  return cardID;
  }
  else {
     await updateCard(query, name, cardID)
  }
  
}

function getGroupConditions(groups) {
  let baseCondition = ""; // Initialize an empty string for the condition

  groups.forEach((group, index) => {
    const conditions = group.conditions.map((condition) => {
      if (condition.metricName === "page") {
        const regexCondition =
          condition.regexFilter === "startsWith"
            ? `${condition.value}%`
            : condition.regexFilter === "endsWith"
            ? `%${condition.value}`
            : `%${condition.value}%`;

        return `("traceEvent" = 'page-visit' AND "traceEventName" LIKE '${regexCondition}')`;
      }
      // Add more cases for other metrics if needed
      return ""; // Default to an empty condition
    });

    const groupCondition = conditions.join(" AND ");
    baseCondition += index === 0 ? `(${groupCondition})` : ` AND (${groupCondition})`;
  });

  return baseCondition;
}



module.exports = { buildMetabaseQuery, createCard };