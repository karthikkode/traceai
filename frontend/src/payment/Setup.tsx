import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TopBar from "@/components/TopBar";

const PaymentSetup = () => {
  const [url, setUrl] = useState(""); // State to store the URL
  const [duration, setDuration] = useState<number>(60); // Duration in minutes
  const [failureThreshold, setFailureThreshold] = useState<number>(5); // Failure threshold
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isExisting, setIsExisting] = useState(false); // State to check if a record exists
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch the existing data from the backend
  const fetchUrl = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/payment/getPaymentUrls`, // Adjusted to use `backendUrl`
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const fetchedUrl = data.data[0]?.url || ""; // Get the first URL or empty string
        const fetchedDuration = data.data[0]?.duration || 60; // Default to 60 minutes
        const fetchedFailureThreshold = data.data[0]?.failureCount || 5; // Default to 5 failures

        setUrl(fetchedUrl);
        setDuration(fetchedDuration);
        setFailureThreshold(fetchedFailureThreshold);
        setIsExisting(!!fetchedUrl); // Determine if the record exists
      } else {
        throw new Error("Failed to fetch the URL");
      }
    } catch (error) {
      console.error("Error fetching URL:", error);
      setUrl("");
      setDuration(60);
      setFailureThreshold(5);
      setIsExisting(false); // Assume no record exists on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUrl(); // Fetch the data on component mount
  }, []);

  // Handle input change for the URL
  const handleUrlChange = (value: string) => {
    setUrl(value);
  };

  // Handle duration change
  const handleDurationChange = (value: number) => {
    setDuration(value);
  };

  // Handle failure threshold change
  const handleFailureThresholdChange = (value: number) => {
    setFailureThreshold(value);
  };

  // Submit the data to the backend
  const submitUrl = async () => {
    setIsSubmitting(true);

    try {
      // Determine whether to create or update based on `isExisting`
      const endpoint = isExisting
        ? `${backendUrl}/payment/updatePaymentUrl`
        : `${backendUrl}/payment/addPaymentUrl`;

      const method = isExisting ? "PUT" : "POST";

      const body = isExisting
        ? JSON.stringify({
            currentUrl: url, // Current URL for update
            newUrl: url, // Update to the same or new URL
            duration, // Update duration
            failureCount: failureThreshold, // Update failure threshold
          })
        : JSON.stringify({
            url, // Create with new URL
            duration, // Add duration
            failureCount: failureThreshold, // Add failure threshold
          });

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      if (response.ok) {
        alert(
          isExisting
            ? "Settings updated successfully!"
            : "URL added successfully!"
        );
        fetchUrl(); // Refresh the data after submission
      } else {
        throw new Error("Failed to submit settings");
      }
    } catch (error) {
      console.error("Error submitting settings:", error);
      alert("Failed to submit settings");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <TopBar />
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Payment Setup</h1>

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              {/* URL Input */}
              <Input
                type="text"
                placeholder="Enter Payment URL"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                className="flex-grow"
              />

              {/* Duration Input */}
              <Input
                type="number"
                placeholder="Enter Duration (minutes)"
                value={duration}
                onChange={(e) => handleDurationChange(Number(e.target.value))}
                className="flex-grow"
              />

              {/* Failure Threshold Input */}
              <Input
                type="number"
                placeholder="Enter Failure Threshold"
                value={failureThreshold}
                onChange={(e) =>
                  handleFailureThresholdChange(Number(e.target.value))
                }
                className="flex-grow"
              />
            </div>
          </div>
        )}

        <Button
          onClick={submitUrl}
          disabled={isSubmitting || isLoading}
          className="mt-4"
        >
          {isSubmitting ? "Submitting..." : "Save Settings"}
        </Button>
      </div>
    </>
  );
};

export default PaymentSetup;
