import { TrendingUp } from "lucide-react";
import { WorkMarketData, JobOpportunityGrowth, IndustryStatistic } from "@/api/types/public.types";

interface WorkMarketSectionProps {
  workMarketData: WorkMarketData | null;
  jobGrowthData: JobOpportunityGrowth[];
  industryStats: IndustryStatistic[];
}

const WorkMarketSection = ({
  workMarketData,
  jobGrowthData,
  industryStats
}: WorkMarketSectionProps) => {
  const maxGrowth = Math.max(...jobGrowthData.map(d => parseInt(d.value)), 1);

  return (
    <section className="py-16 bg-gradient-to-br from-teal-800 via-emerald-800 to-green-700">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-teal-700/50 to-emerald-900/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Thị trường việc làm hôm nay <span className="text-emerald-300">{workMarketData?.time_scan || ""}</span>
              </h2>
            </div>
            <div className="text-emerald-300">
              <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>

          {workMarketData && (
            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              {[
                { label: "Việc làm mới 24h gần nhất", value: workMarketData.quantity_job_new_today },
                { label: "Việc làm đang tuyển", value: workMarketData.quantity_job_recruitment },
                { label: "Công ty đang tuyển", value: workMarketData.quantity_company_recruitment }
              ].map((stat, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="text-5xl font-bold text-white mb-2">{stat.value.toLocaleString()}</div>
                  <div className="text-sm text-emerald-200">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Job Growth Line/Area Chart */}
            <div className="bg-teal-900/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-emerald-300" />
                <h3 className="text-lg font-bold text-white">Tăng trưởng cơ hội việc làm</h3>
              </div>
              <div className="relative h-64">
                <div className="absolute inset-0 flex items-end justify-between gap-2">
                  {jobGrowthData.map((d, i) => {
                    const height = (parseInt(d.value) / maxGrowth) * 100;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div className="relative w-full h-full flex items-end">
                          <div 
                            className="w-full bg-gradient-to-t from-emerald-400 to-emerald-300 rounded-t-lg transition-all duration-1000 hover:from-emerald-300 hover:to-emerald-200 group relative"
                            style={{ height: `${height}%`, minHeight: '8px' }}
                          >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-white px-2 py-1 rounded text-xs font-bold text-gray-900 whitespace-nowrap transition-opacity">
                              {parseInt(d.value).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-medium text-emerald-200">{d.key}</span>
                      </div>
                    );
                  })}
                </div>
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-8 w-16 flex flex-col justify-between text-xs text-emerald-200">
                  {[maxGrowth, Math.floor(maxGrowth * 0.75), Math.floor(maxGrowth * 0.5), Math.floor(maxGrowth * 0.25), 0].map((val, i) => (
                    <div key={i} className="text-right pr-2">{val.toLocaleString()}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Industry Bar Chart */}
            <div className="bg-teal-900/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-300" />
                  Nhu cầu tuyển dụng theo
                </h3>
                <button className="px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-lg text-sm font-medium border border-emerald-500/30">
                  Ngành nghề
                </button>
              </div>
              <div className="space-y-3">
                {industryStats.slice(0, 5).map((ind, i) => {
                  const colors = [
                    "bg-emerald-400",
                    "bg-cyan-400", 
                    "bg-teal-400",
                    "bg-green-400",
                    "bg-lime-400"
                  ];
                  const maxIndustry = Math.max(...industryStats.slice(0, 5).map(x => parseInt(x.value)));
                  const width = (parseInt(ind.value) / maxIndustry) * 100;
                  
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-32 text-sm text-emerald-200 truncate">{ind.key}</div>
                      <div className="flex-1 h-8 bg-white/10 rounded-lg overflow-hidden">
                        <div 
                          className={`h-full ${colors[i]} transition-all duration-1000 flex items-center justify-end px-3`}
                          style={{ width: `${width}%` }}
                        >
                          <span className="text-xs font-bold text-teal-900">{ind.value}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkMarketSection;