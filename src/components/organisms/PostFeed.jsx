import { useState, useEffect, useCallback } from "react";
import PostCard from "@/components/molecules/PostCard";
import FilterTabs from "@/components/molecules/FilterTabs";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { postsService } from "@/services/api/postsService";
import { toast } from "react-toastify";

const PostFeed = ({ 
  communityName = null,
  postType = "all",
  onPostTypeChange,
  className
}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("hot");
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
const loadPosts = useCallback(async (filterType = "hot", pageNum = 1, append = false) => {
    try {
      if (!append) {
        setLoading(true);
        setError("");
      } else {
        setLoadingMore(true);
      }

      const response = await postsService.getAll({
        filter: filterType,
        community: communityName,
        postType: postType !== "all" ? postType : undefined,
        page: pageNum,
        limit: 10
      });

      if (!append) {
        setPosts(response);
        setPage(1);
      } else {
        setPosts(prev => [...prev, ...response]);
      }

      setHasMore(response.length === 10);
      
    } catch (err) {
      console.error("Error loading posts:", err);
      setError(err.message || "Failed to load posts");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [communityName, postType]);

useEffect(() => {
    loadPosts(activeFilter, 1, false);
  }, [loadPosts, activeFilter]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000
      ) {
        if (!loadingMore && hasMore && posts.length > 0) {
          const nextPage = page + 1;
          setPage(nextPage);
          loadPosts(activeFilter, nextPage, true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadingMore, hasMore, posts.length, page, activeFilter, loadPosts]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setPage(1);
  };

  const handleVote = async (postId, voteType) => {
    try {
      await postsService.vote(postId, voteType);
      
      // Update local state optimistically
      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post.id === postId) {
            let newUpvotes = post.upvotes;
            let newDownvotes = post.downvotes;
            
            // Remove previous vote
            if (post.userVote === "up") newUpvotes -= 1;
            if (post.userVote === "down") newDownvotes -= 1;
            
            // Apply new vote
            if (voteType === "up") newUpvotes += 1;
            if (voteType === "down") newDownvotes += 1;
            
            return {
              ...post,
              upvotes: newUpvotes,
              downvotes: newDownvotes,
              userVote: voteType
            };
          }
          return post;
        })
      );

      toast.success("Vote recorded!", { autoClose: 1500 });
    } catch (err) {
      console.error("Error voting:", err);
      toast.error("Failed to record vote");
    }
  };

  const handleRetry = () => {
    loadPosts(activeFilter, 1, false);
  };

  if (loading) {
    return <Loading variant="posts" className={className} />;
  }

  if (error) {
    return (
      <Error
        message={error}
        onRetry={handleRetry}
        variant="posts"
        className={className}
      />
    );
  }

  if (posts.length === 0) {
    return (
      <Empty
        variant="posts"
        title={communityName ? `No posts in r/${communityName}` : "No posts found"}
        description={communityName 
          ? "This community is waiting for its first post. Why not start the conversation?"
          : "Be the first to share something interesting with the community!"
        }
        className={className}
      />
    );
  }

return (
    <div className={className}>
      {/* Filter Tabs */}
      <div className="mb-6">
        <FilterTabs
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          activePostType={postType}
          onPostTypeChange={onPostTypeChange}
        />
      </div>

      {/* Posts */}
<div className="space-y-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onVote={handleVote}
            showCommunity={!communityName}
            isPinned={post.isPinned}
          />
        ))}
      </div>

      {/* Load More Indicator */}
      {loadingMore && (
        <div className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
        </div>
      )}

      {/* End of Posts */}
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>You've reached the end! 🎉</p>
        </div>
      )}
    </div>
  );
};

export default PostFeed;