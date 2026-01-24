import { authService } from "./authService";

/**
 * API Client with automatic auth token injection
 * Wraps fetch to automatically include authentication headers
 */
class ApiClient {
  /**
   * Makes an authenticated API request
   */
  async request(url: string, options: RequestInit = {}): Promise<Response> {
    const token = authService.getToken();

    // Merge headers with auth token
    const headers = new Headers(options.headers);

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    // Make the request with intercepted headers
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 401 Unauthorized - token expired or invalid
    if (response.status === 401) {
      authService.removeToken();
      // You could redirect to login page here if needed
      throw new Error("Unauthorized - please login again");
    }

    return response;
  }

  /**
   * Convenience method for GET requests with typed response
   */
  async get<TResponse = unknown>(url: string, options: RequestInit = {}): Promise<Response> {
    return this.request(url, {
      ...options,
      method: "GET",
    });
  }

  /**
   * Convenience method for POST requests with typed request body and response
   */
  async post<TResponse = unknown, TBody = unknown>(url: string, body?: TBody, options: RequestInit = {}): Promise<Response> {
    const headers = new Headers(options.headers);

    // Auto-set Content-Type for JSON bodies
    if (body && !(body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    return this.request(url, {
      ...options,
      method: "POST",
      headers,
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  /**
   * Convenience method for PUT requests with typed request body and response
   */
  async put<TResponse = unknown, TBody = unknown>(url: string, body?: TBody, options: RequestInit = {}): Promise<Response> {
    const headers = new Headers(options.headers);

    // Auto-set Content-Type for JSON bodies
    if (body && !(body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    return this.request(url, {
      ...options,
      method: "PUT",
      headers,
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  /**
   * Convenience method for DELETE requests with typed response
   */
  async delete<TResponse = unknown>(url: string, options: RequestInit = {}): Promise<Response> {
    return this.request(url, {
      ...options,
      method: "DELETE",
    });
  }

  /**
   * Convenience method for PATCH requests with typed request body and response
   */
  async patch<TResponse = unknown, TBody = unknown>(url: string, body?: TBody, options: RequestInit = {}): Promise<Response> {
    const headers = new Headers(options.headers);

    // Auto-set Content-Type for JSON bodies
    if (body && !(body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    return this.request(url, {
      ...options,
      method: "PATCH",
      headers,
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }
}

export const apiClient = new ApiClient();
