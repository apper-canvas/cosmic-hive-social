import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { postsService } from "@/services/api/postsService";
import { commentsService } from "@/services/api/commentsService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import CommentSection from "@/components/organisms/CommentSection";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import VoteButtons from "@/components/molecules/VoteButtons";
import { formatNumber, formatTimeAgo } from "@/utils/formatters";

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  
const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentsError, setCommentsError] = useState("");
  const [commentSortBy, setCommentSortBy] = useState("best");

  useEffect(() => {
    loadPost();
    loadComments();
  }, [postId]);

  const loadPost = async () => {
    try {
      setLoading(true);
      setError("");
      const postData = await postsService.getById(postId);
      setPost(postData);
    } catch (err) {
      console.error("Error loading post:", err);
      setError(err.message || "Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      setCommentsLoading(true);
      setCommentsError("");
      const commentsData = await commentsService.getByPostId(postId);
      setComments(commentsData);
    } catch (err) {
      console.error("Error loading comments:", err);
      setCommentsError(err.message || "Failed to load comments");
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleVote = async (postId, voteType) => {
    try {
      await postsService.vote(postId, voteType);
      
      // Update post state
      setPost(prevPost => {
        if (!prevPost) return prevPost;
        
        let newUpvotes = prevPost.upvotes;
        let newDownvotes = prevPost.downvotes;
        
        // Remove previous vote
        if (prevPost.userVote === "up") newUpvotes -= 1;
        if (prevPost.userVote === "down") newDownvotes -= 1;
        
        // Apply new vote
        if (voteType === "up") newUpvotes += 1;
        if (voteType === "down") newDownvotes += 1;
        
        return {
          ...prevPost,
          upvotes: newUpvotes,
          downvotes: newDownvotes,
          userVote: voteType
        };
      });

      toast.success("Vote recorded!", { autoClose: 1500 });
    } catch (err) {
      console.error("Error voting:", err);
      toast.error("Failed to record vote");
    }
  };

  const handleCommentVote = async (commentId, voteType) => {
    try {
      await commentsService.vote(commentId, voteType);
      
      // Update comments state recursively
      const updateCommentVote = (comments) => {
        return comments.map(comment => {
          if (comment.id === commentId) {
            let newUpvotes = comment.upvotes;
            let newDownvotes = comment.downvotes;
            
            // Remove previous vote
            if (comment.userVote === "up") newUpvotes -= 1;
            if (comment.userVote === "down") newDownvotes -= 1;
            
            // Apply new vote
            if (voteType === "up") newUpvotes += 1;
            if (voteType === "down") newDownvotes += 1;
            
            return {
              ...comment,
              upvotes: newUpvotes,
              downvotes: newDownvotes,
              userVote: voteType
            };
          }
          
          if (comment.replies) {
            return {
              ...comment,
              replies: updateCommentVote(comment.replies)
            };
          }
          
          return comment;
        });
      };

      setComments(prevComments => updateCommentVote(prevComments));
      toast.success("Vote recorded!", { autoClose: 1500 });
    } catch (err) {
      console.error("Error voting on comment:", err);
      toast.error("Failed to record vote");
    }
  };

  const handleAddComment = async (content, parentId = null) => {
    try {
      const newComment = await commentsService.create({
        postId,
        content,
        parentId
      });

      if (parentId) {
        // Add reply to existing comment
        const updateReplies = (comments) => {
          return comments.map(comment => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), newComment]
              };
            }
            if (comment.replies) {
              return {
                ...comment,
                replies: updateReplies(comment.replies)
              };
            }
            return comment;
          });
        };
        
        setComments(prevComments => updateReplies(prevComments));
      } else {
        // Add top-level comment
        setComments(prevComments => [newComment, ...prevComments]);
      }

      // Update post comment count
      setPost(prevPost => ({
        ...prevPost,
        commentCount: prevPost.commentCount + 1
      }));
      
    } catch (err) {
      console.error("Error adding comment:", err);
      throw err;
    }
  };

  const handleCommunityClick = () => {
    if (post) {
      navigate(`/r/${post.communityName}`);
    }
  };

  const handleUserClick = () => {
    if (post) {
      navigate(`/user/${post.authorUsername}`);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Loading />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Error
          message={error || "Post not found"}
          onRetry={loadPost}
        />
      </div>
    );
  }

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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back Button */}
      <div className="mb-6">
        <Button
          onClick={handleBack}
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-gray-900"
        >
          <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Post Content */}
      <article className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="flex p-6">
          {/* Vote Buttons */}
          <div className="flex-shrink-0 mr-4">
            <VoteButtons
              postId={post.id}
              upvotes={post.upvotes}
              downvotes={post.downvotes}
              userVote={post.userVote}
              onVote={handleVote}
              size="lg"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Meta Info */}
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
              <button
                onClick={handleCommunityClick}
                className="font-bold text-gray-900 hover:text-primary transition-colors"
              >
                r/{post.communityName}
              </button>
              <span>•</span>
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

            {/* Title */}
            <h1 className="text-2xl font-display font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            {/* Content */}
            {post.content && (
              <div className="prose max-w-none mb-4">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>
              </div>
            )}

            {/* Image */}
            {post.type === "image" && post.imageUrl && (
              <div className="mb-4">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="max-w-full h-auto rounded-lg shadow-sm"
                />
              </div>
            )}

            {/* Link */}
            {post.type === "link" && post.linkUrl && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center space-x-2 text-secondary">
                  <ApperIcon name="ExternalLink" className="w-5 h-5" />
                  <a
                    href={post.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline font-medium"
                  >
                    {post.linkUrl}
                  </a>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center space-x-6 text-sm text-gray-500">
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

      {/* Comments Section */}
<CommentSection
        comments={comments}
        loading={commentsLoading}
        error={commentsError}
        onAddComment={handleAddComment}
        onVote={handleCommentVote}
        onRetry={loadComments}
        sortBy={commentSortBy}
        onSortChange={setCommentSortBy}
        postAuthor={post?.authorUsername}
      />
    </div>
  );
};

export default PostDetail;