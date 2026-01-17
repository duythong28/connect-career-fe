import { IndustryStatisticsResponse } from "@/api/types/public.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

interface IndustriesProps {
  industryStats?: IndustryStatisticsResponse | null;
}

const Industries = ({ industryStats }: IndustriesProps) => {
  const defaultIndustries = [
    {
      name: "Technology",
      icon: "💻",
      jobs: "1,234",
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      name: "Healthcare",
      icon: "🏥",
      jobs: "892",
      color: "bg-green-500/10 text-green-500",
    },
    {
      name: "Finance",
      icon: "💰",
      jobs: "756",
      color: "bg-yellow-500/10 text-yellow-500",
    },
    {
      name: "Education",
      icon: "📚",
      jobs: "645",
      color: "bg-purple-500/10 text-purple-500",
    },
    {
      name: "Manufacturing",
      icon: "🏭",
      jobs: "534",
      color: "bg-orange-500/10 text-orange-500",
    },
    {
      name: "Retail",
      icon: "🛒",
      jobs: "423",
      color: "bg-pink-500/10 text-pink-500",
    },
  ];

  const getIndustryIcon = (name: string): string => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("education")) return "📚";
    if (lowerName.includes("software") || lowerName.includes("technology")) return "💻";
    if (lowerName.includes("banking") || lowerName.includes("financial")) return "💰";
    if (lowerName.includes("manufacturing") || lowerName.includes("plastics")) return "🏭";
    if (lowerName.includes("transportation") || lowerName.includes("logistics")) return "🚚";
    return "💼";
  };

  const getIndustryColor = (index: number): string => {
    const colors = [
      "bg-blue-500/10 text-blue-500",
      "bg-green-500/10 text-green-500",
      "bg-yellow-500/10 text-yellow-500",
      "bg-purple-500/10 text-purple-500",
      "bg-orange-500/10 text-orange-500",
      "bg-pink-500/10 text-pink-500",
    ];
    return colors[index % colors.length];
  };

  const industries = industryStats?.data
    ? industryStats.data.slice(0, 6).map((stat, index) => ({
        name: stat.key,
        icon: getIndustryIcon(stat.key),
        jobs: parseInt(stat.value).toLocaleString(),
        color: getIndustryColor(index),
      }))
    : defaultIndustries;

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Top Industries
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore opportunities across various sectors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((industry, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow cursor-pointer"
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${industry.color} flex items-center justify-center text-2xl mb-3`}>
                  {industry.icon}
                </div>
                <CardTitle className="text-xl">{industry.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    Available Jobs
                  </span>
                  <span className="text-2xl font-bold text-primary">{industry.jobs}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Industries;