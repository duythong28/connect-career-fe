import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  Home,
  User,
  Search,
  FileText,
  Calendar,
  Heart,
  MessageCircle,
  Brain,
  Settings,
  Building2,
  Plus,
  Briefcase,
  Users,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";
import { useOrganization } from "@/context/OrganizationContext";

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();
  const { myOrganizations } = useOrganization();
  const match = currentPath.match(/^\/company\/([^/]+)/);
  const companyId = match ? match[1] : undefined;

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

  const getCandidateMenuItems = () => [
    // { title: "Dashboard", url: ROUTES.CANDIDATE.DASHBOARD, icon: Home },
    { title: "Job Search", url: ROUTES.JOBS, icon: Search },
    { title: "My Profile", url: ROUTES.CANDIDATE.PROFILE, icon: User },
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
    // { title: "Career Assistant", url: ROUTES.CANDIDATE.CHATBOT, icon: Brain },
    // { title: "Settings", url: ROUTES.CANDIDATE.SETTINGS, icon: Settings },
  ];

  const getCompanyMenuItems = (id: string) => [
    {
      title: "Company Dashboard",
      url: "/company/" + id + ROUTES.COMPANY.DASHBOARD,
      icon: Home,
    },
    {
      title: "Company Profile",
      url: "/company/" + id + ROUTES.COMPANY.PROFILE,
      icon: Building2,
    },
    {
      title: "Post New Job",
      url: "/company/" + id + ROUTES.COMPANY.POST_JOB,
      icon: Plus,
    },
    {
      title: "My Jobs",
      url: "/company/" + id + ROUTES.COMPANY.JOBS,
      icon: Briefcase,
    },
    {
      title: "Pipeline",
      url: "/company/" + id + ROUTES.COMPANY.PIPELINE,
      icon: Users,
    },
    {
      title: "Find Candidates",
      url: "/company/" + id + ROUTES.COMPANY.CANDIDATES,
      icon: Search,
    },
    {
      title: "Interviews",
      url: "/company/" + id + ROUTES.COMPANY.INTERVIEWS,
      icon: Calendar,
    },
    {
      title: "Messages",
      url: "/company/" + id + ROUTES.COMPANY.MESSAGES,
      icon: MessageCircle,
    },
    // {
    //   title: "Recruiter Assistant",
    //   url: "/company/" + id + ROUTES.COMPANY.CHATBOT,
    //   icon: Brain,
    // },
    // {
    //   title: "Analytics",
    //   url: "/company/" + id + ROUTES.COMPANY.ANALYTICS,
    //   icon: BarChart3,
    // },
    // {
    //   title: "Settings",
    //   url: "/company/" + id + ROUTES.COMPANY.SETTINGS,
    //   icon: Settings,
    // },
  ];

  const getAdminMenuItems = () => [
    { title: "Dashboard", url: ROUTES.ADMIN.DASHBOARD, icon: Home },
    { title: "User Management", url: ROUTES.ADMIN.USERS, icon: Users },
    { title: "Content Management", url: ROUTES.ADMIN.CONTENT, icon: FileText },
    { title: "Job Approvals", url: ROUTES.ADMIN.JOBS, icon: CheckCircle },
    {
      title: "Company Management",
      url: ROUTES.ADMIN.COMPANIES,
      icon: Building2,
    },
    {
      title: "Reports & Violations",
      url: ROUTES.ADMIN.REPORTS,
      icon: AlertTriangle,
    },
    {
      title: "Revenue Management",
      url: ROUTES.ADMIN.REVENUE,
      icon: DollarSign,
    },
    { title: "Refunds", url: ROUTES.ADMIN.REFUNDS, icon: CreditCard },
    { title: "Analytics", url: ROUTES.ADMIN.ANALYTICS, icon: TrendingUp },
  ];

  const getMenuItems = () => {
    if (!user) return [];

    // Admin users only see admin menu
    if (user.username === "admin") {
      return getAdminMenuItems();
    }

    // Candidates can switch between candidate and company views
    // Determine which menu to show based on current path
    if (
      currentPath.startsWith("/company/") &&
      companyId &&
      myOrganizations?.some((org) => String(org.id) === String(companyId))
    ) {
      return getCompanyMenuItems(companyId);
    } else {
      return getCandidateMenuItems();
    }
  };

  const getMenuTitle = () => {
    if (!user) return "";

    if (user.username === "admin") {
      return "Admin Panel";
    }

    if (currentPath.startsWith("/company")) {
      return "Company Management";
    } else {
      return "Candidate Dashboard";
    }
  };

  const menuItems = getMenuItems();
  const menuTitle = getMenuTitle();

  if (!user) return null;

  return (
    <div
      className={`bg-white border-r border-gray-200 h-screen fixed left-0 top-[4.5rem] transition-all duration-200 z-40 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } w-64`}
    >
      <div className="p-6">
        {/* Menu Title */}
        {menuTitle && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">{menuTitle}</h2>
            {user.role !== "admin" && (
              <p className="text-sm text-gray-500">
                {currentPath.startsWith("/company")
                  ? "Manage your company and jobs"
                  : "Manage your profile and applications"}
              </p>
            )}
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = currentPath === item.url;
            return (
              <Link
                key={item.url}
                to={item.url}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                <span className="truncate">{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Role Switch for Candidates */}
        {user.role !== "admin" && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              Switch View
            </p>
            <div className="space-y-1">
              <Link
                to={ROUTES.JOBS}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentPath.startsWith("/candidate") &&
                  currentPath !== ROUTES.CANDIDATE.CREATE_ORGANIZATION
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <User className="mr-3 h-4 w-4" />
                Candidate View
              </Link>
              <Link
                to={ROUTES.CANDIDATE.CREATE_ORGANIZATION}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentPath.startsWith(ROUTES.CANDIDATE.CREATE_ORGANIZATION)
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <User className="mr-3 h-4 w-4" />
                Create Organization
              </Link>
              {myOrganizations &&
                myOrganizations.map((org) => (
                  <Link
                    key={org.id}
                    to={`/company/${org.id}/dashboard`}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      currentPath.startsWith(`/company/${org.id}`)
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Building2 className="mr-3 h-4 w-4" />
                    {org.name} View
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
