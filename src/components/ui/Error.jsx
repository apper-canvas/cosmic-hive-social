import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const Error = ({ 
  className, 
  message = "Something went wrong", 
  onRetry,
  variant = "default" 
}) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8 text-center bg-white rounded-lg border border-gray-200 shadow-sm",
      className
    )}>
      <div className="w-16 h-16 mb-4 rounded-full bg-error/10 flex items-center justify-center">
        <ApperIcon name="AlertCircle" className="w-8 h-8 text-error" />
      </div>
      
      <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">
        {variant === "posts" ? "Failed to Load Posts" : "Error Occurred"}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {message}
      </p>

      {onRetry && (
        <Button
          onClick={handleRetry}
          variant="primary"
          size="sm"
        >
          <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;