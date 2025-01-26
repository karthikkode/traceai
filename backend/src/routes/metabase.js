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
    const newDashboard = await prisma.metabaseDashboards.create({
      data: {
        dashboardName,
        cardId,
      },
    });
    console.log("New Dashboard Added to Database:", newDashboard);
  } catch (error) {
    console.error("Error inserting dashboard into Prisma:", error);
  }
}

async function createMetabaseFormsDashboard() {
  const sessionToken = await authenticate();
  const apiUrl = "http://localhost:3002/api/card";

  const requestBody = {
    name: "Form Dashboard",
    // Add the rest of your Form Dashboard configuration here
  };

  try {
    const response = await axios.post(apiUrl, requestBody, {
      headers: {
        "Content-Type": "application/json",
        "X-Metabase-Session": sessionToken,
      },
    });

    await addDashboardToPrisma("Form Dashboard", response.data.id);

    return response.data.id;
  } catch (error) {
    console.error("Error creating Form Dashboard:", error);
    return null;
  }
}

async function createUninteractedTimeDashboard() {
  const sessionToken = await authenticate();
  const apiUrl = "http://localhost:3002/api/card";

  const requestBody = {
    name: "Uninteracted Time Dashboard",
    // Add the rest of your Uninteracted Time Dashboard configuration here
  };

  try {
    const response = await axios.post(apiUrl, requestBody, {
      headers: {
        "Content-Type": "application/json",
        "X-Metabase-Session": sessionToken,
      },
    });

    await addDashboardToPrisma("Uninteracted Time Dashboard", response.data.id);

    return response.data.id;
  } catch (error) {
    console.error("Error creating Uninteracted Time Dashboard:", error);
    return null;
  }
}

async function createPLTDashboard() {
  const sessionToken = await authenticate();
  const apiUrl = "http://localhost:3002/api/card";

  const requestBody = {
    name: "PLT Dashboard",
    // Add the rest of your PLT Dashboard configuration here
  };

  try {
    const response = await axios.post(apiUrl, requestBody, {
      headers: {
        "Content-Type": "application/json",
        "X-Metabase-Session": sessionToken,
      },
    });

    await addDashboardToPrisma("PLT Dashboard", response.data.id);

    return response.data.id;
  } catch (error) {
    console.error("Error creating PLT Dashboard:", error);
    return null;
  }
}

async function createTimeSpentOnPageDashboard() {
  const sessionToken = await authenticate();
  const apiUrl = "http://localhost:3002/api/card";

  const requestBody = {
    name: "Time Spent on Page by Converted Customers",
    // Add the rest of your Time Spent on Page Dashboard configuration here
  };

  try {
    const response = await axios.post(apiUrl, requestBody, {
      headers: {
        "Content-Type": "application/json",
        "X-Metabase-Session": sessionToken,
      },
    });

    await addDashboardToPrisma("Time Spent on Page by Converted Customers", response.data.id);

    return response.data.id;
  } catch (error) {
    console.error("Error creating Time Spent on Page Dashboard:", error);
    return null;
  }
}

async function createPageExitsCountDashboard() {
  const sessionToken = await authenticate();
  const apiUrl = "http://localhost:3002/api/card";

  const requestBody = {
    name: "Page Exits Count Dashboard",
    // Add the rest of your Page Exits Count Dashboard configuration here
  };

  try {
    const response = await axios.post(apiUrl, requestBody, {
      headers: {
        "Content-Type": "application/json",
        "X-Metabase-Session": sessionToken,
      },
    });

    await addDashboardToPrisma("Page Exits Count Dashboard", response.data.id);

    return response.data.id;
  } catch (error) {
    console.error("Error creating Page Exits Count Dashboard:", error);
    return null;
  }
}

module.exports = {
  createMetabaseFormsDashboard,
  createUninteractedTimeDashboard,
  createPLTDashboard,
  createTimeSpentOnPageDashboard,
  createPageExitsCountDashboard,
};
