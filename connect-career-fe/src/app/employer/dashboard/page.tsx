'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, MapPin, DollarSign, Clock, Filter, Star, Heart, 
  Building2, Users, Eye, Send, Calendar, CheckCircle, Plus,
  TrendingUp, BarChart3, FileText, Bookmark, Bell, Settings,
  User, Briefcase, Award, Globe, Phone, Mail, Linkedin,
  Target, Zap, Brain, Lightbulb, Rocket, Coffee, UserPlus,
  UserCheck, Ban, AlertTriangle, CreditCard, ChevronDown, Download
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
import { mockJobs, mockCompanies, mockApplications, mockInterviews, mockCandidates, mockAnalytics } from '@/lib/mock-data';

export default function EmployerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock employer data
  const currentUser = {
    id: 'emp1',
    name: 'Alice Johnson',
    email: 'alice@techcorp.com',
    avatar: '/api/placeholder/50/50',
    company: 'TechCorp Inc.',
    role: 'HR Manager',
    location: 'San Francisco, CA'
  };

  const companyStats = [
    { label: 'Active Jobs', value: 12, change: '+2', icon: Briefcase, color: 'text-blue-600' },
    { label: 'Total Applications', value: 156, change: '+23', icon: FileText, color: 'text-green-600' },
    { label: 'Interviews Scheduled', value: 8, change: '+3', icon: Calendar, color: 'text-purple-600' },
    { label: 'Hires This Month', value: 3, change: '+1', icon: UserCheck, color: 'text-orange-600' }
  ];

  const recentApplications = mockApplications.slice(0, 5);
  const upcomingInterviews = mockInterviews.slice(0, 3);
  const topCandidates = mockCandidates.slice(0, 4);

  const applicationStats = [
    { name: 'Jan', applications: 45, interviews: 12, hires: 2 },
    { name: 'Feb', applications: 52, interviews: 15, hires: 3 },
    { name: 'Mar', applications: 38, interviews: 10, hires: 1 },
    { name: 'Apr', applications: 61, interviews: 18, hires: 4 },
    { name: 'May', applications: 48, interviews: 14, hires: 2 },
    { name: 'Jun', applications: 67, interviews: 20, hires: 5 }
  ];

  const jobPerformance = [
    { name: 'Senior Frontend Dev', applications: 45, interviews: 8, hires: 2, status: 'active' },
    { name: 'Product Manager', applications: 32, interviews: 6, hires: 1, status: 'active' },
    { name: 'UX Designer', applications: 28, interviews: 5, hires: 1, status: 'active' },
    { name: 'DevOps Engineer', applications: 19, interviews: 4, hires: 0, status: 'active' }
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
                <h1 className="text-xl font-semibold">Welcome back, {currentUser.name}!</h1>
                <p className="text-gray-600">{currentUser.role} at {currentUser.company}</p>
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
          {companyStats.map((stat, index) => (
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
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex-col" onClick={() => router.push('/employer/post-job')}>
                    <Plus className="h-6 w-6 mb-2" />
                    <span className="text-sm">Post Job</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col" onClick={() => router.push('/employer/candidates')}>
                    <Search className="h-6 w-6 mb-2" />
                    <span className="text-sm">Find Candidates</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col" onClick={() => router.push('/employer/pipeline')}>
                    <BarChart3 className="h-6 w-6 mb-2" />
                    <span className="text-sm">Pipeline</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col" onClick={() => router.push('/employer/analytics')}>
                    <TrendingUp className="h-6 w-6 mb-2" />
                    <span className="text-sm">Analytics</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Applications */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Recent Applications</CardTitle>
                  <Button variant="ghost" onClick={() => router.push('/employer/pipeline')}>
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidate</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Applied</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentApplications.map((application) => {
                      const candidate = mockCandidates.find(c => c.id === application.candidateId);
                      const job = mockJobs.find(j => j.id === application.jobId);
                      
                      return (
                        <TableRow key={application.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={candidate?.avatar} />
                                <AvatarFallback>{candidate?.name?.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{candidate?.name}</div>
                                <div className="text-sm text-gray-500">{candidate?.title}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{job?.title}</div>
                              <div className="text-sm text-gray-500">{job?.company}</div>
                            </div>
                          </TableCell>
                          <TableCell>{application.appliedDate}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={application.status === 'Interview' ? 'default' : 
                                      application.status === 'Offer' ? 'default' : 
                                      application.status === 'Rejected' ? 'destructive' : 'secondary'}
                            >
                              {application.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm">
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Job Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Job Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobPerformance.map((job, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{job.name}</h4>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <span>{job.applications} applications</span>
                          <span>{job.interviews} interviews</span>
                          <span>{job.hires} hires</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                          {job.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Interviews */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Interviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingInterviews.map((interview) => {
                    const candidate = mockCandidates.find(c => c.id === interview.candidateId);
                    const job = mockJobs.find(j => j.id === interview.jobId);
                    
                    return (
                      <div key={interview.id} className="p-4 border rounded-lg">
                        <div className="flex items-center space-x-3 mb-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={candidate?.avatar} />
                            <AvatarFallback>{candidate?.name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium text-sm">{candidate?.name}</h4>
                            <p className="text-xs text-gray-600">{job?.title}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {interview.date}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {interview.time}
                          </span>
                          <Badge variant="outline" className="text-xs capitalize">{interview.type}</Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Top Candidates */}
            <Card>
              <CardHeader>
                <CardTitle>Top Candidates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCandidates.map((candidate) => (
                    <div key={candidate.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={candidate.avatar} />
                        <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{candidate.name}</h4>
                        <p className="text-xs text-gray-600">{candidate.title}</p>
                        <div className="flex items-center mt-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-gray-500 ml-1">4.8</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Analytics Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Application Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={applicationStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="applications" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="interviews" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="hires" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      💡 <strong>Tip:</strong> Your job postings get 40% more views when posted on Tuesdays.
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      🎯 <strong>Match:</strong> 3 candidates with 90%+ skill match are available for your open positions.
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm text-orange-800">
                      ⚠️ <strong>Alert:</strong> 5 applications are pending review for more than 3 days.
                    </p>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Zap className="h-4 w-4 mr-2" />
                    Get More Insights
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}