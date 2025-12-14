import { CandidateProfile } from "./candidates.types";
import { Job } from "./jobs.types";
import { Organization } from "./organizations.types";
import { UserResponse, UserStatus } from "./users.types";

export interface BackOfficePaginatedResponse<T> {
  users: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BackOfficeUserStats {
  total: number;
  active: number;
  inactive: number;
  banned: number;
}

export interface OrganizationStats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  totalHires: number;
  totalMembers: number;
  totalRecruiters: number;
}

export interface BackOfficeOrganizationWithStats {
  organization: Organization;
  stats: OrganizationStats;
}

export interface BackOfficeOrganizationsPaginatedResponse {
  data: BackOfficeOrganizationWithStats[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BackOfficeDashboardStats {
  overview: {
    totalUsers: number;
    totalOrganizations: number;
    totalJobs: number;
    totalApplications: number;
    totalRecruiters: number;
    totalCandidates: number;
    activeJobs: number;
    activeRecruiters: number;
  };
  growth: {
    newUsers: number;
    newOrganizations: number;
    newJobs: number;
    newApplications: number;
    growthRate: {
      users: number;
      organizations: number;
      jobs: number;
    };
  };
  activity: {
    jobsPosted: number;
    applicationsReceived: number;
    interviewsScheduled: number;
    offersSent: number;
    hires: number;
  };
  topPerformers: {
    topOrganizations: {
      id: string;
      name: string;
      jobsPosted: number;
      hires: number;
    }[];
    topRecruiters: {
      id: string;
      name: string | null;
      email: string;
      organizations: number;
      hires: number;
    }[];
  };
  trends: {
    usersByPeriod: {
      period: string;
      count: number;
    }[];
    jobsByPeriod: {
      period: string;
      count: number;
    }[];
    applicationsByPeriod: {
      period: string;
      count: number;
    }[];
  };
  period: {
    startDate: string;
    endDate: string;
  };
}

export interface UpdateOrganizationStatusDto {
  isActive: boolean;
}

export interface UpdateJobStatusDto {
  status: UserStatus;
}

export interface OrganizationMembership {
  id: string;
  organization: Organization;
  organizationId: string;
  userId: string;
  role: {
    id: string;
    organizationId: string;
    name: string;
    description: string;
    permissions: {
      id: string;
      name: string;
      description: string;
      action: string;
      resource: string;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    }[];
    isActive: boolean;
    isSystemRole: boolean;
    createdAt: string;
    updatedAt: string;
  };
  roleId: string;
  status: string;
  invitedBy: string;
  invitedAt: string;
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserDetailsResponse {
  user: UserResponse;
  candidateProfile?: CandidateProfile;
  organizationMemberships?: OrganizationMembership[];
}

export interface BackOfficeJobsPaginatedResponse {
  data: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}


export enum StatsPeriod {
  TODAY = 'today',
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year',
  ALL_TIME = 'all_time',
}