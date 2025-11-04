import postsData from "@/services/mockData/posts.json";

class PostsService {
  constructor() {
    this.posts = [...postsData];
  }

  async getAll(options = {}) {
    return new Promise((resolve) => {
      setTimeout(() => {
let filteredPosts = [...this.posts];

        // Filter by community
        if (options.community) {
          filteredPosts = filteredPosts.filter(
            post => post.communityName.toLowerCase() === options.community.toLowerCase()
          );
        }

        // Filter by post type
        if (options.postType) {
          filteredPosts = filteredPosts.filter(post => {
            switch (options.postType) {
              case "image":
                return post.type === "image" || post.imageUrl;
              case "video":
                return post.type === "video";
              case "link":
                return post.type === "link" || post.linkUrl;
              case "text":
                return post.type === "text" && !post.imageUrl && !post.linkUrl;
              default:
                return true;
            }
          });
        }

        // Sort by filter type
        switch (options.filter) {
          case "new":
            filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
          case "top":
            filteredPosts.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
            break;
          case "rising":
            // Simple rising algorithm based on recent votes and time
            filteredPosts.sort((a, b) => {
              const aScore = (a.upvotes - a.downvotes) / Math.max(1, Math.floor((new Date() - new Date(a.createdAt)) / (1000 * 60 * 60)));
              const bScore = (b.upvotes - b.downvotes) / Math.max(1, Math.floor((new Date() - new Date(b.createdAt)) / (1000 * 60 * 60)));
              return bScore - aScore;
            });
            break;
          case "controversial":
            // Sort by posts with similar upvotes and downvotes (controversial)
            filteredPosts.sort((a, b) => {
              const aRatio = Math.min(a.upvotes, a.downvotes) / Math.max(a.upvotes, a.downvotes, 1);
              const bRatio = Math.min(b.upvotes, b.downvotes) / Math.max(b.upvotes, b.downvotes, 1);
              return bRatio - aRatio;
            });
            break;
          default: // "hot"
            // Simple hot algorithm combining score and recency
            filteredPosts.sort((a, b) => {
              const aHot = Math.log10(Math.max(1, a.upvotes - a.downvotes)) - ((new Date() - new Date(a.createdAt)) / (1000 * 60 * 60 * 24));
              const bHot = Math.log10(Math.max(1, b.upvotes - b.downvotes)) - ((new Date() - new Date(b.createdAt)) / (1000 * 60 * 60 * 24));
              return bHot - aHot;
            });
        }

        // Separate pinned posts and regular posts
        const pinnedPosts = filteredPosts.filter(post => post.isPinned);
        const regularPosts = filteredPosts.filter(post => !post.isPinned);
        
        // Combine with pinned posts first
        filteredPosts = [...pinnedPosts, ...regularPosts];

        // Pagination
        const page = options.page || 1;
        const limit = options.limit || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        
        resolve(filteredPosts.slice(startIndex, endIndex));
      }, Math.random() * 300 + 200);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const post = this.posts.find(p => p.id === id);
        if (post) {
          resolve({ ...post });
        } else {
          reject(new Error("Post not found"));
        }
      }, Math.random() * 200 + 100);
    });
  }

  async getByUser(username) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userPosts = this.posts
          .filter(post => post.authorUsername === username)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        resolve([...userPosts]);
      }, Math.random() * 300 + 200);
    });
  }

  async create(postData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newPost = {
          id: String(Math.max(...this.posts.map(p => parseInt(p.id))) + 1),
          title: postData.title,
          content: postData.content || "",
          type: postData.type,
          imageUrl: postData.imageUrl || null,
          linkUrl: postData.linkUrl || null,
          authorUsername: "demo_user", // Simulated current user
          communityName: postData.communityName,
          upvotes: 1, // Auto-upvote own post
          downvotes: 0,
          commentCount: 0,
          createdAt: new Date().toISOString(),
          userVote: "up"
        };

        this.posts.unshift(newPost);
        resolve({ ...newPost });
      }, Math.random() * 500 + 300);
    });
  }

  async vote(postId, voteType) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const postIndex = this.posts.findIndex(p => p.id === postId);
        if (postIndex === -1) {
          reject(new Error("Post not found"));
          return;
        }

        const post = this.posts[postIndex];
        const previousVote = post.userVote;

        // Remove previous vote
        if (previousVote === "up") {
          post.upvotes -= 1;
        } else if (previousVote === "down") {
          post.downvotes -= 1;
        }

        // Apply new vote (or toggle off if same)
        if (voteType === previousVote) {
          post.userVote = "none";
        } else {
          post.userVote = voteType;
          if (voteType === "up") {
            post.upvotes += 1;
          } else if (voteType === "down") {
            post.downvotes += 1;
          }
        }

        resolve({ success: true });
      }, Math.random() * 200 + 100);
    });
  }

  async update(id, data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const postIndex = this.posts.findIndex(p => p.id === id);
        if (postIndex === -1) {
          reject(new Error("Post not found"));
          return;
        }

        this.posts[postIndex] = { ...this.posts[postIndex], ...data };
        resolve({ ...this.posts[postIndex] });
      }, Math.random() * 300 + 200);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const postIndex = this.posts.findIndex(p => p.id === id);
        if (postIndex === -1) {
          reject(new Error("Post not found"));
          return;
        }

        this.posts.splice(postIndex, 1);
        resolve({ success: true });
}, Math.random() * 300 + 200);
    });
  }

  async updateCommentCount(postId, increment = 1) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const postIndex = this.posts.findIndex(p => p.id === postId);
        if (postIndex === -1) {
          reject(new Error("Post not found"));
          return;
        }

        this.posts[postIndex].commentCount += increment;
        resolve({ success: true });
      }, Math.random() * 100 + 50);
    });
  }
}

export const postsService = new PostsService();