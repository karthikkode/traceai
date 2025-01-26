import { useState, useEffect } from "react";
import { Funnel, FunnelChart, Tooltip, LabelList } from "recharts";
import { useParams } from "react-router-dom";
import axios from "axios";
import TopBar from "@/components/TopBar";

const TraceFunnel = () => {
  const [funnelData, setFunnelData] = useState<any>([]);
  const { traceId } = useParams<{ traceId: string }>();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const colorPalette = [
    "#FF5733", // Bright red
    "#33FF57", // Bright green
    "#3357FF", // Bright blue
    "#FF33A1", // Bright pink
    "#FFC300", // Bright yellow
    "#33FFF6", // Bright cyan
    "#8D33FF", // Bright purple
    "#FF8C33", // Bright orange
    "#6A33FF", // Bright indigo
    "#33FF8C", // Bright lime
  ];

  // Function to assign colors, ensuring no consecutive steps share the same color
  const assignColors = (steps: any[]) => {
    const assignedColors: any = [];
    for (let i = 0; i < steps.length; i++) {
      const colorIndex = i % colorPalette.length;
      // Ensure no consecutive steps have the same color
      const color =
        i > 0 && assignedColors[i - 1] === colorPalette[colorIndex]
          ? colorPalette[(colorIndex + 1) % colorPalette.length]
          : colorPalette[colorIndex];
      assignedColors.push(color);
    }
    return steps.map((step, index) => ({
      ...step,
      fill: assignedColors[index],
    }));
  };

  useEffect(() => {
    const fetchTrace = async () => {
      try {
        const trace = await axios.get(`${backendUrl}/traces/${traceId}`);
        let steps = { steps: "" };
        steps.steps = trace.data.data.steps;

        console.log(steps.steps);
        const funnelDataResponse = await axios.post(
          `${backendUrl}/traces/getTraceData/funnel`,
          steps
        );

        // Assign colors using the simple alternate logic
        const updatedFunnelData = assignColors(funnelDataResponse.data.data);

        setFunnelData(updatedFunnelData);
      } catch (error) {
        console.error("Error fetching trace:", error);
      }
    };

    fetchTrace();
  }, []);

  return (
    <>
      <TopBar />
      <div className="flex justify-center">
        <FunnelChart width={730} height={250}>
          <Tooltip />
          <Funnel dataKey="value" data={funnelData} isAnimationActive>
            <LabelList
              position="center"
              fill="#000"
              stroke="none"
              dataKey="name"
            />
          </Funnel>
        </FunnelChart>
      </div>
    </>
  );
};

export default TraceFunnel;
