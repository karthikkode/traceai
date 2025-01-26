import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import HeatmapImage from "@/heatmap/heatmap";
import TopBar from "@/components/TopBar";

const HeatMapPage = () => {
  const [pageUrl, setPageUrl] = useState("http://localhost:3001/");
  const [currentUrl, setCurrentUrl] = useState(pageUrl);
  const [heatmapKey, setHeatmapKey] = useState(0); // Key to force re-render

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUrl(pageUrl); // Updates the heatmap URL
    setHeatmapKey((prevKey) => prevKey + 1); // Increment key to force re-render
  };

  return (
    <>
      <TopBar />
      <div className="p-4">
        <form onSubmit={handleSubmit} className="flex items-center gap-2 mb-4">
          <Input
            type="text"
            value={pageUrl}
            onChange={(e) => setPageUrl(e.target.value)}
            placeholder="Enter a URL"
            className="flex-1"
          />
          <Button type="submit">Load Heatmap</Button>
        </form>
        <HeatmapImage key={heatmapKey} pageUrl={currentUrl} />
      </div>
    </>
  );
};

export default HeatMapPage;
