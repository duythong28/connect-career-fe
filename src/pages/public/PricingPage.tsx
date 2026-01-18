import CTA from "@/components/landing/CTA";
import BillableActions from "@/components/landing/BillableActions";

const PricingPage = () => {
  return (
    <div className="min-h-screen">
      <div>
        <BillableActions />
        <CTA />
      </div>
    </div>
  );
};

export default PricingPage;
