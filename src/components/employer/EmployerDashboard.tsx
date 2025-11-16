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
  LineChart,
  Line,
} from "recharts";
import {
  Users,
  FileText,
  TrendingUp,
  Calendar,
  Plus,
  BrainCircuit,
  Target,
  Clock,
  Award,
  UserCheck,
  Building,
  ArrowUpRight,
  ArrowDownRight,
  Settings,
  Filter,
  AlertTriangle,
  TrendingDown,
  Zap,
  Star,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  getHiringEffectiveness,
  getHiringEffectivenessSummary,
  getOrganizationById,
} from "@/api/endpoints/organizations.api";
import { useParams, useNavigate } from "react-router-dom";
import {
  HiringSummary,
  HiringEffectiveness,
  HiringMetricsPeriod,
  HiringEffectivenessQuery,
} from "@/api/types/organizations.types";
import { DateRange } from "react-day-picker";
import { addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear } from "date-fns";

export function EmployerDashboard() {
  const { companyId } = useParams();
  const navigate = useNavigate();

  // State for managing query parameters
  const [queryParams, setQueryParams] = useState<HiringEffectivenessQuery>({
    period: HiringMetricsPeriod.MONTH,
    compareWithPrevious: true,
  });

  // Initialize with current month range
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });

  // Update query parameters
  const updateQueryParams = (updates: Partial<HiringEffectivenessQuery>) => {
    setQueryParams((prev) => ({ ...prev, ...updates }));
  };

  // Handle period change - auto-set date range based on period
  const handlePeriodChange = (period: HiringMetricsPeriod) => {
    updateQueryParams({ period });
    
    const now = new Date();
    let newRange: DateRange;

    switch (period) {
      case HiringMetricsPeriod.WEEK:
        newRange = {
          from: startOfWeek(now, { weekStartsOn: 1 }),
          to: endOfWeek(now, { weekStartsOn: 1 })
        };
        break;
      case HiringMetricsPeriod.MONTH:
        newRange = {
          from: startOfMonth(now),
          to: endOfMonth(now)
        };
        break;
      case HiringMetricsPeriod.QUARTER:
        newRange = {
          from: startOfQuarter(now),
          to: endOfQuarter(now)
        };
        break;
      case HiringMetricsPeriod.YEAR:
        newRange = {
          from: startOfYear(now),
          to: endOfYear(now)
        };
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

  // Handle date range changes
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from && range?.to) {
      updateQueryParams({
        startDate: range.from.toISOString(),
        endDate: range.to.toISOString(),
      });
    }
  };

  // Get company data
  const { data: company, isLoading: companyLoading } = useQuery({
    queryKey: ["company", companyId],
    queryFn: () => getOrganizationById(companyId!),
    enabled: !!companyId,
  });

  // Get hiring effectiveness summary for quick stats
  const { data: hiringSummary, isLoading: summaryLoading } = useQuery({
    queryKey: ["hiring-summary", companyId],
    queryFn: () => getHiringEffectivenessSummary(companyId!),
    enabled: !!companyId,
  });

  // Get detailed hiring effectiveness data with dynamic query
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
      <div className="min-h-screen bg-gray-50">
        <div className="space-y-8 p-4 md:p-6 lg:p-8">
          <div className="animate-pulse">
            <div className="bg-gray-200 rounded-xl h-40 md:h-48 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-24"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hiringEffectiveness) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">No data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="space-y-6 md:space-y-8 p-4 md:p-6 lg:p-8">
        {/* Highlight Section */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-xl p-6 md:p-8 text-white">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
              Welcome back, {company?.name || "Company"}! 🚀
            </h1>
            <p className="text-blue-50 text-base md:text-lg leading-relaxed mb-6">
              You have {hiringEffectiveness.overview.totalApplications} total
              applications, {hiringEffectiveness.overview.activeCandidates} active
              candidates across {hiringEffectiveness.overview.activeJobs} active
              jobs.
            </p>
          </div>
          
          {/* Key Stats in Highlight */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-6 h-6 text-blue-100" />
                <span className="text-sm font-medium text-blue-100">Active Jobs</span>
              </div>
              <p className="text-2xl font-bold">{hiringEffectiveness.overview.activeJobs}</p>
            </div>
            
            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-6 h-6 text-blue-100" />
                <span className="text-sm font-medium text-blue-100">Applications</span>
              </div>
              <p className="text-2xl font-bold">{hiringEffectiveness.overview.totalApplications}</p>
            </div>
            
            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-6 h-6 text-blue-100" />
                <span className="text-sm font-medium text-blue-100">Offers Made</span>
              </div>
              <p className="text-2xl font-bold">{hiringEffectiveness.overview.totalOffers}</p>
            </div>
            
            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <UserCheck className="w-6 h-6 text-blue-100" />
                <span className="text-sm font-medium text-blue-100">Total Hires</span>
              </div>
              <p className="text-2xl font-bold">{hiringEffectiveness.overview.totalHires}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="bg-white/20 text-white border-white/20 hover:bg-white/30 hover:border-white/30"
              onClick={() => navigate(`/company/${companyId}/jobs/post`)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Post New Job
            </Button>
            <Button
              variant="outline"
              className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:border-white/40"
            >
              <BrainCircuit className="w-4 h-4 mr-2" />
              View Full Analytics
            </Button>
          </div>
        </div>

        {/* Analytics Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Settings className="w-5 h-5" />
              Analytics Filters
            </CardTitle>
            <CardDescription className="text-base">
              Configure your analytics view - Period determines granularity, Date Range sets the timeframe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {/* Period/Granularity Filter */}
              <div className="space-y-3">
                <label className="text-base font-medium">
                  Period Granularity
                </label>
                <Select
                  value={queryParams.period}
                  onValueChange={(value) => handlePeriodChange(value as HiringMetricsPeriod)}
                >
                  <SelectTrigger className="text-base">
                    <SelectValue placeholder="Select granularity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={HiringMetricsPeriod.WEEK}>
                      Weekly Data
                    </SelectItem>
                    <SelectItem value={HiringMetricsPeriod.MONTH}>
                      Monthly Data
                    </SelectItem>
                    <SelectItem value={HiringMetricsPeriod.QUARTER}>
                      Quarterly Data
                    </SelectItem>
                    <SelectItem value={HiringMetricsPeriod.YEAR}>
                      Yearly Data
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">
                  How data is grouped (week/month/quarter/year)
                </p>
              </div>

              {/* Date Range Filter */}
              <div className="space-y-3">
                <label className="text-base font-medium">
                  Date Range
                </label>
                <DatePickerWithRange
                  date={dateRange}
                  onDateChange={handleDateRangeChange}
                />
                <p className="text-sm text-gray-500">
                  Select the specific time period to analyze
                </p>
              </div>

              {/* Job Filter */}
              <div className="space-y-3">
                <label className="text-base font-medium">
                  Specific Job
                </label>
                <Select
                  value={queryParams.jobId || "all"}
                  onValueChange={(value) =>
                    updateQueryParams({
                      jobId: value === "all" ? undefined : value,
                    })
                  }
                >
                  <SelectTrigger className="text-base">
                    <SelectValue placeholder="All jobs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Jobs</SelectItem>
                    {hiringEffectiveness.timeMetrics.byJob.map((job) => (
                      <SelectItem key={job.jobId} value={job.jobId}>
                        {job.jobTitle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">
                  Filter by specific job position
                </p>
              </div>

              {/* Compare Toggle */}
              <div className="space-y-3">
                <label className="text-base font-medium">
                  Compare with Previous Period
                </label>
                <Button
                  variant={
                    queryParams.compareWithPrevious ? "default" : "outline"
                  }
                  onClick={() =>
                    updateQueryParams({
                      compareWithPrevious: !queryParams.compareWithPrevious,
                    })
                  }
                  className="w-full justify-start text-base"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {queryParams.compareWithPrevious ? "Enabled" : "Disabled"}
                </Button>
                <p className="text-sm text-gray-500">
                  Show comparison with previous period
                </p>
              </div>
            </div>

            {/* Quick Period Buttons */}
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                { label: "This Week", range: () => ({ from: startOfWeek(new Date(), { weekStartsOn: 1 }), to: endOfWeek(new Date(), { weekStartsOn: 1 }) }), period: HiringMetricsPeriod.WEEK },
                { label: "Last Week", range: () => ({ from: subDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 7), to: subDays(endOfWeek(new Date(), { weekStartsOn: 1 }), 7) }), period: HiringMetricsPeriod.WEEK },
                { label: "This Month", range: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }), period: HiringMetricsPeriod.MONTH },
                { label: "Last Month", range: () => { const lastMonth = subDays(startOfMonth(new Date()), 1); return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) }; }, period: HiringMetricsPeriod.MONTH },
                { label: "This Quarter", range: () => ({ from: startOfQuarter(new Date()), to: endOfQuarter(new Date()) }), period: HiringMetricsPeriod.QUARTER },
                { label: "This Year", range: () => ({ from: startOfYear(new Date()), to: endOfYear(new Date()) }), period: HiringMetricsPeriod.YEAR }
              ].map((preset) => (
                <Badge 
                  key={preset.label}
                  variant="outline" 
                  className="cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-colors px-3 py-1"
                  onClick={() => {
                    const range = preset.range();
                    handleDateRangeChange(range);
                    updateQueryParams({ period: preset.period });
                  }}
                >
                  {preset.label}
                </Badge>
              ))}
            </div>

            {/* Current Filter Summary */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-medium text-base">Current view:</span>
                <Badge variant="secondary">{queryParams.period} granularity</Badge>
                {queryParams.jobId && <Badge variant="outline">Specific Job</Badge>}
                {queryParams.compareWithPrevious && <Badge variant="outline">With Comparison</Badge>}
                {dateRange && dateRange.from && dateRange.to && (
                  <Badge variant="outline">
                    {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Hiring Conversion Funnel</CardTitle>
            <CardDescription className="text-base">
              Track candidates through your hiring process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-base font-medium">Application → Interview</span>
                  <span className="text-xl font-bold text-blue-700">
                    {hiringEffectiveness.conversionRates.applicationToInterview.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="p-4 bg-purple-50 border border-purple-100 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-base font-medium">Interview → Offer</span>
                  <span className="text-xl font-bold text-purple-700">
                    {hiringEffectiveness.conversionRates.interviewToOffer.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-base font-medium">Offer → Hire</span>
                  <span className="text-xl font-bold text-green-700">
                    {hiringEffectiveness.conversionRates.offerToHire.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="p-4 bg-gray-100 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-base font-semibold">Overall Success</span>
                  <span className="text-xl font-bold text-gray-800">
                    {hiringEffectiveness.conversionRates.overallFunnel.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pipeline Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Current Pipeline Distribution</CardTitle>
            <CardDescription className="text-base">Candidates in each hiring stage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={hiringEffectiveness.pipelineMetrics.stageMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="stageName"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={14}
                  />
                  <YAxis fontSize={14} />
                  <Tooltip />
                  <Bar
                    dataKey="candidatesInStage"
                    fill="#3b82f6"
                    name="Candidates"
                  />
                </BarChart>
              </ResponsiveContainer>

              <div className="space-y-4">
                {hiringEffectiveness.pipelineMetrics.stageMetrics.map(
                  (stage, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-base font-semibold capitalize">
                          {stage.stageName}
                        </span>
                        <span className="text-xl font-bold">
                          {stage.candidatesInStage}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                        <div className="text-center p-2 bg-blue-50 rounded">
                          <div className="font-medium">Avg Time</div>
                          <div>{stage.averageTimeInStage.toFixed(1)} days</div>
                        </div>
                        <div className="text-center p-2 bg-red-50 rounded">
                          <div className="font-medium">Drop-off</div>
                          <div>{stage.dropOffRate.toFixed(0)}%</div>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded">
                          <div className="font-medium">Conversion</div>
                          <div>{stage.conversionToNext.toFixed(0)}%</div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time Metrics and Quality */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Time to Hire Analysis</CardTitle>
              <CardDescription className="text-base">Time metrics breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-center">
                  <Clock className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                  <p className="text-2xl font-bold text-blue-800">
                    {hiringEffectiveness.timeMetrics.average}
                  </p>
                  <p className="text-base text-blue-600">Average Days</p>
                </div>
                <div className="p-4 bg-green-50 border border-green-100 rounded-lg text-center">
                  <Target className="w-8 h-8 mx-auto text-green-600 mb-2" />
                  <p className="text-2xl font-bold text-green-800">
                    {hiringEffectiveness.timeMetrics.median}
                  </p>
                  <p className="text-base text-green-600">Median Days</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-base font-semibold">Time by Job Position</h4>
                {hiringEffectiveness.timeMetrics.byJob.slice(0, 5).map((job, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-base font-medium truncate mr-4">{job.jobTitle}</span>
                    <div className="text-right flex-shrink-0">
                      <div className="text-base font-bold">
                        {job.averageDays} days
                      </div>
                      <div className="text-sm text-gray-500">
                        {job.count} hires
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Quality Metrics</CardTitle>
              <CardDescription className="text-base">Candidate quality and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-base font-medium">Average Matching Score</span>
                    <span className="text-xl font-bold text-blue-600">
                      {hiringEffectiveness.qualityMetrics.averageMatchingScore.toFixed(1)}/100
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                      style={{
                        width: `${hiringEffectiveness.qualityMetrics.averageMatchingScore}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-purple-50 border border-purple-100 rounded-lg text-center">
                    <p className="text-xl font-bold text-purple-800">
                      {hiringEffectiveness.qualityMetrics.offerAcceptanceRate.toFixed(1)}%
                    </p>
                    <p className="text-base text-purple-600">Offer Acceptance</p>
                  </div>
                  <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg text-center">
                    <p className="text-xl font-bold text-indigo-800">
                      {hiringEffectiveness.qualityMetrics.averageInterviewsPerHire.toFixed(1)}
                    </p>
                    <p className="text-base text-indigo-600">Interviews per Hire</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottlenecks */}
        {hiringEffectiveness.pipelineMetrics.bottlenecks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Pipeline Bottlenecks
              </CardTitle>
              <CardDescription className="text-base">
                Stages that need attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hiringEffectiveness.pipelineMetrics.bottlenecks.map(
                  (bottleneck, index) => (
                    <div
                      key={index}
                      className="p-4 border-l-4 border-amber-400 bg-amber-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span className="text-base font-semibold text-amber-800 capitalize">
                          {bottleneck.stageName}
                        </span>
                      </div>
                      <p className="text-base text-amber-700 mb-2">
                        <strong>Time:</strong> {bottleneck.averageTime} days
                      </p>
                      <p className="text-base text-amber-600">
                        <strong>Issue:</strong> {bottleneck.reason}
                      </p>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Hiring Trend Chart */}
        {hiringEffectiveness.timeMetrics.trend.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Hiring Trend</CardTitle>
              <CardDescription className="text-base">Time to hire trend over periods</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={hiringEffectiveness.timeMetrics.trend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" fontSize={14} />
                  <YAxis fontSize={14} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="averageDays"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    name="Average Days"
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Hire Count"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Period Comparison */}
        {hiringEffectiveness.comparison && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Period Comparison</CardTitle>
              <CardDescription className="text-base">
                Changes compared to previous period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium">Time to Hire</span>
                    <div className="flex items-center gap-2">
                      {hiringEffectiveness.comparison.changes.timeToHire.change >= 0 ? (
                        <ArrowUpRight className="w-5 h-5 text-red-500" />
                      ) : (
                        <ArrowDownRight className="w-5 h-5 text-green-500" />
                      )}
                      <span
                        className={`text-lg font-bold ${
                          hiringEffectiveness.comparison.changes.timeToHire.change >= 0
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {hiringEffectiveness.comparison.changes.timeToHire.change} days
                      </span>
                    </div>
                  </div>
                  <p className="text-base text-gray-500 mt-2">
                    {hiringEffectiveness.comparison.changes.timeToHire.percentage.toFixed(1)}% change
                  </p>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium">Conversion Rate</span>
                    <div className="flex items-center gap-2">
                      {hiringEffectiveness.comparison.changes.conversionRate.change >= 0 ? (
                        <ArrowUpRight className="w-5 h-5 text-green-500" />
                      ) : (
                        <ArrowDownRight className="w-5 h-5 text-red-500" />
                      )}
                      <span
                        className={`text-lg font-bold ${
                          hiringEffectiveness.comparison.changes.conversionRate.change >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {hiringEffectiveness.comparison.changes.conversionRate.change.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <p className="text-base text-gray-500 mt-2">
                    {hiringEffectiveness.comparison.changes.conversionRate.percentage.toFixed(1)}% change
                  </p>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-medium">Total Hires</span>
                    <div className="flex items-center gap-2">
                      {hiringEffectiveness.comparison.changes.totalHires.change >= 0 ? (
                        <ArrowUpRight className="w-5 h-5 text-green-500" />
                      ) : (
                        <ArrowDownRight className="w-5 h-5 text-red-500" />
                      )}
                      <span
                        className={`text-lg font-bold ${
                          hiringEffectiveness.comparison.changes.totalHires.change >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {hiringEffectiveness.comparison.changes.totalHires.change >= 0 ? "+" : ""}
                        {hiringEffectiveness.comparison.changes.totalHires.change}
                      </span>
                    </div>
                  </div>
                  <p className="text-base text-gray-500 mt-2">
                    {hiringEffectiveness.comparison.changes.totalHires.percentage.toFixed(1)}% change
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}