import axios from "../client/axios";
import { CvsResponse } from "../types/cvs.types";
const API_URL = "/cvs";

const getMyCvs = async (): Promise<CvsResponse> => {
  const response = await axios.get(`${API_URL}/candidate`);
  return response.data;
};

export { getMyCvs };
