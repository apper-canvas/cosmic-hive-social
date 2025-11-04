import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

class CommunitiesService {
  constructor() {
    this.tableName = 'community_c';
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "member_count_c"}},
          {"field": {"Name": "is_subscribed_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        orderBy: [{"fieldName": "member_count_c", "sorttype": "DESC"}]
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
        name: item.name_c || '',
        description: item.description_c || '',
        memberCount: item.member_count_c || 0,
        isSubscribed: item.is_subscribed_c || false,
        createdAt: item.created_at_c || new Date().toISOString()
      }));

      return transformedData;
    } catch (error) {
      console.error("Error fetching communities:", error?.response?.data?.message || error);
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "member_count_c"}},
          {"field": {"Name": "is_subscribed_c"}},
          {"field": {"Name": "created_at_c"}}
        ]
      };

      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Community not found");
      }

      // Transform data to match UI expectations
      const item = response.data;
      return {
        id: String(item.Id),
        name: item.name_c || '',
        description: item.description_c || '',
        memberCount: item.member_count_c || 0,
        isSubscribed: item.is_subscribed_c || false,
        createdAt: item.created_at_c || new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error fetching community ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async getByName(name) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "member_count_c"}},
          {"field": {"Name": "is_subscribed_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        where: [{
          "FieldName": "name_c",
          "Operator": "EqualTo",
          "Values": [name.toLowerCase()]
        }]
      };

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data || response.data.length === 0) {
        throw new Error("Community not found");
      }

      // Transform data to match UI expectations
      const item = response.data[0];
      return {
        id: String(item.Id),
        name: item.name_c || '',
        description: item.description_c || '',
        memberCount: item.member_count_c || 0,
        isSubscribed: item.is_subscribed_c || false,
        createdAt: item.created_at_c || new Date().toISOString()
      };
    } catch (error) {
      console.error("Error fetching community by name:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async subscribe(communityId, subscribe = true) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      // First get current community data
      const currentCommunity = await this.getById(communityId);
      
      let newMemberCount = currentCommunity.memberCount;
      if (subscribe && !currentCommunity.isSubscribed) {
        newMemberCount += 1;
      } else if (!subscribe && currentCommunity.isSubscribed) {
        newMemberCount = Math.max(0, newMemberCount - 1);
      }

      const params = {
        records: [{
          Id: parseInt(communityId),
          is_subscribed_c: subscribe,
          member_count_c: newMemberCount
        }]
      };

      const response = await apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      // Return updated community data
      return await this.getById(communityId);
    } catch (error) {
      console.error("Error updating subscription:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(communityData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const params = {
        records: [{
          name_c: communityData.name.toLowerCase().replace(/\s+/g, ""),
          description_c: communityData.description,
          member_count_c: 1, // Creator is first member
          is_subscribed_c: true,
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
          console.error(`Failed to create ${failed.length} communities:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const createdCommunity = successful[0].data;
          return {
            id: String(createdCommunity.Id),
            name: createdCommunity.name_c,
            description: createdCommunity.description_c,
            memberCount: createdCommunity.member_count_c,
            isSubscribed: createdCommunity.is_subscribed_c,
            createdAt: createdCommunity.created_at_c
          };
        }
      }

      throw new Error("Failed to create community");
    } catch (error) {
      console.error("Error creating community:", error?.response?.data?.message || error);
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

      if (data.name !== undefined) updateData.name_c = data.name;
      if (data.description !== undefined) updateData.description_c = data.description;
      if (data.memberCount !== undefined) updateData.member_count_c = data.memberCount;
      if (data.isSubscribed !== undefined) updateData.is_subscribed_c = data.isSubscribed;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      // Return updated community data
      return await this.getById(id);
    } catch (error) {
      console.error("Error updating community:", error?.response?.data?.message || error);
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
      console.error("Error deleting community:", error?.response?.data?.message || error);
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "member_count_c"}},
          {"field": {"Name": "is_subscribed_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {"conditions": [{
              "fieldName": "name_c",
              "operator": "Contains",
              "values": [query.toLowerCase()]
            }], "operator": "OR"},
            {"conditions": [{
              "fieldName": "description_c",
              "operator": "Contains",
              "values": [query.toLowerCase()]
            }], "operator": "OR"}
          ]
        }],
        orderBy: [{"fieldName": "member_count_c", "sorttype": "DESC"}]
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
        name: item.name_c || '',
        description: item.description_c || '',
        memberCount: item.member_count_c || 0,
        isSubscribed: item.is_subscribed_c || false,
        createdAt: item.created_at_c || new Date().toISOString()
      }));

      return transformedData;
    } catch (error) {
      console.error("Error searching communities:", error?.response?.data?.message || error);
      return [];
    }
  }
}

export const communitiesService = new CommunitiesService();