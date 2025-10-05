import axios from "../client/axios";
import { CandidateProfile } from "../types/candidates.types";
const API_URL = "/candidates";

const getMyProfile = async (): Promise<CandidateProfile> => {
  const response = await axios.get(`${API_URL}/me`);
  return response.data;
};

const getCandidateProfile = async (id: string): Promise<CandidateProfile> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export { getMyProfile, getCandidateProfile };
