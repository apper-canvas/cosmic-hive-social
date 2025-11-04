import { useNavigate, Link } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8 max-w-md mx-auto">
        <div className="space-y-4">
          <ApperIcon name="AlertTriangle" size={64} className="text-warning mx-auto" />
          <div className="space-y-2">
            <h1 className="text-4xl font-display font-bold text-gray-900">404</h1>
            <h2 className="text-xl font-display font-semibold text-gray-700">Page Not Found</h2>
            <p className="text-gray-600 leading-relaxed">
              The page you're looking for doesn't exist or may have been moved.
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <Button
            onClick={handleGoHome}
            className="w-full bg-primary text-white hover:bg-primary/90"
          >
            <ApperIcon name="Home" size={16} className="mr-2" />
            Go to Home
          </Button>
          
          <Button
            onClick={handleGoBack}
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
            Go Back
          </Button>
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help? Check out our{" "}
            <Link 
              to="/" 
              className="text-secondary hover:underline font-medium"
            >
              popular communities
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;