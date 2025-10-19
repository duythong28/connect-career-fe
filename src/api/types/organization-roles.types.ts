export interface Permission {
  id: string;
  name: string;
  description?: string | null;
  action?: string | null;
  resource?: string | null;
  isActive?: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface Role {
  id: string;
  organizationId?: string | null;
  name: string;
  description?: string | null;
  permissions?: Permission[] | null;
  isActive?: boolean;
  isSystemRole?: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface OrganizationMember {
  id: string;
  userId?: string | null;
  email?: string | null;
  fullName?: string | null;
  avatarUrl?: string | null;
  role?: Role | null;
  roleId?: string | null;
  invitedAt?: string | null;
  joinedAt?: string | null;
  status?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface InviteMemberDto {
  email: string;
  roleId: string;
  message?: string;
}

export interface Invitation {
  id: string;
  token?: string | null;
  email?: string | null;
  roleId?: string | null;
  inviterId?: string | null;
  organizationId?: string | null;
  createdAt?: string | null;
  expiresAt?: string | null;
  status?: string | null;
}

export interface OrganizationSummary {
  id: string;
  name?: string | null;
  slug?: string | null;
  roleId?: string | null;
  roleName?: string | null;
}

export interface PermissionCheckParams {
  action: string;
  resource: string;
}

export interface PermissionCheckResponse {
  allowed: boolean;
  reason?: string | null;
  permissions?: string[] | null;
}

export interface OrganizationStats {
  totalMembers?: number;
  activeMembers?: number;
  pendingInvitations?: number;
  rolesCount?: number;
  [key: string]: any;
}
