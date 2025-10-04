import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { mockJobs, mockApplications, mockAnalytics } from '@/lib/mock-data';
import { 
  FileText, 
  Calendar, 
  Star, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  Eye,
  MessageSquare,
  BrainCircuit
} from 'lucide-react';

export function CandidateDashboard() {
  const recentApplications = mockApplications.slice(0, 3);
  const recommendedJobs = mockJobs.slice(0, 3);

  const stats = [
    {
      title: 'Applications Sent',
      value: '12',
      change: '+2 this week',
      icon: FileText,
      color: 'text-brand-primary'
    },
    {
      title: 'Profile Views',
      value: '89',
      change: '+15 this week',
      icon: Eye,
      color: 'text-brand-accent'
    },
    {
      title: 'Interviews',
      value: '3',
      change: '+1 this week',
      icon: Calendar,
      color: 'text-brand-warning'
    },
    {
      title: 'Saved Jobs',
      value: '24',
      change: '+4 this week',
      icon: Star,
      color: 'text-brand-secondary'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'interview': return 'bg-brand-accent text-white';
      case 'offer': return 'bg-brand-accent text-white';
      case 'screening': return 'bg-brand-warning text-white';
      default: return 'bg-secondary';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-brand-primary to-brand-accent rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Sarah! 👋</h1>
        <p className="text-white/90 mb-6">
          You have 3 new messages and 2 interview invitations waiting for you.
        </p>
        <div className="flex gap-4">
          <Button className="btn-hero bg-white/20 text-white border-white/30 hover:bg-white/30">
            <MessageSquare className="w-4 h-4 mr-2" />
            View Messages
          </Button>
          <Button variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10">
            <BrainCircuit className="w-4 h-4 mr-2" />
            AI Career Assistant
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
        {/* Recent Applications */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Recent Applications
            </CardTitle>
            <CardDescription>Track your application progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentApplications.map((app) => {
                const job = mockJobs.find(j => j.id === app.jobId);
                return (
                  <div key={app.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex-1">
                      <h4 className="font-medium">{job?.title}</h4>
                      <p className="text-sm text-muted-foreground">{job?.company}</p>
                      <p className="text-xs text-muted-foreground">Applied {app.appliedDate}</p>
                    </div>
                    <Badge className={getStatusColor(app.status)}>
                      {app.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Applications
            </Button>
          </CardContent>
        </Card>

        {/* AI Job Recommendations */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="w-5 h-5" />
              AI Job Recommendations
            </CardTitle>
            <CardDescription>Personalized job matches for you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendedJobs.map((job) => (
                <div key={job.id} className="p-4 rounded-lg border hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium">{job.title}</h4>
                      <p className="text-sm text-muted-foreground">{job.company}</p>
                      <p className="text-sm text-brand-primary font-medium">{job.salary}</p>
                    </div>
                    <Badge variant="secondary" className="bg-brand-accent/10 text-brand-accent">
                      95% match
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>{job.type}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 btn-success">
              View All Recommendations
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Profile Completion */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Profile Strength
          </CardTitle>
          <CardDescription>Complete your profile to get better job matches</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Profile Completion</span>
              <span className="text-sm text-muted-foreground">85%</span>
            </div>
            <Progress value={85} className="h-2" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-brand-accent" />
                <span className="text-sm">Basic Info</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-brand-accent" />
                <span className="text-sm">Work Experience</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Portfolio</span>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Complete Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}