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
import { Edit, Trash2, Mail, Users, Check, X, Copy } from "lucide-react";

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

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    toast({
      title: "Token copied",
      description: "The invitation token has been copied to your clipboard.",
    });
  };

  const handleSaveRole = (memberId: string, newRoleId: string | null) => {
    const roleToSave = newRoleId || editingRoleId;

    if (
      roleToSave &&
      roleToSave !== members.find((m) => m.id === memberId)?.role.id
    ) {
      changeRoleMutation.mutate({ memberId, roleId: roleToSave });
    } else {
      setEditingMemberId(null);
      setEditingRoleId(null);
    }
  };

  const handleRemoveMember = (memberId: string) => {
    if (window.confirm("Are you sure you want to remove this member?")) {
      removeMemberMutation.mutate(memberId);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-6 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Organization Members
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your team, roles, and invitations here.
          </p>
        </div>

        {/* Invite Card */}
        <Card className="mb-6 border-border bg-card rounded-3xl shadow-none overflow-hidden">
          <CardHeader className="border-b border-border p-5">
            <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Invite New Member
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isOwner ? (
              <form
                className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
                onSubmit={handleInvite}
              >
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-muted-foreground ml-1">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                    className="border-border h-10 rounded-xl focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-muted-foreground ml-1">
                    Role
                  </label>
                  <Select
                    value={inviteRole}
                    onValueChange={setInviteRole}
                    disabled={!isOwner}
                  >
                    <SelectTrigger className="border-border h-10 rounded-xl focus:ring-2 focus:ring-primary">
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
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-muted-foreground ml-1">
                    Message
                  </label>
                  <Input
                    placeholder="Message (optional)"
                    value={inviteMessage}
                    onChange={(e) => setInviteMessage(e.target.value)}
                    className="border-border h-10 rounded-xl focus:ring-2 focus:ring-primary"
                    disabled={!isOwner}
                  />
                </div>
                <div>
                  <Button
                    type="submit"
                    disabled={
                      inviteMutation.isPending ||
                      !isOwner ||
                      !inviteRole ||
                      !inviteEmail
                    }
                    className="w-full h-10 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-none"
                    variant="default"
                  >
                    Send Invitation
                  </Button>
                </div>
              </form>
            ) : (
              <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm font-medium text-center">
                You do not have permission (Owner role required) to invite new
                members.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Team Members Card */}
        <Card className="mb-6 border-border bg-card rounded-3xl shadow-none overflow-hidden">
          <CardHeader className="border-b border-border p-5">
            <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Team Members
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="py-4 px-6 w-16"></th>
                  <th className="py-4 px-4 text-xs font-bold uppercase text-muted-foreground">
                    Name
                  </th>
                  <th className="py-4 px-4 text-xs font-bold uppercase text-muted-foreground">
                    Email
                  </th>
                  <th className="py-4 px-4 text-xs font-bold uppercase text-muted-foreground">
                    Role
                  </th>
                  <th className="py-4 px-4 text-xs font-bold uppercase text-muted-foreground">
                    Status
                  </th>
                  <th className="py-4 px-6 text-xs font-bold uppercase text-muted-foreground text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr
                    key={member.id}
                    className="group border-b border-border last:border-0 hover:bg-muted/10 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <Avatar className="h-9 w-9 rounded-xl">
                        <AvatarImage src={member.user.avatarUrl || undefined} />
                        <AvatarFallback className="bg-muted text-xs font-bold text-muted-foreground">
                          {member.user.fullName
                            ? member.user.fullName[0]
                            : member.user.email[0]}
                        </AvatarFallback>
                      </Avatar>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm font-bold text-foreground truncate max-w-[150px]">
                        {member.user.fullName ||
                          [member.user.firstName, member.user.lastName]
                            .filter(Boolean)
                            .join(" ") ||
                          member.user.username}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">
                      {member.user.email}
                    </td>
                    <td className="py-4 px-4">
                      {editingMemberId === member.id ? (
                        <Select
                          value={editingRoleId || member.role.id}
                          onValueChange={setEditingRoleId}
                        >
                          <SelectTrigger className="w-32 h-9 text-xs border-border rounded-xl">
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
                      ) : (
                        <Badge
                          variant="outline"
                          className="capitalize text-foreground font-semibold rounded-xl border-border px-3"
                        >
                          {member.role?.name}
                        </Badge>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        variant={
                          member.status === "active" ? "default" : "secondary"
                        }
                        className={`capitalize font-bold rounded-xl px-2.5 py-0.5 ${
                          member.status === "active"
                            ? "bg-[hsl(var(--brand-success))] hover:bg-[hsl(var(--brand-success))]/90"
                            : ""
                        }`}
                      >
                        {statusLabel[member.status] || member.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-end items-center gap-1">
                        {editingMemberId === member.id ? (
                          <>
                            <Button
                              size="icon"
                              variant="default"
                              onClick={() =>
                                handleSaveRole(member.id, editingRoleId)
                              }
                              className="h-8 w-8 bg-primary text-white rounded-xl"
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
                              className="h-8 w-8 text-muted-foreground rounded-xl"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => {
                                setEditingMemberId(member.id);
                                setEditingRoleId(member.role.id);
                              }}
                              disabled={!isOwner}
                              className="h-8 w-8 text-muted-foreground hover:text-primary rounded-xl"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleRemoveMember(member.id)}
                              disabled={!isOwner}
                              className="h-8 w-8 text-muted-foreground hover:text-destructive rounded-xl"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Pending Invitations Card */}
        <Card className="border-border bg-card rounded-3xl shadow-none overflow-hidden">
          <CardHeader className="border-b border-border p-5">
            <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Pending Invitations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="py-4 px-6 text-xs font-bold uppercase text-muted-foreground">
                    Email
                  </th>
                  <th className="py-4 px-4 text-xs font-bold uppercase text-muted-foreground">
                    Role
                  </th>
                  <th className="py-4 px-4 text-xs font-bold uppercase text-muted-foreground">
                    Status
                  </th>
                  <th className="py-4 px-4 text-xs font-bold uppercase text-muted-foreground">
                    Token
                  </th>
                  <th className="py-4 px-6 text-xs font-bold uppercase text-muted-foreground text-right">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody>
                {invitations.map((invite) => (
                  <tr
                    key={invite.id}
                    className="border-b border-border last:border-0 hover:bg-muted/10 transition-colors"
                  >
                    <td className="py-4 px-6 text-sm font-bold text-foreground">
                      {invite.email}
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        variant="outline"
                        className="text-foreground font-semibold rounded-xl border-border px-3"
                      >
                        {invite.role?.name}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        variant={
                          invite.status === "accepted" ? "default" : "secondary"
                        }
                        className={`capitalize font-bold rounded-xl px-2.5 py-0.5 ${
                          invite.status === "accepted"
                            ? "bg-[hsl(var(--brand-success))] hover:bg-[hsl(var(--brand-success))]/90"
                            : ""
                        }`}
                      >
                        {invite.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleCopyToken(invite.token)}
                        className="flex items-center gap-2 group hover:bg-muted/80 p-1 rounded-xl transition-colors text-left"
                        title="Click to copy token"
                      >
                        <span className="break-all text-[10px] font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded-lg group-hover:text-primary transition-colors">
                          {invite.token}
                        </span>
                        <Copy className="h-3 w-3 text-muted-foreground group-hover:text-primary shrink-0" />
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right text-xs text-muted-foreground font-medium">
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
    </div>
  );
}