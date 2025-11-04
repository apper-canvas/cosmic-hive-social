import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";
import { useNavigate } from "react-router-dom";

const Empty = ({ 
  className, 
  title = "Nothing Here Yet",
  description = "Be the first to contribute!",
  variant = "default",
  actionText = "Create Post",
  actionPath = "/create"
}) => {
  const navigate = useNavigate();

  const handleAction = () => {
    navigate(actionPath);
  };

  const getIcon = () => {
    switch (variant) {
      case "posts":
        return "FileText";
      case "comments":
        return "MessageCircle";
      case "communities":
        return "Users";
      default:
        return "Inbox";
    }
  };

  const getVariantContent = () => {
    switch (variant) {
      case "posts":
        return {
          title: "No Posts Yet",
          description: "This community is waiting for its first post. Why not start the conversation?",
          actionText: "Create First Post"
        };
      case "comments":
        return {
          title: "No Comments Yet",
          description: "Be the first to share your thoughts on this post.",
          actionText: "Add Comment"
        };
      case "communities":
        return {
          title: "No Communities Found",
          description: "Discover amazing communities or create your own.",
          actionText: "Explore Communities"
        };
      default:
        return { title, description, actionText };
    }
  };

  const content = getVariantContent();

  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-12 text-center bg-white rounded-lg border border-gray-200 shadow-sm",
      className
    )}>
      <div className="w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
        <ApperIcon name={getIcon()} className="w-10 h-10 text-primary" />
      </div>
      
      <h3 className="text-xl font-display font-semibold text-gray-900 mb-3">
        {content.title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
        {content.description}
      </p>

      <Button
        onClick={handleAction}
        variant="primary"
        size="md"
        className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
      >
        <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
        {content.actionText}
      </Button>
    </div>
  );
};

export default Empty;