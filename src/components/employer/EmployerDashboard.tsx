import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FileText,
  Clock,
  UserCheck,
  ArrowUpRight,
  ArrowDownRight,
  Filter as FilterIcon,
  AlertTriangle,
  Briefcase,
  Layers,
  TrendingUp,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  getHiringEffectiveness,
  getHiringEffectivenessSummary,
  getOrganizationById,
} from "@/api/endpoints/organizations.api";
import { useParams, useNavigate } from "react-router-dom";
import {
  HiringMetricsPeriod,
  HiringEffectivenessQuery,
} from "@/api/types/organizations.types";
import { DateRange } from "react-day-picker";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
} from "date-fns";

// --- Standardized Sub-components ---

const StatCard = ({
  title,
  value,
  icon: Icon,
  subValue,
  trend,
}: {
  title: string;
  value: string | number;
  icon: any;
  subValue?: string;
  trend?: { value: number; label: string };
}) => (
  <Card className="bg-card border-border rounded-3xl shadow-none">
    <CardContent className="p-6">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
            {title}
          </p>
          <div className="text-2xl font-bold text-foreground">{value}</div>
          {subValue && (
            <p className="text-xs text-muted-foreground">{subValue}</p>
          )}
        </div>
        <div className="p-2 bg-primary/10 rounded-xl">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-2 text-xs">
          {trend.value >= 0 ? (
            <span className="flex items-center text-[hsl(var(--brand-success))] font-bold bg-[hsl(var(--brand-success))]/10 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              {trend.value}%
            </span>
          ) : (
            <span className="flex items-center text-destructive font-bold bg-destructive/10 px-2 py-0.5 rounded-full">
              <ArrowDownRight className="w-3 h-3 mr-1" />
              {Math.abs(trend.value)}%
            </span>
          )}
          <span className="text-muted-foreground font-medium">
            {trend.label}
          </span>
        </div>
      )}
    </CardContent>
  </Card>
);

const MetricItem = ({
  label,
  value,
  colorClass = "text-foreground",
}: {
  label: string;
  value: string;
  colorClass?: string;
}) => (
  <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-secondary/50 border border-border">
    <span className={`text-lg font-bold ${colorClass}`}>{value}</span>
    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-1 text-center">
      {label}
    </span>
  </div>
);

export function EmployerDashboard() {
  const { companyId } = useParams();
  const navigate = useNavigate();

  const [queryParams, setQueryParams] = useState<HiringEffectivenessQuery>({
    period: HiringMetricsPeriod.MONTH,
    compareWithPrevious: true,
  });

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  const updateQueryParams = (updates: Partial<HiringEffectivenessQuery>) => {
    setQueryParams((prev) => ({ ...prev, ...updates }));
  };

  const handlePeriodChange = (period: HiringMetricsPeriod) => {
    updateQueryParams({ period });
    const now = new Date();
    let newRange: DateRange;

    switch (period) {
      case HiringMetricsPeriod.WEEK:
        newRange = {
          from: startOfWeek(now, { weekStartsOn: 1 }),
          to: endOfWeek(now, { weekStartsOn: 1 }),
        };
        break;
      case HiringMetricsPeriod.MONTH:
        newRange = { from: startOfMonth(now), to: endOfMonth(now) };
        break;
      case HiringMetricsPeriod.QUARTER:
        newRange = { from: startOfQuarter(now), to: endOfQuarter(now) };
        break;
      case HiringMetricsPeriod.YEAR:
        newRange = { from: startOfYear(now), to: endOfYear(now) };
        break;
      default:
        return;
    }
    setDateRange(newRange);
    updateQueryParams({
      startDate: newRange.from?.toISOString(),
      endDate: newRange.to?.toISOString(),
    });
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from && range?.to) {
      updateQueryParams({
        startDate: range.from.toISOString(),
        endDate: range.to.toISOString(),
      });
    }
  };

  const { data: company, isLoading: companyLoading } = useQuery({
    queryKey: ["company", companyId],
    queryFn: () => getOrganizationById(companyId!),
    enabled: !!companyId,
  });

  const { data: hiringSummary, isLoading: summaryLoading } = useQuery({
    queryKey: ["hiring-summary", companyId],
    queryFn: () => getHiringEffectivenessSummary(companyId!),
    enabled: !!companyId,
  });

  const { data: hiringEffectiveness, isLoading: effectivenessLoading } =
    useQuery({
      queryKey: ["hiring-effectiveness", companyId, queryParams],
      queryFn: () =>
        getHiringEffectiveness({
          organizationId: companyId!,
          query: queryParams,
        }),
      enabled: !!companyId,
    });

  const isLoading = companyLoading || summaryLoading || effectivenessLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-xs font-bold uppercase text-muted-foreground animate-pulse">
            Loading dashboard data...
          </p>
        </div>
      </div>
    );
  }

  if (!hiringEffectiveness) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center text-muted-foreground font-bold uppercase text-xs">
        No data available
      </div>
    );
  }

  const qualityData = [
    {
      name: "Score",
      value: hiringEffectiveness.qualityMetrics.averageMatchingScore,
    },
    {
      name: "Remaining",
      value: 100 - hiringEffectiveness.qualityMetrics.averageMatchingScore,
    },
  ];
  const COLORS = ["hsl(var(--primary))", "hsl(var(--muted))"];

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-4 md:p-8 space-y-8 animate-fade-in">
      {/* 1. Header & Filter Toolbar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Hiring Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Overview for{" "}
            <span className="font-bold text-primary">{company?.name}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-card border border-border p-2 rounded-2xl shadow-none">
          <Select
            value={queryParams.period}
            onValueChange={(value) =>
              handlePeriodChange(value as HiringMetricsPeriod)
            }
          >
            <SelectTrigger className="h-9 w-[130px] border-none bg-secondary/50 rounded-xl focus:ring-0 text-xs font-bold uppercase">
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-primary" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border">
              <SelectItem value={HiringMetricsPeriod.WEEK}>Weekly</SelectItem>
              <SelectItem value={HiringMetricsPeriod.MONTH}>Monthly</SelectItem>
              <SelectItem value={HiringMetricsPeriod.QUARTER}>
                Quarterly
              </SelectItem>
              <SelectItem value={HiringMetricsPeriod.YEAR}>Yearly</SelectItem>
            </SelectContent>
          </Select>

          <div className="h-5 w-px bg-border mx-1" />

          <Select
            value={queryParams.jobId || "all"}
            onValueChange={(value) =>
              updateQueryParams({ jobId: value === "all" ? undefined : value })
            }
          >
            <SelectTrigger className="h-9 w-[180px] border-none bg-transparent hover:bg-secondary/50 rounded-xl focus:ring-0 text-xs font-bold uppercase">
              <div className="flex items-center gap-2 truncate">
                <Briefcase className="w-3.5 h-3.5 text-primary" />
                <span className="truncate">
                  {queryParams.jobId
                    ? hiringEffectiveness.timeMetrics.byJob.find(
                        (j: any) => j.jobId === queryParams.jobId
                      )?.jobTitle
                    : "All Jobs"}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border">
              <SelectItem value="all">All Positions</SelectItem>
              {hiringEffectiveness.timeMetrics.byJob.map((job: any) => (
                <SelectItem key={job.jobId} value={job.jobId}>
                  {job.jobTitle}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="h-5 w-px bg-border mx-1" />

          <div className="transform scale-90 origin-left">
            <DatePickerWithRange
              date={dateRange}
              onDateChange={handleDateRangeChange}
            />
          </div>

          <Button
            variant={queryParams.compareWithPrevious ? "default" : "outline"}
            size="sm"
            onClick={() =>
              updateQueryParams({
                compareWithPrevious: !queryParams.compareWithPrevious,
              })
            }
            className={`h-9 px-4 rounded-xl text-xs font-bold uppercase ${
              queryParams.compareWithPrevious
                ? "bg-primary text-white"
                : "text-muted-foreground"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 mr-2" />
            Comparison
          </Button>
        </div>
      </div>

      {/* 2. Key Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Jobs"
          value={hiringEffectiveness.overview.activeJobs}
          icon={Briefcase}
          subValue="Positions open"
        />
        <StatCard
          title="Total Applications"
          value={hiringEffectiveness.overview.totalApplications}
          icon={FileText}
          trend={
            hiringEffectiveness.comparison
              ? {
                  value:
                    hiringEffectiveness.comparison.changes.conversionRate
                      .change,
                  label: "vs previous",
                }
              : undefined
          }
        />
        <StatCard
          title="Total Hires"
          value={hiringEffectiveness.overview.totalHires}
          icon={UserCheck}
          trend={
            hiringEffectiveness.comparison
              ? {
                  value:
                    hiringEffectiveness.comparison.changes.totalHires
                      .percentage,
                  label: "vs previous",
                }
              : undefined
          }
        />
        <StatCard
          title="Avg Time to Hire"
          value={`${hiringEffectiveness.timeMetrics.average} days`}
          icon={Clock}
          subValue={`Median: ${hiringEffectiveness.timeMetrics.median} days`}
          trend={
            hiringEffectiveness.comparison
              ? {
                  value:
                    -hiringEffectiveness.comparison.changes.timeToHire
                      .percentage,
                  label: "efficiency",
                }
              : undefined
          }
        />
      </div>

      {/* 3 & 4. Conversion & Quality Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-stretch">
        <Card className="xl:col-span-2 border-none shadow-none bg-gradient-to-br from-[hsl(217,91%,60%)] to-[hsl(210,100%,47%)] text-white rounded-3xl flex flex-col">
          <CardHeader className="p-6 pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl font-bold text-white">
                  <FilterIcon className="w-5 h-5 text-blue-100" />
                  Conversion Funnel
                </CardTitle>
                <CardDescription className="text-xs font-bold text-blue-100/60 uppercase tracking-widest mt-1">
                  Efficiency from Application to Hire
                </CardDescription>
              </div>
              <Badge className="bg-white/10 text-white border-none text-[10px] font-bold uppercase">
                Live
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6 pt-2 flex-1 flex flex-col justify-between">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-100 mb-1">
                  Application
                </p>
                <div className="text-2xl font-bold">
                  {hiringEffectiveness.conversionRates.applicationToInterview.toFixed(1)}%
                </div>
                <p className="text-[10px] font-medium text-blue-100/50 uppercase mt-1">
                  To Interview
                </p>
              </div>

              <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-100 mb-1">
                  Interview
                </p>
                <div className="text-2xl font-bold">
                  {hiringEffectiveness.conversionRates.interviewToOffer.toFixed(1)}%
                </div>
                <p className="text-[10px] font-medium text-blue-100/50 uppercase mt-1">
                  To Offer
                </p>
              </div>

              <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20">
                <p className="text-[10px] font-bold uppercase tracking-widest text-yellow-300 mb-1">
                  Final Hire
                </p>
                <div className="text-2xl font-bold text-white">
                  {hiringEffectiveness.conversionRates.offerToHire.toFixed(1)}%
                </div>
                <p className="text-[10px] font-bold text-white/80 uppercase mt-1">
                  Acceptance
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-100/70">
                  Current Status
                </span>
                <span className="text-xs font-semibold text-white">
                  Performance is stable compared to last period
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-100/70">
                  Overall Rate
                </span>
                <span className="text-lg font-bold text-white">
                  {hiringEffectiveness.conversionRates.overallFunnel.toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-1 border-border bg-card rounded-3xl shadow-none flex flex-col">
          <CardHeader className="p-6 pb-0">
            <CardTitle className="text-lg font-bold text-foreground">
              Quality of Hire
            </CardTitle>
            <CardDescription className="text-xs font-bold uppercase text-muted-foreground">
              Matching & Acceptance
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 flex-1 flex flex-col justify-center">
            <div className="h-[140px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={qualityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={65}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                  >
                    {qualityData.map((_entry: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        cornerRadius={8}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {hiringEffectiveness.qualityMetrics.averageMatchingScore.toFixed(0)}
                </span>
                <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter">
                  Score
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <MetricItem
                label="Offers"
                value={`${hiringEffectiveness.qualityMetrics.offerAcceptanceRate.toFixed(0)}%`}
                colorClass="text-[hsl(var(--brand-success))]"
              />
              <MetricItem
                label="Interviews"
                value={hiringEffectiveness.qualityMetrics.averageInterviewsPerHire.toFixed(1)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-border bg-card rounded-3xl shadow-none">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-lg font-bold text-foreground">
              Pipeline Distribution
            </CardTitle>
            <CardDescription className="text-xs font-bold uppercase text-muted-foreground">
              Candidates currently in each stage
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={hiringEffectiveness.pipelineMetrics.stageMetrics}
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={true}
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="stageName"
                    type="category"
                    width={100}
                    tick={{
                      fontSize: 10,
                      fill: "hsl(var(--muted-foreground))",
                      fontWeight: "700",
                      textTransform: "uppercase",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--primary)/0.05)" }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid hsl(var(--border))",
                      fontWeight: "bold",
                    }}
                  />
                  <Bar
                    dataKey="candidatesInStage"
                    fill="hsl(var(--primary))"
                    radius={[0, 4, 4, 0]}
                    barSize={24}
                    name="Candidates"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card rounded-3xl shadow-none">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-lg font-bold text-foreground">
              Time to Hire Trend
            </CardTitle>
            <CardDescription className="text-xs font-bold uppercase text-muted-foreground">
              Average days to hire over time
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={hiringEffectiveness.timeMetrics.trend}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorDays" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="period"
                    tick={{
                      fontSize: 11,
                      fill: "hsl(var(--muted-foreground))",
                      fontWeight: "600",
                    }}
                    axisLine={false}
                    tickLine={false}
                    tickMargin={10}
                  />
                  <YAxis
                    tick={{
                      fontSize: 11,
                      fill: "hsl(var(--muted-foreground))",
                      fontWeight: "600",
                    }}
                    axisLine={false}
                    tickLine={false}
                    label={{
                      value: "Days",
                      angle: -90,
                      position: "insideLeft",
                      style: {
                        fill: "hsl(var(--muted-foreground))",
                        fontSize: "10px",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                      },
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid hsl(var(--border))",
                      fontWeight: "bold",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="averageDays"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorDays)"
                    name="Avg Days"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 7. Bottlenecks Warning */}
      {hiringEffectiveness.pipelineMetrics.bottlenecks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hiringEffectiveness.pipelineMetrics.bottlenecks.map(
            (bottleneck: any, index: number) => (
              <div
                key={index}
                className="flex flex-col bg-card border border-border rounded-3xl p-6 shadow-none"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-destructive/10 rounded-2xl">
                    <AlertTriangle className="w-6 h-6 text-destructive" />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">
                      Bottleneck
                    </p>
                    <p className="text-xl font-bold text-destructive">
                      {bottleneck.averageTime} <span className="text-xs">days</span>
                    </p>
                  </div>
                </div>
                
                <h4 className="text-lg font-bold text-foreground mb-2">
                  {bottleneck.stageName}
                </h4>
                
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                  {bottleneck.reason}
                </p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}