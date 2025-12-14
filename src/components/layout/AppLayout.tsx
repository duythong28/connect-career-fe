import * as React from "react";
import Header from "./Header";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(
    () => !!user && window.innerWidth >= 640
  );

  React.useEffect(() => {
    if (!user) setSidebarOpen(false);
  }, [user]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      <Header
        onSidebarToggle={() => setSidebarOpen((open) => !open)}
        sidebarOpen={sidebarOpen}
        user={user}
      />
      {user && <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />}
      <div className="flex-1 mt-[4.5rem] flex flex-row overflow-hidden">
        <main
          className={cn(
            "flex-1 min-w-0 overflow-y-auto transition-all duration-200 text-base",
            user && sidebarOpen ? "sm:ml-64" : ""
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
