import { useState } from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const SearchBar = ({ 
  className, 
  placeholder = "Search Hive Social...",
  onSearch,
  size = "md"
}) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch && query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const sizes = {
    sm: "h-8",
    md: "h-10",
    lg: "h-12"
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="relative flex items-center">
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          className={cn(
            "pr-12 bg-white border-gray-200 focus:border-primary/50 rounded-full",
            sizes[size]
          )}
        />
        <Button
          type="submit"
          variant="ghost"
          size="sm"
          className="absolute right-1 h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
        >
          <ApperIcon name="Search" className="w-4 h-4 text-gray-500" />
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;