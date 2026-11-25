import { TrendingUp, TrendingDown, Users, Zap, DollarSign, Activity } from "lucide-react";

interface Metric {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function MetricsDashboard() {
  const metrics: Metric[] = [
    {
      title: "Total Users",
      value: "45,231",
      change: 12.5,
      changeLabel: "+2,543 this month",
      icon: Users,
    },
    {
      title: "API Requests",
      value: "1.2M",
      change: 8.2,
      changeLabel: "+98K today",
      icon: Zap,
    },
    {
      title: "Revenue",
      value: "$89,432",
      change: 15.3,
      changeLabel: "+$12,345 this week",
      icon: DollarSign,
    },
    {
      title: "Active Sessions",
      value: "2,847",
      change: -3.1,
      changeLabel: "-142 from yesterday",
      icon: Activity,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const isPositive = metric.change > 0;

          return (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg border bg-card p-6 hover:shadow-md transition-all"
            >
              {/* Background Icon */}
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Icon className="h-20 w-20" />
              </div>

              {/* Content */}
              <div className="relative space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </p>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                </div>

                <div>
                  <p className="text-3xl font-bold">{metric.value}</p>
                  <div className={`flex items-center gap-1 mt-1 text-sm ${
                    isPositive
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}>
                    {isPositive ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span className="font-medium">
                      {isPositive ? "+" : ""}
                      {metric.change}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {metric.changeLabel}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <div className="border rounded-lg p-6 bg-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold">Activity Overview</h3>
              <p className="text-sm text-muted-foreground">
                Last 7 days performance
              </p>
            </div>
            <select className="text-sm border rounded-md px-3 py-1.5 bg-background">
              <option>7 days</option>
              <option>30 days</option>
              <option>90 days</option>
            </select>
          </div>

          {/* Simple Bar Chart */}
          <div className="flex items-end justify-between gap-2 h-48">
            {[65, 45, 75, 55, 85, 70, 90].map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-md transition-all hover:opacity-80"
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-muted-foreground">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Regions */}
        <div className="border rounded-lg p-6 bg-card">
          <h3 className="font-semibold mb-6">Top Regions</h3>
          <div className="space-y-4">
            {[
              { country: "United States", percentage: 45, users: "20,354" },
              { country: "United Kingdom", percentage: 22, users: "9,951" },
              { country: "Germany", percentage: 15, users: "6,785" },
              { country: "Japan", percentage: 10, users: "4,523" },
              { country: "Others", percentage: 8, users: "3,618" },
            ].map((region, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{region.country}</span>
                  <span className="text-muted-foreground">{region.users} users</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                    style={{ width: `${region.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="border rounded-lg overflow-hidden bg-card">
        <div className="p-6 border-b">
          <h3 className="font-semibold">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">
            Latest API requests and user actions
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {[
                {
                  time: "2 min ago",
                  user: "alex@example.com",
                  action: "API Request: /v1/generate",
                  status: "success",
                },
                {
                  time: "5 min ago",
                  user: "sarah@example.com",
                  action: "User Login",
                  status: "success",
                },
                {
                  time: "12 min ago",
                  user: "mike@example.com",
                  action: "API Request: /v1/chat",
                  status: "error",
                },
                {
                  time: "18 min ago",
                  user: "emma@example.com",
                  action: "Password Reset",
                  status: "success",
                },
                {
                  time: "24 min ago",
                  user: "james@example.com",
                  action: "API Request: /v1/embeddings",
                  status: "success",
                },
              ].map((activity, index) => (
                <tr key={index} className="hover:bg-muted/30">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {activity.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {activity.user}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {activity.action}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        activity.status === "success"
                          ? "bg-green-500/10 text-green-600 dark:text-green-400"
                          : "bg-red-500/10 text-red-600 dark:text-red-400"
                      }`}
                    >
                      {activity.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
