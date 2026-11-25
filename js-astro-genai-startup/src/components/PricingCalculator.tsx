import { useState } from "react";
import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PricingCalculator() {
  const [apiCalls, setApiCalls] = useState(100000);
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  // Pricing tiers (price per 1K API calls)
  const calculatePrice = () => {
    const pricePerThousand =
      apiCalls <= 100000 ? 0.01 : apiCalls <= 500000 ? 0.008 : 0.006;

    const monthlyPrice = (apiCalls / 1000) * pricePerThousand;
    const annualPrice = monthlyPrice * 12 * 0.8; // 20% discount

    return billing === "monthly" ? monthlyPrice : annualPrice / 12;
  };

  const totalPrice = calculatePrice();
  const annualSavings = billing === "annual" ? calculatePrice() * 12 * 0.25 : 0;

  const tiers = [
    { limit: 100000, price: "$0.01", label: "Up to 100K" },
    { limit: 500000, price: "$0.008", label: "100K - 500K" },
    { limit: Infinity, price: "$0.006", label: "500K+" },
  ];

  const activeTier = tiers.find((tier) => apiCalls <= tier.limit) || tiers[2];

  return (
    <div className="space-y-6">
      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setBilling("monthly")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            billing === "monthly"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setBilling("annual")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors relative ${
            billing === "annual"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Annual
          <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs bg-green-500 text-white rounded-full">
            -20%
          </span>
        </button>
      </div>

      {/* Calculator Card */}
      <div className="border rounded-2xl p-6 md:p-8 bg-gradient-to-br from-purple-500/5 to-pink-500/5">
        <div className="space-y-6">
          {/* API Calls Slider */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium">
                API Calls per Month
              </label>
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                {apiCalls.toLocaleString()}
              </div>
            </div>
            <input
              type="range"
              min="10000"
              max="1000000"
              step="10000"
              value={apiCalls}
              onChange={(e) => setApiCalls(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>10K</span>
              <span>500K</span>
              <span>1M</span>
            </div>
          </div>

          {/* Price Display */}
          <div className="text-center py-8 border-y">
            <div className="text-sm text-muted-foreground mb-2">
              Estimated {billing === "annual" ? "Monthly" : ""} Cost
            </div>
            <div className="text-5xl font-bold mb-2">
              ${totalPrice.toFixed(2)}
              <span className="text-lg text-muted-foreground font-normal">
                /month
              </span>
            </div>
            {billing === "annual" && (
              <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                Save ${annualSavings.toFixed(2)}/year with annual billing
              </div>
            )}
          </div>

          {/* Active Tier */}
          <div className="bg-background border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">
                  Current Tier
                </div>
                <div className="font-semibold">{activeTier.label} API calls</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">
                  Price per 1K calls
                </div>
                <div className="font-semibold text-primary">
                  {activeTier.price}
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              <span>99.9% uptime SLA</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              <span>24/7 priority support</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              <span>Advanced analytics dashboard</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              <span>Custom model fine-tuning</span>
            </div>
          </div>

          {/* CTA */}
          <Button className="w-full" size="lg">
            <Zap className="h-4 w-4 mr-2" />
            Get Started Now
          </Button>
        </div>
      </div>

      {/* Pricing Tiers Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Volume</th>
              <th className="px-4 py-3 text-right font-semibold">
                Price per 1K
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {tiers.map((tier, index) => (
              <tr
                key={index}
                className={
                  tier === activeTier ? "bg-primary/5" : "hover:bg-muted/30"
                }
              >
                <td className="px-4 py-3">{tier.label}</td>
                <td className="px-4 py-3 text-right font-medium">
                  {tier.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
