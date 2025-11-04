import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

class PostsService {
  constructor() {
    this.tableName = 'post_c';
  }

  async getAll(options = {}) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "image_url_c"}},
          {"field": {"Name": "link_url_c"}},
          {"field": {"Name": "author_username_c"}},
          {"field": {"Name": "community_name_c"}},
          {"field": {"Name": "upvotes_c"}},
          {"field": {"Name": "downvotes_c"}},
          {"field": {"Name": "comment_count_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "user_vote_c"}},
          {"field": {"Name": "is_pinned_c"}}
        ],
        orderBy: [{"fieldName": "created_at_c", "sorttype": "DESC"}],
        pagingInfo: {
          limit: options.limit || 20,
          offset: ((options.page || 1) - 1) * (options.limit || 20)
        }
      };

      // Add community filter if specified
      if (options.community) {
        params.where = [{
          "FieldName": "community_name_c",
          "Operator": "EqualTo",
          "Values": [options.community]
        }];
      }

      // Add post type filter if specified
      if (options.postType && options.postType !== "all") {
        const typeFilter = {
          "FieldName": "type_c",
          "Operator": "EqualTo",
          "Values": [options.postType]
        };
        
        if (params.where) {
          params.where.push(typeFilter);
        } else {
          params.where = [typeFilter];
        }
      }

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Transform data to match UI expectations
      const transformedData = (response.data || []).map(item => ({
        id: String(item.Id),
        title: item.title_c || '',
        content: item.content_c || '',
        type: item.type_c || 'text',
        imageUrl: item.image_url_c || null,
        linkUrl: item.link_url_c || null,
        authorUsername: item.author_username_c || '',
        communityName: item.community_name_c || '',
        upvotes: item.upvotes_c || 0,
        downvotes: item.downvotes_c || 0,
        commentCount: item.comment_count_c || 0,
        createdAt: item.created_at_c || new Date().toISOString(),
        userVote: item.user_vote_c || 'none',
        isPinned: item.is_pinned_c || false
      }));

      return transformedData;
    } catch (error) {
      console.error("Error fetching posts:", error?.response?.data?.message || error);
      toast.error("Failed to load posts");
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "image_url_c"}},
          {"field": {"Name": "link_url_c"}},
          {"field": {"Name": "author_username_c"}},
          {"field": {"Name": "community_name_c"}},
          {"field": {"Name": "upvotes_c"}},
          {"field": {"Name": "downvotes_c"}},
          {"field": {"Name": "comment_count_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "user_vote_c"}},
          {"field": {"Name": "is_pinned_c"}}
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Post not found");
      }

      // Transform data to match UI expectations
      const item = response.data;
      return {
        id: String(item.Id),
        title: item.title_c || '',
        content: item.content_c || '',
        type: item.type_c || 'text',
        imageUrl: item.image_url_c || null,
        linkUrl: item.link_url_c || null,
        authorUsername: item.author_username_c || '',
        communityName: item.community_name_c || '',
        upvotes: item.upvotes_c || 0,
        downvotes: item.downvotes_c || 0,
        commentCount: item.comment_count_c || 0,
        createdAt: item.created_at_c || new Date().toISOString(),
        userVote: item.user_vote_c || 'none',
        isPinned: item.is_pinned_c || false
      };
    } catch (error) {
      console.error(`Error fetching post ${id}:`, error?.response?.data?.message || error);
      throw error;
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
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "image_url_c"}},
          {"field": {"Name": "link_url_c"}},
          {"field": {"Name": "author_username_c"}},
          {"field": {"Name": "community_name_c"}},
          {"field": {"Name": "upvotes_c"}},
          {"field": {"Name": "downvotes_c"}},
          {"field": {"Name": "comment_count_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "user_vote_c"}},
          {"field": {"Name": "is_pinned_c"}}
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
        id: String(item.Id),
        title: item.title_c || '',
        content: item.content_c || '',
        type: item.type_c || 'text',
        imageUrl: item.image_url_c || null,
        linkUrl: item.link_url_c || null,
        authorUsername: item.author_username_c || '',
        communityName: item.community_name_c || '',
        upvotes: item.upvotes_c || 0,
        downvotes: item.downvotes_c || 0,
        commentCount: item.comment_count_c || 0,
        createdAt: item.created_at_c || new Date().toISOString(),
        userVote: item.user_vote_c || 'none',
        isPinned: item.is_pinned_c || false
      }));

      return transformedData;
    } catch (error) {
      console.error("Error fetching user posts:", error?.response?.data?.message || error);
      return [];
    }
  }

  async create(postData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        records: [{
          title_c: postData.title,
          content_c: postData.content || "",
          type_c: postData.type,
          image_url_c: postData.imageUrl || null,
          link_url_c: postData.linkUrl || null,
          author_username_c: postData.authorUsername || "current_user",
          community_name_c: postData.communityName,
          upvotes_c: 1,
          downvotes_c: 0,
          comment_count_c: 0,
          created_at_c: new Date().toISOString(),
          user_vote_c: "up",
          is_pinned_c: false
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
          console.error(`Failed to create ${failed.length} posts:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const createdPost = successful[0].data;
          return {
            Id: createdPost.Id,
            id: String(createdPost.Id)
          };
        }
      }

      throw new Error("Failed to create post");
    } catch (error) {
      console.error("Error creating post:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async vote(postId, voteType) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // First get current post data
      const currentPost = await this.getById(postId);
      
      let newUpvotes = currentPost.upvotes;
      let newDownvotes = currentPost.downvotes;
      let newVote = voteType;

      // Remove previous vote effect
      if (currentPost.userVote === "up") {
        newUpvotes -= 1;
      } else if (currentPost.userVote === "down") {
        newDownvotes -= 1;
      }

      // Apply new vote effect (toggle if same vote)
      if (voteType === currentPost.userVote) {
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
          Id: parseInt(postId),
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
      console.error("Error voting on post:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // Only include updateable fields
      const updateData = {
        Id: parseInt(id)
      };

      if (data.title !== undefined) updateData.title_c = data.title;
      if (data.content !== undefined) updateData.content_c = data.content;
      if (data.type !== undefined) updateData.type_c = data.type;
      if (data.imageUrl !== undefined) updateData.image_url_c = data.imageUrl;
      if (data.linkUrl !== undefined) updateData.link_url_c = data.linkUrl;
      if (data.upvotes !== undefined) updateData.upvotes_c = data.upvotes;
      if (data.downvotes !== undefined) updateData.downvotes_c = data.downvotes;
      if (data.commentCount !== undefined) updateData.comment_count_c = data.commentCount;
      if (data.userVote !== undefined) updateData.user_vote_c = data.userVote;
      if (data.isPinned !== undefined) updateData.is_pinned_c = data.isPinned;

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
      console.error("Error updating post:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting post:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async updateCommentCount(postId, increment = 1) {
    try {
      const currentPost = await this.getById(postId);
      const newCount = currentPost.commentCount + increment;
      
      await this.update(postId, { commentCount: newCount });
      return { success: true };
    } catch (error) {
      console.error("Error updating comment count:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const postsService = new PostsService();