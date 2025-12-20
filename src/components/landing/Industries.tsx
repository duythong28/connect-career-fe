import { motion } from "framer-motion";
import {
  Code2,
  HeartPulse,
  Banknote,
  GraduationCap,
  Megaphone,
  Briefcase,
  PenTool,
  Cpu,
} from "lucide-react";

const industries = [
  {
    id: 1,
    name: "Technology",
    icon: Code2,
    jobs: 12500,
    color: "217 91% 60%",
  },
  {
    id: 2,
    name: "Finance & Fintech",
    icon: Banknote,
    jobs: 6780,
    color: "262 83% 58%",
  },
  {
    id: 3,
    name: "Healthcare",
    icon: HeartPulse,
    jobs: 8420,
    color: "142 76% 36%",
  },
  {
    id: 4,
    name: "Education & EdTech",
    icon: GraduationCap,
    jobs: 4350,
    color: "25 95% 53%",
  },
  {
    id: 5,
    name: "Marketing & Sales",
    icon: Megaphone,
    jobs: 5640,
    color: "340 82% 52%",
  },
  {
    id: 6,
    name: "Business & HR",
    icon: Briefcase,
    jobs: 2890,
    color: "199 89% 48%",
  },
  {
    id: 7,
    name: "Engineering",
    icon: Cpu,
    jobs: 3120,
    color: "47 96% 53%",
  },
  {
    id: 8,
    name: "Creative & Design",
    icon: PenTool,
    jobs: 2450,
    color: "292 84% 61%",
  },
];

const Industries = () => {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">
            Industries We <span className="text-gradient">Power</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Bringing AI-driven recruitment solutions to high-demand sectors
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {industries.map((industry, index) => (
            <motion.div
              key={industry.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group relative p-6 rounded-2xl bg-card border border-border hover:shadow-card-hover hover:border-primary/20 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, hsl(${industry.color}) 0%, transparent 100%)`,
                }}
              />

              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300"
                style={{
                  backgroundColor: `hsl(${industry.color} / 0.1)`,
                }}
              >
                <industry.icon
                  className="w-6 h-6 transition-colors duration-300"
                  style={{ color: `hsl(${industry.color})` }}
                />
              </div>

              <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                {industry.name}
              </h3>
              {/* Metric: Dùng "active roles" trung tính hơn "jobs" */}
              <p className="text-sm text-muted-foreground">
                {industry.jobs.toLocaleString()} active roles
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Industries;
