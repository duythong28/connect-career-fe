export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  tokenType: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string | null;
  avatar: string | null;
  createdAt: string;
  emailVerified: boolean;
  mfaEnabled: boolean;
}

export interface ProfileResponse extends User {
  role?: 'admin' | 'candidate' | 'companies' | 'employer';
}
