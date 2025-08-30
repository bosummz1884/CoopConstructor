// User and Authentication Types
export interface User {
  id: string;
  email: string;
  subscriptionTier: 'free' | 'basic' | 'premium';
  stripeCustomerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  user: Omit<User, 'createdAt' | 'updatedAt'>;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  // Additional registration fields can be added here
}

export interface UpdateProfileData {
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

// Extend existing types with user information
export interface CoopConfig {
  chickens: number;
  nestingBox: boolean;
  roostingBar: boolean;
  chickenRun: boolean;
  wheels: boolean;
  roofStyle: "gable" | "flat" | "slanted";
  size: "small" | "medium" | "large";
  material: "wood" | "metal" | "mixed";
  description: string;
  userId?: string; // Added to associate blueprints with users
}

export interface Material {
  name: string;
  quantity: number;
  size: string;
  cost: number;
}

export interface BuildStep {
  step: number;
  title: string;
  description: string;
  details: string[];
  estimatedTime: string;
  isActive?: boolean;
}

export interface Dimensions {
  overall: {
    length: number;
    width: number;
    height: number;
    ridgeHeight: number;
  };
  nestingBoxes: {
    size: string;
    quantity: number;
    heightFromFloor: number;
  };
  chickenRun: {
    length: number;
    width: number;
    fenceHeight: number;
  };
}

export interface CutList {
  description: string;
  pieces: number;
}

// Update ApiResponse to be more generic
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Add specific response types
export type AuthResponseData = {
  user: Omit<User, 'passwordHash'>;
  token: string;
};

export type UserProfileResponse = Omit<User, 'passwordHash'>;

// Add request types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Extend the CoopBlueprint interface to include user information
export interface CoopBlueprint {
  id: string;
  config: CoopConfig;
  materials: Material[];
  instructions: BuildStep[];
  dimensions: Dimensions;
  cutList: CutList[];
  totalCost: number;
  pdfBase64?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Add error response type
export interface ErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
  validationErrors?: Record<string, string[]>;
}

// Add success response type
export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}
