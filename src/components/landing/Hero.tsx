import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const companies = [
  "Google",
  "Microsoft",
  "Amazon",
  "Meta",
  "Netflix",
  "Spotify",
];

const Hero = () => {
  const navigate=useNavigate();

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden gradient-hero-bg">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px] opacity-60" />
      <div className="absolute -top-20 right-0 w-[400px] h-[400px] rounded-full bg-[hsl(199_89%_48%/0.15)] blur-[100px] opacity-50" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-primary/10 blur-[80px] opacity-40" />

      <div className="container-custom relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-blue-light border border-primary/20 mb-8 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">
              The AI-Powered Talent Ecosystem
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6 animate-fade-up animation-delay-100">
            Where Great Talent Meets <br className="hidden md:block" />
            <span className="text-gradient">Endless Opportunities</span>
          </h1>

          {/* Subtext: Đã bỏ highlight và lược bớt từ thừa (both, single account) */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up animation-delay-200">
            The unified platform for candidates and recruiters. Leverage our ecosystem to hire smarter or build your career faster.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto mb-12 animate-fade-up animation-delay-300">
            <input
              type="email"
              placeholder="Enter your email to get started"
              className="w-full sm:flex-1 h-12 px-6 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            <Button variant="hero" size="lg" className="w-full sm:w-auto"
             onClick={()=> navigate('/login')}
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="animate-fade-up animation-delay-400">
            <p className="text-sm text-muted-foreground mb-6">
              Trusted by{" "}
              <span className="font-semibold text-foreground">500+</span>{" "}
              leading companies & professionals
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {companies.map((company) => (
                <span
                  key={company}
                  className="text-lg font-semibold text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                >
                  {company}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;