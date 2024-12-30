import { useState, useEffect } from "react";
import axios from "axios";
import TraceCard from "@/components/TraceCard"; // Assuming Trace component exists for individual traces
import TopBar from "@/components/TopBar";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface Trace {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  organizationId: string;
}

const AllTraces = () => {
  const [traces, setTraces] = useState<Trace[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTraces = async () => {
      try {
        const response = await axios.get(`${backendUrl}/traces`);
        setTraces(response.data);
      } catch (error: any) {
        console.error("Error fetching traces:", error);
        setError("Failed to fetch traces.");
      } finally {
        setLoading(false);
      }
    };

    fetchTraces();
  }, []);

  if (loading) {
    return <div>Loading traces...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <>
      <TopBar />
      <div className="p-4">
        {traces.length === 0 ? (
          <div>No traces found.</div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {traces.map((trace) => (
              <div
                className="cursor-pointer"
                onClick={() => navigate(`/trace/${trace.id}`)}
              >
                <TraceCard
                  key={trace.id}
                  traceId={trace.id}
                  name={trace.name}
                  description={trace.description || "No description provided."}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <div
        onClick={() => navigate("/createTrace")}
        className="flex justify-center items-center mt-4"
      >
        <Button>
          Create Trace <CirclePlus className="h-5 w-5" />
        </Button>
      </div>
    </>
  );
};

export default AllTraces;
