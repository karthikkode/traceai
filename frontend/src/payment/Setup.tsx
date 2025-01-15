import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TopBar from "@/components/TopBar";

const PaymentSetup = () => {
  const [url, setUrl] = useState(""); // State to store the URL
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [oldUrl, setOldUrl] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch the existing URL from the backend
  const fetchUrl = async () => {
    try {
      const response = await fetch(
        "http://www.localhost:3000/payment/getPaymentUrls",
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
        setUrl(fetchedUrl);
        setOldUrl(fetchedUrl);
      } else {
        throw new Error("Failed to fetch the URL");
      }
    } catch (error) {
      console.error("Error fetching URL:", error);
      setUrl("");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUrl(); // Fetch the URL on component mount
  }, []);

  // Handle input change for the URL
  const handleUrlChange = (value: any) => {
    setUrl(value);
  };

  // Submit the updated URL to the backend
  const submitUrl = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch(`${backendUrl}/payment/updatePaymentUrl`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentUrl: oldUrl, // Assuming the current URL is being updated
          newUrl: url,
        }),
      });

      if (response.ok) {
        alert("URL updated successfully!");
        fetchUrl(); // Refresh the URL after submission
      } else {
        throw new Error("Failed to update URL");
      }
    } catch (error) {
      console.error("Error updating URL:", error);
      alert("Failed to update URL");
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
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Enter Payment URL"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
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
          {isSubmitting ? "Submitting..." : "Save URL"}
        </Button>
      </div>
    </>
  );
};

export default PaymentSetup;
