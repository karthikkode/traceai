import { Trash2, ExternalLink, Edit3, Eye } from "lucide-react";

const Trace = () => {
  const trace_name = "Payment Trace";
  const trace_description = "This trace shows the user journey of payments"; //add this in backend
  const trace_view_link = ""; //add this in frontend
  const trace_delete_link_api = ""; //add this in backend
  const trace_edit_link = ""; //add this in frontend
  const trace_data_view_link = ""; //add this in frontend

  return (
    <div className="flex flex-col border rounded-xl shadow-md p-4 max-w-lg w-96 h-40 bg-[#E6F0FA]">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-medium font-bold text-gray-800">
          Payment Trace
        </h2>
        <ExternalLink className="w-5 h-5 text-gray-500 ml-2 cursor-pointer" />
      </div>

      {/* Description Section */}
      <p className="text-sm text-gray-600 mb-auto">
        This trace shows the user journey of payments
      </p>

      {/* Footer Section */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <button className="text-red-500 hover:text-red-700">
            <Trash2 className="w-5 h-5" />
          </button>
          <button className="text-blue-500 hover:text-blue-700">
            <Edit3 className="w-5 h-5" />
          </button>
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          <Eye className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Trace;
