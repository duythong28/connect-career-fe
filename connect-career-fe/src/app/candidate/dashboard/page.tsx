'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, MapPin, DollarSign, Clock, Filter, Star, Heart, 
  Building2, Users, Eye, Send, Calendar, CheckCircle, Plus,
  TrendingUp, BarChart3, FileText, Bookmark, Bell, Settings,
  User, Briefcase, Award, Globe, Phone, Mail, Linkedin,
  Target, Zap, Brain, Lightbulb, Rocket, Coffee, UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { mockJobs, mockCompanies, mockApplications, mockInterviews, mockAnalytics } from '@/lib/mock-data';

export default function CandidateDashboard() {
  const router = useRouter();
  const [searchFilters, setSearchFilters] = useState({
    keyword: '',
    location: '',
    type: '',
    industry: ''
  });

  // Mock user data
  const currentUser = {
    id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '/api/placeholder/50/50',
    title: 'Frontend Developer',
    location: 'San Francisco, CA',
    experience: '3 years',
    skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML'],
    profileCompletion: 85,
    applicationsCount: 12,
    interviewsCount: 3,
    savedJobsCount: 8
  };

  const getFilteredJobs = () => {
    return mockJobs.filter(job => {
      const matchesKeyword = !searchFilters.keyword || 
        job.title.toLowerCase().includes(searchFilters.keyword.toLowerCase()) ||
        job.company.toLowerCase().includes(searchFilters.keyword.toLowerCase());
      const matchesLocation = !searchFilters.location || 
        job.location.toLowerCase().includes(searchFilters.location.toLowerCase());
      const matchesType = !searchFilters.type || job.type === searchFilters.type;
      
      return matchesKeyword && matchesLocation && matchesType && job.status === 'active';
    });
  };

  const recommendedJobs = getFilteredJobs().slice(0, 4);
  const recentApplications = mockApplications.slice(0, 3);
  const upcomingInterviews = mockInterviews.slice(0, 2);

  const profileStats = [
    { label: 'Profile Views', value: 45, change: '+12%', icon: Eye },
    { label: 'Applications', value: currentUser.applicationsCount, change: '+3', icon: Send },
    { label: 'Interviews', value: currentUser.interviewsCount, change: '+1', icon: Calendar },
    { label: 'Saved Jobs', value: currentUser.savedJobsCount, change: '+2', icon: Heart }
  ];

  const applicationStats = [
    { name: 'Jan', applications: 4, interviews: 1 },
    { name: 'Feb', applications: 6, interviews: 2 },
    { name: 'Mar', applications: 8, interviews: 3 },
    { name: 'Apr', applications: 5, interviews: 2 },
    { name: 'May', applications: 7, interviews: 1 },
    { name: 'Jun', applications: 9, interviews: 4 }
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
                <p className="text-gray-600">{currentUser.title} • {currentUser.location}</p>
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
        {/* Profile Completion */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Complete Your Profile</h3>
                <p className="text-gray-600">Add more information to increase your visibility to employers</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{currentUser.profileCompletion}%</div>
                <div className="text-sm text-gray-600">Complete</div>
              </div>
            </div>
            <Progress value={currentUser.profileCompletion} className="mb-4" />
            <Button variant="outline" onClick={() => router.push('/candidate/profile')}>
              <User className="h-4 w-4 mr-2" />
              Complete Profile
            </Button>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {profileStats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
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
                  <Button variant="outline" className="h-20 flex-col" onClick={() => router.push('/jobs')}>
                    <Search className="h-6 w-6 mb-2" />
                    <span className="text-sm">Find Jobs</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col" onClick={() => router.push('/candidate/applications')}>
                    <FileText className="h-6 w-6 mb-2" />
                    <span className="text-sm">My Applications</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col" onClick={() => router.push('/candidate/interviews')}>
                    <Calendar className="h-6 w-6 mb-2" />
                    <span className="text-sm">Interviews</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col" onClick={() => router.push('/candidate/saved')}>
                    <Bookmark className="h-6 w-6 mb-2" />
                    <span className="text-sm">Saved Jobs</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recommended Jobs */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Recommended for You</CardTitle>
                  <Button variant="ghost" onClick={() => router.push('/jobs')}>
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendedJobs.map((job) => {
                    const company = mockCompanies.find(c => c.name === job.company);
                    return (
                      <div key={job.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                           onClick={() => router.push(`/jobs/${job.id}`)}>
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={company?.logo} />
                          <AvatarFallback>{company?.name?.charAt(0) || job.company.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{job.title}</h4>
                          <p className="text-sm text-gray-600">{company?.name || job.company}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-gray-500">{job.location}</span>
                            <span className="text-sm text-gray-500">{job.salary}</span>
                            <Badge variant="secondary" className="capitalize text-xs">{job.type}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="icon">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button size="sm">
                            <Send className="h-4 w-4 mr-1" />
                            Apply
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Applications */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Recent Applications</CardTitle>
                  <Button variant="ghost" onClick={() => router.push('/candidate/applications')}>
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentApplications.map((application) => {
                    const job = mockJobs.find(j => j.id === application.jobId);
                    const company = job ? mockCompanies.find(c => c.name === job.company) : null;
                    
                    return (
                      <div key={application.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={company?.logo} />
                          <AvatarFallback>{company?.name?.charAt(0) || job?.company.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{job?.title}</h4>
                          <p className="text-sm text-gray-600">{company?.name || job?.company}</p>
                          <p className="text-sm text-gray-500">Applied {application.appliedDate}</p>
                        </div>
                        <Badge 
                          variant={application.status === 'Interview' ? 'default' : 
                                  application.status === 'Offer' ? 'default' : 
                                  application.status === 'Rejected' ? 'destructive' : 'secondary'}
                        >
                          {application.status}
                        </Badge>
                      </div>
                    );
                  })}
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
                    const job = mockJobs.find(j => j.id === interview.jobId);
                    const company = job ? mockCompanies.find(c => c.name === job.company) : null;
                    
                    return (
                      <div key={interview.id} className="p-4 border rounded-lg">
                        <div className="flex items-center space-x-3 mb-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={company?.logo} />
                            <AvatarFallback>{company?.name?.charAt(0) || job?.company.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium text-sm">{job?.title}</h4>
                            <p className="text-xs text-gray-600">{company?.name || job?.company}</p>
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

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Your Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {currentUser.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="mt-4 w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Skills
                </Button>
              </CardContent>
            </Card>

            {/* Application Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Application Analytics</CardTitle>
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
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* AI Assistant */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  AI Career Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      💡 <strong>Tip:</strong> Your profile is 85% complete. Add a professional summary to increase visibility by 40%.
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      🎯 <strong>Match:</strong> You have a 92% skill match with 3 new job postings.
                    </p>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Zap className="h-4 w-4 mr-2" />
                    Get Career Insights
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