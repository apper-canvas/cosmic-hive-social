import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PostCard from "@/components/molecules/PostCard";
import CommentCard from "@/components/molecules/CommentCard";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { usersService } from "@/services/api/usersService";
import { postsService } from "@/services/api/postsService";
import { commentsService } from "@/services/api/commentsService";
import { formatTimeAgo, formatKarma } from "@/utils/formatters";
import { toast } from "react-toastify";

const UserProfile = () => {
  const { username } = useParams();
  
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUserData();
  }, [username]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [userData, userPosts, userComments] = await Promise.all([
        usersService.getByUsername(username),
        postsService.getByUser(username),
        commentsService.getByUser(username)
      ]);

      setUser(userData);
      setPosts(userPosts);
      setComments(userComments);
    } catch (err) {
      console.error("Error loading user data:", err);
      setError(err.message || "Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (postId, voteType) => {
    try {
      await postsService.vote(postId, voteType);
      
      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post.id === postId) {
            let newUpvotes = post.upvotes;
            let newDownvotes = post.downvotes;
            
            if (post.userVote === "up") newUpvotes -= 1;
            if (post.userVote === "down") newDownvotes -= 1;
            
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

  const handleCommentVote = async (commentId, voteType) => {
    try {
      await commentsService.vote(commentId, voteType);
      
      setComments(prevComments =>
        prevComments.map(comment => {
          if (comment.id === commentId) {
            let newUpvotes = comment.upvotes;
            let newDownvotes = comment.downvotes;
            
            if (comment.userVote === "up") newUpvotes -= 1;
            if (comment.userVote === "down") newDownvotes -= 1;
            
            if (voteType === "up") newUpvotes += 1;
            if (voteType === "down") newDownvotes += 1;
            
            return {
              ...comment,
              upvotes: newUpvotes,
              downvotes: newDownvotes,
              userVote: voteType
            };
          }
          return comment;
        })
      );

      toast.success("Vote recorded!", { autoClose: 1500 });
    } catch (err) {
      console.error("Error voting on comment:", err);
      toast.error("Failed to record vote");
    }
  };

  const handleRetry = () => {
    loadUserData();
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Loading />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Error
          message={error || "User not found"}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  const tabs = [
    { id: "posts", label: "Posts", count: posts.length, icon: "FileText" },
    { id: "comments", label: "Comments", count: comments.length, icon: "MessageCircle" }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* User Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
                u/{user.username}
              </h1>
              
              <div className="flex items-center space-x-4">
                <Badge variant="primary" size="md">
                  <ApperIcon name="ArrowUp" className="w-3 h-3 mr-1" />
                  {formatKarma(user.postKarma)} post karma
                </Badge>
                
                <Badge variant="secondary" size="md">
                  <ApperIcon name="MessageCircle" className="w-3 h-3 mr-1" />
                  {formatKarma(user.commentKarma)} comment karma
                </Badge>
                
                <Badge variant="outline" size="md">
                  <ApperIcon name="Calendar" className="w-3 h-3 mr-1" />
                  Joined {formatTimeAgo(user.createdAt)}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <ApperIcon name="MessageSquare" className="w-4 h-4 mr-2" />
              Send Message
            </Button>
            
            <Button variant="outline">
              <ApperIcon name="Share" className="w-4 h-4 mr-2" />
              Share Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm transition-colors relative ${
                activeTab === tab.id
                  ? "text-primary border-b-2 border-primary bg-primary/5"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <ApperIcon name={tab.icon} className="w-4 h-4" />
              <span>{tab.label}</span>
              <Badge variant="outline" size="sm">
                {tab.count}
              </Badge>
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Posts Tab */}
          {activeTab === "posts" && (
            <div>
              {posts.length === 0 ? (
                <Empty
                  variant="posts"
                  title={`${user.username} hasn't posted anything yet`}
                  description="Check back later to see what they share with the community."
                  actionText="Browse Posts"
                  actionPath="/"
                />
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onVote={handleVote}
                      showCommunity={true}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Comments Tab */}
          {activeTab === "comments" && (
            <div>
              {comments.length === 0 ? (
                <Empty
                  variant="comments"
                  title={`${user.username} hasn't commented yet`}
                  description="When they start engaging in discussions, their comments will appear here."
                  actionText="Browse Discussions"
                  actionPath="/"
                />
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="text-xs text-gray-500 mb-2">
                        Comment on post: <span className="font-medium">"{comment.postTitle}"</span>
                        {" • "}
                        <span>{formatTimeAgo(comment.createdAt)}</span>
                      </div>
                      <CommentCard
                        comment={comment}
                        onVote={handleCommentVote}
                        depth={0}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;