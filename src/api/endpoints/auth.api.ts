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

const loginNormalUser = async (credentials) => {
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

const googleCallback = async (token: string) => {
  const response = await axios.get(`${API_URL}/oath/google/callback`, {
    params: { token },
  });
  return response.data;
};

const signInWithGoogle = async () => {
  try {
    const response = await axios.get(`${API_URL}/oath/google`);
    return response.data;
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    throw error;
  }
};

const signInWithGithub = async () => {
  try {
    const response = await axios.get(`${API_URL}/oath/github`);
    return response.data;
  } catch (error) {
    console.error("Error during GitHub sign-in:", error);
    throw error;
  }
};

const githubCallback = async (code: string) => {
  try {
    const response = await axios.get(`${API_URL}/oath/github/callback`, {
      params: { code },
    });
    return response.data;
  } catch (error) {
    console.error("Error during GitHub callback:", error);
    throw error;
  }
};

const signInWithLinkedIn = async () => {
  try {
    const response = await axios.get(`${API_URL}/oath/linkedin`);
    return response.data;
  } catch (error) {
    console.error("Error during LinkedIn sign-in:", error);
    throw error;
  }
};

const linkedInCallback = async (code: string) => {
  try {
    const response = await axios.get(`${API_URL}/oath/linkedin/callback`, {
      params: { code },
    });
    return response.data;
  } catch (error) {
    console.error("Error during LinkedIn callback:", error);
    throw error;
  }
};

export { login, logout, register, getProfile, loginNormalUser, verifyEmail };
