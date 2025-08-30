import { ApiResponse, AuthResponse, LoginCredentials, RegisterData, UpdateProfileData, User } from '@shared/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  
  if (!response.ok) {
    const error = data?.error || 'An error occurred';
    throw new Error(error);
  }
  
  return data;
}

// Get auth token from localStorage
function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}

// Set auth token in localStorage
function setAuthToken(token: string): void {
  localStorage.setItem('authToken', token);
}

// Remove auth token from localStorage
function removeAuthToken(): void {
  localStorage.removeItem('authToken');
}

// Get default headers with auth token
function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

// API client methods
export const api = {
  // Auth methods
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials),
    });
    
    const data = await handleResponse<AuthResponse>(response);
    setAuthToken(data.token);
    return data;
  },
  
  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    
    const data = await handleResponse<AuthResponse>(response);
    setAuthToken(data.token);
    return data;
  },
  
  logout(): void {
    removeAuthToken();
  },
  
  async getProfile(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getHeaders(),
    });
    
    return handleResponse<User>(response);
  },
  
  async updateProfile(profileData: UpdateProfileData): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(profileData),
    });
    
    return handleResponse<User>(response);
  },
  
  // Coop blueprint methods
  async generateBlueprint(description: string): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/coop`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ description }),
    });
    
    return handleResponse<ApiResponse>(response);
  },
  
  async getBlueprints(): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/blueprints`, {
      headers: getHeaders(),
    });
    
    return handleResponse<ApiResponse>(response);
  },
  
  async getBlueprintById(id: string): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/blueprints/${id}`, {
      headers: getHeaders(),
    });
    
    return handleResponse<ApiResponse>(response);
  },
  
  // Helper to check if user is authenticated
  isAuthenticated(): boolean {
    return !!getAuthToken();
  },
  
  // Set auth token (useful for OAuth flows)
  setAuthToken,
  getAuthToken,
  removeAuthToken,
};

export default api;
