import { useState, useEffect } from "react";
import { Users, TrendingUp, Zap, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Live User Counter
export function LiveUserCount() {
  const [count, setCount] = useState(1247);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev + Math.floor(Math.random() * 3));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-background/50 backdrop-blur-sm shadow-sm">
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
        <div className="relative w-2 h-2 bg-green-500 rounded-full" />
      </div>
      <Users className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm font-medium">
        <motion.span
          key={count}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {count.toLocaleString()}
        </motion.span>{" "}
        <span className="text-muted-foreground">users online</span>
      </span>
    </div>
  );
}

// Recent Activity Feed
interface Activity {
  id: string;
  user: string;
  action: string;
  location: string;
  timestamp: number;
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "1",
      user: "Sarah J.",
      action: "just signed up",
      location: "San Francisco, US",
      timestamp: Date.now() - 5000,
    },
  ]);

  const locations = [
    "New York, US",
    "London, UK",
    "Tokyo, JP",
    "Berlin, DE",
    "Paris, FR",
    "Sydney, AU",
    "Toronto, CA",
    "Singapore, SG",
  ];

  const names = [
    "Alex M.",
    "Jordan K.",
    "Taylor R.",
    "Morgan S.",
    "Casey B.",
    "Riley P.",
    "Jamie L.",
    "Quinn D.",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity: Activity = {
        id: Date.now().toString(),
        user: names[Math.floor(Math.random() * names.length)],
        action: "just signed up",
        location: locations[Math.floor(Math.random() * locations.length)],
        timestamp: Date.now(),
      };

      setActivities((prev) => [newActivity, ...prev.slice(0, 2)]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-40 w-full max-w-sm pointer-events-none">
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {activities.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-lg border bg-background/95 backdrop-blur-sm shadow-lg"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold text-sm flex-shrink-0">
                {activity.user.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-semibold">{activity.user}</span>{" "}
                  <span className="text-muted-foreground">{activity.action}</span>
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                  <Globe className="h-3 w-3" />
                  <span>{activity.location}</span>
                  <span>•</span>
                  <span>Just now</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Stats Ticker
export function StatsTicker() {
  const stats = [
    { label: "API Requests", value: 124567890, icon: Zap },
    { label: "Active Users", value: 45231, icon: Users },
    { label: "Growth Rate", value: 234, suffix: "%", icon: TrendingUp },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="relative overflow-hidden rounded-lg border bg-card p-6 hover:shadow-md transition-shadow"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Icon className="h-16 w-16" />
            </div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
              </div>
              <CountUpNumber
                end={stat.value}
                suffix={stat.suffix}
                className="text-3xl font-bold"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Count Up Animation
function CountUpNumber({
  end,
  suffix,
  className,
}: {
  end: number;
  suffix?: string;
  className?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = end / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [end]);

  return (
    <div className={className}>
      {count.toLocaleString()}
      {suffix}
    </div>
  );
}

// Trust Badges
export function TrustBadges() {
  const badges = [
    { label: "SOC 2 Certified", icon: "🔒" },
    { label: "GDPR Compliant", icon: "🇪🇺" },
    { label: "99.9% Uptime", icon: "⚡" },
    { label: "24/7 Support", icon: "💬" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {badges.map((badge, index) => (
        <div
          key={index}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-muted/30 text-sm font-medium"
        >
          <span className="text-lg">{badge.icon}</span>
          {badge.label}
        </div>
      ))}
    </div>
  );
}
