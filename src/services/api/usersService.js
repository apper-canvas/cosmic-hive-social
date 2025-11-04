import usersData from "@/services/mockData/users.json";

class UsersService {
  constructor() {
    this.users = [...usersData];
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sortedUsers = this.users
          .sort((a, b) => (b.postKarma + b.commentKarma) - (a.postKarma + a.commentKarma));
        resolve([...sortedUsers]);
      }, Math.random() * 300 + 200);
    });
  }

  async getByUsername(username) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = this.users.find(u => 
          u.username.toLowerCase() === username.toLowerCase()
        );
        if (user) {
          resolve({ ...user });
        } else {
          reject(new Error("User not found"));
        }
      }, Math.random() * 200 + 100);
    });
  }

  async create(userData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if username already exists
        const existingUser = this.users.find(u => 
          u.username.toLowerCase() === userData.username.toLowerCase()
        );
        
        if (existingUser) {
          reject(new Error("Username already exists"));
          return;
        }

        const newUser = {
          username: userData.username,
          postKarma: 0,
          commentKarma: 0,
          createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        resolve({ ...newUser });
      }, Math.random() * 500 + 300);
    });
  }

  async update(username, data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userIndex = this.users.findIndex(u => 
          u.username.toLowerCase() === username.toLowerCase()
        );
        
        if (userIndex === -1) {
          reject(new Error("User not found"));
          return;
        }

        // Don't allow username changes
        const updatedData = { ...data };
        delete updatedData.username;

        this.users[userIndex] = { 
          ...this.users[userIndex], 
          ...updatedData 
        };
        
        resolve({ ...this.users[userIndex] });
      }, Math.random() * 300 + 200);
    });
  }

  async delete(username) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userIndex = this.users.findIndex(u => 
          u.username.toLowerCase() === username.toLowerCase()
        );
        
        if (userIndex === -1) {
          reject(new Error("User not found"));
          return;
        }

        this.users.splice(userIndex, 1);
        resolve({ success: true });
      }, Math.random() * 300 + 200);
    });
  }

  async search(query) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredUsers = this.users.filter(user =>
          user.username.toLowerCase().includes(query.toLowerCase())
        ).sort((a, b) => (b.postKarma + b.commentKarma) - (a.postKarma + a.commentKarma));

        resolve([...filteredUsers]);
      }, Math.random() * 300 + 200);
    });
  }

  async updateKarma(username, postKarmaDelta = 0, commentKarmaDelta = 0) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userIndex = this.users.findIndex(u => 
          u.username.toLowerCase() === username.toLowerCase()
        );
        
        if (userIndex === -1) {
          reject(new Error("User not found"));
          return;
        }

        const user = this.users[userIndex];
        user.postKarma = Math.max(0, user.postKarma + postKarmaDelta);
        user.commentKarma = Math.max(0, user.commentKarma + commentKarmaDelta);

        resolve({ ...user });
      }, Math.random() * 200 + 100);
    });
  }
}

export const usersService = new UsersService();