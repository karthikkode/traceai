import TopBar from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import axios from "axios";

function MetabaseSetup() {
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
            <a href="#" className="text-blue-600 underline text-sm mt-2 block">
              View Forms Dashboard
            </a>
          </div>
          <div className="text-center">
            <Button className="w-full p-4" onClick={handlePLTDashboard}>
              Create PLT Dashboard
            </Button>
            <a href="#" className="text-blue-600 underline text-sm mt-2 block">
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
            <a href="#" className="text-blue-600 underline text-sm mt-2 block">
              View Uninteracted Time Dashboard
            </a>
          </div>
          <div className="text-center">
            <Button className="w-full p-4" onClick={handleTimeSpentDashboard}>
              Create Time Spent on Page Dashboard
            </Button>
            <a href="#" className="text-blue-600 underline text-sm mt-2 block">
              View Time Spent on Page Dashboard
            </a>
          </div>
          <div className="text-center">
            <Button className="w-full p-4" onClick={handlePageExitsDashboard}>
              Create Page Exits Dashboard
            </Button>
            <a href="#" className="text-blue-600 underline text-sm mt-2 block">
              View Page Exits Dashboard
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default MetabaseSetup;
