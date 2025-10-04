'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { 
  User, Briefcase, Building2, Users, Search, MapPin, DollarSign, Clock, 
  Eye, Send, Upload, Edit, Trash2, Plus, Menu, X, ChevronRight, 
  Home, Star, Award, Globe, Phone, Mail, FileText, CheckCircle,
  ArrowLeft, Filter, Heart, Bell, Settings, Share, Calendar,
  MessageCircle, Shield, TrendingUp, BarChart3, UserCheck,
  Ban, AlertTriangle, CreditCard, ChevronDown, Download,
  Zap, Target, Brain, Lightbulb, Rocket, Coffee, UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

const Header = () => {
  const router = useRouter();
  const { 
    currentUser, 
    sidebarOpen, 
    setSidebarOpen,
    setCurrentUser,
    users,
    setUsers 
  } = useApp();

  const handleRoleChange = (newRole: 'candidate' | 'employer' | 'admin') => {
    if (!currentUser) return;
    
    const updatedUser = { ...currentUser, role: newRole };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    
    // Navigate to appropriate dashboard
    const dashboardPath = newRole === 'candidate' ? '/candidate/dashboard' : 
                         newRole === 'employer' ? '/employer/dashboard' : '/admin/dashboard';
    router.push(dashboardPath);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSidebarOpen(false);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out"
    });
    router.push('/');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {currentUser && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <Link href="/" className="flex items-center space-x-2">
            <Briefcase className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">TalentHub</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {currentUser ? (
            <>
              <Select value={currentUser.role} onValueChange={handleRoleChange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="candidate">Candidate</SelectItem>
                  <SelectItem value="employer">Employer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{currentUser.name}</span>
              </div>
              
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="outline" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const Sidebar = () => {
  const pathname = usePathname();
  const { currentUser, sidebarOpen } = useApp();

  const getCandidateMenuItems = () => [
    { title: 'Dashboard', url: '/candidate/dashboard', icon: Home },
    { title: 'My Profile', url: '/candidate/profile', icon: User },
    { title: 'Job Search', url: '/jobs', icon: Search },
    { title: 'Applications', url: '/candidate/applications', icon: FileText },
    { title: 'Interviews', url: '/candidate/interviews', icon: Calendar },
    { title: 'Saved Jobs', url: '/candidate/saved', icon: Heart },
    { title: 'Messages', url: '/candidate/messages', icon: MessageCircle },
    { title: 'Career Assistant', url: '/candidate/chatbot', icon: Brain },
    { title: 'Settings', url: '/candidate/settings', icon: Settings }
  ];

  const getEmployerMenuItems = () => [
    { title: 'Dashboard', url: '/employer/dashboard', icon: Home },
    { title: 'Company Profile', url: '/employer/company', icon: Building2 },
    { title: 'Post New Job', url: '/employer/post-job', icon: Plus },
    { title: 'My Jobs', url: '/employer/jobs', icon: Briefcase },
    { title: 'Pipeline', url: '/employer/pipeline', icon: Users },
    { title: 'Candidate Search', url: '/employer/candidates', icon: Search },
    { title: 'Interviews', url: '/employer/interviews', icon: Calendar },
    { title: 'Messages', url: '/employer/messages', icon: MessageCircle },
    { title: 'Recruiter Assistant', url: '/employer/chatbot', icon: Brain },
    { title: 'Analytics', url: '/employer/analytics', icon: BarChart3 },
    { title: 'Settings', url: '/employer/settings', icon: Settings }
  ];

  const getAdminMenuItems = () => [
    { title: 'Dashboard', url: '/admin/dashboard', icon: Home },
    { title: 'User Management', url: '/admin/users', icon: Users },
    { title: 'Content Management', url: '/admin/content', icon: FileText },
    { title: 'Job Approvals', url: '/admin/jobs', icon: CheckCircle },
    { title: 'Company Management', url: '/admin/companies', icon: Building2 },
    { title: 'Reports & Violations', url: '/admin/reports', icon: AlertTriangle },
    { title: 'Revenue Management', url: '/admin/revenue', icon: DollarSign },
    { title: 'Refunds', url: '/admin/refunds', icon: CreditCard },
    { title: 'Analytics', url: '/admin/analytics', icon: TrendingUp }
  ];

  const getMenuItems = () => {
    if (!currentUser) return [];
    switch (currentUser.role) {
      case 'candidate': return getCandidateMenuItems();
      case 'employer': return getEmployerMenuItems();
      case 'admin': return getAdminMenuItems();
      default: return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className={`bg-white border-r border-gray-200 h-screen fixed left-0 top-16 transition-transform duration-200 z-40 ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    } w-64`}>
      <div className="p-6">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.url;
            return (
              <Link
                key={item.url}
                href={item.url}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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

interface AppWrapperProps {
  children: React.ReactNode;
}

export default function AppWrapper({ children }: AppWrapperProps) {
  const { currentUser, sidebarOpen } = useApp();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex pt-16">
        {currentUser && <Sidebar />}
        
        <main className={`flex-1 ${currentUser ? (sidebarOpen ? 'ml-64' : 'ml-0') : ''} transition-all duration-200`}>
          {children}
        </main>
      </div>
    </div>
  );
}
