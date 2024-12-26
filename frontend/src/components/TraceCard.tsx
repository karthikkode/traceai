import { Trash2, ExternalLink, Edit3, Eye } from "lucide-react";

interface TraceProps {
  traceId: string;
  name: string;
  description: string;
}

const TraceCard: React.FC<TraceProps> = ({ traceId, name, description }) => {
  const handleDelete = () => {
    // Add delete logic here, for example, calling an API to delete the trace
    console.log(`Delete trace with ID: ${traceId}`);
  };

  const handleEdit = () => {
    // Add edit logic here, for example, redirecting to an edit page
    console.log(`Edit trace with ID: ${traceId}`);
  };

  const handleView = () => {
    // Add view logic here, for example, redirecting to a detailed view page
    console.log(`View trace with ID: ${traceId}`);
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
          onClick={handleView}
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
