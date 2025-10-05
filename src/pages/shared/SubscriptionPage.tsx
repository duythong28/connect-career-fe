import React, { useState } from "react";
import { CheckCircle, CreditCard } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const SubscriptionPage = () => {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(
    user?.subscription.plan || "Free"
  );

  const plans = [
    {
      name: "Free",
      price: 0,
      features: [
        "3 job applications per month",
        "Basic profile",
        "Email support",
      ],
      popular: false,
    },
    {
      name: "Standard",
      price: 29,
      features: [
        "20 job applications per month",
        "Enhanced profile",
        "Priority support",
        "CV analysis",
      ],
      popular: true,
    },
    {
      name: "Premium",
      price: 99,
      features: [
        "Unlimited applications",
        "Premium profile badge",
        "24/7 support",
        "AI career coach",
        "Direct recruiter contact",
      ],
      popular: false,
    },
  ];

  const employerPlans = [
    {
      name: "Free",
      price: 0,
      features: ["1 job posting", "Basic analytics", "Email support"],
      popular: false,
    },
    {
      name: "Standard",
      price: 199,
      features: [
        "10 job postings",
        "Advanced analytics",
        "Priority support",
        "Candidate search",
      ],
      popular: true,
    },
    {
      name: "Premium",
      price: 499,
      features: [
        "Unlimited job postings",
        "Premium analytics",
        "24/7 support",
        "AI recruiting tools",
        "Featured company profile",
      ],
      popular: false,
    },
  ];

  const currentPlans = user?.role === "employer" ? employerPlans : plans;

  const upgradePlan = (planName: string) => {
    if (user) {
      const updatedUser = {
        ...user,
        subscription: {
          ...user.subscription,
          plan: planName as any,
          expiresAt: "2024-12-31",
        },
      };

      toast({
        title: "Subscription updated",
        description: `Successfully upgraded to ${planName} plan.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Subscription & Billing
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your subscription plan and billing information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Subscription */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="bg-blue-100 p-4 rounded-lg mb-4">
                    <CreditCard className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                    <h3 className="text-2xl font-bold text-gray-900">
                      {user?.subscription.plan}
                    </h3>
                    <p className="text-gray-600">Current Plan</p>
                  </div>

                  {user?.subscription.expiresAt && (
                    <p className="text-sm text-gray-600 mb-4">
                      Expires: {user.subscription.expiresAt}
                    </p>
                  )}

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Applications</span>
                      <span>
                        {user?.subscription.plan === "Premium"
                          ? "Unlimited"
                          : user?.subscription.plan === "Standard"
                          ? "20/month"
                          : "3/month"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Support</span>
                      <span>
                        {user?.subscription.plan === "Premium"
                          ? "24/7"
                          : user?.subscription.plan === "Standard"
                          ? "Priority"
                          : "Email"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Billing History */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      date: "2024-01-01",
                      plan: "Standard",
                      amount: 29,
                      status: "paid",
                    },
                    {
                      date: "2023-12-01",
                      plan: "Standard",
                      amount: 29,
                      status: "paid",
                    },
                    {
                      date: "2023-11-01",
                      plan: "Free",
                      amount: 0,
                      status: "paid",
                    },
                  ].map((record, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-sm">{record.plan}</p>
                        <p className="text-xs text-gray-600">{record.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${record.amount}</p>
                        <Badge variant="outline" className="text-xs">
                          {record.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Available Plans */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Available Plans
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {currentPlans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`relative ${
                    plan.popular ? "border-blue-500 shadow-lg" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-600">Most Popular</Badge>
                    </div>
                  )}

                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="text-3xl font-bold text-gray-900">
                      ${plan.price}
                      <span className="text-base font-normal text-gray-600">
                        /month
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => upgradePlan(plan.name)}
                      disabled={user?.subscription.plan === plan.name}
                      className="w-full"
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {user?.subscription.plan === plan.name
                        ? "Current Plan"
                        : plan.price === 0
                        ? "Downgrade"
                        : "Upgrade"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">
                Need a custom plan for your organization?
              </p>
              <Button variant="outline">Contact Sales</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
