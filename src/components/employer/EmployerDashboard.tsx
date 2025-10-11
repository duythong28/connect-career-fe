import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockJobs, mockApplications, mockCandidates, mockAnalytics } from '@/lib/mock-data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Calendar,
  Eye,
  Plus,
  BrainCircuit,
  Target,
  Clock,
  Award
} from 'lucide-react';

export function EmployerDashboard() {
  const activeJobs = mockJobs.filter(job => job.status === 'active');
  const recentApplications = mockApplications.slice(0, 4);
  const topCandidates = mockCandidates.slice(0, 3);

  const stats = [
    {
      title: 'Active Jobs',
      value: activeJobs.length.toString(),
      change: '+2 this month',
      icon: FileText,
      color: 'text-brand-primary'
    },
    {
      title: 'Total Applications',
      value: '156',
      change: '+23 this week',
      icon: Users,
      color: 'text-brand-accent'
    },
    {
      title: 'Interviews Scheduled',
      value: '12',
      change: '+5 this week',
      icon: Calendar,
      color: 'text-brand-warning'
    },
    {
      title: 'Profile Views',
      value: '1.2k',
      change: '+156 this week',
      icon: Eye,
      color: 'text-brand-secondary'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'interview': return 'bg-brand-accent text-white';
      case 'offer': return 'bg-brand-accent text-white';
      case 'screening': return 'bg-brand-warning text-white';
      case 'applied': return 'bg-brand-primary text-white';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-brand-secondary to-brand-primary rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, TechCorp! 🚀</h1>
        <p className="text-white/90 mb-6">
          You have 23 new applications and 5 candidates shortlisted for interviews.
        </p>
        <div className="flex gap-4">
          <Button className="btn-hero bg-white/20 text-white border-white/30 hover:bg-white/30">
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Button>
          <Button variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10">
            <BrainCircuit className="w-4 h-4 mr-2" />
            AI Candidate Matching
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="card-elevated">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-brand-accent">{stat.change}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Job Performance Chart */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Job Performance
            </CardTitle>
            <CardDescription>Daily job views and applications</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={mockAnalytics.jobViews}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="hsl(var(--brand-primary))" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Application Status Distribution */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Application Pipeline
            </CardTitle>
            <CardDescription>Current application status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={mockAnalytics.applicationsByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {mockAnalytics.applicationsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {mockAnalytics.applicationsByStatus.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Recent Applications
            </CardTitle>
            <CardDescription>Latest candidate applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentApplications.map((app) => {
                const job = mockJobs.find(j => j.id === app.jobId);
                const candidate = mockCandidates.find(c => c.id === app.candidateId);
                return (
                  <div key={app.id} className="flex items-center justify-between p-4 rounded-lg border hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <h4 className="font-medium">{candidate?.name}</h4>
                      <p className="text-sm text-muted-foreground">{job?.title}</p>
                      <p className="text-xs text-muted-foreground">Applied {app.appliedDate}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(app.status)}>
                        {app.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Review
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Applications
            </Button>
          </CardContent>
        </Card>

        {/* AI Recommended Candidates */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="w-5 h-5" />
              AI Top Candidates
            </CardTitle>
            <CardDescription>AI-recommended candidates for your jobs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCandidates.map((candidate) => (
                <div key={candidate.id} className="p-4 rounded-lg border hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium">{candidate.name}</h4>
                      <p className="text-sm text-muted-foreground">{candidate.title}</p>
                      {/* <p className="text-sm text-brand-primary">{candidate.experience} experience</p> */}
                    </div>
                    <Badge variant="secondary" className="bg-brand-accent/10 text-brand-accent">
                      <Award className="w-3 h-3 mr-1" />
                      92% match
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {candidate.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="btn-hero">
                      Contact
                    </Button>
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 btn-success">
              View All AI Recommendations
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your recruitment process efficiently</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex flex-col gap-2 btn-hero">
              <Plus className="w-6 h-6" />
              Post New Job
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Calendar className="w-6 h-6" />
              Schedule Interviews
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <BrainCircuit className="w-6 h-6" />
              AI Assistant
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}