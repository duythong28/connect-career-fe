import { useState } from "react";
import { UserRole } from "@/lib/types";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { RoleSwitcher } from "./RoleSwitcher";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useAuth } from "@/hooks/useAuth";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user } = useAuth();
  const getSidebarOpen = () => {
    const stored = localStorage.getItem("sidebarOpen");
    return stored ? JSON.parse(stored) : true;
  };

  const sidebarOpen = getSidebarOpen();
  return (
    <div className="App">
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="flex pt-16">
          {user && <Sidebar />}

          <main
            className={`flex-1 ${
              user ? (sidebarOpen ? "ml-64" : "ml-0") : ""
            } transition-all duration-200`}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
