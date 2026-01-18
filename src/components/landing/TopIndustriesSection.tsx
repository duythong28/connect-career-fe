import { Briefcase } from "lucide-react";
import { IndustryStatistic } from "@/api/types/public.types";

interface TopIndustriesSectionProps {
  industries: IndustryStatistic[];
}

const TopIndustriesSection = ({ industries }: TopIndustriesSectionProps) => {
  const getGradientColor = (index: number): string => {
    const colors = [
      "from-blue-500 to-cyan-500",
      "from-green-500 to-emerald-500",
      "from-yellow-500 to-orange-500",
      "from-purple-500 to-pink-500",
      "from-red-500 to-rose-500",
      "from-indigo-500 to-blue-500",
      "from-teal-500 to-cyan-500",
      "from-orange-500 to-red-500"
    ];
    return colors[index % colors.length];
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Explore by Industry</h2>
          <p className="text-lg text-gray-600">Find opportunities across diverse sectors</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.slice(0, 8).map((ind, i) => (
            <div 
              key={i} 
              className={`group bg-gradient-to-br ${getGradientColor(i)} rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer text-white`}
            >
              <h3 className="text-xl font-bold mb-2 line-clamp-2 min-h-[3.5rem]">
                {ind.key}
              </h3>
              <div className="flex items-center gap-2 mb-1">
                <Briefcase className="w-5 h-5" />
                <span className="text-4xl font-bold">{ind.value}</span>
              </div>
              <p className="text-sm opacity-90">Open Positions</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopIndustriesSection;