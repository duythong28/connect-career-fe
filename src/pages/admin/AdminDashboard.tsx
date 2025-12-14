import { useState } from "react";
import {
  Briefcase,
  Building2,
  Users,
  TrendingUp,
  TrendingDown,
  FileText,
  UserCheck,
  Calendar,
  Award,
  Target,
  Clock,
  Zap,
  Filter,
  BarChart3,
  Star,
  MessageSquare,
} from "lucide-react";

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { getBackOfficeDashboardStats } from "@/api/endpoints/back-office.api";
import { StatsPeriod } from "@/api/types/back-office.types";
import { Skeleton } from "@/components/ui/skeleton";

const periodLabels: Record<StatsPeriod, string> = {
  [StatsPeriod.TODAY]: "Today",
  [StatsPeriod.WEEK]: "This Week",
  [StatsPeriod.MONTH]: "This Month",
  [StatsPeriod.QUARTER]: "This Quarter",
  [StatsPeriod.YEAR]: "This Year",
  [StatsPeriod.ALL_TIME]: "All Time",
};

const AdminDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<StatsPeriod>(
    StatsPeriod.MONTH
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: ["back-office-dashboard-stats", selectedPeriod],
    queryFn: async () => getBackOfficeDashboardStats(selectedPeriod),
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatPeriodLabel = (period: string) => {
    const date = new Date(period);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Prepare trends data for charts
  const getAllPeriods = () => {
    if (!data?.trends) return [];

    const periodsSet = new Set<string>();
    data.trends.usersByPeriod?.forEach((item) => periodsSet.add(item.period));
    data.trends.jobsByPeriod?.forEach((item) => periodsSet.add(item.period));
    data.trends.applicationsByPeriod?.forEach((item) => periodsSet.add(item.period));

    return Array.from(periodsSet).sort();
  };

  const trendsChartData = getAllPeriods().map((period) => ({
    period: formatPeriodLabel(period),
    applications:
      data?.trends.applicationsByPeriod?.find((a) => a.period === period)?.count || 0,
    users:
      data?.trends.usersByPeriod?.find((u) => u.period === period)?.count || 0,
    jobs:
      data?.trends.jobsByPeriod?.find((j) => j.period === period)?.count || 0,
  }));

  const GrowthIndicator = ({
    value,
    label,
  }: {
    value: number;
    label: string;
  }) => (
    <div className="flex items-center gap-1">
      {value > 0 ? (
        <TrendingUp className="h-4 w-4 text-green-500" />
      ) : value < 0 ? (
        <TrendingDown className="h-4 w-4 text-red-500" />
      ) : null}
      <span
        className={`text-sm font-medium ${
          value > 0
            ? "text-green-600"
            : value < 0
            ? "text-red-600"
            : "text-gray-500"
        }`}
      >
        {value > 0 ? "+" : ""}
        {value.toFixed(1)}% {label}
      </span>
    </div>
  );

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <Card className="p-6">
          <p className="text-red-500">
            Failed to load dashboard data. Please try again.
          </p>
        </Card>
      </div>
    );
  }

  // --- Helper Components matching EmployerDashboard Style ---

  const iconBaseStyle = "h-10 w-10 p-2 rounded-xl text-white"; 
  const secondaryIconBaseStyle = "h-8 w-8 p-1.5 rounded-lg text-white";

  const OverviewCard = ({
    title,
    value,
    subValue,
    growthValue,
    icon: Icon,
    iconBgClass,
    isLoading,
    subValueClass = "text-gray-500",
  }) => (
    // Basic 1px border and hover border
    <Card className="transition-colors duration-300 border border-gray-200 hover:border-[#0EA5E9] bg-white">
      <CardContent className="p-5">
        {isLoading ? (
          <Skeleton className="h-20 w-full" />
        ) : (
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
              <p className="text-2xl font-extrabold text-gray-900 mt-1">
                {value}
              </p>
              <div className="mt-2 space-y-1">
                {subValue && (
                  <span className={`text-xs ${subValueClass} font-medium`}>
                    {subValue}
                  </span>
                )}
                {growthValue !== undefined && (
                  <GrowthIndicator value={growthValue} label="" />
                )}
              </div>
            </div>
            <div className={`${iconBgClass} ${iconBaseStyle} flex-shrink-0`}>
                <Icon className="h-full w-full" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const SecondaryCard = ({
    title,
    value,
    subValue,
    icon: Icon,
    iconBgClass,
    isLoading,
  }) => (
    // Basic 1px border and hover border
    <Card className="border border-gray-200 hover:border-blue-400 transition-colors duration-300 bg-white">
      <CardContent className="p-4">
        {isLoading ? (
          <Skeleton className="h-12 w-full" />
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">{title}</p>
              <p className="text-lg font-bold text-gray-900">{value}</p>
              {subValue && <p className="text-xs text-gray-500 mt-0.5">{subValue}</p>}
            </div>
            <div className={`${iconBgClass} ${secondaryIconBaseStyle} flex-shrink-0`}>
              <Icon className="h-full w-full" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const ActivityItem = ({ icon: Icon, title, value, color, borderColor }) => (
    // Basic 1px border and hover border
    <div className={`flex items-center justify-between p-4 border border-gray-200 bg-white rounded-xl hover:border-${borderColor}-500 transition-colors`}>
      <div className="flex items-center gap-3">
        <Icon className={`h-5 w-5 text-${color}-600`} />
        <span className="font-semibold text-sm text-gray-800">{title}</span>
      </div>
      <span className={`text-xl font-extrabold text-${color}-600`}>
        {value}
      </span>
    </div>
  );

  const GrowthMetricsTable = () => {
    const metrics = [
      { name: "New Users", value: data?.growth.newUsers || 0, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
      { name: "New Organizations", value: data?.growth.newOrganizations || 0, icon: Building2, color: "text-purple-600", bg: "bg-purple-50" },
      { name: "New Jobs", value: data?.growth.newJobs || 0, icon: Briefcase, color: "text-green-600", bg: "bg-green-50" },
      { name: "New Applications", value: data?.growth.newApplications || 0, icon: FileText, color: "text-orange-600", bg: "bg-orange-50" },
    ];

    return (
      <div className="space-y-3">
        {metrics.map((metric) => (
          <div
            key={metric.name}
            // Basic 1px border and implicit light hover
            className={`flex items-center justify-between p-3 ${metric.bg} rounded-lg border border-gray-100 hover:border-gray-200 transition-colors`} 
          >
            <div className="flex items-center gap-3">
              <metric.icon className={`h-5 w-5 ${metric.color} flex-shrink-0`} />
              <span className="font-semibold text-sm text-gray-800">{metric.name}</span>
            </div>
            <span className={`text-xl font-extrabold ${metric.color}`}>
              {metric.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  };
  
  const TopPerformerItem = ({
    name,
    subtext,
    value,
    rank,
    rankColor,
    rankBg,
    extraSubtext = null,
  }) => (
    <div
      // Basic 1px border and light hover
      className="flex items-center justify-between p-3 border border-gray-200 rounded-xl bg-white hover:border-blue-200 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-3">
        {/* Basic 1px border for the rank circle */}
        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-base font-extrabold flex-shrink-0 ${rankBg} ${rankColor} border border-gray-200`}>
          {rank}
        </div>
        <div>
          <h4 className="font-sm font-semibold text-gray-900">{name}</h4>
          <p className="text-xs text-gray-500 truncate max-w-[140px]">{subtext}</p>
          {extraSubtext && <p className="text-[10px] text-gray-400">{extraSubtext}</p>}
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-extrabold text-green-600">
          {value}
        </p>
        <p className="text-xs text-gray-500">hires</p>
      </div>
    </div>
  );

  // --- End of Helper Components ---

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-sm">
      <div className="max-w-7xl mx-auto">
        {/* Header with Period Selector */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage platform content and monitor system health
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-blue-600" />
            <Select
              value={selectedPeriod}
              onValueChange={(value) => setSelectedPeriod(value as StatsPeriod)}
            >
              <SelectTrigger className="w-[160px] border border-gray-300 hover:border-blue-400 focus:ring-2 focus:ring-blue-500 h-9 text-xs font-medium"> {/* Basic 1px border */}
                <Filter className="w-3 h-3 text-gray-400 mr-2"/>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(periodLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Period Info - Clean box with border */}
        {data?.period && (
          <div className="mb-6 text-xs text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-gray-200 inline-block"> {/* Basic 1px border */}
            📅 Data period: <span className="font-semibold">{formatDate(data.period.startDate)}</span> to{" "}
            <span className="font-semibold">{formatDate(data.period.endDate)}</span>
          </div>
        )}

        {/* Overview Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <OverviewCard
            title="Total Users"
            value={data?.overview.totalUsers.toLocaleString() || "..."}
            subValue={
              <span className="text-blue-600">
                +{data?.growth.newUsers} new
              </span>
            }
            growthValue={data?.growth.growthRate.users}
            icon={Users}
            iconBgClass="bg-blue-600"
            isLoading={isLoading}
          />

          <OverviewCard
            title="Active Jobs"
            value={data?.overview.activeJobs.toLocaleString() || "..."}
            subValue={
              <div className="flex flex-col gap-1">
                <span className="text-gray-500">
                  of {data?.overview.totalJobs.toLocaleString()} total
                </span>
                <span className="text-green-600">
                  +{data?.growth.newJobs} posted
                </span>
              </div>
            }
            icon={Briefcase}
            iconBgClass="bg-green-600"
            isLoading={isLoading}
          />

          <OverviewCard
            title="Organizations"
            value={data?.overview.totalOrganizations.toLocaleString() || "..."}
            subValue={
              <span className="text-purple-600">
                +{data?.growth.newOrganizations} created
              </span>
            }
            growthValue={data?.growth.growthRate.organizations}
            icon={Building2}
            iconBgClass="bg-purple-600"
            isLoading={isLoading}
          />

          <OverviewCard
            title="Total Applications"
            value={data?.overview.totalApplications.toLocaleString() || "..."}
            subValue={
              <span className="text-orange-600">
                +{data?.growth.newApplications} received
              </span>
            }
            icon={FileText}
            iconBgClass="bg-orange-600"
            isLoading={isLoading}
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <SecondaryCard
            title="Total Candidates"
            value={data?.overview.totalCandidates.toLocaleString() || "..."}
            icon={UserCheck}
            iconBgClass="bg-indigo-600"
            isLoading={isLoading}
          />

          <SecondaryCard
            title="Active Recruiters"
            value={data?.overview.activeRecruiters.toLocaleString() || "..."}
            subValue={`of ${data?.overview.totalRecruiters.toLocaleString()} total`}
            icon={Target}
            iconBgClass="bg-teal-600"
            isLoading={isLoading}
          />

          <SecondaryCard
            title="Interviews Scheduled"
            value={data?.activity.interviewsScheduled.toLocaleString() || "..."}
            icon={Calendar}
            iconBgClass="bg-pink-600"
            isLoading={isLoading}
          />

          <SecondaryCard
            title="Successful Hires"
            value={data?.activity.hires.toLocaleString() || "..."}
            icon={Award}
            iconBgClass="bg-yellow-600"
            isLoading={isLoading}
          />
        </div>

        {/* Activity & Growth Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Activity Stats */}
          <Card className="border border-gray-200 rounded-xl"> {/* Basic 1px border */}
            <CardHeader className="border-b border-gray-100 p-4">
              <CardTitle className="text-base font-bold text-gray-900">Activity Overview</CardTitle>
              <CardDescription className="text-xs text-gray-500">
                Key activities during {periodLabels[selectedPeriod].toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <ActivityItem
                    icon={Briefcase}
                    title="Jobs Posted"
                    value={data?.activity.jobsPosted}
                    color="blue"
                    borderColor="blue"
                  />
                  <ActivityItem
                    icon={FileText}
                    title="Applications Received"
                    value={data?.activity.applicationsReceived}
                    color="green"
                    borderColor="green"
                  />
                  <ActivityItem
                    icon={Calendar}
                    title="Interviews Scheduled"
                    value={data?.activity.interviewsScheduled}
                    color="purple"
                    borderColor="purple"
                  />
                  <ActivityItem
                    icon={FileText}
                    title="Offers Sent"
                    value={data?.activity.offersSent}
                    color="orange"
                    borderColor="orange"
                  />
                  <ActivityItem
                    icon={Award}
                    title="Successful Hires"
                    value={data?.activity.hires}
                    color="teal"
                    borderColor="teal"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Growth Metrics - Simplified Table */}
          <Card className="border border-gray-200 rounded-xl"> {/* Basic 1px border */}
            <CardHeader className="border-b border-gray-100 p-4">
              <CardTitle className="flex items-center gap-2 text-base font-bold text-gray-900">
                <Zap className="h-5 w-5 text-yellow-500" /> New Additions
              </CardTitle>
              <CardDescription className="text-xs text-gray-500">
                Quantity of new entities created during {periodLabels[selectedPeriod].toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <GrowthMetricsTable />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Performers Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Organizations */}
          <Card className="border border-gray-200 rounded-xl"> {/* Basic 1px border */}
            <CardHeader className="border-b border-gray-100 p-4">
              <CardTitle className="text-base font-bold text-gray-900">Top Organizations</CardTitle>
              <CardDescription className="text-xs text-gray-500">
                Best performing organizations by hires
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : data?.topPerformers.topOrganizations.length ? (
                <div className="space-y-3">
                  {data.topPerformers.topOrganizations.map((org, index) => (
                    <TopPerformerItem
                      key={org.id}
                      rank={index + 1}
                      name={org.name}
                      subtext={`${org.jobsPosted} jobs posted`}
                      value={org.hires}
                      rankColor={index === 0 ? "text-white" : index === 1 ? "text-white" : index === 2 ? "text-white" : "text-gray-700"}
                      rankBg={index === 0 ? "bg-amber-500" : index === 1 ? "bg-gray-400" : index === 2 ? "bg-orange-400" : "bg-gray-200"}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Building2 className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="font-semibold">No organization data available</p>
                  <p className="text-sm">Check back later for top performers</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Recruiters */}
          <Card className="border border-gray-200 rounded-xl"> {/* Basic 1px border */}
            <CardHeader className="border-b border-gray-100 p-4">
              <CardTitle className="text-base font-bold text-gray-900">Top Recruiters</CardTitle>
              <CardDescription className="text-xs text-gray-500">Best performing recruiters by hires</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : data?.topPerformers.topRecruiters.length ? (
                <div className="space-y-3">
                  {data.topPerformers.topRecruiters.map((recruiter, index) => (
                    <TopPerformerItem
                      key={recruiter.id}
                      rank={index + 1}
                      name={recruiter.name || "Unknown"}
                      subtext={recruiter.email}
                      value={recruiter.hires}
                      extraSubtext={`${recruiter.organizations} organization${recruiter.organizations !== 1 ? "s" : ""}`}
                      rankColor={index === 0 ? "text-white" : index === 1 ? "text-white" : index === 2 ? "text-white" : "text-gray-700"}
                      rankBg={index === 0 ? "bg-amber-500" : index === 1 ? "bg-gray-400" : index === 2 ? "bg-orange-400" : "bg-gray-200"}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="font-semibold">No recruiter data available</p>
                  <p className="text-sm">Check back later for top performers</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Trends Chart */}
        <Card className="border border-gray-200 rounded-xl"> {/* Basic 1px border */}
          <CardHeader className="border-b border-gray-100 p-4">
            <CardTitle className="text-base font-bold text-gray-900">Platform Trends</CardTitle>
            <CardDescription className="text-xs text-gray-500">
              Users, jobs, and applications over time
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            {isLoading ? (
              <Skeleton className="h-80 w-full" />
            ) : trendsChartData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendsChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="period" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                        contentStyle={{
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb',
                            backgroundColor: '#fff',
                            padding: '10px',
                            fontSize: '11px',
                        }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }} />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#0EA5E9"
                      name="New Users"
                      strokeWidth={3}
                      dot={{ fill: "#0EA5E9", r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="jobs"
                      stroke="#10b981"
                      name="New Jobs"
                      strokeWidth={3}
                      dot={{ fill: "#10b981", r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="applications"
                      stroke="#f97316"
                      name="Applications"
                      strokeWidth={3}
                      dot={{ fill: "#f97316", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p className="font-semibold">No trend data available</p>
                  <p className="text-sm">Try selecting a different time period</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
       {/* Floating Feedback Button */}
       <button className="fixed bottom-6 right-6 bg-[#0EA5E9] text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#0284c7] flex items-center gap-2 z-50">
           <MessageSquare size={16}/> Feedback
       </button>
    </div>
  );
};

export default AdminDashboard;