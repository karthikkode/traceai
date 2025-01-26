import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import TopBar from "@/components/TopBar";

const DropoffConfigForm = () => {
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
              <div className="mb-4">
                <Label htmlFor="urlPath">URL Path:</Label>
                <Input
                  type="text"
                  id="urlPath"
                  value={formData.urlPath}
                  onChange={(e) =>
                    setFormData({ ...formData, urlPath: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-4">
                <Label htmlFor="urlGroupName">URL Group Name:</Label>
                <Input
                  type="text"
                  id="urlGroupName"
                  value={formData.urlGroupName}
                  onChange={(e) =>
                    setFormData({ ...formData, urlGroupName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="mb-4">
                <Label htmlFor="dropoffPercentage">Drop-off Percentage:</Label>
                <Input
                  type="number"
                  id="dropoffPercentage"
                  value={formData.dropoffPercentage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dropoffPercentage: Number(e.target.value),
                    })
                  }
                  required
                  min="0"
                  max="100"
                />
              </div>

              <div className="mb-4">
                <Label htmlFor="notificationFrequency">
                  Notification Frequency (Minutes):
                </Label>
                <Input
                  type="number"
                  id="notificationFrequency"
                  value={formData.notificationFrequency}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      notificationFrequency: Number(e.target.value),
                    })
                  }
                  required
                  min="0"
                />
              </div>

              <div className="mb-4">
                <Label htmlFor="urlMatchType">URL Match Type:</Label>
                <Select
                  value={formData.urlMatchType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, urlMatchType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Match Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exact">Exact</SelectItem>
                    <SelectItem value="contains">Contains</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">
                {isEditing ? "Update Configuration" : "Create Configuration"}
              </Button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold mb-4">
              Existing Drop-off Configurations
            </h2>
            {loading ? (
              <p>Loading configurations...</p>
            ) : configurations.length > 0 ? (
              <div className="space-y-4">
                {configurations.map((config: any) => (
                  <Card key={config.id}>
                    <CardHeader>
                      <CardTitle>{config.urlGroupName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>
                        <strong>URL Path:</strong> {config.urlPath}
                      </p>
                      <p>
                        <strong>Drop-off Percentage:</strong>{" "}
                        {config.dropoffPercentage}%
                      </p>
                      <p>
                        <strong>Notification Frequency:</strong>{" "}
                        {config.notificationFrequency} minutes
                      </p>
                      <p>
                        <strong>URL Match Type:</strong> {config.urlMatchType}
                      </p>
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
                      </div>
                    </CardContent>
                  </Card>
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
          </>
        )}
      </div>
    </>
  );
};

export default DropoffConfigForm;
