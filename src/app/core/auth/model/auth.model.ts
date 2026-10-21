export interface AuthResponse {
  token: string;
  refreshToken: string;
  userId: string;
  fullName: string;
  email: string;
  role: string;
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
}
