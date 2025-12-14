// Cập nhật Header.tsx
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, Menu, User, LogOut, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { logout } from "@/api/endpoints/auth.api";
import { deleteCookie } from "@/api/client/axios";
import { queryClient } from "@/lib/queryClient";
import { ROUTES } from "@/constants/routes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationBell } from "./NotificationBell";

interface HeaderProps {
  onSidebarToggle: () => void;
  sidebarOpen: boolean;
  user: any;
}

const Header: React.FC<HeaderProps> = ({
  onSidebarToggle,
  sidebarOpen,
  user,
}) => {
  const navigate = useNavigate();
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

  const handleGoToNotifications = () => {
    navigate(ROUTES.CANDIDATE.NOTIFICATIONS);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          {user && (
            <Button
              variant="ghost"
              size="icon"
              aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
              onClick={onSidebarToggle}
              className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <Link to="/" className="flex items-center gap-x-2">
            <Briefcase className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold tracking-tight">Career</span>
          </Link>
        </div>
        <div className="flex items-center gap-x-4">
          {user ? (
            <>
              {user?.roles?.[0]?.name !== "admin" && (
                <NotificationBell
                  onGoToNotifications={handleGoToNotifications}
                />
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0 h-auto">
                    <div className="flex items-center gap-x-2">
                      <Avatar>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                          {user.firstName?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-base font-medium hidden sm:inline-block">
                        {user.firstName}
                      </span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {user.firstName}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={ROUTES.CANDIDATE.PROFILE}>
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="text-red-600 focus:text-red-700"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-x-2">
              <Button variant="outline" asChild size="sm" className="text-base">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild size="sm" className="text-base">
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
