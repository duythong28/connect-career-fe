import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { acceptOrganizationInvitation } from "@/api/endpoints/organizations-rbac.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function OrganizationJoinPage() {
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data: { token: string }) => acceptOrganizationInvitation(data),
    onSuccess: (data) => {
      const organizationId = data.organizationId;
      navigate(`/company/${organizationId}/dashboard`);
      toast({ title: "Joined organization successfully!" });
    },
    onError: () =>
      toast({ title: "Invalid or expired invitation", variant: "destructive" }),
  });

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast({ title: "Token is required", variant: "destructive" });
      return;
    }
    mutation.mutate({ token });
  };

  return (
    <div className="max-w-md mx-auto py-16">
      <Card>
        <CardHeader>
          <CardTitle>Join Organization</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleJoin}>
            <Input
              placeholder="Invitation Token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
            <Button type="submit" disabled={mutation.isPending}>
              Join
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
