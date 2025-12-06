import { Organization } from "./organizations.types";
import { UserResponse } from "./users.types";

export interface OrganizationRole {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationRoleResponse {
  data: OrganizationRole[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrganizationMemberRole {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  isActive: boolean;
  isSystemRole: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  user: UserResponse;
  userId: string;
  role: OrganizationMemberRole;
  roleId: string;
  status: "active" | "invited" | "removed";
  invitedBy?: string | null;
  invitedAt?: string | null;
  joinedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationInvitation {
  id: string;
  organizationId: string;
  email: string;
  role: OrganizationMemberRole;
  roleId: string;
  status: "pending" | "accepted" | "declined" | "cancelled";
  token: string;
  expiresAt: string;
  acceptedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
export interface InviteMemberDTO {
  email: string;
  roleId: string;
  message?: string;
}

export interface AcceptInvitationDTO {
  token: string;
}

export interface ChangeMemberRoleDTO {
  roleId: string;
}

export interface CheckPermissionResponse {
  allowed: boolean;
}

export interface OrganizationMembership {
  id: string;
  organization: Organization;
  organizationId: string;
  userId: string;
  role: OrganizationMemberRole;
  roleId: string;
  status: string;
  invitedBy?: string | null;
  invitedAt?: string | null;
  joinedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}
