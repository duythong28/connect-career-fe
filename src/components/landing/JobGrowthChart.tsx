import { JobOpportunityGrowthResponse } from "@/api/types/public.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface JobGrowthChartProps {
  jobGrowthData?: JobOpportunityGrowthResponse | null;
}

const JobGrowthChart = ({ jobGrowthData }: JobGrowthChartProps) => {
  if (!jobGrowthData?.data || jobGrowthData.data.length === 0) {
    return null;
  }

  const latestData = jobGrowthData.data.slice(-5);
  const maxValue = Math.max(...latestData.map(item => parseInt(item.value)));

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Job Market Growth
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track the latest job posting trends
          </p>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Recent Job Postings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {latestData.map((item, index) => {
                const value = parseInt(item.value);
                const percentage = (value / maxValue) * 100;
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{item.key}</span>
                      <span className="text-muted-foreground">
                        {value.toLocaleString()} jobs
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
                        style={{ 
                          width: `${percentage}%`,
                          animationDelay: `${index * 100}ms`
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default JobGrowthChart;