import { Trash2, ExternalLink, Edit3, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface TraceProps {
  traceId: string;
  name: string;
  description: string;
  cardID: string;
}

const TraceCard: React.FC<TraceProps> = ({
  traceId,
  name,
  description,
  cardID,
}) => {
  console.log("traceId", traceId);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${backendUrl}/traces/${traceId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Trace deleted successfully:", response.data);
      window.location.reload();
      // You can add logic here to refresh the page or navigate to another page
    } catch (error: any) {
      if (error.response) {
        console.error(
          `Failed to delete trace: ${error.response.status} - ${error.response.data.error}`
        );
        alert(`Failed to delete trace: ${error.response.data.error}`);
      } else {
        console.error("Failed to delete trace:", error.message);
        alert("An unexpected error occurred while deleting the trace.");
      }
    }
  };

  const handleEdit = () => {
    navigate(`/trace/${traceId}`);
  };

  const handleView = () => {
    navigate(`/trace/${traceId}`);
  };

  const handleViewFunnel = () => {
    window.open(
      `http://localhost:3002/question/${cardID}?deviceType=desktop&traceEvent=page-visit`,
      "_blank"
    );
  };

  return (
    <div className="flex flex-col border rounded-xl shadow-md p-4 max-w-md w-80 h-40 bg-[#E6F0FA]">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-medium font-bold text-gray-800">
          {name}
        </h2>
        <ExternalLink
          className="w-5 h-5 text-gray-500 ml-2 cursor-pointer"
          onClick={handleViewFunnel}
        />
      </div>

      {/* Description Section */}
      <p className="text-sm text-gray-600 mb-auto">{description}</p>

      {/* Footer Section */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <button
            className="text-red-500 hover:text-red-700"
            onClick={handleDelete}
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={handleEdit}
          >
            <Edit3 className="w-5 h-5" />
          </button>
        </div>
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={handleView}
        >
          <Eye className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default TraceCard;
