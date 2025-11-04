import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Header = ({ className }) => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (query) => {
    console.log("Search query:", query);
    // TODO: Implement search functionality
  };

  const handleCreatePost = () => {
    navigate("/create");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm",
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogoClick}
              className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <ApperIcon name="Hexagon" className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold hidden sm:block">
                Hive Social
              </span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4 sm:mx-8">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search communities, posts..."
              className="w-full"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Create Post Button */}
            <Button
              onClick={handleCreatePost}
              variant="primary"
              size="sm"
              className="hidden sm:flex bg-gradient-to-r from-primary to-primary/80"
            >
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              Create
            </Button>

            {/* Mobile Create Button */}
            <Button
              onClick={handleCreatePost}
              variant="primary"
              size="sm"
              className="sm:hidden p-2"
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
            </Button>

            {/* User Menu */}
            <div className="relative">
              <Button
                onClick={() => setShowUserMenu(!showUserMenu)}
                variant="ghost"
                size="sm"
                className="p-2"
              >
                <ApperIcon name="User" className="w-5 h-5" />
              </Button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                    <div className="py-2">
                      <Link
                        to="/user/demo_user"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="User" className="w-4 h-4" />
                          <span>Profile</span>
                        </div>
                      </Link>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="Settings" className="w-4 h-4" />
                          <span>Settings</span>
                        </div>
                      </button>
                      <div className="border-t border-gray-100 my-1" />
<button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => {
                          setShowUserMenu(false);
                          if (window.ApperSDK?.ApperUI?.logout) {
                            window.ApperSDK.ApperUI.logout();
                          }
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="LogOut" className="w-4 h-4" />
                          <span>Sign Out</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;