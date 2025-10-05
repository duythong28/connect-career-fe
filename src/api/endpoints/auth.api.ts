import axios, { getCookie } from "../client/axios";
import {
  LoginCredentials,
  LoginResponse,
  ProfileResponse,
} from "../types/auth.types";

const API_URL = "/auth";

const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data;
};

const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

const loginNormalUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/loginNormalUser`, credentials);
  return response.data;
};

const verifyEmail = async (token) => {
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

export { login, logout, register, getProfile, loginNormalUser, verifyEmail };
