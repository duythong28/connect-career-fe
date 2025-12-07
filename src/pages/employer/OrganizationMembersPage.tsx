import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getOrganizationMembers,
  getOrganizationRoles,
  getOrganizationInvitations,
  inviteOrganizationMember,
  changeOrganizationMemberRole,
  removeOrganizationMember,
} from "@/api/endpoints/organizations-rbac.api";
import {
  OrganizationMember,
  OrganizationRole,
  OrganizationInvitation,
  InviteMemberDTO,
} from "@/api/types/organizations-rbac.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useOrganization } from "@/context/OrganizationContext";
import { useAuth } from "@/hooks/useAuth";
import { Edit, Trash2, Mail, Users, Check } from "lucide-react";

const statusLabel: Record<string, string> = {
  active: "Active",
  invited: "Invited",
  removed: "Removed",
};

export default function OrganizationMembersPage() {
  const { jobId, companyId } = useParams();
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<string>("");
  const [inviteMessage, setInviteMessage] = useState("");
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const { myOrganizations } = useOrganization();
  const { user } = useAuth();

  const myMembership = myOrganizations?.find(
    (org) => org.organization.id === companyId && org.userId === user?.id
  );
  const isOwner = myMembership?.role?.name === "owner";

  const { data: members = [], refetch: refetchMembers } = useQuery<
    OrganizationMember[]
  >({
    queryKey: ["org-members", companyId],
    queryFn: () => getOrganizationMembers(companyId!),
    enabled: !!companyId,
  });

  const { data: roles = [] } = useQuery<OrganizationRole[]>({
    queryKey: ["org-roles", companyId],
    queryFn: () => getOrganizationRoles(companyId!),
    enabled: !!companyId,
  });

  const { data: invitations = [], refetch: refetchInvites } = useQuery<
    OrganizationInvitation[]
  >({
    queryKey: ["org-invitations", companyId],
    queryFn: () => getOrganizationInvitations(companyId!),
    enabled: !!companyId,
  });

  const inviteMutation = useMutation({
    mutationFn: (data: InviteMemberDTO) =>
      inviteOrganizationMember(companyId!, data),
    onSuccess: () => {
      toast({ title: "Invitation sent!" });
      setInviteEmail("");
      setInviteRole("");
      setInviteMessage("");
      refetchInvites();
    },
    onError: () => toast({ title: "Failed to invite", variant: "destructive" }),
  });

  const changeRoleMutation = useMutation({
    mutationFn: ({ memberId, roleId }: { memberId: string; roleId: string }) =>
      changeOrganizationMemberRole(companyId!, memberId, { roleId }),
    onSuccess: () => {
      toast({ title: "Role updated!" });
      setEditingMemberId(null);
      setEditingRoleId(null);
      refetchMembers();
    },
    onError: () =>
      toast({ title: "Failed to update role", variant: "destructive" }),
  });

  const removeMemberMutation = useMutation({
    mutationFn: (memberId: string) =>
      removeOrganizationMember(companyId!, memberId),
    onSuccess: () => {
      toast({ title: "Member removed!" });
      refetchMembers();
    },
    onError: () =>
      toast({ title: "Failed to remove member", variant: "destructive" }),
  });

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteRole) {
      toast({ title: "Email and role are required", variant: "destructive" });
      return;
    }
    inviteMutation.mutate({
      email: inviteEmail,
      roleId: inviteRole,
      message: inviteMessage || undefined,
    });
  };

  const handleRoleChange = (memberId: string, roleId: string) => {
    changeRoleMutation.mutate({ memberId, roleId });
  };

  const handleRemoveMember = (memberId: string) => {
    if (window.confirm("Are you sure you want to remove this member?")) {
      removeMemberMutation.mutate(memberId);
    }
  };

  const handleSaveRole = (memberId: string, newRoleId: string | null) => {
    const roleToSave = newRoleId || editingRoleId;

    if (
      roleToSave &&
      roleToSave !== members.find((m) => m.id === memberId)?.role.id
    ) {
      handleRoleChange(memberId, roleToSave);
    } else {
      setEditingMemberId(null);
      setEditingRoleId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 font-sans bg-gray-50 min-h-screen">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Organization Members
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your team, roles, and invitations here.
        </p>
      </div>

      <Card className="mb-6 border border-gray-200 shadow-sm rounded-xl">
        <CardHeader className="border-b border-gray-100 p-4">
          <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Mail className="h-5 w-5 text-[#0EA5E9]" />
            Invite New Member
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {isOwner ? (
            <form
              className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end"
              onSubmit={handleInvite}
            >
              <div className="md:col-span-1">
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                  className="border-gray-300 h-10"
                />
              </div>
              <div className="md:col-span-1">
                <Select
                  value={inviteRole}
                  onValueChange={setInviteRole}
                  disabled={!isOwner}
                >
                  <SelectTrigger className="border-gray-300 h-10">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-1">
                <Input
                  placeholder="Message (optional)"
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  className="border-gray-300 h-10"
                  disabled={!isOwner}
                />
              </div>
              <div className="md:col-span-1">
                <Button
                  type="submit"
                  disabled={
                    inviteMutation.isPending ||
                    !isOwner ||
                    !inviteRole ||
                    !inviteEmail
                  }
                  className="w-full bg-[#0EA5E9] hover:bg-[#0284c7] font-bold h-10"
                >
                  Send Invitation
                </Button>
              </div>
            </form>
          ) : (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
              You do not have permission (Owner role required) to invite new
              members.
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6 border border-gray-200 shadow-sm rounded-xl">
        <CardHeader className="border-b border-gray-100 p-4">
          <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Users className="h-5 w-5 text-[#0EA5E9]" />
            Team Members
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-xs font-bold text-gray-600 uppercase bg-gray-50">
                <th className="py-3 px-4 w-12"></th>
                <th className="py-3 px-4 min-w-[120px]">Name</th>
                <th className="py-3 px-4 min-w-[150px]">Email</th>
                <th className="py-3 px-4 min-w-[150px]">Role</th>
                <th className="py-3 px-4 w-20">Status</th>
                <th className="py-3 px-4 w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr
                  key={member.id}
                  className="align-middle border-b last:border-0 hover:bg-gray-50/50"
                >
                  <td className="py-3 px-4">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={member.user.avatarUrl || undefined} />
                      <AvatarFallback className="bg-gray-200 text-xs font-bold">
                        {member.user.fullName
                          ? member.user.fullName[0]
                          : member.user.email[0]}
                      </AvatarFallback>
                    </Avatar>
                  </td>
                  <td className="py-3 px-4 text-sm font-semibold text-gray-800">
                    <div className="truncate">
                      {member.user.fullName ||
                        [member.user.firstName, member.user.lastName]
                          .filter(Boolean)
                          .join(" ") ||
                        member.user.username}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {member.user.email}
                  </td>
                  <td className="py-3 px-4">
                    {editingMemberId === member.id ? (
                      <div className="flex gap-2 items-center">
                        <Select
                          value={editingRoleId || member.role.id}
                          onValueChange={setEditingRoleId}
                          disabled={changeRoleMutation.isPending || !isOwner}
                        >
                          <SelectTrigger className="w-32 h-9 text-xs border-gray-300">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role.id} value={role.id}>
                                {role.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <Badge
                        variant="outline"
                        className="capitalize text-gray-800 font-medium"
                      >
                        {member.role?.name}
                      </Badge>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        member.status === "active"
                          ? "default"
                          : member.status === "invited"
                          ? "secondary"
                          : "destructive"
                      }
                      className={`capitalize font-bold ${
                        member.status === "active"
                          ? "bg-green-500 hover:bg-green-600"
                          : ""
                      }`}
                    >
                      {statusLabel[member.status] || member.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    {editingMemberId === member.id ? (
                      <div className="flex gap-1 items-center">
                        <Button
                          size="icon"
                          onClick={() =>
                            handleSaveRole(member.id, editingRoleId)
                          }
                          disabled={changeRoleMutation.isPending || !isOwner}
                          className="h-8 w-8 p-0 bg-[#0EA5E9] hover:bg-[#0284c7] text-white"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setEditingMemberId(null);
                            setEditingRoleId(null);
                          }}
                          className="h-8 w-8 p-0 text-gray-700 hover:bg-gray-200"
                        >
                          <span className="text-xl leading-none">×</span>
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setEditingMemberId(member.id);
                            setEditingRoleId(member.role.id);
                          }}
                          disabled={!isOwner}
                          className="h-8 w-8 p-1 text-gray-500 hover:text-[#0EA5E9]"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleRemoveMember(member.userId)}
                          disabled={removeMemberMutation.isPending || !isOwner}
                          className="h-8 w-8 p-1 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 shadow-sm rounded-xl">
        <CardHeader className="border-b border-gray-100 p-4">
          <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Mail className="h-5 w-5 text-[#0EA5E9]" />
            Pending Invitations
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-xs font-bold text-gray-600 uppercase bg-gray-50">
                <th className="py-3 px-4 min-w-[150px]">Email</th>
                <th className="py-3 px-4 min-w-[100px]">Role</th>
                <th className="py-3 px-4 w-20">Status</th>
                <th className="py-3 px-4 min-w-[200px]">Token</th>
                <th className="py-3 px-4 min-w-[120px]">Created At</th>
              </tr>
            </thead>
            <tbody>
              {invitations.map((invite) => (
                <tr
                  key={invite.id}
                  className="border-b last:border-0 hover:bg-gray-50/50"
                >
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {invite.email}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant="outline"
                      className="text-gray-800 font-medium"
                    >
                      {invite.role?.name}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 capitalize">
                    <Badge
                      variant={
                        invite.status === "pending"
                          ? "secondary"
                          : invite.status === "accepted"
                          ? "default"
                          : "destructive"
                      }
                      className={`capitalize font-bold ${
                        invite.status === "accepted"
                          ? "bg-green-500 hover:bg-green-600"
                          : ""
                      }`}
                    >
                      {invite.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <span className="break-all text-xs font-mono text-gray-500">
                      {invite.token}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-500">
                    {invite.createdAt
                      ? new Date(invite.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
