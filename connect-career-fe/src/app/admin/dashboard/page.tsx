'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, MapPin, DollarSign, Clock, Filter, Star, Heart, 
  Building2, Users, Eye, Send, Calendar, CheckCircle, Plus,
  TrendingUp, BarChart3, FileText, Bookmark, Bell, Settings,
  User, Briefcase, Award, Globe, Phone, Mail, Linkedin,
  Target, Zap, Brain, Lightbulb, Rocket, Coffee, UserPlus,
  UserCheck, Ban, AlertTriangle, CreditCard, ChevronDown, Download,
  Shield, Activity, DollarSign as DollarIcon, TrendingDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { mockJobs, mockCompanies, mockApplications, mockInterviews, mockCandidates, mockUsers, mockAnalytics, mockViolationReports, mockRefundRequests } from '@/lib/mock-data';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock admin data
  const currentUser = {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@jobboard.com',
    avatar: '/api/placeholder/50/50',
    role: 'System Administrator'
  };

  const systemStats = [
    { label: 'Total Users', value: 2847, change: '+156', icon: Users, color: 'text-blue-600' },
    { label: 'Active Jobs', value: 142, change: '+12', icon: Briefcase, color: 'text-green-600' },
    { label: 'Companies', value: 78, change: '+5', icon: Building2, color: 'text-purple-600' },
    { label: 'Revenue', value: '$45,230', change: '+12.5%', icon: DollarIcon, color: 'text-orange-600' }
  ];

  const recentUsers = mockUsers.slice(0, 5);
  const recentReports = mockViolationReports.slice(0, 3);
  const recentRefunds = mockRefundRequests.slice(0, 3);

  const userGrowth = [
    { name: 'Jan', users: 1200, jobs: 45, companies: 12 },
    { name: 'Feb', users: 1350, jobs: 52, companies: 15 },
    { name: 'Mar', users: 1480, jobs: 38, companies: 18 },
    { name: 'Apr', users: 1620, jobs: 61, companies: 22 },
    { name: 'May', users: 1780, jobs: 48, companies: 25 },
    { name: 'Jun', users: 1950, jobs: 67, companies: 28 }
  ];

  const revenueData = [
    { name: 'Jan', revenue: 12000, expenses: 8000 },
    { name: 'Feb', revenue: 15000, expenses: 9000 },
    { name: 'Mar', revenue: 18000, expenses: 10000 },
    { name: 'Apr', revenue: 22000, expenses: 12000 },
    { name: 'May', revenue: 25000, expenses: 13000 },
    { name: 'Jun', revenue: 28000, expenses: 14000 }
  ];

  const userDistribution = [
    { name: 'Candidates', value: 2450, color: '#3b82f6' },
    { name: 'Employers', value: 350, color: '#10b981' },
    { name: 'Admins', value: 47, color: '#f59e0b' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-semibold">Admin Dashboard</h1>
                <p className="text-gray-600">Welcome back, {currentUser.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {systemStats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Admin Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex-col" onClick={() => router.push('/admin/users')}>
                    <Users className="h-6 w-6 mb-2" />
                    <span className="text-sm">Manage Users</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col" onClick={() => router.push('/admin/jobs')}>
                    <Briefcase className="h-6 w-6 mb-2" />
                    <span className="text-sm">Manage Jobs</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col" onClick={() => router.push('/admin/companies')}>
                    <Building2 className="h-6 w-6 mb-2" />
                    <span className="text-sm">Companies</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col" onClick={() => router.push('/admin/reports')}>
                    <Shield className="h-6 w-6 mb-2" />
                    <span className="text-sm">Reports</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Users */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Recent Users</CardTitle>
                  <Button variant="ghost" onClick={() => router.push('/admin/users')}>
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'default' : 
                                        user.role === 'employer' ? 'secondary' : 'outline'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.joinedDate || '2024-01-15'}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* System Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>System Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="jobs" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="companies" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Violation Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                  Violation Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReports.map((report) => (
                    <div key={report.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={report.status === 'pending' ? 'destructive' : 
                                        report.status === 'resolved' ? 'default' : 'secondary'}>
                          {report.status}
                        </Badge>
                        <span className="text-xs text-gray-500">{report.createdAt}</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-1">
                        {report.targetType}: {report.reason}
                      </p>
                      <p className="text-xs text-gray-500">Reported by: {report.reporterId}</p>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Reports
                </Button>
              </CardContent>
            </Card>

            {/* Refund Requests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-orange-500" />
                  Refund Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentRefunds.map((refund) => (
                    <div key={refund.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={refund.status === 'pending' ? 'destructive' : 
                                        refund.status === 'approved' ? 'default' : 'secondary'}>
                          {refund.status}
                        </Badge>
                        <span className="text-sm font-semibold">${refund.amount}</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-1">
                        {refund.plan} - {refund.reason}
                      </p>
                      <p className="text-xs text-gray-500">User: {refund.userId}</p>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Refunds
                </Button>
              </CardContent>
            </Card>

            {/* User Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={userDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {userDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue vs Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#10b981" />
                    <Bar dataKey="expenses" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-green-500" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Server Status</span>
                    <Badge variant="default" className="bg-green-500">Online</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Database</span>
                    <Badge variant="default" className="bg-green-500">Healthy</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">API Response</span>
                    <Badge variant="default" className="bg-green-500">Fast</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Uptime</span>
                    <span className="text-sm font-semibold">99.9%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}