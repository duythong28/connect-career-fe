import { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CreditCard,
} from "lucide-react";

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { RefundRequest, User } from "@/lib/types";
import { mockPlanData, mockRefundRequests, mockRevenueData, mockUsers } from "@/lib/mock-data";

const RevenuePage = () => {
  const [refundRequests, setRefundRequests] =
    useState<RefundRequest[]>(mockRefundRequests);
  const [users, setUsers] = useState<User[]>(mockUsers);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Revenue Management
          </h1>
          <p className="text-gray-600 mt-2">
            Monitor revenue, subscriptions, and financial metrics
          </p>
        </div>

        {/* Revenue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Revenue
                  </p>
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
                  <p className="text-sm font-medium text-gray-600">
                    Active Subscriptions
                  </p>
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
                  <p className="text-sm font-medium text-gray-600">
                    Pending Refunds
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    $
                    {refundRequests
                      .filter((r) => r.status === "pending")
                      .reduce((sum, r) => sum + r.amount, 0)}
                  </p>
                  <p className="text-sm text-orange-600">
                    {
                      refundRequests.filter((r) => r.status === "pending")
                        .length
                    }{" "}
                    requests
                  </p>
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
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
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
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
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
            <CardDescription>
              Highest revenue generating users and companies
            </CardDescription>
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
                {users
                  .filter((u) => u.role === "employer")
                  .slice(0, 5)
                  .map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-600">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.subscription.plan === "Premium"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {user.subscription.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        $
                        {user.subscription.plan === "Premium"
                          ? "99"
                          : user.subscription.plan === "Standard"
                          ? "49"
                          : "0"}
                      </TableCell>
                      <TableCell>
                        ${Math.floor(Math.random() * 5000) + 500}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-green-600">
                          Active
                        </Badge>
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
};

export default RevenuePage;
