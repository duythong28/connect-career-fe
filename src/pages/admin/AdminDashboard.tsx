import { useState } from "react";
import {
  Briefcase,
  Building2,
  Users,
  FileText,
  UserCheck,
  Calendar,
  Award,
  Target,
  Clock,
  Zap,
  LayoutDashboard,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { getBackOfficeDashboardStats } from "@/api/endpoints/back-office.api";
import { StatsPeriod } from "@/api/types/back-office.types";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const periodLabels: Record<StatsPeriod, string> = {
  [StatsPeriod.TODAY]: "Today",
  [StatsPeriod.WEEK]: "This Week",
  [StatsPeriod.MONTH]: "This Month",
  [StatsPeriod.QUARTER]: "This Quarter",
  [StatsPeriod.YEAR]: "This Year",
  [StatsPeriod.ALL_TIME]: "All Time",
};

const AdminDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<StatsPeriod>(StatsPeriod.MONTH);

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
    applications: data?.trends.applicationsByPeriod?.find((a) => a.period === period)?.count || 0,
    users: data?.trends.usersByPeriod?.find((u) => u.period === period)?.count || 0,
    jobs: data?.trends.jobsByPeriod?.find((j) => j.period === period)?.count || 0,
  }));

  // --- Styled Components ---

  const GrowthIndicator = ({ value, label = "" }: { value: number; label?: string }) => (
    <div
      className={cn(
        "flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full w-fit",
        value > 0
          ? "bg-[hsl(var(--brand-success)/0.1)] text-[hsl(var(--brand-success))]"
          : value < 0
          ? "bg-destructive/10 text-destructive"
          : "bg-muted text-muted-foreground"
      )}
    >
      {value > 0 ? (
        <ArrowUpRight className="h-3 w-3" />
      ) : value < 0 ? (
        <ArrowDownRight className="h-3 w-3" />
      ) : null}
      {value > 0 ? "+" : ""}
      {value.toFixed(1)}% {label}
    </div>
  );

  const OverviewCard = ({ title, value, subValue, growthValue, icon: Icon, iconBgClass, isLoading }) => (
    <Card className="group relative overflow-hidden border-border bg-card rounded-3xl transition-all duration-300">
      <CardContent className="p-6">
        {isLoading ? (
          <Skeleton className="h-20 w-full rounded-xl" />
        ) : (
          <div className="flex justify-between items-start">
            <div className="space-y-3">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{title}</p>
              <h3 className="text-2xl font-bold tracking-tight text-foreground">{value}</h3>
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-muted-foreground">{subValue}</div>
                {growthValue !== undefined && <GrowthIndicator value={growthValue} />}
              </div>
            </div>
            <div
              className={cn(
                "p-3 rounded-2xl text-white transition-transform group-hover:scale-110 duration-300",
                iconBgClass
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const TopPerformerItem = ({ name, subtext, value, rank, rankBg, rankColor, extraSubtext = null }) => (
    <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card hover:bg-accent/50 transition-all duration-200">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex items-center justify-center min-w-[32px] h-8 rounded-full text-[10px] font-bold",
            rankBg,
            rankColor
          )}
        >
          {rank}
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-foreground truncate">{name}</h4>
          <p className="text-xs text-muted-foreground truncate">{subtext}</p>
          {extraSubtext && (
            <p className="text-[10px] font-bold text-primary uppercase mt-0.5">{extraSubtext}</p>
          )}
        </div>
      </div>
      <div className="text-right ml-4">
        <p className="text-lg font-bold text-[hsl(var(--brand-success))] leading-none">{value}</p>
        <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">hires</p>
      </div>
    </div>
  );

  if (isError)
    return <div className="p-20 text-center text-destructive font-bold">Failed to load dashboard data.</div>;

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-6 md:p-10 text-foreground animate-fade-in">
      <div className="max-w-[1400px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-primary p-1.5 rounded-lg text-primary-foreground">
                <LayoutDashboard className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Back Office</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm font-medium mt-1">
              System health monitoring and platform metrics.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-card p-1.5 rounded-xl border border-border">
            <Clock className="h-4 w-4 text-muted-foreground ml-2" />
            <Select value={selectedPeriod} onValueChange={(v) => setSelectedPeriod(v as StatsPeriod)}>
              <SelectTrigger className="w-[160px] h-9 border-none shadow-none font-bold text-xs focus:ring-0 bg-transparent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {Object.entries(periodLabels).map(([v, l]) => (
                  <SelectItem key={v} value={v} className="text-xs font-semibold">
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Data Range Indicator */}
        {data?.period && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-card rounded-xl border border-border text-xs font-bold text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            {formatDate(data.period.startDate)} — {formatDate(data.period.endDate)}
          </div>
        )}

        {/* 1. Primary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <OverviewCard
            title="Total Users"
            value={data?.overview.totalUsers.toLocaleString() || "..."}
            subValue={<span className="text-primary">+{data?.growth.newUsers} new members</span>}
            growthValue={data?.growth.growthRate.users}
            icon={Users}
            iconBgClass="bg-primary"
            isLoading={isLoading}
          />
          <OverviewCard
            title="Active Jobs"
            value={data?.overview.activeJobs.toLocaleString() || "..."}
            subValue={
              <div className="flex flex-col text-[11px]">
                <span className="text-muted-foreground">of {data?.overview.totalJobs.toLocaleString()} total</span>
                <span className="text-[hsl(var(--brand-success))]">+{data?.growth.newJobs} posted</span>
              </div>
            }
            icon={Briefcase}
            iconBgClass="bg-[hsl(var(--brand-success))]"
            isLoading={isLoading}
          />
          <OverviewCard
            title="Organizations"
            value={data?.overview.totalOrganizations.toLocaleString() || "..."}
            subValue={<span className="text-amber-600">+{data?.growth.newOrganizations} created</span>}
            growthValue={data?.growth.growthRate.organizations}
            icon={Building2}
            iconBgClass="bg-amber-500"
            isLoading={isLoading}
          />
          <OverviewCard
            title="Total Applications"
            value={data?.overview.totalApplications.toLocaleString() || "..."}
            subValue={<span className="text-destructive">+{data?.growth.newApplications} received</span>}
            icon={FileText}
            iconBgClass="bg-destructive"
            isLoading={isLoading}
          />
        </div>

        {/* 2. Secondary Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Candidates", val: data?.overview.totalCandidates, icon: UserCheck, color: "bg-blue-500" },
            {
              label: "Active Recruiters",
              val: data?.overview.activeRecruiters,
              sub: `of ${data?.overview.totalRecruiters}`,
              icon: Target,
              color: "bg-teal-500",
            },
            { label: "Interviews", val: data?.activity.interviewsScheduled, icon: Calendar, color: "bg-pink-500" },
            { label: "Hires", val: data?.activity.hires, icon: Award, color: "bg-orange-500" },
          ].map((item, i) => (
            <Card key={i} className="border-border bg-card rounded-2xl overflow-hidden">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                    {item.label}
                  </p>
                  <p className="text-lg font-bold">{item.val?.toLocaleString() || "..."}</p>
                  {item.sub && <p className="text-[10px] text-muted-foreground font-medium">{item.sub}</p>}
                </div>
                <div className={cn("p-2 rounded-lg text-white", item.color)}>
                  <item.icon className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 3. Trends & Growth Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <Card className="lg:col-span-2 border-border bg-card rounded-3xl overflow-hidden">
            <CardHeader className="p-6 pb-0">
              <CardTitle className="text-lg font-bold">Platform Growth Trends</CardTitle>
              <CardDescription className="text-xs font-bold text-muted-foreground uppercase">
                Users, Jobs, and Applications volume
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendsChartData}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="period"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))", fontWeight: 600 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))", fontWeight: 600 }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid hsl(var(--border))",
                        backgroundColor: "hsl(var(--card))",
                      }}
                    />
                    <Legend
                      iconType="circle"
                      wrapperStyle={{ paddingTop: "20px", fontSize: "11px", fontWeight: "bold" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="users"
                      name="New Users"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorUsers)"
                    />
                    <Area
                      type="monotone"
                      dataKey="jobs"
                      name="New Jobs"
                      stroke="hsl(var(--brand-success))"
                      strokeWidth={3}
                      fillOpacity={0}
                    />
                    <Area
                      type="monotone"
                      dataKey="applications"
                      name="Applications"
                      stroke="#f97316"
                      strokeWidth={3}
                      fillOpacity={0}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Activity Overview List */}
          <Card className="border-border bg-card rounded-3xl overflow-hidden">
            <CardHeader className="p-6 pb-2 border-b border-border">
              <CardTitle className="text-lg font-bold">Activity Overview</CardTitle>
              <CardDescription className="text-[10px] font-bold text-primary uppercase">
                {periodLabels[selectedPeriod]}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {[
                { label: "Jobs Posted", val: data?.activity.jobsPosted, icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Applications", val: data?.activity.applicationsReceived, icon: FileText, color: "text-[hsl(var(--brand-success))]", bg: "bg-[hsl(var(--brand-success)/0.05)]" },
                { label: "Interviews", val: data?.activity.interviewsScheduled, icon: Calendar, color: "text-purple-600", bg: "bg-purple-50" },
                { label: "Offers Sent", val: data?.activity.offersSent, icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
                { label: "Successful Hires", val: data?.activity.hires, icon: Award, color: "text-rose-600", bg: "bg-rose-50" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between group cursor-default">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-xl transition-colors", item.bg, item.color)}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                      {item.label}
                    </span>
                  </div>
                  <span className={cn("text-lg font-black", item.color)}>{item.val?.toLocaleString() || 0}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* 4. Performers Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Organizations */}
          <Card className="border-border bg-card rounded-3xl overflow-hidden">
            <CardHeader className="p-6 pb-2 flex flex-row items-center justify-between border-b border-border">
              <div>
                <CardTitle className="text-lg font-bold">Top Organizations</CardTitle>
                <CardDescription className="text-[10px] font-bold text-muted-foreground uppercase">
                  Best performance by hires
                </CardDescription>
              </div>
              <Building2 className="w-5 h-5 text-muted/30" />
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              {data?.topPerformers.topOrganizations.length ? (
                data.topPerformers.topOrganizations.map((org, i) => (
                  <TopPerformerItem
                    key={org.id}
                    rank={i + 1}
                    name={org.name}
                    subtext={`${org.jobsPosted} jobs posted`}
                    value={org.hires}
                    rankBg={i === 0 ? "bg-amber-400" : i === 1 ? "bg-slate-300" : i === 2 ? "bg-orange-300" : "bg-muted"}
                    rankColor="text-white"
                  />
                ))
              ) : (
                <div className="text-center py-10 text-muted-foreground text-xs font-bold">No organization data</div>
              )}
            </CardContent>
          </Card>

          {/* Top Recruiters */}
          <Card className="border-border bg-card rounded-3xl overflow-hidden">
            <CardHeader className="p-6 pb-2 flex flex-row items-center justify-between border-b border-border">
              <div>
                <CardTitle className="text-lg font-bold">Top Recruiters</CardTitle>
                <CardDescription className="text-[10px] font-bold text-muted-foreground uppercase">
                  Individual hiring leaders
                </CardDescription>
              </div>
              <Users className="w-5 h-5 text-muted/30" />
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              {data?.topPerformers.topRecruiters.length ? (
                data.topPerformers.topRecruiters.map((rec, i) => (
                  <TopPerformerItem
                    key={rec.id}
                    rank={i + 1}
                    name={rec.name || "Unknown"}
                    subtext={rec.email}
                    value={rec.hires}
                    extraSubtext={`${rec.organizations} ${rec.organizations === 1 ? "org" : "orgs"}`}
                    rankBg={i === 0 ? "bg-primary" : i === 1 ? "bg-primary/80" : i === 2 ? "bg-primary/60" : "bg-muted"}
                    rankColor="text-white"
                  />
                ))
              ) : (
                <div className="text-center py-10 text-muted-foreground text-xs font-bold">No recruiter data</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;