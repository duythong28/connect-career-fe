import axios from "../client/axios";
const API_URL = "/recruiters";

const createRecruiterJobs = async () => {
  const response = await axios.post(`${API_URL}/recruiter/jobs`);
  return response.data;
};

export { createRecruiterJobs };
