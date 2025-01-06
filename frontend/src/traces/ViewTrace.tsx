import { useState, useEffect } from "react";
import { Funnel, FunnelChart, Tooltip, LabelList } from "recharts";
import { useParams } from "react-router-dom";
import axios from "axios";
import TopBar from "@/components/TopBar";

const TraceFunnel = () => {
  const [funnelData, setFunnelData] = useState<any>([]);
  const { traceId } = useParams<{ traceId: string }>();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const generateRandomColor = () =>
    `#${Math.floor(Math.random() * 16777215).toString(16)}`;

  useEffect(() => {
    const fetchTrace = async () => {
      try {
        const trace = await axios.get(`${backendUrl}/traces/${traceId}`);
        let steps = { steps: "" };
        steps.steps = trace.data.data.steps;
        const funnelDataResponse = await axios.post(
          `${backendUrl}/traces/getTraceData/funnel`,
          steps
        );
        funnelDataResponse.data.data.map((step: any) => {
          step.fill = generateRandomColor();
        });
        setFunnelData(funnelDataResponse.data.data);
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
