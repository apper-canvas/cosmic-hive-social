import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AuthModal from "@/components/organisms/AuthModal";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import VoteButtons from "@/components/molecules/VoteButtons";
import { formatTimeAgo } from "@/utils/formatters";
import { cn } from "@/utils/cn";

const CommentCard = ({ 
  comment,
  onVote,
  onReply,
  depth = 0,
  className 
}) => {
  const { user } = useSelector(state => state.user);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(comment.isCollapsed || false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleUserClick = () => {
    navigate(`/user/${comment.authorUsername}`);
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleReplySubmit = () => {
    if (replyText.trim() && onReply) {
      onReply(comment.id, replyText.trim());
      setReplyText("");
      setShowReplyForm(false);
    }
  };

  const maxDepth = 8;
  const shouldShowReplies = !isCollapsed && depth < maxDepth;

  return (
    <div className={cn("space-y-2", className)}>
      <div 
className={cn(
          "border-l-2 border-gray-200 pl-3",
          depth > 0 ? "border-gray-300 bg-gray-50/50" : "border-gray-200"
        )}
        style={{ marginLeft: depth > 0 ? `${Math.min(depth * 20, maxDepth * 20)}px` : undefined }}
      >
        {/* Comment Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <button
              onClick={handleUserClick}
              className="font-medium text-gray-900 hover:text-primary transition-colors"
            >
              u/{comment.authorUsername}
            </button>
            <span>•</span>
            <span>{formatTimeAgo(comment.createdAt)}</span>
            {comment.replies && comment.replies.length > 0 && (
              <>
                <span>•</span>
                <button
                  onClick={handleToggleCollapse}
                  className="flex items-center space-x-1 hover:text-primary transition-colors"
                >
                  <ApperIcon 
                    name={isCollapsed ? "Plus" : "Minus"} 
                    className="w-3 h-3" 
                  />
                  <span>{isCollapsed ? "expand" : "collapse"}</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Comment Content */}
        {!isCollapsed && (
          <>
            <div className="py-2">
              <p className="text-gray-900 text-sm leading-relaxed whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>

            {/* Comment Actions */}
            <div className="flex items-center space-x-4">
              <VoteButtons
                postId={comment.id}
                upvotes={comment.upvotes}
                downvotes={comment.downvotes}
                userVote={comment.userVote}
                onVote={onVote}
                size="sm"
                variant="horizontal"
              />
<button
                onClick={() => {
                  if (!user) {
                    setShowAuthModal(true);
                  } else {
                    setShowReplyForm(!showReplyForm);
                  }
                }}
                className="text-xs text-gray-500 hover:text-primary transition-colors font-medium"
              >
                Reply
              </button>
            </div>

            {/* Reply Form */}
            {showReplyForm && (
              <div className="mt-3 space-y-2">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="What are your thoughts?"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none resize-none"
                  rows={3}
                />
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={handleReplySubmit}
                    variant="primary"
                    size="sm"
                    disabled={!replyText.trim()}
                  >
                    Reply
                  </Button>
                  <Button
                    onClick={() => {
                      setShowReplyForm(false);
                      setReplyText("");
                    }}
                    variant="ghost"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Nested Replies */}
      {shouldShowReplies && comment.replies && comment.replies.length > 0 && (
        <div className="space-y-2">
          {comment.replies.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
onVote={onVote}
              onReply={onReply}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        defaultTab="signup"
      />

      {/* Show More Link for Deep Nesting */}
      {depth >= maxDepth && comment.replies && comment.replies.length > 0 && (
        <div className="ml-4">
          <button className="text-sm text-primary hover:underline">
            Continue this thread →
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentCard;