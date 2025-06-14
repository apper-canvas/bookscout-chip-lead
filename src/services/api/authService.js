import { toast } from 'react-toastify';
import { userService } from './userService';

// Mock JWT token generation for development
const generateToken = (user) => {
  return btoa(JSON.stringify({ userId: user.id, exp: Date.now() + 24 * 60 * 60 * 1000 }));
};

// Mock JWT token validation
const validateToken = (token) => {
  try {
    const payload = JSON.parse(atob(token));
    return payload.exp > Date.now();
  } catch {
    return false;
  }
};

const getUserFromToken = (token) => {
  try {
    const payload = JSON.parse(atob(token));
    return payload.userId;
  } catch {
    return null;
  }
};

class AuthService {
  constructor() {
    this.TOKEN_KEY = 'bookscout_token';
  }

  async login(email, password) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Get all users and find matching email
      const users = await userService.getAll();
      const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase());

      if (!user) {
        throw new Error('User not found');
      }

      // In a real app, you'd verify the password hash
      // For demo purposes, we'll accept any password for existing users
      if (!password) {
        throw new Error('Password is required');
      }

      // Generate JWT token
      const token = generateToken(user);

      // Store token
      localStorage.setItem(this.TOKEN_KEY, token);

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        token
      };
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  }

  async signup(userData) {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user already exists
      const users = await userService.getAll();
      const existingUser = users.find(u => u.email?.toLowerCase() === userData.email.toLowerCase());

      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create new user
      const newUser = await userService.create({
        ...userData,
        createdAt: new Date().toISOString(),
        savedBooks: [],
        preferences: {
          notifications: true,
          newsletter: false
        }
      });

      // Generate JWT token
      const token = generateToken(newUser);

      // Store token
      localStorage.setItem(this.TOKEN_KEY, token);

      return {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email
        },
        token
      };
    } catch (error) {
      throw new Error(error.message || 'Signup failed');
    }
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated() {
    const token = this.getToken();
    return token && validateToken(token);
  }

  async getCurrentUser() {
    const token = this.getToken();
    if (!token || !validateToken(token)) {
      return null;
    }

    try {
      const userId = getUserFromToken(token);
      const user = await userService.getById(userId);
      return {
        id: user.id,
        name: user.name,
        email: user.email
      };
    } catch {
      return null;
    }
  }
}

export const authService = new AuthService();
export default authService;