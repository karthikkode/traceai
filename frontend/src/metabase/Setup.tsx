import TopBar from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState, useEffect } from "react";

type Dashboards = {
  [key: string]: number; // The dashboard name is a string, and the cardId is a number
};

function MetabaseSetup() {
  const [dashboards, setDashboards] = useState<Dashboards>({});
  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboards = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/form/getDashboards"
        );
        const dashboardsData = response.data.reduce(
          (acc: any, dashboard: any) => {
            acc[dashboard.dashboardName] = dashboard.cardId;
            return acc;
          },
          {}
        );
        setDashboards(dashboardsData);
      } catch (error) {
        console.error("Error fetching dashboards:", error);
      }
    };

    fetchDashboards();
  }, []);

  useEffect(() => {
    console.log(dashboards);
    console.log(dashboards["Uninteracted Time Dashboard"]);
  }, [dashboards]);

  const handleFormsDashboard = async () => {
    console.log("Creating Forms Dashboard...");
    const response = await axios.post(
      "http://localhost:3000/form/createFromsDashboard"
    );
    console.log(response.data);
  };

  const handlePLTDashboard = async () => {
    console.log("Creating PLT Dashboard...");
    const response = await axios.post(
      "http://localhost:3000/form/createPLTDashboard"
    );
    console.log(response.data);
    // Add your function logic here
  };

  const handleUninteractedTimeDashboard = async () => {
    console.log("Creating Uninteracted Time Dashboard...");
    const response = await axios.post(
      "http://localhost:3000/form/createUninteractedTimeDashboard"
    );
    console.log(response.data);
    // Add your function logic here
  };

  const handleTimeSpentDashboard = async () => {
    console.log("Creating Time Spent on Page Dashboard...");
    const response = await axios.post(
      "http://localhost:3000/form/createTimeSpentOnPageDashboard"
    );
    console.log(response.data);
    // Add your function logic here
  };

  const handlePageExitsDashboard = async () => {
    console.log("Creating Page Exits Dashboard...");
    const response = await axios.post(
      "http://localhost:3000/form/createPageExitsCountDashboard"
    );
    console.log(response.data);
    // Add your function logic here
  };

  const handleURLAnalysisDashboard = async () => {
    console.log("Creating Page Exits Dashboard...");
    const response = await axios.post(
      "http://localhost:3000/form/createURLAnalysisDashboard"
    );
    console.log(response.data);
    // Add your function logic here
  };

  const handlePLTByBrowserDashboard = async () => {
    console.log("Creating PLT By Browser Dashboard...");
    const response = await axios.post(
      "http://localhost:3000/form/createPLTByBrowserDashboard"
    );
    console.log(response.data);
    // Add your function logic here
  };

  return (
    <>
      <TopBar />
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">
          Metabase Dashboard Setup
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <div className="text-center">
            <Button className="w-full p-4" onClick={handleFormsDashboard}>
              Create Forms Dashboard
            </Button>
            <a
              href={`http://localhost:3002/question/${dashboards["Form Dashboard"]}`}
              className="text-blue-600 underline text-sm mt-2 block"
            >
              View Forms Dashboard
            </a>
          </div>
          <div className="text-center">
            <Button className="w-full p-4" onClick={handlePLTDashboard}>
              Create PLT Dashboard
            </Button>
            <a
              href={`http://localhost:3002/question/${dashboards["PLT Dashboard"]}`}
              className="text-blue-600 underline text-sm mt-2 block"
            >
              View PLT Dashboard
            </a>
          </div>
          <div className="text-center">
            <Button
              className="w-full p-4"
              onClick={handleUninteractedTimeDashboard}
            >
              Create Uninteracted Time Dashboard
            </Button>
            <a
              href={`http://localhost:3002/question/${dashboards["Uninteracted Time Dashboard"]}`}
              className="text-blue-600 underline text-sm mt-2 block"
            >
              View Uninteracted Time Dashboard
            </a>
          </div>
          <div className="text-center">
            <Button className="w-full p-4" onClick={handleTimeSpentDashboard}>
              Create Time Spent on Page Dashboard
            </Button>
            <a
              href={`http://localhost:3002/question/${dashboards["Time Spent on Page by Converted Customers"]}`}
              className="text-blue-600 underline text-sm mt-2 block"
            >
              View Time Spent on Page Dashboard
            </a>
          </div>
          <div className="text-center">
            <Button className="w-full p-4" onClick={handlePageExitsDashboard}>
              Create Page Exits Dashboard
            </Button>
            <a
              href={`http://localhost:3002/question/${dashboards["Page Exits Count Dashboard"]}`}
              className="text-blue-600 underline text-sm mt-2 block"
            >
              View Page Exits Dashboard
            </a>
          </div>
          <div className="text-center">
            <Button className="w-full p-4" onClick={handleURLAnalysisDashboard}>
              Create URL Analysis Dashboard
            </Button>
            <a
              href={`http://localhost:3002/question/${dashboards["URL Analysis Dashboard"]}`}
              className="text-blue-600 underline text-sm mt-2 block"
            >
              View URL Analysis Dashboard
            </a>
          </div>
          <div className="text-center">
            <Button
              className="w-full p-4"
              onClick={handlePLTByBrowserDashboard}
            >
              Create PLT By Browser Dashboard
            </Button>
            <a
              href={`http://localhost:3002/question/${dashboards["PLT By Browser Dashboard"]}`}
              className="text-blue-600 underline text-sm mt-2 block"
            >
              View PLT By Browser Dashboard
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default MetabaseSetup;
