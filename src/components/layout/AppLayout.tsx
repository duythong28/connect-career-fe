import { useEffect, useState } from "react";
import { UserRole } from "@/lib/types";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
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
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const stored = localStorage.getItem("sidebarOpen");
    return stored ? JSON.parse(stored) : true;
  });

  useEffect(() => {
    const handleSidebarToggle = () => {
      const stored = localStorage.getItem("sidebarOpen");
      setSidebarOpen(stored ? JSON.parse(stored) : true);
    };

    window.addEventListener("sidebarToggle", handleSidebarToggle);
    handleSidebarToggle();

    return () => {
      window.removeEventListener("sidebarToggle", handleSidebarToggle);
    };
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex min-h-screen flex-row pt-[4.5rem] w-full">
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
  );
}
