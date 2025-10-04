import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, Menu } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

// Updated Header Component
const Header = () => {
  const navigate = useNavigate();
  const { user, switchRole } = useAuth();

  const getSidebarOpen = () => {
    const stored = localStorage.getItem("sidebarOpen");
    return stored ? JSON.parse(stored) : true;
  };
  const toggleSidebar = () => {
    const currentState = getSidebarOpen();
    const newState = !currentState;
    localStorage.setItem("sidebarOpen", JSON.stringify(newState));
    // Force re-render by dispatching a custom event
    window.dispatchEvent(new Event("sidebarToggle"));
  };

  const handleRoleChange = (newRole: "candidate" | "employer" | "admin") => {
    if (!user) return;

    switchRole(newRole);

    // Navigate to appropriate dashboard
    const dashboardPath =
      newRole === "candidate"
        ? "/candidate/dashboard"
        : newRole === "employer"
        ? "/employer/dashboard"
        : "/admin/dashboard";
    navigate(dashboardPath);
  };

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate("/");
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {user && (
            <Button variant="ghost" size="sm" onClick={toggleSidebar}>
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <Link to="/" className="flex items-center space-x-2">
            <Briefcase className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">TalentHub</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Select value={user.role} onValueChange={handleRoleChange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="candidate">Candidate</SelectItem>
                  <SelectItem value="employer">Employer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user.name}</span>
              </div>

              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="outline" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
