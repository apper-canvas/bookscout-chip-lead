import usersData from '../mockData/users.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class UserService {
  constructor() {
    this.users = [...usersData];
    this.currentUser = this.users[0]; // Mock logged in user
  }

  async getAll() {
    await delay(300);
    return [...this.users];
  }

  async getById(id) {
    await delay(200);
    const user = this.users.find(u => u.id === id);
    if (!user) {
      throw new Error('User not found');
    }
    return { ...user };
  }

  async getCurrentUser() {
    await delay(200);
    return { ...this.currentUser };
  }

  async create(userData) {
    await delay(300);
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      savedBooks: [],
      preferredGenres: [],
      joinedAt: new Date().toISOString()
    };
    this.users.push(newUser);
    return { ...newUser };
  }

  async update(id, data) {
    await delay(300);
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error('User not found');
    }
    this.users[index] = { ...this.users[index], ...data };
    
    // Update current user if it's the same
    if (this.currentUser.id === id) {
      this.currentUser = { ...this.users[index] };
    }
    
    return { ...this.users[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error('User not found');
    }
    this.users.splice(index, 1);
    return { success: true };
  }

  async addSavedBook(userId, bookId) {
    await delay(250);
    const user = await this.getById(userId);
    if (!user.savedBooks.includes(bookId)) {
      user.savedBooks.push(bookId);
      await this.update(userId, { savedBooks: user.savedBooks });
    }
    return { ...user };
  }

  async removeSavedBook(userId, bookId) {
    await delay(250);
    const user = await this.getById(userId);
    user.savedBooks = user.savedBooks.filter(id => id !== bookId);
    await this.update(userId, { savedBooks: user.savedBooks });
    return { ...user };
  }

  async updatePreferences(userId, preferences) {
    await delay(300);
    await this.update(userId, { preferredGenres: preferences });
    return await this.getById(userId);
  }

  async getSavedBooks(userId) {
    await delay(250);
    const user = await this.getById(userId);
    return user.savedBooks || [];
  }
}

export default new UserService();