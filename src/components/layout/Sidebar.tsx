import React, { useState } from "react";
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

// Fixed Sidebar Component with Role-Specific Navigation
const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const getCandidateMenuItems = () => [
    { title: "Dashboard", url: "/candidate/dashboard", icon: Home },
    { title: "My Profile", url: "/candidate/profile", icon: User },
    { title: "Job Search", url: "/jobs", icon: Search },
    { title: "Applications", url: "/candidate/applications", icon: FileText },
    { title: "Interviews", url: "/candidate/interviews", icon: Calendar },
    { title: "Saved Jobs", url: "/candidate/saved", icon: Heart },
    { title: "Messages", url: "/candidate/messages", icon: MessageCircle },
    { title: "Career Assistant", url: "/candidate/chatbot", icon: Brain },
    { title: "Settings", url: "/candidate/settings", icon: Settings },
  ];

  const getEmployerMenuItems = () => [
    { title: "Dashboard", url: "/employer/dashboard", icon: Home },
    { title: "Company Profile", url: "/employer/company", icon: Building2 },
    { title: "Post New Job", url: "/employer/post-job", icon: Plus },
    { title: "My Jobs", url: "/employer/jobs", icon: Briefcase },
    { title: "Pipeline", url: "/employer/pipeline", icon: Users },
    { title: "Candidate Search", url: "/employer/candidates", icon: Search },
    { title: "Interviews", url: "/employer/interviews", icon: Calendar },
    { title: "Messages", url: "/employer/messages", icon: MessageCircle },
    { title: "Recruiter Assistant", url: "/employer/chatbot", icon: Brain },
    { title: "Analytics", url: "/employer/analytics", icon: BarChart3 },
    { title: "Settings", url: "/employer/settings", icon: Settings },
  ];

  const getAdminMenuItems = () => [
    { title: "Dashboard", url: "/admin/dashboard", icon: Home },
    { title: "User Management", url: "/admin/users", icon: Users },
    { title: "Content Management", url: "/admin/content", icon: FileText },
    { title: "Job Approvals", url: "/admin/jobs", icon: CheckCircle },
    { title: "Company Management", url: "/admin/companies", icon: Building2 },
    {
      title: "Reports & Violations",
      url: "/admin/reports",
      icon: AlertTriangle,
    },
    { title: "Revenue Management", url: "/admin/revenue", icon: DollarSign },
    { title: "Refunds", url: "/admin/refunds", icon: CreditCard },
    { title: "Analytics", url: "/admin/analytics", icon: TrendingUp },
  ];

  const getMenuItems = () => {
    if (!user) return [];
    switch (user.role) {
      case "candidate":
        return getCandidateMenuItems();
      case "employer":
        return getEmployerMenuItems();
      case "admin":
        return getAdminMenuItems();
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div
      className={`bg-white border-r border-gray-200 h-screen fixed left-0 top-16 transition-transform duration-200 z-40 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } w-64`}
    >
      <div className="p-6">
        <div className="space-y-1">
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
                <item.icon className="mr-3 h-5 w-5" />
                {item.title}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
