import axios from "../client/axios";
import {
  InterviewCreateDto,
  InterviewUpdateDto,
  InterviewFeedbackDto,
  InterviewRescheduleDto,
  InterviewResponse,
} from "../types/interviews.types";

const API_URL = "/recruiters/interviews";
const APPLICATIONS_URL = "/recruiters/applications";

const createInterview = async (
  applicationId: string,
  data: InterviewCreateDto
): Promise<InterviewResponse> => {
  const response = await axios.post(
    `${APPLICATIONS_URL}/${applicationId}/interviews`,
    data
  );
  return response.data;
};

const getInterviewById = async (interviewId: string): Promise<InterviewResponse> => {
  const response = await axios.get(`${API_URL}/${interviewId}`);
  return response.data;
};

const updateInterview = async (
  interviewId: string,
  data: InterviewUpdateDto
): Promise<InterviewResponse> => {
  const response = await axios.put(`${API_URL}/${interviewId}`, data);
  return response.data;
};

const deleteInterview = async (interviewId: string): Promise<any> => {
  const response = await axios.delete(`${API_URL}/${interviewId}`);
  return response.data;
};

const addInterviewFeedback = async (
  interviewId: string,
  data: InterviewFeedbackDto
): Promise<any> => {
  const response = await axios.post(`${API_URL}/${interviewId}/feedback`, data);
  return response.data;
};

const rescheduleInterview = async (
  interviewId: string,
  data: InterviewRescheduleDto
): Promise<any> => {
  const response = await axios.post(`${API_URL}/${interviewId}/reschedule`, data);
  return response.data;
};

export {
  createInterview,
  getInterviewById,
  updateInterview,
  deleteInterview,
  addInterviewFeedback,
  rescheduleInterview,
};