import axios from "../client/axios";
import {
  OfferCreateDto,
  OfferUpdateDto,
  OfferCandidateResponseDto,
  OfferResponse,
} from "../types/offers.types";

const API_URL = "/recruiters/offers";
const APPLICATIONS_URL = "/recruiters/applications";

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

const deleteOffer = async (offerId: string): Promise<any> => {
  const response = await axios.delete(`${API_URL}/${offerId}`);
  return response.data;
};

const respondToOffer = async (
  offerId: string,
  data: OfferCandidateResponseDto
): Promise<any> => {
  const response = await axios.post(`${API_URL}/${offerId}/response`, data);
  return response.data;
};

export {
  createOffer,
  getOffersByApplication,
  getOfferById,
  updateOffer,
  deleteOffer,
  respondToOffer,
};
