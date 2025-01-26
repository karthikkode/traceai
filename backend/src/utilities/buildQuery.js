async function buildQuery(steps) {
  let query = "WITH "; // Initialize the query with a WITH clause
  steps.forEach((step, stepIndex) => {
    const stepConditions = getGroupConditions(step.groups);
    const stepName = step.name;
    const groupByColumns = step.groupBy || ["deviceType", "traceEvent", "url"]; // Default grouping columns
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
      (_, index) => `SELECT name,  "url",
             SUM(value) as value, 
             AVG(pageLoadTime) as pageLoadTime 
      FROM step${index + 1}
      GROUP BY name, "url"`
    )
    .join("\nUNION ALL\n");
  return query
}

function getGroupConditions(groups) {
  let baseCondition = ""; // Initialize an empty string for the condition

  groups.forEach((group, index) => {
    const conditions = group.conditions.map((condition) => {
      if (condition.metricName === "page" || condition.metricName === "button") {
        const regexCondition =
          condition.regexFilter === "startsWith"
            ? `${condition.value}%`
            : condition.regexFilter === "endsWith"
            ? `%${condition.value}`
            : `%${condition.value}%`;
        const traceEventValue = condition.eventType === "click" ? "trace-click" : "page-visit";


        return `("traceEvent" = '${traceEventValue}' AND "traceEventName" LIKE '${regexCondition}')`;
      }
      // Add more cases for other metrics if needed
      return ""; // Default to an empty condition
    });

    const groupCondition = conditions.join(" AND ");
    baseCondition += index === 0 ? `(${groupCondition})` : ` AND (${groupCondition})`;
  });

  return baseCondition;
}


module.exports = { buildQuery }