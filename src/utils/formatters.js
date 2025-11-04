import { formatDistanceToNow } from "date-fns";

export const formatTimeAgo = (timestamp) => {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return "just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    } else {
      return formatDistanceToNow(date, { addSuffix: true })
        .replace("about ", "")
        .replace(" ago", "")
        .replace("days", "d")
        .replace("day", "d")
        .replace("hours", "h")
        .replace("hour", "h")
        .replace("minutes", "m")
        .replace("minute", "m") + " ago";
    }
  } catch (error) {
    return "unknown";
  }
};

export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return num.toString();
};

export const formatKarma = (karma) => {
  return formatNumber(karma);
};

export const getVoteScore = (upvotes, downvotes) => {
  return upvotes - downvotes;
};

export const truncateText = (text, maxLength = 150) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};