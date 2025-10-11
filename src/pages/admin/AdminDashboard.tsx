import { useState } from "react";
import {
  Briefcase,
  Building2,
  Users,
  X,
  CheckCircle,
  Shield,
  AlertTriangle,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  mockCompanies,
  mockJobs,
  mockRevenueData,
  mockUsers,
  mockViolationReports,
} from "@/lib/mock-data";
import { Company, Job, User, ViolationReport } from "@/lib/types";

const AdminDashboard = () => {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const pendingJobs = jobs.filter((j) => j.status === "draft");
  const [violationReports, setViolationReports] =
    useState<ViolationReport[]>(mockViolationReports);
  const pendingReports = violationReports.filter((r) => r.status === "pending");

  const approveJob = (jobId: string) => {
    setJobs(
      jobs.map((job) =>
        job.id === jobId ? { ...job, status: "active" as const } : job
      )
    );
    toast({
      title: "Job approved",
      description: "Job is now visible to candidates.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage platform content and monitor system health
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Jobs
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {jobs.filter((j) => j.status === "active").length}
                  </p>
                </div>
                <Briefcase className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Companies</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {companies.length}
                  </p>
                </div>
                <Building2 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Pending Reports
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {pendingReports.length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Job Approvals */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Job Approvals</CardTitle>
              <CardDescription>Jobs waiting for admin approval</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingJobs.length > 0 ? (
                <div className="space-y-4">
                  {pendingJobs.slice(0, 5).map((job) => {
                    const company = companies.find(
                      (c) => c.id === job.companyId
                    );
                    return (
                      <div
                        key={job.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{job.title}</h4>
                          <p className="text-sm text-gray-600">
                            {company?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Posted {job.postedDate}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={() => approveJob(job.id)}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="outline">
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No pending job approvals</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Violation Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Violation Reports</CardTitle>
              <CardDescription>
                Recent user reports that need attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingReports.length > 0 ? (
                <div className="space-y-4">
                  {pendingReports.slice(0, 5).map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{report.reason}</h4>
                        <p className="text-sm text-gray-600">
                          {report.targetType} reported • {report.createdAt}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setViolationReports(
                              violationReports.map((r) =>
                                r.id === report.id
                                  ? { ...r, status: "resolved" }
                                  : r
                              )
                            );
                            toast({
                              title: "Report resolved",
                              description:
                                "The violation report has been marked as resolved.",
                            });
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Resolve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setViolationReports(
                              violationReports.map((r) =>
                                r.id === report.id
                                  ? { ...r, status: "dismissed" }
                                  : r
                              )
                            );
                            toast({
                              title: "Report dismissed",
                              description:
                                "The violation report has been dismissed.",
                            });
                          }}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Shield className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No pending reports</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Analytics Chart */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Platform Analytics</CardTitle>
            <CardDescription>User activity and growth metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="subscriptions"
                    fill="#8884d8"
                    name="New Users"
                  />
                  <Bar dataKey="revenue" fill="#82ca9d" name="Revenue ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
