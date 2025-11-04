import { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
import { formatNumber } from "@/utils/formatters";

const VoteButtons = ({ 
  postId,
  upvotes = 0,
  downvotes = 0,
  userVote = "none",
  onVote,
  size = "md",
  className,
  variant = "vertical"
}) => {
  const [currentVote, setCurrentVote] = useState(userVote);
  const [currentUpvotes, setCurrentUpvotes] = useState(upvotes);
  const [currentDownvotes, setCurrentDownvotes] = useState(downvotes);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setCurrentVote(userVote);
    setCurrentUpvotes(upvotes);
    setCurrentDownvotes(downvotes);
  }, [userVote, upvotes, downvotes]);

  const score = currentUpvotes - currentDownvotes;

  const handleVote = async (voteType) => {
    if (isAnimating) return;

    const previousVote = currentVote;
    const previousUpvotes = currentUpvotes;
    const previousDownvotes = currentDownvotes;

    setIsAnimating(true);

    // Optimistic update
    let newVote = voteType;
    let newUpvotes = currentUpvotes;
    let newDownvotes = currentDownvotes;

    // Remove previous vote effect
    if (previousVote === "up") {
      newUpvotes -= 1;
    } else if (previousVote === "down") {
      newDownvotes -= 1;
    }

    // Apply new vote effect, but toggle if same vote
    if (voteType === previousVote) {
      newVote = "none";
    } else {
      if (voteType === "up") {
        newUpvotes += 1;
      } else if (voteType === "down") {
        newDownvotes += 1;
      }
    }

    setCurrentVote(newVote);
    setCurrentUpvotes(newUpvotes);
    setCurrentDownvotes(newDownvotes);

    try {
      if (onVote) {
        await onVote(postId, newVote);
      }
      
      // Add pulse animation
      setTimeout(() => {
        setIsAnimating(false);
      }, 200);
    } catch (error) {
      // Revert on error
      setCurrentVote(previousVote);
      setCurrentUpvotes(previousUpvotes);
      setCurrentDownvotes(previousDownvotes);
      setIsAnimating(false);
    }
  };

  const sizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10"
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  if (variant === "horizontal") {
    return (
      <div className={cn("flex items-center space-x-1", className)}>
        <button
          onClick={() => handleVote("up")}
          className={cn(
            "flex items-center justify-center rounded-full transition-all duration-150 hover:bg-upvote/10",
            sizes[size],
            currentVote === "up" ? "text-upvote bg-upvote/10" : "text-gray-400 hover:text-upvote",
            isAnimating && "vote-pulse"
          )}
        >
          <ApperIcon name="ArrowUp" className={iconSizes[size]} />
        </button>
        
        <span className={cn(
          "font-medium px-2",
          textSizes[size],
          score > 0 ? "text-upvote" : score < 0 ? "text-downvote" : "text-gray-600"
        )}>
          {formatNumber(score)}
        </span>
        
        <button
          onClick={() => handleVote("down")}
          className={cn(
            "flex items-center justify-center rounded-full transition-all duration-150 hover:bg-downvote/10",
            sizes[size],
            currentVote === "down" ? "text-downvote bg-downvote/10" : "text-gray-400 hover:text-downvote",
            isAnimating && "vote-pulse"
          )}
        >
          <ApperIcon name="ArrowDown" className={iconSizes[size]} />
        </button>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center space-y-1", className)}>
      <button
        onClick={() => handleVote("up")}
        className={cn(
          "flex items-center justify-center rounded-full transition-all duration-150 hover:bg-upvote/10 active:scale-110",
          sizes[size],
          currentVote === "up" ? "text-upvote bg-upvote/10" : "text-gray-400 hover:text-upvote",
          isAnimating && currentVote === "up" && "vote-pulse"
        )}
      >
        <ApperIcon name="ArrowUp" className={iconSizes[size]} />
      </button>
      
      <span className={cn(
        "font-bold select-none",
        textSizes[size],
        score > 0 ? "text-upvote" : score < 0 ? "text-downvote" : "text-gray-600"
      )}>
        {formatNumber(score)}
      </span>
      
      <button
        onClick={() => handleVote("down")}
        className={cn(
          "flex items-center justify-center rounded-full transition-all duration-150 hover:bg-downvote/10 active:scale-110",
          sizes[size],
          currentVote === "down" ? "text-downvote bg-downvote/10" : "text-gray-400 hover:text-downvote",
          isAnimating && currentVote === "down" && "vote-pulse"
        )}
      >
        <ApperIcon name="ArrowDown" className={iconSizes[size]} />
      </button>
    </div>
  );
};

export default VoteButtons;