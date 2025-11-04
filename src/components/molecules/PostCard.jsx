import { useState } from "react";
import { useNavigate } from "react-router-dom";
import VoteButtons from "@/components/molecules/VoteButtons";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { formatTimeAgo, formatNumber, truncateText } from "@/utils/formatters";
import { cn } from "@/utils/cn";

const PostCard = ({ 
  post,
  onVote,
  className,
  showCommunity = true
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handlePostClick = () => {
    navigate(`/post/${post.id}`);
  };

  const handleCommunityClick = (e) => {
    e.stopPropagation();
    navigate(`/r/${post.communityName}`);
  };

  const handleUserClick = (e) => {
    e.stopPropagation();
    navigate(`/user/${post.authorUsername}`);
  };

  const getPostTypeIcon = () => {
    switch (post.type) {
      case "image":
        return "Image";
      case "link":
        return "ExternalLink";
      default:
        return "FileText";
    }
  };

  const getThumbnail = () => {
    if (post.type === "image" && post.imageUrl) {
      return (
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      );
    }
    
    if (post.type === "link") {
      return (
        <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
          <ApperIcon name="ExternalLink" className="w-6 h-6 text-gray-500" />
        </div>
      );
    }

    return null;
  };

  return (
    <article
      className={cn(
        "bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-200 cursor-pointer group",
        "hover:shadow-md hover:border-gray-300 hover:-translate-y-0.5",
        isHovered && "shadow-md border-gray-300",
        className
      )}
      onClick={handlePostClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex p-4 space-x-3">
        {/* Vote Buttons */}
        <div 
          className="flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <VoteButtons
            postId={post.id}
            upvotes={post.upvotes}
            downvotes={post.downvotes}
            userVote={post.userVote}
            onVote={onVote}
            size="sm"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Meta Info */}
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            {showCommunity && (
              <>
                <button
                  onClick={handleCommunityClick}
                  className="font-bold text-gray-900 hover:text-primary transition-colors"
                >
                  r/{post.communityName}
                </button>
                <span>•</span>
              </>
            )}
            <span>Posted by</span>
            <button
              onClick={handleUserClick}
              className="hover:text-primary transition-colors"
            >
              u/{post.authorUsername}
            </button>
            <span>•</span>
            <span>{formatTimeAgo(post.createdAt)}</span>
            <Badge variant="outline" size="sm" className="ml-2">
              <ApperIcon name={getPostTypeIcon()} className="w-3 h-3 mr-1" />
              {post.type}
            </Badge>
          </div>

          {/* Title and Content */}
          <div className="flex items-start justify-between space-x-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-display font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h2>
              
              {post.content && (
                <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                  {truncateText(post.content, 200)}
                </p>
              )}

              {post.type === "link" && post.linkUrl && (
                <div className="flex items-center mt-2 text-sm text-secondary">
                  <ApperIcon name="ExternalLink" className="w-4 h-4 mr-1" />
                  <span className="truncate">{post.linkUrl}</span>
                </div>
              )}
            </div>

            {/* Thumbnail */}
            {getThumbnail()}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <ApperIcon name="MessageCircle" className="w-4 h-4" />
              <span>{formatNumber(post.commentCount)} comments</span>
            </div>
            <button className="flex items-center space-x-1 hover:text-primary transition-colors">
              <ApperIcon name="Share" className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-primary transition-colors">
              <ApperIcon name="Bookmark" className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;