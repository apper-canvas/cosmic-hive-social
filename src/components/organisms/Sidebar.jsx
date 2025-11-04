import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { formatNumber } from "@/utils/formatters";
import { cn } from "@/utils/cn";

const Sidebar = ({ className, communities = [], trendingTopics = [], communityContext = false }) => {
  const navigate = useNavigate();

  const handleCommunityClick = (communityName) => {
    navigate(`/r/${communityName}`);
  };

const popularCommunities = [
    { name: "technology", memberCount: 125000, description: "Latest tech news and discussions" },
    { name: "programming", memberCount: 89000, description: "Code, algorithms, and development" },
    { name: "gaming", memberCount: 156000, description: "All things gaming" },
    { name: "science", memberCount: 98000, description: "Scientific discoveries and research" },
    { name: "music", memberCount: 76000, description: "Music lovers unite" },
    { name: "movies", memberCount: 112000, description: "Film discussion and reviews" }
  ];

  const relatedCommunities = [
    { name: "webdev", memberCount: 67000, description: "Web development discussions" },
    { name: "reactjs", memberCount: 45000, description: "React.js community" },
    { name: "javascript", memberCount: 89000, description: "JavaScript developers" },
    { name: "frontend", memberCount: 34000, description: "Frontend development" },
    { name: "css", memberCount: 23000, description: "CSS tips and tricks" }
  ];

  const defaultTrending = [
    { topic: "AI Revolution", posts: 145 },
    { topic: "Climate Change", posts: 89 },
    { topic: "Space Exploration", posts: 67 },
    { topic: "Cryptocurrency", posts: 234 },
    { topic: "Remote Work", posts: 156 }
  ];

  const displayCommunities = communities.length > 0 ? communities : (communityContext ? relatedCommunities : popularCommunities);
  const displayTrending = trendingTopics.length > 0 ? trendingTopics : defaultTrending;
  return (
    <aside className={cn("space-y-6", className)}>
      {/* Popular Communities */}
<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-2 mb-4">
          <ApperIcon name="Users" className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-display font-semibold text-gray-900">
            {communityContext ? "Related Communities" : "Popular Communities"}
          </h3>
        </div>
        
        <div className="space-y-3">
          {displayCommunities.slice(0, 6).map((community) => (
            <div
              key={community.name}
              onClick={() => handleCommunityClick(community.name)}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-medium text-gray-900 group-hover:text-primary">
                    r/{community.name}
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate">
                  {community.description}
                </p>
              </div>
              
              <div className="text-right flex-shrink-0 ml-2">
                <Badge variant="outline" size="sm">
                  {formatNumber(community.memberCount)}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate("/communities")}
          className="w-full mt-4 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
        >
          View All Communities →
        </button>
      </div>

      {/* Trending Topics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-2 mb-4">
          <ApperIcon name="TrendingUp" className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-display font-semibold text-gray-900">
            Trending Topics
          </h3>
        </div>
        
        <div className="space-y-3">
          {displayTrending.slice(0, 5).map((item, index) => (
            <div
              key={item.topic}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <Badge
                  variant="primary"
                  size="sm"
                  className="w-6 h-6 p-0 text-xs font-bold"
                >
                  {index + 1}
                </Badge>
                <span className="text-sm font-medium text-gray-900 group-hover:text-primary">
                  {item.topic}
                </span>
              </div>
              
              <div className="text-xs text-gray-500">
                {formatNumber(item.posts)} posts
              </div>
            </div>
          ))}
        </div>
      </div>
{/* Community Guidelines */}
      {!communityContext && (
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg border border-primary/20 p-4">
          <div className="flex items-center space-x-2 mb-3">
            <ApperIcon name="Shield" className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-display font-semibold text-gray-900">
              Community Guidelines
            </h3>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Help us keep Hive Social a welcoming place for everyone.
          </p>
          
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex items-start space-x-2">
              <ApperIcon name="Check" className="w-3 h-3 text-accent mt-0.5 flex-shrink-0" />
              <span>Be respectful and civil in discussions</span>
            </div>
            <div className="flex items-start space-x-2">
              <ApperIcon name="Check" className="w-3 h-3 text-accent mt-0.5 flex-shrink-0" />
              <span>No spam or self-promotion</span>
            </div>
            <div className="flex items-start space-x-2">
              <ApperIcon name="Check" className="w-3 h-3 text-accent mt-0.5 flex-shrink-0" />
              <span>Stay on topic in communities</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;