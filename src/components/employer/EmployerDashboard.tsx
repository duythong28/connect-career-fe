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
// import { DatePickerWithRange } from "@/components/ui/date-range-picker"; // Kept outside for mocking
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
    ChevronDown,
    ChevronUp,
    DollarSign,
    MessageSquare,
    Rocket,
    RotateCcw,
    Maximize2,
    ListOrdered
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
import { addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear, format } from "date-fns";

// Mock implementation for external components/hooks not provided in the snippet
const DatePickerWithRange = ({ date, onDateChange }) => (
    <div className="w-full h-8 bg-white border border-gray-300 rounded-lg flex items-center px-3 text-xs text-gray-700 hover:border-blue-400 transition-colors cursor-pointer">
        <Calendar className="w-3 h-3 mr-2 text-gray-400" />
        {date?.from && date?.to ? `${format(date.from, 'MMM dd')}${format(date.from, 'yyyy') !== format(date.to, 'yyyy') ? `, ${format(date.from, 'yyyy')}` : ''} - ${format(date.to, 'MMM dd, yyyy')}` : "Select date range"}
    </div>
);


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

    // Expandable sections state
    const [expandedSections, setExpandedSections] = useState({
        conversion: true,
        pipeline: true,
        metrics: true, 
        bottlenecks: true,
        trend: true, 
    });

    // Toggle button state for the filter bar
    const [isFilterBarExpanded, setIsFilterBarExpanded] = useState(false);

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

    // Placeholder data retrieval (assuming these hooks are functional)
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
            enabled: !!companyId && !!queryParams.startDate && !!queryParams.endDate,
        });

    const isLoading = companyLoading || summaryLoading || effectivenessLoading;

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // Utility function for rendering icons and titles consistently
    const SectionHeader = ({ title, description, icon: Icon, sectionKey, actions = null }) => (
        // Sử dụng p-3 và border-b-gray-100 để tạo sự phân tách bằng viền mỏng
        <div
            className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 select-none transition-colors border-b border-gray-100"
            onClick={() => toggleSection(sectionKey)}
        >
            <div className="flex items-center gap-3">
                <div className="p-1 bg-blue-50 rounded-md text-blue-600">
                    <Icon className="w-4 h-4" />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-gray-900">{title}</h2>
                    <p className="text-xs text-gray-500 mt-0.5">{description}</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                {actions}
                <ChevronUp size={14} className={`text-gray-400 transition-transform ${expandedSections[sectionKey] ? '' : 'rotate-180'}`} />
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="space-y-8 p-4 md:p-6 lg:p-8">
                    <div className="animate-pulse">
                        <div className="bg-gray-200 rounded-xl h-32 md:h-40 mb-6"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="bg-gray-200 rounded-lg h-20"></div>
                            ))}
                        </div>
                        <div className="bg-gray-200 rounded-xl h-80"></div>
                    </div>
                </div>
            </div>
        );
    }

    const effectiveData = hiringEffectiveness || {
        overview: { totalApplications: 0, activeCandidates: 0, activeJobs: 0, totalOffers: 0, totalHires: 0 },
        conversionRates: { applicationToInterview: 0, interviewToOffer: 0, offerToHire: 0, overallFunnel: 0 },
        pipelineMetrics: { stageMetrics: [], bottlenecks: [] },
        timeMetrics: { average: 0, median: 0, byJob: [], trend: [] },
        qualityMetrics: { averageMatchingScore: 0, offerAcceptanceRate: 0, averageInterviewsPerHire: 0 },
        comparison: null
    };

    // Function to calculate and format the comparison change component
    const ComparisonChange = ({ change, percentage, isTimeMetric }) => {
        // Time metric: lower is better (green arrow up means improvement)
        const isPositive = isTimeMetric ? change < 0 : change >= 0; 
        const ArrowIcon = isPositive ? ArrowUpRight : ArrowDownRight;
        const color = isPositive ? 'text-green-600' : 'text-red-600';
        const sign = change > 0 && !isTimeMetric ? '+' : (change > 0 && isTimeMetric ? '+' : '');

        return (
            <div className="flex items-center gap-1 text-[10px] font-bold">
                <ArrowIcon className={`w-3 h-3 ${color}`} />
                <span className={color}>
                    {sign}{change.toFixed(isTimeMetric ? 0 : 1)}{isTimeMetric ? 'd' : '%'}
                </span>
                <span className="text-[9px] text-gray-500">({percentage.toFixed(1)}%)</span>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-xs">
            <style>
                {`
                    .sticky-filter-bar {
                        top: 0;
                        z-index: 50;
                        transition: transform 0.3s ease-in-out;
                    }
                    .sticky-filter-bar.expanded {
                        height: auto;
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); /* Lighter shadow */
                    }
                    .sticky-filter-bar .content {
                        max-height: 0;
                        overflow: hidden;
                        transition: max-height 0.3s ease-in-out;
                    }
                    .sticky-filter-bar.expanded .content {
                        max-height: 500px;
                    }
                    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
                    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                    .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
                `}
            </style>
            
            {/* Sticky Filter Bar (UX Senior Implementation) */}
            <div className={`sticky-filter-bar w-full bg-white border-b border-gray-200 ${isFilterBarExpanded ? 'expanded' : ''}`}>
                <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-2.5">
                    
                    {/* Always Visible Filter Row */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-grow">
                            
                            {/* Period Filter (Granularity) */}
                            <div className="w-32 flex-shrink-0">
                                <Select
                                    value={queryParams.period}
                                    onValueChange={(value) => handlePeriodChange(value as HiringMetricsPeriod)}
                                >
                                    <SelectTrigger className="text-xs border-gray-300 hover:border-blue-400 rounded-lg h-8 transition-all">
                                        <Filter className="w-3 h-3 text-gray-400 mr-2" />
                                        <SelectValue placeholder="Period" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={HiringMetricsPeriod.WEEK}>Weekly</SelectItem>
                                        <SelectItem value={HiringMetricsPeriod.MONTH}>Monthly</SelectItem>
                                        <SelectItem value={HiringMetricsPeriod.QUARTER}>Quarterly</SelectItem>
                                        <SelectItem value={HiringMetricsPeriod.YEAR}>Yearly</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Date Range Filter */}
                            <div className="flex-grow max-w-[280px]">
                                <DatePickerWithRange
                                    date={dateRange}
                                    onDateChange={handleDateRangeChange}
                                />
                            </div>

                             {/* Job Filter */}
                            <div className="w-40 flex-shrink-0">
                                <Select
                                    value={queryParams.jobId || "all"}
                                    onValueChange={(value) =>
                                        updateQueryParams({
                                            jobId: value === "all" ? undefined : value,
                                        })
                                    }
                                >
                                    <SelectTrigger className="text-xs border-gray-300 hover:border-blue-400 rounded-lg h-8 transition-all">
                                        <FileText className="w-3 h-3 text-gray-400 mr-2" />
                                        <SelectValue placeholder="All Jobs" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Jobs</SelectItem>
                                        {effectiveData.timeMetrics.byJob.map((job) => (
                                            <SelectItem key={job.jobId} value={job.jobId}>
                                                {job.jobTitle}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={() => updateQueryParams({ compareWithPrevious: !queryParams.compareWithPrevious })}
                                className={`h-8 px-3 text-xs rounded-lg font-bold transition-all border ${queryParams.compareWithPrevious ? 'bg-[#0EA5E9] border-[#0EA5E9] text-white hover:bg-[#0284c7]' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                            >
                                <Users className="w-3 h-3 mr-2" />
                                Compare {queryParams.compareWithPrevious ? 'ON' : 'OFF'}
                            </Button>
                            
                            <button 
                                onClick={() => setIsFilterBarExpanded(!isFilterBarExpanded)}
                                className="p-1.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                                title="Toggle Quick Filters"
                            >
                                <ChevronDown size={14} className={`transition-transform ${isFilterBarExpanded ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {/* Collapsible Content */}
                    <div className="content">
                        <div className="pt-3 border-t border-gray-100 mt-3">
                            <p className="text-xs font-bold text-gray-700 uppercase mb-2 tracking-wider">Quick Periods</p>
                            <div className="flex flex-wrap gap-2">
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
                                        className="cursor-pointer bg-gray-100 text-gray-700 border border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all px-3 py-1.5 font-semibold text-xs shadow-sm"
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
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-4 space-y-4">

                {/* --- 1. Highlight Section --- */}
                <div className="bg-gradient-to-br from-[#0EA5E9] via-blue-600 to-indigo-700 rounded-xl p-4 md:p-6 text-white border border-blue-500">
                    <div className="mb-4">
                        {/* Reduced font size */}
                        <h1 className="text-xl md:text-2xl font-bold mb-1 leading-tight drop-shadow-sm">
                            Hiring Effectiveness Dashboard 📊
                        </h1>
                        {/* Reduced font size */}
                        <p className="text-blue-100 text-xs md:text-sm leading-relaxed">
                            Analyzing performance for {company?.name || "your company"}. You have <span className="font-extrabold">{effectiveData.overview.totalApplications}</span> total applications and <span className="font-extrabold">{effectiveData.overview.activeCandidates}</span> active candidates in the selected period.
                        </p>
                    </div>

                    {/* Key Stats in Highlight (4-Column Layout) */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { title: 'Total Applications', value: effectiveData.overview.totalApplications, icon: FileText, color: 'text-blue-200' },
                            { title: 'Active Candidates', value: effectiveData.overview.activeCandidates, icon: Users, color: 'text-blue-200' },
                            { title: 'Total Hires', value: effectiveData.overview.totalHires, icon: UserCheck, color: 'text-blue-200' },
                            { title: 'Avg Time to Hire', value: `${effectiveData.timeMetrics.average} Days`, icon: Clock, color: 'text-blue-200' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white/15 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                                <div className="flex items-center gap-2 mb-1">
                                    <stat.icon className={`w-3 h-3 ${stat.color}`} />
                                    <span className="text-xs font-medium text-blue-100">{stat.title}</span>
                                </div>
                                {/* Reduced font size to xl */}
                                <p className="text-xl font-bold">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div>


                {/* --- 2. Conversion Funnel (Accent Cards) --- */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <SectionHeader
                        title="Hiring Conversion Funnel"
                        description="Track candidate conversion rates between key stages"
                        icon={Rocket}
                        sectionKey='conversion'
                    />

                    {expandedSections.conversion && (
                        <div className="p-3 border-t border-gray-100 animate-fadeIn">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                {[
                                    { title: 'App → Interview', rate: effectiveData.conversionRates.applicationToInterview, color: 'blue', icon: FileText, dataKey: 'conversionRate' },
                                    { title: 'Interview → Offer', rate: effectiveData.conversionRates.interviewToOffer, color: 'purple', icon: MessageSquare, dataKey: 'conversionRate' },
                                    { title: 'Offer → Hire', rate: effectiveData.conversionRates.offerToHire, color: 'green', icon: CheckCircle2, dataKey: 'conversionRate' },
                                    { title: 'Overall Success', rate: effectiveData.conversionRates.overallFunnel, color: 'amber', icon: Zap, dataKey: 'conversionRate' },
                                ].map((item, i) => (
                                    <div key={i} className={`p-3 bg-gradient-to-br from-${item.color}-50 to-${item.color}-100/50 border border-${item.color}-100 rounded-lg`}>
                                        <div className="flex items-center justify-between mb-1">
                                            <p className={`text-xs font-semibold text-${item.color}-700`}>{item.title}</p>
                                            <item.icon className={`w-3 h-3 text-${item.color}-600`} />
                                        </div>
                                        {/* Reduced font size to xl */}
                                        <p className="text-xl font-extrabold text-gray-900">
                                            {item.rate.toFixed(1)}%
                                        </p>
                                        {effectiveData.comparison && effectiveData.comparison.changes[item.dataKey] && (
                                            <div className="mt-1">
                                                <ComparisonChange
                                                    change={effectiveData.comparison.changes[item.dataKey].change}
                                                    percentage={effectiveData.comparison.changes[item.dataKey].percentage}
                                                    isTimeMetric={false}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>


                {/* --- 3. Main Metrics Grid (3 Columns) --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Left Column (2/3 width) - Pipeline Distribution Chart & Metrics */}
                    <div className="lg:col-span-2 space-y-4">

                        {/* Pipeline Distribution Chart & Metrics */}
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                            <SectionHeader
                                title="Pipeline Distribution & Flow"
                                description="Candidate count and conversion rates by stage"
                                icon={ListOrdered}
                                sectionKey='pipeline'
                            />
                            {expandedSections.pipeline && (
                                <div className="p-3 border-t border-gray-100 animate-fadeIn">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                            <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2"><BarChart size={14} className="text-[#0EA5E9]"/> Candidates by Stage</h4>
                                            <ResponsiveContainer width="100%" height={250}>
                                                <BarChart data={effectiveData.pipelineMetrics.stageMetrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                    <XAxis
                                                        dataKey="stageName"
                                                        angle={-45}
                                                        textAnchor="end"
                                                        height={70}
                                                        fontSize={10}
                                                        tickLine={false}
                                                    />
                                                    <YAxis fontSize={10} tickLine={false} axisLine={false} />
                                                    <Tooltip cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} contentStyle={{ borderRadius: '6px', border: '1px solid #e5e7eb', fontSize: 10 }} />
                                                    <Bar
                                                        dataKey="candidatesInStage"
                                                        fill="#0EA5E9"
                                                        name="Candidates"
                                                        radius={[4, 4, 0, 0]}
                                                        maxBarSize={30}
                                                    />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>

                                        <div className="space-y-2 custom-scrollbar max-h-[300px] py-1">
                                            <h4 className="text-xs font-bold text-gray-900 border-b border-gray-100 pb-2">Stage Performance Summary</h4>
                                            {effectiveData.pipelineMetrics.stageMetrics.map(
                                                (stage, index) => (
                                                    // Reduced padding and font size further
                                                    <div key={index} className="p-3 border border-gray-200 rounded-lg bg-white">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="font-bold text-gray-900 capitalize text-xs">
                                                                {stage.stageName}
                                                            </span>
                                                            <span className="text-base font-bold text-[#0EA5E9]">
                                                                {stage.candidatesInStage} <span className="text-[10px] text-gray-500">cands</span>
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between gap-2 text-[10px] font-medium">
                                                            <span className="text-gray-600 flex items-center gap-1"><Clock size={10} className="text-blue-400"/> Time: <span className="font-bold text-gray-900">{stage.averageTimeInStage.toFixed(1)}d</span></span>
                                                            <span className="text-gray-600 flex items-center gap-1"><TrendingDown size={10} className="text-red-400"/> Drop-off: <span className="font-bold text-gray-900">{stage.dropOffRate.toFixed(0)}%</span></span>
                                                            <span className="text-gray-600 flex items-center gap-1"><TrendingUp size={10} className="text-green-400"/> Conversion: <span className="font-bold text-gray-900">{stage.conversionToNext.toFixed(0)}%</span></span>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Hiring Trend Chart - LINE CHART */}
                        {effectiveData.timeMetrics.trend.length > 0 && (
                            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                                <SectionHeader
                                    title="Hiring Trend Over Time"
                                    description="Time to hire trend (blue) vs. total hires (green)"
                                    icon={TrendingUp}
                                    sectionKey='trend'
                                />

                                {expandedSections.trend && (
                                    <div className="p-3 border-t border-gray-100 animate-fadeIn">
                                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                            <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2"><LineChart size={14} className="text-[#0EA5E9]"/> Time-to-Hire and Volume Trend</h4>
                                            <ResponsiveContainer width="100%" height={250}>
                                                <LineChart data={effectiveData.timeMetrics.trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                    <XAxis dataKey="period" fontSize={10} tickLine={false} />
                                                    <YAxis yAxisId="left" stroke="#0EA5E9" fontSize={10} tickLine={false} axisLine={false} label={{ value: 'Avg Days', angle: -90, position: 'insideLeft', fill: '#0EA5E9', fontSize: 10 }} />
                                                    <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={10} tickLine={false} axisLine={false} label={{ value: 'Hire Count', angle: 90, position: 'insideRight', fill: '#10b981', fontSize: 10 }} />
                                                    <Tooltip
                                                        cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                                                        contentStyle={{ borderRadius: '6px', border: '1px solid #e5e7eb', fontSize: 10 }}
                                                    />
                                                    <Line
                                                        yAxisId="left"
                                                        type="monotone"
                                                        dataKey="averageDays"
                                                        stroke="#0EA5E9"
                                                        strokeWidth={2}
                                                        name="Average Days to Hire"
                                                        dot={{ fill: '#0EA5E9', r: 3 }}
                                                        activeDot={{ r: 5 }}
                                                    />
                                                    <Line
                                                        yAxisId="right"
                                                        type="monotone"
                                                        dataKey="count"
                                                        stroke="#10b981"
                                                        strokeWidth={1.5}
                                                        name="Total Hires"
                                                        dot={{ fill: '#10b981', r: 2 }}
                                                        activeDot={{ r: 4 }}
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        
                    </div>

                    {/* Right Column (1/3 width) - Core Metrics & Quality */}
                    <div className="lg:col-span-1 space-y-4">

                        {/* Core Metrics Card */}
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                            <div className="p-3 border-b border-gray-100">
                                <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2"><Target className="w-4 h-4 text-[#0EA5E9]"/> Core Hiring Metrics</h2>
                                <p className="text-xs text-gray-500 mt-0.5">Snapshot of Time and Quality Indicators</p>
                            </div>
                            <div className="p-3 space-y-3">
                                {/* Time Metrics */}
                                <div className="space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <h4 className="text-xs font-bold text-gray-700 uppercase">Time to Hire</h4>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-600">Average Days</span>
                                        <span className="text-base font-bold text-gray-900">{effectiveData.timeMetrics.average}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-600">Median Days</span>
                                        <span className="text-base font-bold text-gray-900">{effectiveData.timeMetrics.median}</span>
                                    </div>
                                    {effectiveData.comparison && (
                                        <div className="pt-2 border-t border-gray-200">
                                            <span className="text-xs font-bold text-gray-700">Change from Prior Period: </span>
                                            <ComparisonChange
                                                change={effectiveData.comparison.changes.timeToHire.change}
                                                percentage={effectiveData.comparison.changes.timeToHire.percentage}
                                                isTimeMetric={true}
                                            />
                                        </div>
                                    )}
                                </div>
                                {/* Quality Metrics */}
                                <div className="space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <h4 className="text-xs font-bold text-gray-700 uppercase">Quality & Efficiency</h4>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-600">Offer Acceptance Rate</span>
                                        <span className="text-base font-bold text-gray-900">{effectiveData.qualityMetrics.offerAcceptanceRate.toFixed(1)}%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-600">Avg Interviews/Hire</span>
                                        <span className="text-base font-bold text-gray-900">{effectiveData.qualityMetrics.averageInterviewsPerHire.toFixed(1)}</span>
                                    </div>
                                </div>
                                {/* Matching Score */}
                                <div className="p-3 border border-gray-200 rounded-lg">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-bold text-gray-700">Avg Simplify Match Score</span>
                                        <span className="text-base font-bold text-[#0EA5E9]">
                                            {effectiveData.qualityMetrics.averageMatchingScore.toFixed(1)}/100
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-blue-400 to-[#0EA5E9] h-2 rounded-full transition-all duration-300"
                                            style={{
                                                width: `${effectiveData.qualityMetrics.averageMatchingScore}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actionable Bottlenecks */}
                        {effectiveData.pipelineMetrics.bottlenecks.length > 0 && (
                            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                                <SectionHeader
                                    title="Actionable Bottlenecks"
                                    description="Stages with high time-in-stage or drop-off rates"
                                    icon={AlertTriangle}
                                    sectionKey='bottlenecks'
                                />
                                {expandedSections.bottlenecks && (
                                    <div className="p-3 border-t border-gray-100 animate-fadeIn space-y-3">
                                        {effectiveData.pipelineMetrics.bottlenecks.map(
                                            (bottleneck, index) => (
                                                <div
                                                    key={index}
                                                    className="p-3 border-l-4 border-amber-500 bg-amber-50 rounded-lg"
                                                >
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                                                        <span className="font-bold text-amber-800 capitalize text-xs">
                                                            {bottleneck.stageName}
                                                        </span>
                                                    </div>
                                                    <p className="text-[10px] text-amber-700 mb-0.5">
                                                        **Avg Time:** <span className="font-bold">{bottleneck.averageTime} days</span>
                                                    </p>
                                                    <p className="text-[10px] text-amber-700">
                                                        **Issue:** {bottleneck.reason}
                                                    </p>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {/* Top Performing Jobs */}
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                             <div className="p-3 border-b border-gray-100">
                                <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500"/> Top Performing Jobs</h2>
                                <p className="text-xs text-gray-500 mt-0.5">Quickest time-to-hire positions</p>
                            </div>
                            <div className="p-3 space-y-3">
                                {/* Reduced padding/font size */}
                                {effectiveData.timeMetrics.byJob.slice(0, 3).sort((a, b) => a.averageDays - b.averageDays).map((job, index) => (
                                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg border border-gray-100">
                                        <span className="text-xs font-semibold text-gray-900 truncate mr-4 flex items-center gap-2">
                                            <span className="text-xs font-bold text-green-600">{index + 1}.</span>
                                            {job.jobTitle}
                                        </span>
                                        <div className="text-right flex-shrink-0">
                                            <div className="text-sm font-bold text-green-600">
                                                {job.averageDays} days
                                            </div>
                                            <div className="text-[10px] text-gray-500">
                                                ({job.count} hires)
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button className="w-full text-[#0EA5E9] text-xs font-bold hover:underline mt-4">View All Job Analytics →</button>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Floating Feedback Button */}
                <button className="fixed bottom-4 right-4 bg-[#0EA5E9] text-white px-3 py-1.5 rounded-lg font-bold text-xs shadow-lg hover:bg-[#0284c7] flex items-center gap-2 z-50">
                    <MessageSquare size={14} /> Feedback
                </button>
            </div>
        </div>
    );
}