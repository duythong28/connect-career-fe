'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  DollarSign, 
  CreditCard, 
  AlertTriangle, 
  TrendingUp 
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';

export default function RevenuePage() {
  // Mock data for revenue page
  const mockRevenueData = [
    { month: 'Jan', revenue: 18000 },
    { month: 'Feb', revenue: 22000 },
    { month: 'Mar', revenue: 26000 },
    { month: 'Apr', revenue: 24000 },
    { month: 'May', revenue: 28000 },
    { month: 'Jun', revenue: 32000 }
  ];

  const mockPlanData = [
    { name: 'Free', value: 60, color: '#8884d8' },
    { name: 'Standard', value: 30, color: '#82ca9d' },
    { name: 'Premium', value: 10, color: '#ffc658' }
  ];

  const mockRefundRequests = [
    { id: '1', amount: 299, status: 'pending' },
    { id: '2', amount: 99, status: 'pending' },
    { id: '3', amount: 199, status: 'approved' }
  ];

  const mockTopCustomers = [
    { id: '1', name: 'TechCorp Inc.', avatar: '/api/placeholder/50/50', plan: 'Premium', monthlyRevenue: 299, totalPaid: 2990, status: 'active' },
    { id: '2', name: 'InnovateLabs', avatar: '/api/placeholder/50/50', plan: 'Standard', monthlyRevenue: 99, totalPaid: 1188, status: 'active' },
    { id: '3', name: 'DesignStudio', avatar: '/api/placeholder/50/50', plan: 'Premium', monthlyRevenue: 299, totalPaid: 1795, status: 'active' },
    { id: '4', name: 'StartupCo', avatar: '/api/placeholder/50/50', plan: 'Standard', monthlyRevenue: 99, totalPaid: 495, status: 'active' },
    { id: '5', name: 'BigTech Solutions', avatar: '/api/placeholder/50/50', plan: 'Premium', monthlyRevenue: 299, totalPaid: 3588, status: 'active' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Revenue Management</h1>
          <p className="text-gray-600 mt-2">Monitor revenue, subscriptions, and financial metrics</p>
        </div>

        {/* Revenue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">$130,000</p>
                  <p className="text-sm text-green-600">+12% from last month</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                  <p className="text-2xl font-bold text-gray-900">1,250</p>
                  <p className="text-sm text-green-600">+8% from last month</p>
                </div>
                <CreditCard className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Refunds</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${mockRefundRequests.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0)}
                  </p>
                  <p className="text-sm text-orange-600">{mockRefundRequests.filter(r => r.status === 'pending').length} requests</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">MRR</p>
                  <p className="text-2xl font-bold text-gray-900">$28,500</p>
                  <p className="text-sm text-green-600">+15% from last month</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Plan Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockPlanData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mockPlanData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Paying Customers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Paying Customers</CardTitle>
            <CardDescription>Highest revenue generating users and companies</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Monthly Revenue</TableHead>
                  <TableHead>Total Paid</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTopCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={customer.avatar} />
                          <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={customer.plan === 'Premium' ? 'default' : 'secondary'}>
                        {customer.plan}
                      </Badge>
                    </TableCell>
                    <TableCell>${customer.monthlyRevenue}</TableCell>
                    <TableCell>${customer.totalPaid}</TableCell>
                    <TableCell>
                      <Badge variant="default">{customer.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}