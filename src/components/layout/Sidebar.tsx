import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  User,
  Search,
  FileText,
  Calendar,
  Heart,
  MessageCircle,
  Brain,
  Building2,
  Plus,
  Briefcase,
  Users,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  CreditCard,
  TrendingUp,
  Flag,
  Wallet,
  Sparkles,
  Mic,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";
import { useOrganization } from "@/context/OrganizationContext";
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

interface MenuItem {
  title: string;
  url: string;
  icon: React.ElementType;
}

interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ open, onOpenChange }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { user } = useAuth();
  const { myOrganizations } = useOrganization();
  const match = currentPath.match(/^\/company\/([^/]+)/);
  const companyId = match ? match[1] : undefined;
  const isMobile = useIsMobile();

  const getCandidateMenuItems = (id: string): MenuItem[] => [
    { title: "Job Search", url: ROUTES.JOBS, icon: Search },
    { title: "My Profile", url: `/candidate/profile/${id}`, icon: User },
    {
      title: "Applications",
      url: ROUTES.CANDIDATE.APPLICATIONS,
      icon: FileText,
    },
    { title: "Interviews", url: ROUTES.CANDIDATE.INTERVIEWS, icon: Calendar },
    { title: "Saved Jobs", url: ROUTES.CANDIDATE.SAVED_JOBS, icon: Heart },
    { title: "Messages", url: ROUTES.CANDIDATE.MESSAGES, icon: MessageCircle },
    {
      title: "Imrpove Resume",
      url: ROUTES.CANDIDATE.RESUME_IMPROVEMENT,
      icon: Brain,
    },
    { title: "My Wallet", url: "/candidate/wallet", icon: Wallet },
    { title: "My Reports", url: ROUTES.CANDIDATE.MY_REPORTS, icon: Flag },
    {
      title: "AI Assistant",
      url: ROUTES.CANDIDATE.AI_AGENT_CHATBOT,
      icon: Sparkles,
    },
    {
      title: "AI Mock Interview", // Add this
      url: ROUTES.CANDIDATE.AI_MOCK_INTERVIEW,
      icon: Mic,
    },
  ];

  const getCompanyMenuItems = (id: string): MenuItem[] => [
    {
      title: "Company Dashboard",
      url: `/company/${id}${ROUTES.COMPANY.DASHBOARD}`,
      icon: Home,
    },
    {
      title: "Company Profile",
      url: `/company/${id}/profile`,
      icon: Building2,
    },
    {
      title: "Post New Job",
      url: `/company/${id}${ROUTES.COMPANY.POST_JOB}`,
      icon: Plus,
    },
    {
      title: "My Jobs",
      url: `/company/${id}${ROUTES.COMPANY.JOBS}`,
      icon: Briefcase,
    },
    {
      title: "Pipeline",
      url: `/company/${id}${ROUTES.COMPANY.PIPELINE}`,
      icon: Users,
    },
    {
      title: "Find Candidates",
      url: `/company/${id}${ROUTES.COMPANY.CANDIDATES}`,
      icon: Search,
    },
    {
      title: "Interviews",
      url: `/company/${id}${ROUTES.COMPANY.INTERVIEWS}`,
      icon: Calendar,
    },
    {
      title: "Members",
      url: `/company/${id}${ROUTES.COMPANY.MEMBERS}`,
      icon: Users,
    },
    {
      title: "Messages",
      url: `/company/${id}${ROUTES.COMPANY.MESSAGES}`,
      icon: MessageCircle,
    },
    {
      title: "AI Assistant",
      url: `/company/${id}${ROUTES.COMPANY.CHATBOT}`,
      icon: Sparkles,
    },
  ];

  const getAdminMenuItems = (): MenuItem[] => [
    { title: "Dashboard", url: ROUTES.ADMIN.DASHBOARD, icon: Home },
    { title: "User Management", url: ROUTES.ADMIN.USERS, icon: Users },
    {
      title: "Company Management",
      url: ROUTES.ADMIN.COMPANIES,
      icon: Building2,
    },
    { title: "Job Management", url: ROUTES.ADMIN.JOBS, icon: CheckCircle },

    {
      title: "Reports & Violations",
      url: ROUTES.ADMIN.REPORTS,
      icon: AlertTriangle,
    },
    { title: "Wallet Management", url: "/admin/wallets", icon: Wallet },
    { title: "Refund Management", url: "/admin/refunds", icon: CreditCard },
  ];

  const getMenuItems = (): MenuItem[] => {
    if (!user) return [];
    if (user.username === "admin") return getAdminMenuItems();
    if (
      currentPath.startsWith("/company/") &&
      companyId &&
      myOrganizations?.some(
        (org) => String(org.organization.id) === String(companyId)
      )
    ) {
      return getCompanyMenuItems(companyId);
    }
    return getCandidateMenuItems(user.candidateProfileId);
  };

  const getMenuTitle = (isMyCompanyPage: boolean): string => {
    if (!user) return "";
    if (user.username === "admin") return "Admin Panel";
    if (isMyCompanyPage) return "Company Management";
    return "Candidate Dashboard";
  };

  const menuItems = getMenuItems();
  const isMyCompanyPage =
    currentPath.startsWith("/company") &&
    companyId &&
    myOrganizations?.some(
      (org) => String(org.organization.id) === String(companyId)
    );

  const menuTitle = getMenuTitle(isMyCompanyPage);

  if (!user) return null;

  // Sidebar content for desktop (NO SheetClose)
  const desktopSidebarContent = (
    <nav className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900">
          {menuTitle}
        </h2>
        {user.role !== "admin" && (
          <p className="text-sm md:text-base text-gray-500 mt-1">
            {isMyCompanyPage
              ? "Manage your company and jobs"
              : "Manage your profile and applications"}
          </p>
        )}
      </div>
      <div className="flex-1 flex flex-col gap-y-1">
        {menuItems.map((item) => {
          const isActive = currentPath === item.url;
          return (
            <Link
              key={item.url}
              to={item.url}
              className={`flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors
                ${
                  isActive
                    ? "bg-primary/90 text-primary-foreground shadow"
                    : "text-gray-700 hover:text-primary hover:bg-gray-100"
                }
                focus:outline-none focus:ring-2 focus:ring-primary/40
              `}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon
                className="mr-3 h-5 w-5 flex-shrink-0"
                aria-hidden="true"
              />
              <span className="truncate">{item.title}</span>
            </Link>
          );
        })}
      </div>
      {user.role !== "admin" && (
        <div className="mt-auto pt-6 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Switch View
          </p>
          <div className="flex flex-col gap-y-1">
            <Link
              to={ROUTES.JOBS}
              className={`flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors
                ${
                  currentPath.startsWith("/candidate") &&
                  currentPath !== ROUTES.CANDIDATE.CREATE_ORGANIZATION &&
                  currentPath !== ROUTES.CANDIDATE.JOIN_ORGANIZATION
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-700 hover:text-primary hover:bg-gray-100"
                }
              `}
            >
              <User className="mr-3 h-4 w-4" />
              Candidate View
            </Link>
            <Link
              to={ROUTES.CANDIDATE.CREATE_ORGANIZATION}
              className={`flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors
                ${
                  currentPath.startsWith(ROUTES.CANDIDATE.CREATE_ORGANIZATION)
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-700 hover:text-primary hover:bg-gray-100"
                }
              `}
            >
              <User className="mr-3 h-4 w-4" />
              Create Organization
            </Link>
            <Link
              to={ROUTES.CANDIDATE.JOIN_ORGANIZATION}
              className={`flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors
                  ${
                    currentPath.startsWith(ROUTES.CANDIDATE.JOIN_ORGANIZATION)
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-700 hover:text-primary hover:bg-gray-100"
                  }
                `}
            >
              <User className="mr-3 h-4 w-4" />
              Join Organization
            </Link>
            {myOrganizations &&
              myOrganizations.map((org) => (
                <Link
                  key={org.organization.id}
                  to={`/company/${org.organization.id}/dashboard`}
                  className={`flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors
          ${
            currentPath.startsWith(`/company/${org.organization.id}`)
              ? "bg-green-50 text-green-700 border border-green-200"
              : "text-gray-700 hover:text-primary hover:bg-gray-100"
          }
        `}
                >
                  <Building2 className="mr-3 h-4 w-4" />
                  {org.organization.name} View
                </Link>
              ))}
          </div>
        </div>
      )}
    </nav>
  );

  // Sidebar content for mobile (WITH SheetClose)
  const mobileSidebarContent = (
    <nav className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
          {menuTitle}
        </h2>
        {user.role !== "admin" && (
          <p className="text-base md:text-lg text-gray-500 mt-1">
            {currentPath.startsWith("/company")
              ? "Manage your company and jobs"
              : "Manage your profile and applications"}
          </p>
        )}
      </div>
      <div className="flex-1 flex flex-col gap-y-1">
        {menuItems.map((item) => {
          const isActive = currentPath === item.url;
          return (
            <SheetClose asChild key={item.url}>
              <Link
                to={item.url}
                className={`flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors
                  ${
                    isActive
                      ? "bg-primary/90 text-primary-foreground shadow"
                      : "text-gray-700 hover:text-primary hover:bg-gray-100"
                  }
                  focus:outline-none focus:ring-2 focus:ring-primary/40
                `}
                aria-current={isActive ? "page" : undefined}
              >
                <item.icon
                  className="mr-3 h-5 w-5 flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="truncate">{item.title}</span>
              </Link>
            </SheetClose>
          );
        })}
      </div>
      {user.role !== "admin" && (
        <div className="mt-auto pt-6 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Switch View
          </p>
          <div className="flex flex-col gap-y-1">
            <SheetClose asChild>
              <Link
                to={ROUTES.JOBS}
                className={`flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors
                  ${
                    currentPath.startsWith("/candidate") &&
                    currentPath !== ROUTES.CANDIDATE.CREATE_ORGANIZATION &&
                    currentPath !== ROUTES.CANDIDATE.JOIN_ORGANIZATION
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-700 hover:text-primary hover:bg-gray-100"
                  }
                `}
              >
                <User className="mr-3 h-4 w-4" />
                Candidate View
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                to={ROUTES.CANDIDATE.CREATE_ORGANIZATION}
                className={`flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors
                  ${
                    currentPath.startsWith(ROUTES.CANDIDATE.CREATE_ORGANIZATION)
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-700 hover:text-primary hover:bg-gray-100"
                  }
                `}
              >
                <User className="mr-3 h-4 w-4" />
                Create Organization
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                to={ROUTES.CANDIDATE.JOIN_ORGANIZATION}
                className={`flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors
                  ${
                    currentPath.startsWith(ROUTES.CANDIDATE.JOIN_ORGANIZATION)
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-700 hover:text-primary hover:bg-gray-100"
                  }
                `}
              >
                <User className="mr-3 h-4 w-4" />
                Join Organization
              </Link>
            </SheetClose>
            {myOrganizations &&
              myOrganizations.map((org) => (
                <Link
                  key={org.organization.id}
                  to={`/company/${org.organization.id}/dashboard`}
                  className={`flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors
          ${
            currentPath.startsWith(`/company/${org.organization.id}`)
              ? "bg-green-50 text-green-700 border border-green-200"
              : "text-gray-700 hover:text-primary hover:bg-gray-100"
          }
        `}
                >
                  <Building2 className="mr-3 h-4 w-4" />
                  {org.organization.name} View
                </Link>
              ))}
          </div>
        </div>
      )}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar (no SheetClose) */}
      {!isMobile && open && (
        <aside
          className="flex flex-col bg-white border-r border-gray-200 fixed left-0 top-[4.5rem] w-64 z-40 h-[calc(100vh-4.5rem)]"
          aria-label="Sidebar"
        >
          <div className="p-6 overflow-y-auto h-full">
            {desktopSidebarContent}
          </div>
        </aside>
      )}
      {/* Mobile sidebar (Sheet with SheetClose) */}
      {isMobile && (
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetContent
            side="left"
            className="p-0 w-64 h-screen overflow-y-auto"
          >
            <div className="p-6">{mobileSidebarContent}</div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
};
