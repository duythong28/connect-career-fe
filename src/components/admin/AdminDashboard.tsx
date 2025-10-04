import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockAnalytics } from '@/lib/mock-data';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { 
  Users, 
  Building2, 
  TrendingUp, 
  Shield,
  AlertTriangle,
  FileCheck,
  CreditCard,
  Database,
  Activity,
  CheckCircle
} from 'lucide-react';

export function AdminDashboard() {
  const stats = [
    {
      title: 'Total Users',
      value: '12,547',
      change: '+8.2% this month',
      icon: Users,
      color: 'text-brand-primary'
    },
    {
      title: 'Active Companies',
      value: '1,234',
      change: '+12 this week',
      icon: Building2,
      color: 'text-brand-accent'
    },
    {
      title: 'Pending Reviews',
      value: '23',
      change: '-5 since yesterday',
      icon: FileCheck,
      color: 'text-brand-warning'
    },
    {
      title: 'System Health',
      value: '99.9%',
      change: 'All systems operational',
      icon: Activity,
      color: 'text-brand-accent'
    }
  ];

  const userGrowthData = [
    { month: 'Jan', candidates: 1200, employers: 150 },
    { month: 'Feb', candidates: 1450, employers: 180 },
    { month: 'Mar', candidates: 1680, employers: 210 },
    { month: 'Apr', candidates: 1920, employers: 245 },
    { month: 'May', candidates: 2150, employers: 280 },
    { month: 'Jun', candidates: 2380, employers: 315 }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 52000 },
    { month: 'Mar', revenue: 48000 },
    { month: 'Apr', revenue: 61000 },
    { month: 'May', revenue: 55000 },
    { month: 'Jun', revenue: 67000 }
  ];

  const recentAlerts = [
    { id: 1, type: 'warning', message: 'High server load detected', time: '2 minutes ago' },
    { id: 2, type: 'info', message: 'New company registration pending review', time: '15 minutes ago' },
    { id: 3, type: 'success', message: 'Security scan completed successfully', time: '1 hour ago' },
    { id: 4, type: 'warning', message: 'Unusual login activity detected', time: '2 hours ago' }
  ];

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-brand-warning';
      case 'success': return 'text-brand-accent';
      case 'error': return 'text-brand-error';
      default: return 'text-brand-primary';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return AlertTriangle;
      case 'success': return CheckCircle;
      case 'error': return AlertTriangle;
      default: return Shield;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-brand-secondary to-brand-primary rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard 🛡️</h1>
        <p className="text-white/90 mb-6">
          Monitor platform health, manage users, and oversee system operations.
        </p>
        <div className="flex gap-4">
          <Button className="btn-hero bg-white/20 text-white border-white/30 hover:bg-white/30">
            <Shield className="w-4 h-4 mr-2" />
            Security Center
          </Button>
          <Button variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10">
            <Database className="w-4 h-4 mr-2" />
            System Reports
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
        {/* User Growth Chart */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              User Growth
            </CardTitle>
            <CardDescription>Monthly user registration trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="candidates" 
                  stackId="1"
                  stroke="hsl(var(--brand-primary))" 
                  fill="hsl(var(--brand-primary))"
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="employers" 
                  stackId="1"
                  stroke="hsl(var(--brand-accent))" 
                  fill="hsl(var(--brand-accent))"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Revenue Trends
            </CardTitle>
            <CardDescription>Monthly revenue performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--brand-accent))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--brand-accent))', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Alerts */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Recent Alerts
            </CardTitle>
            <CardDescription>System notifications and warnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAlerts.map((alert) => {
                const Icon = getAlertIcon(alert.type);
                return (
                  <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border">
                    <Icon className={`w-5 h-5 mt-0.5 ${getAlertColor(alert.type)}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">{alert.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Alerts
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Users className="w-6 h-6" />
                <span className="text-sm">User Management</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <FileCheck className="w-6 h-6" />
                <span className="text-sm">Content Review</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Shield className="w-6 h-6" />
                <span className="text-sm">Security Scan</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Database className="w-6 h-6" />
                <span className="text-sm">Data Export</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Overview */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Platform Overview
          </CardTitle>
          <CardDescription>Key metrics and system status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-brand-primary">99.9%</p>
              <p className="text-sm text-muted-foreground">Uptime</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-brand-accent">2.1s</p>
              <p className="text-sm text-muted-foreground">Avg Response Time</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-brand-secondary">99.7%</p>
              <p className="text-sm text-muted-foreground">User Satisfaction</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}