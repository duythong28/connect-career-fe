import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import CTA from "@/components/landing/CTA";


const HowItWorkPage = () => {
  return (
    <div className="min-h-screen">
      <div>
        <Hero />
        <HowItWorks />
        <Features />
        <CTA />
      </div>
    </div>
  );
};

export default HowItWorkPage;
