import { useQuery, useMutation } from "@tanstack/react-query";
import { getWalletBalance, topUpWallet } from "@/api/endpoints/wallet.api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

const paymentProviders = [
  { label: "MoMo", value: "momo" },
  { label: "ZaloPay", value: "zalopay" },
  { label: "Stripe", value: "stripe" },
];

const paymentMethods = {
  momo: [{ label: "MoMo Wallet", value: "momo" }],
  zalopay: [{ label: "ZaloPay Wallet", value: "zalopay" }],
  stripe: [{ label: "Credit Card", value: "credit_card" }],
};

const UserWalletPage = () => {
  const {
    data: balance,
    isLoading: loadingBalance,
    refetch,
  } = useQuery({
    queryKey: ["wallet-balance"],
    queryFn: getWalletBalance,
  });

  // Top up state
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [provider, setProvider] = useState("momo");
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  const topUpMutation = useMutation({
    mutationFn: (data: {
      amount: number;
      currency: string;
      provider: string;
      paymentMethod: string;
    }) => topUpWallet(data),
    onSuccess: (res) => {
      setRedirectUrl(res.redirectUrl || null);
      setExpiresAt(res.expiresAt || null);
      toast({ title: "Top up request created. Please complete payment." });
      refetch();
    },
    onError: () => toast({ title: "Top up failed", variant: "destructive" }),
  });

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl md:text-4xl">
            Wallet Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingBalance ? (
            <p>Loading...</p>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold">
                {balance?.balance?.toLocaleString()} {balance?.currency}
              </span>
              <Badge variant="outline">
                Updated:{" "}
                {balance && new Date(balance.updatedAt).toLocaleDateString()}
              </Badge>
              <Button className="ml-4" onClick={() => setShowTopUp(true)}>
                Top Up
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Up Dialog */}
      {showTopUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Top Up Wallet</h2>
            <div className="space-y-4">
              <Input
                type="number"
                placeholder="Amount"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
              />
              <Select
                value={provider}
                onValueChange={(val) => {
                  setProvider(val);
                  setPaymentMethod(paymentMethods[val][0].value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {paymentProviders.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods[provider].map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={() =>
                  topUpMutation.mutate({
                    amount: Number(topUpAmount),
                    currency: balance?.currency || "VND",
                    provider,
                    paymentMethod,
                  })
                }
                disabled={topUpMutation.isPending || !topUpAmount}
                className="w-full"
              >
                Top Up
              </Button>
              {redirectUrl && (
                <div className="mt-4">
                  <a
                    href={redirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Complete Payment
                  </a>
                  <div className="text-xs text-gray-500 mt-1">
                    Expires at:{" "}
                    {expiresAt ? new Date(expiresAt).toLocaleString() : ""}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowTopUp(false);
                  setTopUpAmount("");
                  setRedirectUrl(null);
                  setExpiresAt(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserWalletPage;
