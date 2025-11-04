import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

class UsersService {
  constructor() {
    this.tableName = 'user_c';
  }

  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "username_c"}},
          {"field": {"Name": "post_karma_c"}},
          {"field": {"Name": "comment_karma_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
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
        username: item.username_c || '',
        postKarma: item.post_karma_c || 0,
        commentKarma: item.comment_karma_c || 0,
        createdAt: item.created_at_c || new Date().toISOString()
      }));

      // Sort by total karma
      transformedData.sort((a, b) => (b.postKarma + b.commentKarma) - (a.postKarma + a.commentKarma));

      return transformedData;
    } catch (error) {
      console.error("Error fetching users:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByUsername(username) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "username_c"}},
          {"field": {"Name": "post_karma_c"}},
          {"field": {"Name": "comment_karma_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        where: [{
          "FieldName": "username_c",
          "Operator": "EqualTo",
          "Values": [username]
        }]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data || response.data.length === 0) {
        throw new Error("User not found");
      }

      // Transform data to match UI expectations
      const item = response.data[0];
      return {
        id: String(item.Id),
        username: item.username_c || '',
        postKarma: item.post_karma_c || 0,
        commentKarma: item.comment_karma_c || 0,
        createdAt: item.created_at_c || new Date().toISOString()
      };
    } catch (error) {
      console.error("Error fetching user:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(userData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        records: [{
          username_c: userData.username,
          post_karma_c: 0,
          comment_karma_c: 0,
          created_at_c: new Date().toISOString()
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
          console.error(`Failed to create ${failed.length} users:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
          throw new Error("Username already exists");
        }

        if (successful.length > 0) {
          const createdUser = successful[0].data;
          return {
            id: String(createdUser.Id),
            username: createdUser.username_c,
            postKarma: createdUser.post_karma_c || 0,
            commentKarma: createdUser.comment_karma_c || 0,
            createdAt: createdUser.created_at_c
          };
        }
      }

      throw new Error("Failed to create user");
    } catch (error) {
      console.error("Error creating user:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(username, data) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // First find the user by username
      const user = await this.getByUsername(username);

      // Only include updateable fields (excluding username_c for security)
      const updateData = {
        Id: parseInt(user.id)
      };

      if (data.postKarma !== undefined) updateData.post_karma_c = data.postKarma;
      if (data.commentKarma !== undefined) updateData.comment_karma_c = data.commentKarma;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      // Return updated user data
      return await this.getByUsername(username);
    } catch (error) {
      console.error("Error updating user:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async delete(username) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // First find the user by username
      const user = await this.getByUsername(username);

      const params = {
        RecordIds: [parseInt(user.id)]
      };

      const response = await apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting user:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async search(query) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "username_c"}},
          {"field": {"Name": "post_karma_c"}},
          {"field": {"Name": "comment_karma_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        where: [{
          "FieldName": "username_c",
          "Operator": "Contains",
          "Values": [query]
        }]
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
        username: item.username_c || '',
        postKarma: item.post_karma_c || 0,
        commentKarma: item.comment_karma_c || 0,
        createdAt: item.created_at_c || new Date().toISOString()
      }));

      // Sort by total karma
      transformedData.sort((a, b) => (b.postKarma + b.commentKarma) - (a.postKarma + a.commentKarma));

      return transformedData;
    } catch (error) {
      console.error("Error searching users:", error?.response?.data?.message || error);
      return [];
    }
  }

  async updateKarma(username, postKarmaDelta = 0, commentKarmaDelta = 0) {
    try {
      const user = await this.getByUsername(username);
      const newPostKarma = Math.max(0, user.postKarma + postKarmaDelta);
      const newCommentKarma = Math.max(0, user.commentKarma + commentKarmaDelta);
      
      return await this.update(username, {
        postKarma: newPostKarma,
        commentKarma: newCommentKarma
      });
    } catch (error) {
      console.error("Error updating karma:", error?.response?.data?.message || error);
      throw error;
    }
  }
}

export const usersService = new UsersService();