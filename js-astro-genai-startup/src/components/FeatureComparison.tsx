import { Check, X } from "lucide-react";

interface FeatureComparisonProps {
  features: {
    name: string;
    free: boolean;
    pro: boolean;
    enterprise: boolean;
  }[];
}

export function FeatureComparison({ features }: FeatureComparisonProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4 font-semibold">Feature</th>
            <th className="text-center p-4 font-semibold">Free</th>
            <th className="text-center p-4 font-semibold">Pro</th>
            <th className="text-center p-4 font-semibold">Enterprise</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, index) => (
            <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
              <td className="p-4 text-sm">{feature.name}</td>
              <td className="p-4 text-center">
                {feature.free ? (
                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                ) : (
                  <X className="h-5 w-5 text-muted-foreground mx-auto" />
                )}
              </td>
              <td className="p-4 text-center">
                {feature.pro ? (
                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                ) : (
                  <X className="h-5 w-5 text-muted-foreground mx-auto" />
                )}
              </td>
              <td className="p-4 text-center">
                {feature.enterprise ? (
                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                ) : (
                  <X className="h-5 w-5 text-muted-foreground mx-auto" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
