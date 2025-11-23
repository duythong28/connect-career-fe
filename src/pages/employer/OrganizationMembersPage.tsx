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

// Enum-to-label mapping for status
const statusLabel: Record<string, string> = {
  active: "Active",
  invited: "Invited",
  removed: "Removed",
};

export default function OrganizationMembersPage() {
  const { companyId } = useParams();
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

  // Fetch members, roles, invitations
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

  // Invite mutation
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

  // Change member role mutation
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

  // Remove member mutation
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

  // Responsive highlight area
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      {/* Highlight area */}
      <div className="rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 p-6 mb-8 shadow-sm">
        <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-blue-900 mb-2">
          Organization Members
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-blue-700">
          Manage your team, roles, and invitations here.
        </p>
      </div>

      {/* Invite Member */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Invite Member</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-4 sm:flex-row sm:items-end"
            onSubmit={handleInvite}
          >
            <Input
              type="email"
              placeholder="Email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              required
              className="text-base"
              disabled={!isOwner}
            />
            <Select value={inviteRole} onValueChange={setInviteRole}>
              <SelectTrigger className="w-48">
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
            <Input
              placeholder="Message (optional)"
              value={inviteMessage}
              onChange={(e) => setInviteMessage(e.target.value)}
              className="text-base"
            />
            <Button
              type="submit"
              disabled={inviteMutation.isPending}
              className="w-full sm:w-auto"
            >
              Invite
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Members</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2">Avatar</th>
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Role</th>
                <th className="py-2">Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr
                  key={member.id}
                  className="align-top border-b last:border-0"
                >
                  <td className="py-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.user.avatarUrl || undefined} />
                      <AvatarFallback>
                        {member.user.fullName
                          ? member.user.fullName[0]
                          : member.user.email[0]}
                      </AvatarFallback>
                    </Avatar>
                  </td>
                  <td className="py-2 min-w-[120px]">
                    <div className="truncate">
                      {member.user.fullName ||
                        [member.user.firstName, member.user.lastName]
                          .filter(Boolean)
                          .join(" ") ||
                        member.user.username}
                    </div>
                  </td>
                  <td className="py-2">{member.user.email}</td>
                  <td className="py-2 min-w-[100px]">
                    {editingMemberId === member.id ? (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Select
                          value={editingRoleId || member.role.id}
                          onValueChange={setEditingRoleId}
                          disabled={changeRoleMutation.isPending}
                        >
                          <SelectTrigger className="w-32">
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
                        <Button
                          size="sm"
                          onClick={() => {
                            if (
                              editingRoleId &&
                              editingRoleId !== member.role.id
                            ) {
                              handleRoleChange(member.userId, editingRoleId);
                            } else {
                              setEditingMemberId(null);
                              setEditingRoleId(null);
                            }
                          }}
                          disabled={changeRoleMutation.isPending || !isOwner}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setEditingMemberId(null);
                            setEditingRoleId(null);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Badge variant="outline" className="capitalize">
                        {member.role?.name}
                      </Badge>
                    )}
                  </td>
                  <td className="py-2">
                    <Badge
                      variant={
                        member.status === "active"
                          ? "default"
                          : member.status === "invited"
                          ? "secondary"
                          : "destructive"
                      }
                      className="capitalize"
                    >
                      {statusLabel[member.status] || member.status}
                    </Badge>
                  </td>
                  <td className="py-2">
                    {editingMemberId === member.id ? null : (
                      <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingMemberId(member.id);
                            setEditingRoleId(member.role.id);
                          }}
                          disabled={!isOwner}
                        >
                          Edit Role
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRemoveMember(member.userId)}
                          disabled={removeMemberMutation.isPending || !isOwner}
                        >
                          Remove
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

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">
            Pending Invitations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2">Email</th>
                  <th className="py-2">Role</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Token</th>
                  <th className="py-2">Created At</th>
                </tr>
              </thead>
              <tbody>
                {invitations.map((invite) => (
                  <tr key={invite.id} className="border-b last:border-0">
                    <td className="py-2">{invite.email}</td>
                    <td className="py-2">
                      <Badge variant="outline">{invite.role?.name}</Badge>
                    </td>
                    <td className="py-2 capitalize">
                      <Badge
                        variant={
                          invite.status === "pending"
                            ? "secondary"
                            : invite.status === "accepted"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {invite.status}
                      </Badge>
                    </td>
                    <td className="py-2">
                      <span className="break-all text-xs">{invite.token}</span>
                    </td>
                    <td className="py-2">
                      {invite.createdAt
                        ? new Date(invite.createdAt).toLocaleString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
