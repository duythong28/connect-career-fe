import { Briefcase } from "lucide-react";
import { IndustryStatistic } from "@/api/types/public.types";

interface TopIndustriesSectionProps {
  industries: IndustryStatistic[];
}

const TopIndustriesSection = ({ industries }: TopIndustriesSectionProps) => {
  // Adapted to work with text gradients/accents on white cards
  const getGradientColor = (index: number): string => {
    const colors = [
      "from-blue-500 to-cyan-500",
      "from-green-500 to-emerald-500",
      "from-yellow-500 to-orange-500",
      "from-purple-500 to-pink-500",
      "from-red-500 to-rose-500",
      "from-indigo-500 to-blue-500",
      "from-teal-500 to-cyan-500",
      "from-orange-500 to-red-500",
    ];
    return colors[index % colors.length];
  };

  return (
    <section className="py-16 bg-[#F8F9FB] animate-fade-in">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Explore by Industry
          </h2>
          <p className="text-lg text-muted-foreground">
            Find opportunities across diverse sectors
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.slice(0, 8).map((ind, i) => (
            <a
              key={i}
              className="group relative flex flex-col justify-between rounded-2xl bg-card p-6 border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              href={`${import.meta.env.VITE_APP_BASE_URL || "http://localhost:3000"}/jobs?search=${encodeURIComponent(ind.key)}`}
            >
              <div className="mb-4">
                <h3 className="text-lg font-bold text-foreground line-clamp-2 min-h-[3.5rem] group-hover:text-primary transition-colors">
                  {ind.key}
                </h3>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs font-bold uppercase text-muted-foreground mb-1">
                    Open Positions
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-3xl font-bold bg-gradient-to-br ${getGradientColor(i)} bg-clip-text text-transparent`}
                    >
                      {ind.value}
                    </span>
                  </div>
                </div>

                {/* Icon Container with subtle gradient background */}
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${getGradientColor(i)} opacity-10 group-hover:opacity-20 transition-opacity absolute bottom-6 right-6`}
                ></div>
                <Briefcase className="w-6 h-6 relative z-10 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopIndustriesSection;
