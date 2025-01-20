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
        SELECT '${stepName}' as name, COUNT(DISTINCT "id") AS value
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
    let baseCondition = ""; // Initialize an empty string for the condition
  
    groupConditions.forEach((condition, index) => {
      if (condition.metricName === "page") {
        const regexCondition =
          condition.regexFilter === "startsWith"
            ? `${condition.value}%`
            : condition.regexFilter === "endsWith"
            ? `%${condition.value}`
            : `%${condition.value}%`;
  
        const conditionString = `("traceEvent" = 'page-visit' AND "traceEventName" LIKE '${regexCondition}')`;
  
        // Append with AND if not the first condition
        baseCondition += index === 0 ? conditionString : ` AND ${conditionString}`;
      }
      // Add other metricName cases if needed
    });
  
    return baseCondition;
  }

  module.exports = { buildQuery }