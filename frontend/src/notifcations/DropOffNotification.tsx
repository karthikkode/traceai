import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import TopBar from "@/components/TopBar";

const DropoffConfigForm = () => {
  const sendApiRequests = async (url: string, urlMatchType: string) => {
    if (!url || !urlMatchType) {
      console.error("Missing required parameters: url and urlMatchType");
      return;
    }

    const apis = [
      { name: "PLT Report", endpoint: "/pltReport" },
      { name: "Uninteracted Time Report", endpoint: "/uninteractedTimeReport" },
      { name: "Time Spent Report", endpoint: "/timeSpentReport" },
      { name: "Average Page Exits", endpoint: "/averagePageExitsByUrl" },
    ];

    for (const api of apis) {
      try {
        console.log(`Sending request to ${api.name} API...`);
        const response = await axios.get(
          `http://localhost:3000/notifications/${api.endpoint}`,
          {
            params: { url, urlMatchType },
          }
        );
        console.log(`${api.name} API Response:`, response.data);
      } catch (error: any) {
        console.error(`Error in ${api.name} API:`, error.message);
      }
    }
  };
  const [formData, setFormData] = useState({
    id: null,
    urlPath: "",
    urlGroupName: "",
    dropoffPercentage: 0,
    notificationFrequency: 0,
    urlMatchType: "exact",
  });
  const [viewMode, setViewMode] = useState<"form" | "list">("list");
  const [configurations, setConfigurations] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing && formData.id) {
        await axios.put(
          `http://localhost:3000/dropOff/dropoffConfig/${formData.id}`,
          formData
        );
        alert("Configuration updated successfully!");
      } else {
        await axios.post(
          "http://localhost:3000/dropOff/dropoffConfig",
          formData
        );
        alert("Configuration saved successfully!");
      }

      resetForm();
      fetchConfigurations();
      setViewMode("list");
    } catch (error) {
      console.error("Error saving configuration:", error);
      alert("An error occurred while saving.");
    }
  };

  const fetchConfigurations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:3000/dropOff/dropoffConfig"
      );
      setConfigurations(response.data.data);
    } catch (error) {
      console.error("Error fetching configurations:", error);
      alert("An error occurred while fetching configurations.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (config: any) => {
    setFormData({
      id: config.id,
      urlPath: config.urlPath,
      urlGroupName: config.urlGroupName,
      dropoffPercentage: config.dropoffPercentage,
      notificationFrequency: config.notificationFrequency,
      urlMatchType: config.urlMatchType,
    });
    setIsEditing(true);
    setViewMode("form");
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/dropOff/dropoffConfig/${id}`);
      alert("Configuration deleted successfully!");
      fetchConfigurations();
    } catch (error) {
      console.error("Error deleting configuration:", error);
      alert("An error occurred while deleting.");
    }
  };

  const handleSendInsights = async (config: any) => {
    let dropOff;
    try {
      const response = await axios.get(
        "http://localhost:3000/notifications/calculateDropoff",
        {
          params: {
            url: config.urlPath,
            urlMatchType: config.urlMatchType,
          },
        }
      );

      if (response.data.success) {
        dropOff = response.data.serializedResult[0].non_converted_percentage;
        console.log("dropOff", dropOff);
        if (dropOff && dropOff >= config.dropoffPercentage) {
          console.log("fdsj");
          const url = config.urlPath;
          const urlMatchType = config.urlMatchType;
          await sendApiRequests(url, urlMatchType);
        } else {
          console.log("dsgvj");
        }
        return dropOff; // Return the result for further use
      } else {
        console.error(
          "Error:",
          response.data.message || "Unknown error occurred"
        );
      }
    } catch (error) {
      console.error("Error calling calculateDropoff API:", error);
      throw error; // Re-throw the error if needed for higher-level handling
    }

    console.log("dropOff", dropOff);
  };

  const resetForm = () => {
    setFormData({
      id: null,
      urlPath: "",
      urlGroupName: "",
      dropoffPercentage: 0,
      notificationFrequency: 0,
      urlMatchType: "exact",
    });
    setIsEditing(false);
  };

  const handleCreateNew = () => {
    resetForm();
    setViewMode("form");
  };

  useEffect(() => {
    fetchConfigurations();
  }, []);

  return (
    <>
      <TopBar />
      <div className="max-w-md mx-auto mt-8">
        {viewMode === "form" ? (
          <>
            <h1 className="text-xl font-bold mb-4">
              {isEditing
                ? "Edit Drop-off Configuration"
                : "Create Drop-off Configuration"}
            </h1>
            <form onSubmit={handleSubmit}>
              {/* Form Fields */}
              {/* ...existing form fields */}
            </form>
          </>
        ) : (
          <>
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">
                Existing Drop-off Configurations
              </h2>
              {loading ? (
                <p>Loading configurations...</p>
              ) : configurations.length > 0 ? (
                <div className="space-y-4">
                  {configurations.map((config: any) => (
                    <div
                      key={config.id}
                      className="p-4 border rounded-md shadow-sm bg-gray-100 text-gray-900"
                    >
                      <div>
                        <p>
                          <strong className="text-black">URL Path:</strong>{" "}
                          {config.urlPath}
                        </p>
                        <p>
                          <strong className="text-black">Group Name:</strong>{" "}
                          {config.urlGroupName}
                        </p>
                        <p>
                          <strong className="text-black">
                            Drop-off Percentage:
                          </strong>{" "}
                          {config.dropoffPercentage}%
                        </p>
                        <p>
                          <strong className="text-black">
                            Notification Frequency (Minutes):
                          </strong>{" "}
                          {config.notificationFrequency}
                        </p>
                        <p>
                          <strong className="text-black">
                            URL Match Type:
                          </strong>{" "}
                          {config.urlMatchType}
                        </p>
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button size="sm" onClick={() => handleEdit(config)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(config.id)}
                        >
                          Delete
                        </Button>
                        <Button
                          size="sm"
                          className="bg-blue-500 text-white hover:bg-blue-600"
                          onClick={() => handleSendInsights(config)}
                        >
                          Send Insights
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No configurations found.</p>
              )}
              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={handleCreateNew}
              >
                Create New Configuration
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default DropoffConfigForm;
