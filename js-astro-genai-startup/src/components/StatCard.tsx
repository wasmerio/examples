import { motion } from "framer-motion";
import type { FC, SVGProps } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: FC<SVGProps<SVGSVGElement>>;
  gradient?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  gradient = "from-purple-500 to-pink-500",
}: StatCardProps) {
  const changeColors = {
    positive: "text-green-600 dark:text-green-400",
    negative: "text-red-600 dark:text-red-400",
    neutral: "text-muted-foreground",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      {Icon && (
        <div
          className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${gradient} mb-4`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
      )}
      <div className="space-y-1">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
        {change && (
          <p className={`text-sm font-medium ${changeColors[changeType]}`}>
            {change}
          </p>
        )}
      </div>
    </motion.div>
  );
}
