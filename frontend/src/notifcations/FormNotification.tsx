import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import TopBar from "@/components/TopBar";

const FormNotificationPage = () => {
  const [formData, setFormData] = useState({
    id: null, // To track the current config being edited
    formId: "",
    dropOffPercentage: 0,
    notificationFrequency: 0,
  });
  const [viewMode, setViewMode] = useState<"form" | "list">("list");
  const [configurations, setConfigurations] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "dropOffPercentage" || name === "notificationFrequency"
          ? parseFloat(value)
          : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing && formData.id) {
        // Update existing configuration
        await axios.put(
          `http://localhost:3000/formNotifications/formNotificationConfigs/${formData.id}`,
          formData
        );
        alert("Configuration updated successfully!");
      } else {
        // Create new configuration
        await axios.post(
          "http://localhost:3000/formNotifications/formNotificationConfigs",
          formData
        );
        alert("Configuration saved successfully!");
      }

      resetForm();
      fetchConfigurations(); // Refresh the list
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
        "http://localhost:3000/formNotifications/formNotificationConfigs"
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
      formId: config.formId,
      dropOffPercentage: config.dropOffPercentage,
      notificationFrequency: config.notificationFrequency,
    });
    setIsEditing(true);
    setViewMode("form");
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(
        `http://localhost:3000/formNotifications/formNotificationConfigs/${id}`
      );
      alert("Configuration deleted successfully!");
      fetchConfigurations(); // Refresh the list
    } catch (error) {
      console.error("Error deleting configuration:", error);
      alert("An error occurred while deleting.");
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      formId: "",
      dropOffPercentage: 0,
      notificationFrequency: 0,
    });
    setIsEditing(false);
  };

  const handleCreateNew = () => {
    resetForm();
    setViewMode("form");
  };

  // Fetch configurations on component mount
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
                ? "Edit Form Notification Configuration"
                : "Create Form Notification Configuration"}
            </h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Label htmlFor="formId">Form ID</Label>
                <Input
                  id="formId"
                  name="formId"
                  placeholder="Enter Form ID"
                  value={formData.formId}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="dropOffPercentage">
                  Drop-Off Percentage Threshold
                </Label>
                <Input
                  id="dropOffPercentage"
                  name="dropOffPercentage"
                  placeholder="Enter drop-off percentage"
                  value={formData.dropOffPercentage}
                  onChange={handleInputChange}
                  type="number"
                  min="0"
                  max="100"
                  required
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="notificationFrequency">
                  Notification Frequency (Minutes)
                </Label>
                <Input
                  id="notificationFrequency"
                  name="notificationFrequency"
                  placeholder="Enter notification frequency in minutes"
                  value={formData.notificationFrequency}
                  onChange={handleInputChange}
                  type="number"
                  min="1"
                  required
                />
              </div>
              <Separator className="my-4" />
              <div className="flex gap-4">
                <Button type="submit">
                  {isEditing ? "Update" : "Create"} Configuration
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setViewMode("list")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">
                Existing Form Notification Configurations
              </h2>
              {loading ? (
                <p>Loading configurations...</p>
              ) : configurations.length > 0 ? (
                <div className="space-y-4">
                  {configurations.map((config: any) => (
                    <div
                      key={config.id}
                      className="p-4 border rounded-md shadow-sm bg-gray-100 text-gray-900 flex flex-col justify-between"
                    >
                      <div className="mb-4">
                        <p>
                          <strong className="text-black">Form ID:</strong>{" "}
                          {config.formId}
                        </p>
                        <p>
                          <strong className="text-black">
                            Drop-Off Percentage Threshold:
                          </strong>{" "}
                          {config.dropOffPercentage}%
                        </p>
                        <p>
                          <strong className="text-black">
                            Notification Frequency (Minutes):
                          </strong>{" "}
                          {config.notificationFrequency}
                        </p>
                      </div>
                      <div className="flex justify-end gap-2">
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

export default FormNotificationPage;
