import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container-custom">
        <div className="relative rounded-3xl gradient-blue p-12 md:p-20 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-primary-foreground/10" />
          <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full border-4 border-primary-foreground/20 opacity-50" />
          <div className="absolute top-20 left-10 w-16 h-16 rounded-full border-2 border-primary-foreground/20 opacity-30" />

          <div className="relative text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
              Ready to Join the Future of Recruitment?
            </h2>
            
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-10">
              One platform, endless possibilities. Whether you're advancing your career or building a dream team, access everything with a single unified account.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-primary-foreground text-primary hover:bg-primary-foreground/90 border-0"
              >
                Create Your Account
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
              >
                How It Works
              </Button>
            </div>
            
            <p className="text-sm text-primary-foreground/60 mt-8">
              Join 90M+ users building the global workforce together
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;