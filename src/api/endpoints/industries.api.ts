import axios from "../client/axios";
import { Industry } from "../types/industries.types";

const API_URL = "/industries";

const getIndistries = async (): Promise<{
  data: Array<Industry>;
}> => {
  const response = await axios.get(`${API_URL}?parentsOnly=true`);
  return response.data;
};

export { getIndistries };
