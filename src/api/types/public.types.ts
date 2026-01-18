export interface IndustryStatistic {
  key: string;
  value: string;
}

export interface IndustryStatisticsResponse {
  status: string;
  message: string;
  data: IndustryStatistic[];
}

export interface JobOpportunityGrowth {
  key: string;
  value: string;
}

export interface JobOpportunityGrowthResponse {
  status: string;
  message: string;
  data: JobOpportunityGrowth[];
}

export interface WorkMarketData {
  quantity_job_recruitment: number;
  quantity_job_recruitment_yesterday: number;
  quantity_job_new_today: number;
  quantity_company_recruitment: number;
  time_scan: string;
}

export interface WorkMarketResponse {
  status: string;
  message: string;
  data: WorkMarketData;
}

export interface IndustryStatisticsParams {
  startDate?: string;
  endDate?: string;
}