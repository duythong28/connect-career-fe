import axios, { getCookie } from "../client/axios";
import {
  LoginCredentials,
  LoginResponse,
  ProfileResponse,
  RegisterCredentials,
} from "../types/auth.types";

const API_URL = "/auth";

const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data;
};

const register = async (userData: RegisterCredentials) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

const loginNormalUser = async (credentials: any) => {
  const response = await axios.post(`${API_URL}/loginNormalUser`, credentials);
  return response.data;
};

const verifyEmail = async (token: string) => {
  const response = await axios.post(`${API_URL}/verify-email`, { token });
  return response.data;
};

const logout = async () => {
  const refreshToken = getCookie("refreshToken");
  const response = await axios.post(`${API_URL}/logout`, { refreshToken });
  return response.data;
};

const getProfile = async (): Promise<ProfileResponse> => {
  const response = await axios.get(`${API_URL}/profile`);
  return response.data;
};

const forgotPassword = async (email: string) => {
  const response = await axios.post(`${API_URL}/forgot-password`, { email });
  return response.data;
};

const resetPassword = async (token: string, newPassword: string) => {
  const response = await axios.post(`${API_URL}/reset-password`, {
    token,
    newPassword,
  });
  return response.data;
};

export {
  login,
  logout,
  register,
  getProfile,
  loginNormalUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
