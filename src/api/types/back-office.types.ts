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
  totalUsers: number;
  totalOrganizations: number;
  totalJobs: number;
  totalApplications: number;
  [key: string]: number;
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
