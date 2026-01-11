import { useEffect, useState } from "react";
import {
  DollarSign,
  Zap,
  Shield,
  TrendingUp,
  Sparkles,
  Check,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  getBillableActions,
  getPublicBillableActions,
} from "@/api/endpoints/wallet.api";
import { BillableAction } from "@/api/types/wallet.types";

const getIconForAction = (code: string) => {
  if (code.includes("VIEW") || code.includes("CV")) return DollarSign;
  if (code.includes("POST") || code.includes("JOB")) return Zap;
  if (code.includes("PREMIUM") || code.includes("MATCH")) return Shield;
  if (code.includes("BOOST")) return TrendingUp;
  return Sparkles;
};

const BillableActions = () => {
  const [actions, setActions] = useState<BillableAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getPublicBillableActions()
      .then((res) => {
        setActions(res.items || []);
      })
      .catch((error) => {
        console.error("Failed to fetch billable actions:", error);
        setActions([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <section className="py-20 lg:py-28 bg-gradient-to-b from-background via-secondary/30 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container-custom relative">
          <div className="text-center text-muted-foreground">
            Loading pricing...
          </div>
        </div>
      </section>
    );
  }

  if (actions.length === 0) {
    return null;
  }

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-background via-secondary/30 to-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Transparent <span className="text-gradient">Pricing</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Pay only for what you use. No hidden fees, no monthly subscriptions.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {actions.map((action, index) => {
            const IconComponent = getIconForAction(action.actionCode);
            const isPopular = index === 0;

            return (
              <div
                key={action.id}
                className={`group relative p-8 rounded-3xl transition-all duration-500 ${
                  isPopular
                    ? "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-2 border-primary/30"
                    : "bg-card/50 backdrop-blur-sm border border-border hover:border-primary/30"
                } hover:-translate-y-2`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-primary to-blue-600">
                      <span className="text-xs font-bold text-primary-foreground tracking-wide">
                        MOST POPULAR
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-start justify-between mb-6">
                  <div
                    className={`p-4 rounded-2xl transition-all duration-300 ${
                      isPopular
                        ? "bg-gradient-to-br from-primary to-primary/80"
                        : "bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10"
                    }`}
                  >
                    <IconComponent
                      className={`w-7 h-7 ${
                        isPopular ? "text-primary-foreground" : "text-primary"
                      }`}
                    />
                  </div>

                  <Badge
                    variant="outline"
                    className="capitalize rounded-full border-border/50 bg-background/80 backdrop-blur-sm font-medium text-xs px-3 py-1"
                  >
                    {action.category}
                  </Badge>
                </div>

                <div className="mb-6">
                  <h3 className="font-bold text-xl lg:text-2xl text-foreground mb-3 group-hover:text-primary transition-colors">
                    {action.actionName}
                  </h3>

                  {action.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed min-h-[60px]">
                      {action.description}
                    </p>
                  )}
                </div>

                <div className="pt-6 border-t border-border/50">
                  <div className="flex items-end gap-2 mb-6">
                    <span className="text-5xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                      ${parseFloat(action.cost.toString()).toFixed(2)}
                    </span>
                    <span className="text-muted-foreground mb-2 text-sm">
                      {action.currency}
                    </span>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      <span>Per action usage</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      <span>No monthly commitment</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary" />
                      <span>Instant activation</span>
                    </div>
                  </div>

                  <Button
                    className={`w-full ${
                      isPopular
                        ? "bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
                        : ""
                    }`}
                    variant={isPopular ? "default" : "outline"}
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="hidden  lg:block text-center mt-16">
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">
                  Trusted by 90M+ users
                </p>
                <p className="text-sm text-muted-foreground">
                  Join the global workforce
                </p>
              </div>
            </div>

            <div className="w-px h-12 bg-border hidden sm:block" />

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">
                  Enterprise-grade security
                </p>
                <p className="text-sm text-muted-foreground">
                  Your data is protected
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BillableActions;
