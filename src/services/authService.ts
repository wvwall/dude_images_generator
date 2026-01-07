import { api } from "./api";

const TOKEN_KEY = "auth_token";

export interface User {
  id: string;
  username: string;
  name?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

class AuthService {
  private token: string | null = localStorage.getItem(TOKEN_KEY);

  setToken(token: string) {
    this.token = token;
    localStorage.setItem(TOKEN_KEY, token);
  }

  getToken() {
    return this.token;
  }

  removeToken() {
    this.token = null;
    localStorage.removeItem(TOKEN_KEY);
  }

  async login(credentials: {
    username: string;
    password: string;
  }): Promise<AuthResponse> {
    const response = await fetch(api.backend.auth.login(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }
    const data: AuthResponse = await response.json();
    this.setToken(data.accessToken);
    return data;
  }

  async register(userData: {
    username: string;
    password: string;
  }): Promise<AuthResponse> {
    const response = await fetch(api.backend.auth.register(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }

    const data: AuthResponse = await response.json();
    this.setToken(data.accessToken);
    return data;
  }

  async getCurrentUser(): Promise<User | null> {
    if (!this.token) return null;

    try {
      const response = await fetch(api.backend.auth.me(), {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      if (!response.ok) {
        this.removeToken();
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching current user:", error);
      return null;
    }
  }

  logout() {
    this.removeToken();
  }
}

export const authService = new AuthService();
