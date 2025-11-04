import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthModal from "@/components/organisms/AuthModal";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Textarea from "@/components/atoms/Textarea";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import CommentCard from "@/components/molecules/CommentCard";

const CommentSection = ({
  comments = [],
  loading = false,
  error = "",
  onAddComment,
  onVote,
  onRetry,
  className,
  postAuthor
}) => {
const { user } = useSelector(state => state.user);
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

const handleSubmitComment = async () => {
if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      await onAddComment(newComment.trim());
      setNewComment("");
      toast.success("Comment added!");
    } catch (err) {
      console.error("Error adding comment:", err);
      toast.error("Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

const handleReply = async (parentId, content) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    try {
      await onAddComment(content, parentId);
      toast.success("Reply added!");
    } catch (err) {
      console.error("Error adding reply:", err);
      toast.error("Failed to add reply");
    }
  };

  if (loading) {
    return <Loading variant="comments" className={className} />;
  }

  if (error) {
    return (
      <Error
        message={error}
        onRetry={onRetry}
        className={className}
      />
    );
  }

  return (
    <div className={className}>
      {/* Add Comment Form */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
        <h3 className="text-lg font-display font-semibold text-gray-900 mb-3">
          Add a comment
        </h3>
        
<div className="space-y-3">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
onClick={() => {
              if (!user) {
                setShowAuthModal(true);
              }
            }}
            placeholder="What are your thoughts?"
            rows={4}
            className="resize-none"
          />
          
          <div className="flex justify-end">
            <Button
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || submitting}
              variant="primary"
              className="bg-gradient-to-r from-primary to-primary/80"
            >
              {submitting ? "Posting..." : "Comment"}
            </Button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      {comments.length === 0 ? (
        <Empty
          variant="comments"
          title="No comments yet"
          description="Be the first to share your thoughts on this post."
          actionText="Add Comment"
          actionPath="#"
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-semibold text-gray-900">
              Comments ({comments.length})
            </h3>
          </div>

{comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              onVote={onVote}
              onReply={handleReply}
              depth={0}
              postAuthor={postAuthor}
            />
          ))}
        </div>
      )}
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        defaultTab="signup"
      />
    </div>
  );
};

export default CommentSection;