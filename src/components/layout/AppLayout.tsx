import * as React from "react";
import Header from "./Header";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/hooks/useAuth";

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
    <div className="min-h-screen bg-gray-50">
      <Header
        onSidebarToggle={() => setSidebarOpen((open) => !open)}
        sidebarOpen={sidebarOpen}
        user={user}
      />
      {user && <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />}
      <div className="flex min-h-screen flex-row pt-[4.5rem] w-full">
        <main
          className={`flex-1 min-w-0 transition-all duration-200
    ${user && sidebarOpen ? "sm:ml-64" : ""}
    text-base
  `}
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
