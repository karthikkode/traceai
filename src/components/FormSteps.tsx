import { CheckCircle, Circle } from "lucide-react";

const StepIndicator = () => {
  return (
    <div className="flex flex-col items-center">
      {/* Step Navigation */}
      <div className="flex items-center space-x-4">
        {/* Step 1 */}
        <div className="flex items-center space-x-2">
          <CheckCircle className="text-green-500" />
          <span className="text-sm text-green-500">Step 1</span>
        </div>
        <div className="flex-1 border-t border-dotted border-gray-400" />
        {/* Step 2 */}
        <div className="flex items-center space-x-2">
          <Circle className="text-gray-400" />
          <span className="text-sm text-gray-400">Step 2</span>
        </div>
        <div className="flex-1 border-t border-dotted border-gray-400" />
        {/* Step 3 */}
        <div className="flex items-center space-x-2">
          <Circle className="text-gray-400" />
          <span className="text-sm text-gray-400">Step 3</span>
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
