import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

class CommentsService {
  constructor() {
    this.tableName = 'comment_c';
  }

  async getByPostId(postId, sortBy = "best") {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "post_id_c"}},
          {"field": {"Name": "parent_id_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "author_username_c"}},
          {"field": {"Name": "upvotes_c"}},
          {"field": {"Name": "downvotes_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "user_vote_c"}},
          {"field": {"Name": "is_collapsed_c"}}
        ],
        where: [{
          "FieldName": "post_id_c",
          "Operator": "EqualTo",
          "Values": [postId]
        }],
        orderBy: [{"fieldName": "created_at_c", "sorttype": "ASC"}]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Transform data to match UI expectations
      const allComments = (response.data || []).map(item => ({
        id: `c${item.Id}`,
        postId: item.post_id_c || '',
        parentId: item.parent_id_c || null,
        content: item.content_c || '',
        authorUsername: item.author_username_c || '',
        upvotes: item.upvotes_c || 0,
        downvotes: item.downvotes_c || 0,
        createdAt: item.created_at_c || new Date().toISOString(),
        userVote: item.user_vote_c || 'none',
        isCollapsed: item.is_collapsed_c || false,
        replies: []
      }));

      // Filter top-level comments (no parentId)
      let topLevelComments = allComments.filter(comment => !comment.parentId);

      // Sort top-level comments based on sortBy parameter
      switch (sortBy) {
        case "new":
          topLevelComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case "old":
          topLevelComments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          break;
        case "top":
          topLevelComments.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
          break;
        case "controversial":
          topLevelComments.sort((a, b) => {
            const aRatio = Math.min(a.upvotes, a.downvotes) / Math.max(a.upvotes, a.downvotes, 1);
            const bRatio = Math.min(b.upvotes, b.downvotes) / Math.max(b.upvotes, b.downvotes, 1);
            return bRatio - aRatio;
          });
          break;
        default: // "best"
          topLevelComments.sort((a, b) => {
            const aScore = (a.upvotes - a.downvotes) + (a.upvotes + a.downvotes) * 0.1;
            const bScore = (b.upvotes - b.downvotes) + (b.upvotes + b.downvotes) * 0.1;
            return bScore - aScore;
          });
      }

      // Build nested structure - replies always sorted by time (oldest first)
      const buildReplies = (parentId) => {
        return allComments
          .filter(comment => comment.parentId === parentId)
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
          .map(comment => ({
            ...comment,
            replies: buildReplies(comment.id)
          }));
      };

      const commentsWithReplies = topLevelComments.map(comment => ({
        ...comment,
        replies: buildReplies(comment.id)
      }));

      return commentsWithReplies;
    } catch (error) {
      console.error("Error fetching comments:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByUser(username) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "post_id_c"}},
          {"field": {"Name": "parent_id_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "author_username_c"}},
          {"field": {"Name": "upvotes_c"}},
          {"field": {"Name": "downvotes_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "user_vote_c"}},
          {"field": {"Name": "is_collapsed_c"}}
        ],
        where: [{
          "FieldName": "author_username_c",
          "Operator": "EqualTo",
          "Values": [username]
        }],
        orderBy: [{"fieldName": "created_at_c", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Transform data to match UI expectations
      const transformedData = (response.data || []).map(item => ({
        id: `c${item.Id}`,
        postId: item.post_id_c || '',
        parentId: item.parent_id_c || null,
        content: item.content_c || '',
        authorUsername: item.author_username_c || '',
        upvotes: item.upvotes_c || 0,
        downvotes: item.downvotes_c || 0,
        createdAt: item.created_at_c || new Date().toISOString(),
        userVote: item.user_vote_c || 'none',
        isCollapsed: item.is_collapsed_c || false,
        postTitle: `Post ${item.post_id_c}` // Mock post title for now
      }));

      return transformedData;
    } catch (error) {
      console.error("Error fetching user comments:", error?.response?.data?.message || error);
      return [];
    }
  }

  async create(commentData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        records: [{
          post_id_c: commentData.postId,
          parent_id_c: commentData.parentId || null,
          content_c: commentData.content,
          author_username_c: commentData.authorUsername || "current_user",
          upvotes_c: 1, // Auto-upvote own comment
          downvotes_c: 0,
          created_at_c: new Date().toISOString(),
          user_vote_c: "up",
          is_collapsed_c: false
        }]
      };

      const response = await apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} comments:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const createdComment = successful[0].data;
          return {
            id: `c${createdComment.Id}`,
            postId: createdComment.post_id_c,
            parentId: createdComment.parent_id_c,
            content: createdComment.content_c,
            authorUsername: createdComment.author_username_c,
            upvotes: createdComment.upvotes_c,
            downvotes: createdComment.downvotes_c,
            createdAt: createdComment.created_at_c,
            userVote: createdComment.user_vote_c,
            isCollapsed: createdComment.is_collapsed_c,
            replies: []
          };
        }
      }

      throw new Error("Failed to create comment");
    } catch (error) {
      console.error("Error creating comment:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async vote(commentId, voteType) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Extract numeric ID from comment ID (remove 'c' prefix)
      const numericId = parseInt(commentId.replace('c', ''));

      // First get current comment data
      const currentCommentResponse = await apperClient.getRecordById(this.tableName, numericId, {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "upvotes_c"}},
          {"field": {"Name": "downvotes_c"}},
          {"field": {"Name": "user_vote_c"}}
        ]
      });

      if (!currentCommentResponse.success || !currentCommentResponse.data) {
        throw new Error("Comment not found");
      }

      const currentComment = currentCommentResponse.data;
      let newUpvotes = currentComment.upvotes_c || 0;
      let newDownvotes = currentComment.downvotes_c || 0;
      let newVote = voteType;
      const previousVote = currentComment.user_vote_c || 'none';

      // Remove previous vote effect
      if (previousVote === "up") {
        newUpvotes -= 1;
      } else if (previousVote === "down") {
        newDownvotes -= 1;
      }

      // Apply new vote effect (toggle if same vote)
      if (voteType === previousVote) {
        newVote = "none";
      } else {
        if (voteType === "up") {
          newUpvotes += 1;
        } else if (voteType === "down") {
          newDownvotes += 1;
        }
      }

      const params = {
        records: [{
          Id: numericId,
          upvotes_c: newUpvotes,
          downvotes_c: newDownvotes,
          user_vote_c: newVote
        }]
      };

      const response = await apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      return { success: true };
    } catch (error) {
      console.error("Error voting on comment:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Extract numeric ID from comment ID (remove 'c' prefix if present)
      const numericId = parseInt(id.replace('c', ''));

      // Only include updateable fields
      const updateData = {
        Id: numericId
      };

      if (data.content !== undefined) updateData.content_c = data.content;
      if (data.upvotes !== undefined) updateData.upvotes_c = data.upvotes;
      if (data.downvotes !== undefined) updateData.downvotes_c = data.downvotes;
      if (data.userVote !== undefined) updateData.user_vote_c = data.userVote;
      if (data.isCollapsed !== undefined) updateData.is_collapsed_c = data.isCollapsed;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      return { success: true };
    } catch (error) {
      console.error("Error updating comment:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Extract numeric ID from comment ID (remove 'c' prefix if present)
      const numericId = parseInt(id.replace('c', ''));

      // For now, just delete the single comment
      // In a real implementation, you might want to handle cascading deletes for replies
      const params = {
        RecordIds: [numericId]
      };

      const response = await apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting comment:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const commentsService = new CommentsService();