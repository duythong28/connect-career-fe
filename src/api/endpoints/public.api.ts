import axios from "../client/axios";
import {
  IndustryStatisticsParams,
  IndustryStatisticsResponse,
  JobOpportunityGrowthResponse,
  WorkMarketResponse,
} from "../types/public.types";

const API_PUBLIC_URL = "/public";

const getIndustryStatistics = async (
  params?: IndustryStatisticsParams,
): Promise<IndustryStatisticsResponse> => {
  const response = await axios.get(
    `${API_PUBLIC_URL}/reports/industry-statistics`,
    { params },
  );
  return response.data;
};

const getJobOpportunityGrowth =
  async (): Promise<JobOpportunityGrowthResponse> => {
    const response = await axios.get(
      `${API_PUBLIC_URL}/reports/job-opportunity-growth`,
    );
    return response.data;
  };

const getWorkMarket = async (): Promise<WorkMarketResponse> => {
  const response = await axios.get(`${API_PUBLIC_URL}/reports/work-market`);
  return response.data;
};

export { getIndustryStatistics, getJobOpportunityGrowth, getWorkMarket };
