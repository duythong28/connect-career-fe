import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const WalletTopUpReturnPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast({ title: "Top up successful!", description: "Your wallet has been updated." });
    // Redirect to user wallet page after a short delay
    const timeout = setTimeout(() => {
      navigate("/candidate/wallet");
    }, 2000);
    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-2xl font-bold mb-4">Payment Successful!</div>
      <div className="text-gray-600 mb-2">Redirecting to your wallet...</div>
    </div>
  );
};

export default WalletTopUpReturnPage;