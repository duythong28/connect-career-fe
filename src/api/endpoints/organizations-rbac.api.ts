import axios from "../client/axios";
import {
  OrganizationRole,
  OrganizationMember,
  OrganizationInvitation,
  InviteMemberDTO,
  AcceptInvitationDTO,
  ChangeMemberRoleDTO,
  OrganizationMembership,
} from "../types/organizations-rbac.types";

export const getOrganizationRoles = async (
  organizationId: string
): Promise<OrganizationRole[]> => {
  const res = await axios.get(`/organizations-rbac/${organizationId}/roles`);
  return res.data;
};

export const getOrganizationMembers = async (
  organizationId: string
): Promise<OrganizationMember[]> => {
  const res = await axios.get(`/organizations-rbac/${organizationId}/members`);
  return res.data;
};

export const inviteOrganizationMember = async (
  organizationId: string,
  data: InviteMemberDTO
): Promise<OrganizationInvitation> => {
  const res = await axios.post(
    `/organizations-rbac/${organizationId}/invite`,
    data
  );
  return res.data;
};

export const getOrganizationInvitations = async (
  organizationId: string
): Promise<OrganizationInvitation[]> => {
  const res = await axios.get(
    `/organizations-rbac/${organizationId}/invitations`
  );
  return res.data;
};

export const acceptOrganizationInvitation = async (
  data: AcceptInvitationDTO
): Promise<OrganizationMember> => {
  const res = await axios.post(`/organizations-rbac/invitations/accept`, data);
  return res.data;
};

// Get organizations the current user is a member of
export const getMyOrganizations = async (): Promise<
  OrganizationMembership[]
> => {
  const res = await axios.get(`/organizations-rbac/me/organizations`);
  return res.data;
};

// Get current user's role in an organization
export const getMyOrganizationRole = async (
  organizationId: string
): Promise<OrganizationRole> => {
  const res = await axios.get(
    `/organizations-rbac/me/organizations/${organizationId}/role`
  );
  return res.data;
};

export const changeOrganizationMemberRole = async (
  organizationId: string,
  memberId: string,
  data: ChangeMemberRoleDTO
): Promise<OrganizationMember> => {
  const res = await axios.put(
    `/organizations-rbac/${organizationId}/members/${memberId}/role`,
    data
  );
  return res.data;
};

export const removeOrganizationMember = async (
  organizationId: string,
  memberId: string
): Promise<{ success: boolean }> => {
  const res = await axios.delete(
    `/organizations-rbac/${organizationId}/members/${memberId}`
  );
  return res.data;
};

// Get organization stats (RBAC)
export const getOrganizationRbacStats = async (
  organizationId: string
): Promise<any> => {
  const res = await axios.get(`/organizations-rbac/${organizationId}/stats`);
  return res.data;
};
