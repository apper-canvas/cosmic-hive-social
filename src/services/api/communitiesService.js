import communitiesData from "@/services/mockData/communities.json";

class CommunitiesService {
  constructor() {
    this.communities = [...communitiesData];
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sortedCommunities = this.communities
          .sort((a, b) => b.memberCount - a.memberCount);
        resolve([...sortedCommunities]);
      }, Math.random() * 300 + 200);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const community = this.communities.find(c => c.id === id);
        if (community) {
          resolve({ ...community });
        } else {
          reject(new Error("Community not found"));
        }
      }, Math.random() * 200 + 100);
    });
  }

async getByName(name) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const community = this.communities.find(c => 
          c.name.toLowerCase() === name.toLowerCase()
        );
        if (community) {
          resolve({ ...community });
        } else {
          reject(new Error("Community not found"));
        }
      }, Math.random() * 200 + 100);
    });
  }

  async toggleSubscription(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const communityIndex = this.communities.findIndex(c => c.id === id);
        if (communityIndex !== -1) {
          this.communities[communityIndex].isSubscribed = !this.communities[communityIndex].isSubscribed;
          if (this.communities[communityIndex].isSubscribed) {
            this.communities[communityIndex].memberCount += 1;
          } else {
            this.communities[communityIndex].memberCount -= 1;
          }
          resolve({ ...this.communities[communityIndex] });
        }
      }, Math.random() * 300 + 100);
    });
  }

  async subscribe(communityId, subscribe = true) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const communityIndex = this.communities.findIndex(c => c.id === communityId);
        if (communityIndex === -1) {
          reject(new Error("Community not found"));
          return;
        }

        const community = this.communities[communityIndex];
        community.isSubscribed = subscribe;
        
        // Update member count
        if (subscribe) {
          community.memberCount += 1;
        } else {
          community.memberCount = Math.max(0, community.memberCount - 1);
        }

        resolve({ ...community });
      }, Math.random() * 300 + 200);
    });
  }

  async create(communityData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newCommunity = {
          id: String(Math.max(...this.communities.map(c => parseInt(c.id))) + 1),
          name: communityData.name.toLowerCase().replace(/\s+/g, ""),
          description: communityData.description,
          memberCount: 1, // Creator is first member
          createdAt: new Date().toISOString(),
          isSubscribed: true
        };

        this.communities.push(newCommunity);
        resolve({ ...newCommunity });
      }, Math.random() * 500 + 300);
    });
  }

  async update(id, data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const communityIndex = this.communities.findIndex(c => c.id === id);
        if (communityIndex === -1) {
          reject(new Error("Community not found"));
          return;
        }

        this.communities[communityIndex] = { 
          ...this.communities[communityIndex], 
          ...data 
        };
        resolve({ ...this.communities[communityIndex] });
      }, Math.random() * 300 + 200);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const communityIndex = this.communities.findIndex(c => c.id === id);
        if (communityIndex === -1) {
          reject(new Error("Community not found"));
          return;
        }

        this.communities.splice(communityIndex, 1);
        resolve({ success: true });
      }, Math.random() * 300 + 200);
    });
  }

  async search(query) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredCommunities = this.communities.filter(community =>
          community.name.toLowerCase().includes(query.toLowerCase()) ||
          community.description.toLowerCase().includes(query.toLowerCase())
        ).sort((a, b) => b.memberCount - a.memberCount);

        resolve([...filteredCommunities]);
      }, Math.random() * 300 + 200);
    });
  }
}

export const communitiesService = new CommunitiesService();