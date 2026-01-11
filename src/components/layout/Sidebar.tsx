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
  CreditCard,
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
    { title: "My Wallet", url: "/candidate/wallet", icon: Wallet },
    { title: "My Reports", url: ROUTES.CANDIDATE.MY_REPORTS, icon: Flag },
    {
      title: "AI Improve Resume",
      url: ROUTES.CANDIDATE.RESUME_IMPROVEMENT,
      icon: Brain,
    },
    {
      title: "AI Assistant",
      url: ROUTES.CANDIDATE.AI_AGENT_CHATBOT,
      icon: Sparkles,
    },
    {
      title: "AI Mock Interview",
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
    { title: "Billable Actions", url: "/admin/billable-actions", icon: FileText },
  ];

  const getMenuItems = (): MenuItem[] => {
    if (!user) return [];
    if (user?.roles?.[0]?.name === "admin") return getAdminMenuItems();
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
    if (user?.roles?.[0]?.name === "admin") return "Admin Panel";
    if (isMyCompanyPage) return "Company Dashboard";
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

  const renderMenuLinks = (isMobileView: boolean) => {
    return menuItems.map((item) => {
      const isActive = currentPath.includes(item.url);
      const LinkContent = (
        <Link
          key={item.url}
          to={item.url}
          className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ease-in-out
            ${
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-primary hover:bg-primary/10"
            }
            focus:outline-none focus:ring-2 focus:ring-primary/20
          `}
          aria-current={isActive ? "page" : undefined}
        >
          <item.icon
            className={`mr-3 h-5 w-5 flex-shrink-0 ${
              isActive ? "text-primary-foreground" : "text-current"
            }`}
            aria-hidden="true"
          />
          <span className="truncate">{item.title}</span>
        </Link>
      );

      return isMobileView ? (
        <SheetClose asChild key={item.url}>
          {LinkContent}
        </SheetClose>
      ) : (
        LinkContent
      );
    });
  };

  const renderSwitchViewLinks = (isMobileView: boolean) => {
    const linkBaseClass = `flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-colors duration-200 ease-in-out`;

    // Unified "Active" state style using Brand Primary instead of Green/Indigo
    const activeClass = "bg-primary text-primary-foreground shadow-sm";
    const inactiveClass =
      "text-muted-foreground hover:text-primary hover:bg-primary/10";

    const candidateViewLink = (
      <Link
        to={ROUTES.JOBS}
        className={`${linkBaseClass} ${
          currentPath.startsWith("/candidate") &&
          currentPath !== ROUTES.CANDIDATE.CREATE_ORGANIZATION &&
          currentPath !== ROUTES.CANDIDATE.JOIN_ORGANIZATION
            ? activeClass
            : inactiveClass
        }`}
      >
        <User className="mr-3 h-4 w-4" />
        Candidate View
      </Link>
    );

    const createOrgLink = (
      <Link
        to={ROUTES.CANDIDATE.CREATE_ORGANIZATION}
        className={`${linkBaseClass} ${
          currentPath.startsWith(ROUTES.CANDIDATE.CREATE_ORGANIZATION)
            ? activeClass
            : inactiveClass
        }`}
      >
        <Plus className="mr-3 h-4 w-4" />
        Create Organization
      </Link>
    );

    const joinOrgLink = (
      <Link
        to={ROUTES.CANDIDATE.JOIN_ORGANIZATION}
        className={`${linkBaseClass} ${
          currentPath.startsWith(ROUTES.CANDIDATE.JOIN_ORGANIZATION)
            ? activeClass
            : inactiveClass
        }`}
      >
        <Users className="mr-3 h-4 w-4" />
        Join Organization
      </Link>
    );

    const organizationLinks =
      myOrganizations &&
      myOrganizations.map((org) => (
        <Link
          key={org.organization.id}
          to={`/company/${org.organization.id}/dashboard`}
          className={`${linkBaseClass} ${
            currentPath.startsWith(`/company/${org.organization.id}`)
              ? activeClass
              : inactiveClass
          }`}
        >
          <Building2 className="mr-3 h-4 w-4" />
          {org.organization.name}
        </Link>
      ));

    const switcherView = (
      <div className="mt-auto pt-6 border-t border-border">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-4">
          Switch View
        </p>
        <div className="flex flex-col gap-y-1">
          {isMobileView ? (
            <>
              <SheetClose asChild>{candidateViewLink}</SheetClose>
              <SheetClose asChild>{createOrgLink}</SheetClose>
              <SheetClose asChild>{joinOrgLink}</SheetClose>
            </>
          ) : (
            <>
              {candidateViewLink}
              {createOrgLink}
              {joinOrgLink}
            </>
          )}
          {organizationLinks}
        </div>
      </div>
    );

    return switcherView;
  };

  // Sidebar content for desktop
  const desktopSidebarContent = (
    <nav className="flex flex-col h-full">
      <div className="mb-8 px-2">
        <h2 className="text-xl font-bold text-foreground tracking-tight">
          {menuTitle}
        </h2>
      </div>
      <div className="flex-1 flex flex-col gap-y-1">
        {renderMenuLinks(false)}
      </div>
      {user?.roles?.[0]?.name !== "admin" && renderSwitchViewLinks(false)}
    </nav>
  );

  // Sidebar content for mobile
  const mobileSidebarContent = (
    <nav className="flex flex-col h-full">
      <div className="mb-8 px-2">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">
          {menuTitle}
        </h2>
      </div>
      <div className="flex-1 flex flex-col gap-y-1">
        {renderMenuLinks(true)}
      </div>
      {user?.roles?.[0]?.name !== "admin" && renderSwitchViewLinks(true)}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      {!isMobile && open && (
        <aside
          className="flex flex-col bg-background border-r border-border fixed left-0 top-[4.5rem] w-64 z-40 h-[calc(100vh-4.5rem)] transition-all duration-300 ease-in-out"
          aria-label="Sidebar"
        >
          <div className="p-4 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
            {desktopSidebarContent}
          </div>
        </aside>
      )}

      {/* Mobile sidebar */}
      {isMobile && (
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetContent
            side="left"
            className="p-0 w-64 h-screen overflow-y-auto bg-background border-r border-border"
          >
            <div className="p-4">{mobileSidebarContent}</div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
};
