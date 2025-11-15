import axios from "../client/axios";
import {
  OfferCreateDto,
  OfferUpdateDto,
  OfferResponse,
  CandidateCreateOfferDto,
} from "../types/offers.types";

const API_URL = "/recruiters/applications/offers";
const APPLICATIONS_URL = "/recruiters/applications";
const CANDIDATE_API_URL = "/candidates/applications";

const createOffer = async (
  applicationId: string,
  data: OfferCreateDto
): Promise<OfferResponse> => {
  const response = await axios.post(
    `${APPLICATIONS_URL}/${applicationId}/offers`,
    data
  );
  return response.data;
};

const getOffersByApplication = async (
  applicationId: string
): Promise<OfferResponse[]> => {
  const response = await axios.get(
    `${APPLICATIONS_URL}/${applicationId}/offers`
  );
  return response.data;
};

const getOfferById = async (offerId: string): Promise<OfferResponse> => {
  const response = await axios.get(`${API_URL}/${offerId}`);
  return response.data;
};

const updateOffer = async (
  offerId: string,
  data: OfferUpdateDto
): Promise<OfferResponse> => {
  const response = await axios.put(`${API_URL}/${offerId}`, data);
  return response.data;
};

const candidateAcceptOffer = async (
  applicationId: string,
  notes?: string
): Promise<any> => {
  const response = await axios.put(
    `${CANDIDATE_API_URL}/${applicationId}/offers/accept`,
    { notes }
  );
  return response.data;
};

const candidateRejectOffer = async (
  applicationId: string,
  reason?: string
): Promise<any> => {
  const response = await axios.put(
    `${CANDIDATE_API_URL}/${applicationId}/offers/reject`,
    { reason }
  );
  return response.data;
};

const candidateCreateOffer = async (
  applicationId: string,
  data: CandidateCreateOfferDto
): Promise<any> => {
  const response = await axios.post(
    `${CANDIDATE_API_URL}/${applicationId}/offers`,
    {
      ...data,
      isOfferedByCandidate: true,
    }
  );
  return response.data;
};

const recruiterRejectOffer = async (
  applicationId: string,
  reason?: string
): Promise<any> => {
  const response = await axios.post(
    `${APPLICATIONS_URL}/${applicationId}/offers/reject`,
    { reason }
  );
  return response.data;
};

const recruiterAcceptOffer = async (
  applicationId: string,
  reason?: string
): Promise<any> => {
  const response = await axios.post(
    `${APPLICATIONS_URL}/${applicationId}/offers/accept`,
    { reason }
  );
  return response.data;
};

const recruiterCancelOffer = async (
  offerId: string,
  reason?: string
): Promise<any> => {
  const response = await axios.post(
    `${APPLICATIONS_URL}/offers/${offerId}/cancel`,
    { reason }
  );
  return response.data;
};

export {
  createOffer,
  getOffersByApplication,
  getOfferById,
  updateOffer,
  candidateAcceptOffer,
  candidateRejectOffer,
  candidateCreateOffer,
  recruiterRejectOffer,
  recruiterAcceptOffer,
  recruiterCancelOffer,
};
