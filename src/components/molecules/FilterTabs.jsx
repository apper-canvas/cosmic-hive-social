import { useState } from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const FilterTabs = ({ 
  activeFilter, 
  onFilterChange, 
  activePostType = "all",
  onPostTypeChange,
  className 
}) => {
  const [showPostTypes, setShowPostTypes] = useState(false);

  const sortFilters = [
    { key: "hot", label: "Hot", icon: "Flame" },
    { key: "new", label: "New", icon: "Clock" },
    { key: "top", label: "Top", icon: "TrendingUp" },
    { key: "rising", label: "Rising", icon: "ArrowUp" },
    { key: "controversial", label: "Controversial", icon: "MessageSquare" }
  ];

  const postTypes = [
    { key: "all", label: "All Posts", icon: "Grid3x3" },
    { key: "image", label: "Images", icon: "Image" },
    { key: "video", label: "Videos", icon: "Video" },
    { key: "text", label: "Discussions", icon: "MessageCircle" },
    { key: "link", label: "Links", icon: "ExternalLink" }
  ];

  const handleSortFilter = (filterKey) => {
    onFilterChange(filterKey);
  };

  const handlePostTypeFilter = (typeKey) => {
    if (onPostTypeChange) {
      onPostTypeChange(typeKey);
    }
    setShowPostTypes(false);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Sort Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
        <div className="flex flex-wrap gap-1">
          {sortFilters.map((filter) => (
            <Button
              key={filter.key}
              onClick={() => handleSortFilter(filter.key)}
              variant={activeFilter === filter.key ? "primary" : "ghost"}
              size="sm"
              className={cn(
                "flex items-center space-x-1.5 px-3 py-2 rounded-md transition-all text-sm font-medium",
                activeFilter === filter.key
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <ApperIcon name={filter.icon} className="w-4 h-4" />
              <span>{filter.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Post Type Filter */}
      {onPostTypeChange && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1 flex-1">
              {postTypes.slice(0, 4).map((type) => (
                <Button
                  key={type.key}
                  onClick={() => handlePostTypeFilter(type.key)}
                  variant={activePostType === type.key ? "primary" : "ghost"}
                  size="sm"
                  className={cn(
                    "flex items-center space-x-1.5 px-3 py-2 rounded-md transition-all text-sm font-medium",
                    activePostType === type.key
                      ? "bg-primary text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <ApperIcon name={type.icon} className="w-4 h-4" />
                  <span className="hidden sm:inline">{type.label}</span>
                  <span className="sm:hidden">{type.key === "text" ? "Text" : type.label}</span>
                </Button>
              ))}
            </div>

            <div className="relative ml-2">
              <Button
                onClick={() => setShowPostTypes(!showPostTypes)}
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 p-2"
              >
                <ApperIcon name="MoreHorizontal" className="w-4 h-4" />
              </Button>

              {showPostTypes && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 min-w-[120px]">
                  {postTypes.slice(4).map((type) => (
                    <button
                      key={type.key}
                      onClick={() => handlePostTypeFilter(type.key)}
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm flex items-center space-x-2 hover:bg-gray-50 transition-colors",
                        activePostType === type.key
                          ? "text-primary bg-primary/5"
                          : "text-gray-600"
                      )}
                    >
                      <ApperIcon name={type.icon} className="w-4 h-4" />
                      <span>{type.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterTabs;