import { WorkMarketData } from "@/api/types/public.types";

interface StatsProps {
  workMarketData: WorkMarketData | null;
}

const Stats = ({ workMarketData }: StatsProps) => {
  const stats = [
    {
      label: "Active Jobs",
      value: workMarketData?.quantity_job_recruitment.toLocaleString() || "0",
      icon: "💼",
    },
    {
      label: "Companies",
      value: workMarketData?.quantity_company_recruitment.toLocaleString() || "0",
      icon: "🏢",
    },
    {
      label: "New Jobs Today",
      value: workMarketData?.quantity_job_new_today.toLocaleString() || "0",
      icon: "✨",
    },
    {
      label: "Jobs Yesterday",
      value: workMarketData?.quantity_job_recruitment_yesterday.toLocaleString() || "0",
      icon: "📈",
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
        {workMarketData?.time_scan && (
          <div className="text-center mt-4 text-xs text-muted-foreground">
            Last updated: {workMarketData.time_scan}
          </div>
        )}
      </div>
    </section>
  );
};

export default Stats;