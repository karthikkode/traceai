function buildQuery(steps) {
    let query = "WITH "; // Initialize the query string with a single WITH
  
    steps.forEach((step, stepIndex) => {
      let stepConditions = "";
      const stepName = step.name
  
      step.groups.forEach((group, groupIndex) => {
        const groupCondition = getGroupConditions(group.conditions);
        if (groupIndex === 0) {
          stepConditions += `(${groupCondition})`;
        } else {
          stepConditions += ` AND (${groupCondition})`;
        }
      });
  
      // Add CTE for each step
      query += `step${stepIndex + 1} AS (
        SELECT '${stepName}' as name, COUNT(DISTINCT "ipAddress") AS value
        FROM "Event"
        WHERE 1=1
        AND ${stepConditions}
      )`;
      if (stepIndex < steps.length - 1) {
        query += ",\n"; // Add a comma for multiple CTEs
      }
    });
  
    // Build the final SELECT query with UNION ALL
    query += "\n";
    query += steps
      .map((_, index) => `SELECT name, value FROM step${index + 1}`)
      .join("\nUNION ALL\n");
  
    return query;
  }
  
  function getGroupConditions(groupConditions) {
    let baseCondition = "((1=1)"; // Initialize the base condition
  
    groupConditions.forEach((condition) => {
      if (condition.metricName === "page") {
        const regexCondition =
          condition.regexFilter === "startsWith"
            ? `${condition.value}%`
            : condition.regexFilter === "endsWith"
            ? `%${condition.value}`
            : `%${condition.value}%`;
  
        baseCondition += ` OR ("traceEvent" = 'trace-page-view' AND "traceEventName" LIKE '${regexCondition}'))`;
      }
      // Add other metricName cases if needed
    });
  
    return baseCondition;
  }

  module.exports = { buildQuery }