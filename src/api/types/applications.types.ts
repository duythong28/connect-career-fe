export interface ApplyJobDto {
  jobId: string;
  candidateId: string;
  cvId: string;
  coverLetter: string;
  notes: string;
  referralSource: string;
}

export interface GetApplicationByCandidateFilters {
  status?: string;
  isShortlisted?: boolean;
  isFlagged?: boolean;
}

export interface GetMyApplicationsParams {
  status?: string;
  hasInterviews?: boolean;
  hasOffers?: boolean;
  awaitingResponse?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}
