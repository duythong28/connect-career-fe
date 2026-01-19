import { TrendingUp, Briefcase, Building2, Users } from "lucide-react";
import {
  WorkMarketData,
  JobOpportunityGrowth,
  IndustryStatistic,
} from "@/api/types/public.types";
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
} from "recharts";

interface WorkMarketSectionProps {
  workMarketData: WorkMarketData | null;
  jobGrowthData: JobOpportunityGrowth[];
  industryStats: IndustryStatistic[];
}

const WorkMarketSection = ({
  workMarketData,
  jobGrowthData,
  industryStats,
}: WorkMarketSectionProps) => {
  // Transform data for charts
  const growthChartData = jobGrowthData.map((item) => ({
    name: item.key,
    value: parseInt(item.value),
  }));

  const industryChartData = industryStats.slice(0, 5).map((item) => ({
    name: item.key,
    value: parseInt(item.value),
  }));

  // Custom Tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-blue-100 shadow-lg rounded-lg">
          <p className="font-bold text-gray-800">{label}</p>
          <p className="text-primary font-medium">
            {payload[0].value.toLocaleString()} positions
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    // Background gradient applied here for full width - switched to Blue/Slate
    <section className="py-16 bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 animate-fade-in relative overflow-hidden">
      {/* Decorative background elements - Blue/Indigo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

      <div className="container-custom relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Job Market Overview
            </h2>
            <p className="text-blue-100 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              Updated: {workMarketData?.time_scan || "Just now"}
            </p>
          </div>
        </div>

        {workMarketData && (
          <div className="grid sm:grid-cols-3 gap-6 mb-10">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Briefcase className="w-5 h-5 text-blue-300" />
                </div>
                <span className="text-blue-100 font-medium text-sm">
                  New Jobs (24h)
                </span>
              </div>
              <div className="text-4xl font-bold text-white">
                {workMarketData.quantity_job_new_today.toLocaleString()}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-cyan-300" />
                </div>
                <span className="text-blue-100 font-medium text-sm">
                  Active Jobs
                </span>
              </div>
              <div className="text-4xl font-bold text-white">
                {workMarketData.quantity_job_recruitment.toLocaleString()}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <Building2 className="w-5 h-5 text-indigo-300" />
                </div>
                <span className="text-blue-100 font-medium text-sm">
                  Hiring Companies
                </span>
              </div>
              <div className="text-4xl font-bold text-white">
                {workMarketData.quantity_company_recruitment.toLocaleString()}
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Job Growth Area Chart */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-bold text-white">
                Job Opportunity Growth
              </h3>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthChartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      {/* Using standard Blue-500 hex #3b82f6 */}
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#bfdbfe", fontSize: 12 }} // blue-200
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#bfdbfe", fontSize: 12 }} // blue-200
                  />
                  <Tooltip content={<CustomTooltip />} cursor={false} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6" // blue-500
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Industry Bar Chart */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Top Demanded Industries
              </h3>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={industryChartData}
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={true}
                    vertical={false}
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={100}
                    tick={{ fill: "#bfdbfe", fontSize: 12 }} // blue-200
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  />
                  <Bar
                    dataKey="value"
                    fill="#3b82f6" // blue-500
                    radius={[0, 4, 4, 0]}
                    barSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkMarketSection;