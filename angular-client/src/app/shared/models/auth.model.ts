import { User } from './user.model';

export interface LoginRequest {
  userName?: string;  // Either userName OR email is required
  email?: string;     // Either userName OR email is required
  password: string;   // Required
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface RegisterRequest {
  firstName: string;        // Required
  lastName: string;         // Required  
  userName: string;         // Required (will be converted to lowercase)
  email: string;            // Required (will be converted to lowercase)
  password: string;         // Required (min 6 characters)
  confirmPassword: string;  // Required (must match password)
  phone?: string;           // Optional
  gender?: string;          // Optional
  dob?: string;             // Optional (ISO date format)
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    phone?: string;
    gender?: string;
    dob?: string;
  };
}
