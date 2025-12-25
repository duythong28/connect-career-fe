export interface SimilarJobRecommendationResponse {
  jobIds: string[];
}

export interface JobRecommendationPreferences {
  values?: string[];
  industriesLike?: string[];
  industriesDislike?: string[];
  skillsLike?: string[];
  skillsDislike?: string[];
  preferredRoleTypes?: string[];
  preferredLocations?: string[];
  preferredCompanySize?: string;
  wantsClearanceRoles?: boolean;
  minSalary?: number;
}