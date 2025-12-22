import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { acceptOrganizationInvitation } from "@/api/endpoints/organizations-rbac.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

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
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center p-6 animate-fade-in">
      <Card className="w-full max-w-md bg-card border-border rounded-3xl shadow-none overflow-hidden">
        <CardHeader className="p-8 pb-4 text-center">
          <CardTitle className="text-2xl font-bold text-foreground">
            Join Organization
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Enter your invitation token to access the organization dashboard
          </p>
        </CardHeader>
        <CardContent className="p-8 pt-4">
          <form className="flex flex-col gap-6" onSubmit={handleJoin}>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground ml-1">
                Invitation Token
              </label>
              <Input
                placeholder="Invitation Token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                className="h-10 rounded-xl border-border focus:ring-2 focus:ring-primary bg-background transition-all"
              />
            </div>
            <Button 
              type="submit" 
              variant="default"
              disabled={mutation.isPending}
              className="h-10 w-full rounded-xl font-bold transition-all"
            >
              {mutation.isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Joining...
                </div>
              ) : (
                "Join"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}