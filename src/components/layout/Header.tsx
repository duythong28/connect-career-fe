import { Link } from "react-router-dom";
import { Briefcase, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { logout } from "@/api/endpoints/auth.api";
import { deleteCookie } from "@/api/client/axios";
import { queryClient } from "@/lib/queryClient";
import { ROUTES } from "@/constants/routes";

const Header = () => {
  const { user } = useAuth();

  const getSidebarOpen = () => {
    const stored = localStorage.getItem("sidebarOpen");
    return stored ? JSON.parse(stored) : true;
  };
  const toggleSidebar = () => {
    const currentState = getSidebarOpen();
    const newState = !currentState;
    localStorage.setItem("sidebarOpen", JSON.stringify(newState));
    window.dispatchEvent(new Event("sidebarToggle"));
  };
  const { mutate: logoutMutate, isPending: isLoggingOut } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      queryClient.clear();
      toast({
        title: "Logged out successfully",
        description: "You have been successfully logged out",
      });
      window.location.href = ROUTES.LOGIN;
    },
    onError: (error: any) => {
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      queryClient.clear();

      toast({
        title: "Logout failed",
        description:
          error?.response?.data?.message ||
          "There was an error logging out. Please try again.",
        variant: "destructive",
      });

      window.location.href = ROUTES.LOGIN;
    },
  });

  const handleLogout = () => {
    logoutMutate();
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
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.firstName.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user.firstName}</span>
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
