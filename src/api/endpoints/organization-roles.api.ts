import axios from "../client/axios";
import {
  Role,
  OrganizationMember,
  InviteMemberDto,
  Invitation,
  OrganizationSummary,
  PermissionCheckParams,
  PermissionCheckResponse,
  OrganizationStats,
} from "../types/organization-roles.types";

const BASE = "/organizations-rbac";

const getRoles = async (organizationId: string): Promise<Role[]> => {
  const response = await axios.get(`${BASE}/${organizationId}/roles`);
  return response.data;
};

const getMembers = async (
  organizationId: string,
  params?: Record<string, any>
): Promise<OrganizationMember[]> => {
  const response = await axios.get(`${BASE}/${organizationId}/members`, {
    params,
  });
  return response.data;
};

const inviteMember = async (
  organizationId: string,
  data: InviteMemberDto
): Promise<Invitation> => {
  const response = await axios.post(`${BASE}/${organizationId}/invite`, data);
  return response.data;
};

const getInvitations = async (
  organizationId: string
): Promise<Invitation[]> => {
  const response = await axios.get(`${BASE}/${organizationId}/invitations`);
  return response.data;
};

const acceptInvitation = async (data: { token: string }): Promise<any> => {
  const response = await axios.post(`${BASE}/invitations/accept`, data);
  return response.data;
};

const getMyOrganizations = async (): Promise<OrganizationSummary[]> => {
  const response = await axios.get(`${BASE}/me/organizations`);
  return response.data;
};

const checkPermission = async (
  organizationId: string,
  params: PermissionCheckParams
): Promise<PermissionCheckResponse> => {
  const response = await axios.get(
    `${BASE}/${organizationId}/permissions/check`,
    { params }
  );
  return response.data;
};

const getMyRole = async (
  organizationId: string
): Promise<{ role?: Role | null }> => {
  const response = await axios.get(
    `${BASE}/me/organizations/${organizationId}/role`
  );
  return response.data;
};

const updateMemberRole = async (
  organizationId: string,
  memberId: string,
  roleId: string
): Promise<any> => {
  const response = await axios.put(
    `${BASE}/${organizationId}/members/${memberId}/role`,
    { roleId }
  );
  return response.data;
};

const getStats = async (organizationId: string): Promise<OrganizationStats> => {
  const response = await axios.get(`${BASE}/${organizationId}/stats`);
  return response.data;
};

const removeMember = async (
  organizationId: string,
  memberId: string
): Promise<any> => {
  const response = await axios.delete(
    `${BASE}/${organizationId}/members/${memberId}`
  );
  return response.data;
};

const migrateExistingOrganizations = async (
  organizationId: string
): Promise<any> => {
  const response = await axios.post(
    `${BASE}/migrate-existing-organizations`,
    null,
    {
      params: { organizationId },
    }
  );
  return response.data;
};

const isAdmin = async (
  organizationId: string
): Promise<{ isAdmin: boolean }> => {
  const response = await axios.get(`${BASE}/${organizationId}/is-admin`);
  return response.data;
};

export {
  getRoles,
  getMembers,
  inviteMember,
  getInvitations,
  acceptInvitation,
  getMyOrganizations,
  checkPermission,
  getMyRole,
  updateMemberRole,
  getStats,
  removeMember,
  migrateExistingOrganizations,
  isAdmin,
};
