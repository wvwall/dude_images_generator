/**
 * API Endpoints Configuration
 * Centralizza tutte le URL delle API utilizzate nell'applicazione
 */

// Base URL per le API (può essere configurata tramite env)
const API_BASE_URL = process.env.VITE_API_BASE_URL || "";
const NETLIFY_FUNCTIONS_BASE = "/.netlify/functions";

/**
 * API Endpoints
 */
export const api = {
  // Netlify Functions
  netlify: {
    generateImage: () => `${NETLIFY_FUNCTIONS_BASE}/generate-image`,
    generateVideo: () => `${NETLIFY_FUNCTIONS_BASE}/generate-video`,
    checkVideoStatus: () => `${NETLIFY_FUNCTIONS_BASE}/check-video-status`,
  },

  // Backend API (se presente)
  backend: {
    // Images
    images: {
      getAll: () => `${API_BASE_URL}/api/v1/images`,
      getById: (id: string) => `${API_BASE_URL}/api/v1/images/${id}`,
      create: () => `${API_BASE_URL}/api/v1/images`,
      update: (id: string) => `${API_BASE_URL}/api/v1/images/${id}`,
      delete: (id: string) => `${API_BASE_URL}/api/v1/images/${id}`,
    },

    // Videos
    videos: {
      getAll: () => `${API_BASE_URL}/api/v1/videos`,
      getById: (id: string) => `${API_BASE_URL}/api/v1/videos/${id}`,
      create: () => `${API_BASE_URL}/api/v1/videos`,
      update: (id: string) => `${API_BASE_URL}/api/v1/videos/${id}`,
      delete: (id: string) => `${API_BASE_URL}/api/v1/videos/${id}`,
    },

    // User/Auth (esempio)
    auth: {
      login: () => `${API_BASE_URL}/api/v1/auth/login`,
      logout: () => `${API_BASE_URL}/api/v1/auth/logout`,
      register: () => `${API_BASE_URL}/api/v1/auth/register`,
      me: () => `${API_BASE_URL}/api/v1/auth/me`,
    },
  },
} as const;

// Type helpers per le URL
export type ApiEndpoint = typeof api;
