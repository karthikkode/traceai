import { useEffect, useState } from "react";

const HeatmapImage = ({ pageUrl }: { pageUrl: string }) => {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchHeatmapImage = async () => {
      try {
        // Fetch the heatmap image URL
        const response = await fetch(
          `http://localhost:3000/events/heatmap/${encodeURIComponent(pageUrl)}`
        );
        if (response.ok) {
          setImageUrl(response.url); // Image will be served by the backend
        } else {
          console.error("Failed to fetch heatmap image");
        }
      } catch (error) {
        console.error("Error fetching heatmap image:", error);
      }
    };

    fetchHeatmapImage();
  }, [pageUrl]);

  return (
    <div style={{ textAlign: "center" }}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Heatmap"
          style={{ maxWidth: "100%", border: "1px solid #ccc" }}
        />
      ) : (
        <p>Loading heatmap...</p>
      )}
    </div>
  );
};

export default HeatmapImage;
