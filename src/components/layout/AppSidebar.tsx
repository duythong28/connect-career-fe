import { UserRole } from '@/lib/types';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  User,
  Search,
  FileText,
  Calendar,
  MessageSquare,
  Settings,
  Building2,
  Users,
  BarChart3,
  FileCheck,
  Shield,
  Database,
  AlertTriangle,
  CreditCard,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';

interface AppSidebarProps {
  currentRole: UserRole;
}

const navigationConfig = {
  candidate: [
    {
      title: 'Overview',
      items: [
        { title: 'Dashboard', url: '/candidate', icon: Home },
        { title: 'Profile', url: '/candidate/profile', icon: User },
      ]
    },
    {
      title: 'Job Search',
      items: [
        { title: 'Find Jobs', url: '/candidate/jobs', icon: Search },
        { title: 'My Applications', url: '/candidate/applications', icon: FileText },
        { title: 'Saved Jobs', url: '/candidate/saved', icon: FileCheck },
      ]
    },
    {
      title: 'Interviews',
      items: [
        { title: 'Schedule', url: '/candidate/interviews', icon: Calendar },
        { title: 'AI Mock Interview', url: '/candidate/mock-interview', icon: BrainCircuit },
      ]
    },
    {
      title: 'Communication',
      items: [
        { title: 'Messages', url: '/candidate/messages', icon: MessageSquare, badge: 3 },
        { title: 'AI Assistant', url: '/candidate/ai-chat', icon: BrainCircuit },
      ]
    },
    {
      title: 'Account',
      items: [
        { title: 'Settings', url: '/candidate/settings', icon: Settings },
        { title: 'Subscription', url: '/candidate/subscription', icon: CreditCard },
      ]
    }
  ],
  employer: [
    {
      title: 'Overview',
      items: [
        { title: 'Dashboard', url: '/employer', icon: Home },
        { title: 'Company Profile', url: '/employer/profile', icon: Building2 },
      ]
    },
    {
      title: 'Job Management',
      items: [
        { title: 'Job Postings', url: '/employer/jobs', icon: FileText },
        { title: 'Applications', url: '/employer/applications', icon: Users },
        { title: 'Analytics', url: '/employer/analytics', icon: BarChart3 },
      ]
    },
    {
      title: 'Candidates',
      items: [
        { title: 'Search Candidates', url: '/employer/candidates', icon: Search },
        { title: 'AI Recommendations', url: '/employer/ai-candidates', icon: BrainCircuit },
        { title: 'Interview Schedule', url: '/employer/interviews', icon: Calendar },
      ]
    },
    {
      title: 'Communication',
      items: [
        { title: 'Messages', url: '/employer/messages', icon: MessageSquare, badge: 5 },
        { title: 'AI Assistant', url: '/employer/ai-chat', icon: BrainCircuit },
      ]
    },
    {
      title: 'Account',
      items: [
        { title: 'Settings', url: '/employer/settings', icon: Settings },
        { title: 'Billing', url: '/employer/billing', icon: CreditCard },
      ]
    }
  ],
  admin: [
    {
      title: 'Overview',
      items: [
        { title: 'Dashboard', url: '/admin', icon: Home },
        { title: 'Analytics', url: '/admin/analytics', icon: TrendingUp },
      ]
    },
    {
      title: 'User Management',
      items: [
        { title: 'Candidates', url: '/admin/candidates', icon: User },
        { title: 'Employers', url: '/admin/employers', icon: Building2 },
        { title: 'User Reports', url: '/admin/user-reports', icon: AlertTriangle },
      ]
    },
    {
      title: 'Content Management',
      items: [
        { title: 'Job Approvals', url: '/admin/job-approvals', icon: FileCheck },
        { title: 'Profile Reviews', url: '/admin/profile-reviews', icon: Users },
        { title: 'Content Moderation', url: '/admin/content', icon: Shield },
      ]
    },
    {
      title: 'System',
      items: [
        { title: 'AI Management', url: '/admin/ai', icon: BrainCircuit },
        { title: 'Data Management', url: '/admin/data', icon: Database },
        { title: 'System Health', url: '/admin/health', icon: BarChart3 },
      ]
    },
    {
      title: 'Business',
      items: [
        { title: 'Revenue', url: '/admin/revenue', icon: CreditCard },
        { title: 'Subscriptions', url: '/admin/subscriptions', icon: TrendingUp },
        { title: 'Settings', url: '/admin/settings', icon: Settings },
      ]
    }
  ]
};

export function AppSidebar({ currentRole }: AppSidebarProps) {
  const { state } = useSidebar();
  const location = useLocation();
  const navigation = navigationConfig[currentRole];
  const isCollapsed = state === 'collapsed';

  const isActive = (url: string) => location.pathname === url;
  const getNavClass = (isActive: boolean) =>
    isActive ? 'bg-primary text-primary-foreground font-medium' : 'hover:bg-accent';

  return (
    <Sidebar className={isCollapsed ? 'w-16' : 'w-64'}>
      <SidebarContent className="p-4">
        {navigation.map((group) => (
          <SidebarGroup key={group.title} className="mb-6">
            {!isCollapsed && (
              <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {group.title}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          className={({ isActive }) => 
                            `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${getNavClass(isActive)}`
                          }
                        >
                          <Icon className="w-5 h-5 flex-shrink-0" />
                          {!isCollapsed && (
                            <>
                              <span className="flex-1">{item.title}</span>
                              {item.badge && (
                                <Badge variant="secondary" className="text-xs">
                                  {item.badge}
                                </Badge>
                              )}
                            </>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}