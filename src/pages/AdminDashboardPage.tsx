import { useLocation } from "wouter";
import { useAuth } from "@/features/auth/context/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/ui/page-header";
import { StatsCard } from "@/components/ui/stats-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Activity, TrendingUp, Server, Database } from "lucide-react";

export function AdminDashboardPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  if (user?.role !== "admin") {
    setLocation("/dashboard");
    return null;
  }

  const stats = [
    {
      title: "Total Users",
      value: "156",
      icon: Users,
      trend: { value: "12% from last month", isPositive: true },
      iconColor: "text-blue-600",
      iconBgColor: "bg-blue-100",
    },
    {
      title: "Total Documents",
      value: "2,847",
      icon: FileText,
      trend: { value: "18% from last month", isPositive: true },
      iconColor: "text-green-600",
      iconBgColor: "bg-green-100",
    },
    {
      title: "API Requests",
      value: "12.4K",
      icon: Activity,
      trend: { value: "8% from last month", isPositive: true },
      iconColor: "text-purple-600",
      iconBgColor: "bg-purple-100",
    },
    {
      title: "System Uptime",
      value: "99.9%",
      icon: Server,
      iconColor: "text-orange-600",
      iconBgColor: "bg-orange-100",
    },
  ];

  const systemMetrics = [
    { label: "CPU Usage", value: "45%", color: "bg-blue-600" },
    { label: "Memory Usage", value: "62%", color: "bg-green-600" },
    { label: "Storage Used", value: "38%", color: "bg-purple-600" },
    { label: "Network I/O", value: "28%", color: "bg-orange-600" },
  ];

  const recentUsers = [
    { name: "John Doe", email: "john@example.com", documents: 45, joined: "2 days ago" },
    { name: "Jane Smith", email: "jane@example.com", documents: 32, joined: "5 days ago" },
    { name: "Bob Johnson", email: "bob@example.com", documents: 28, joined: "1 week ago" },
    { name: "Alice Brown", email: "alice@example.com", documents: 19, joined: "2 weeks ago" },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Admin Dashboard"
        description="System administration and monitoring"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Metrics */}
        <Card className="lg:col-span-2 shadow-sm rounded-2xl border-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">System Metrics</CardTitle>
            <CardDescription className="text-gray-500">Real-time system performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 mt-4">
            {systemMetrics.map((metric) => (
              <div key={metric.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">{metric.label}</span>
                  <span className="text-sm font-bold text-gray-900">{metric.value}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className={`${metric.color} h-2.5 rounded-full transition-all shadow-sm`}
                    style={{ width: metric.value }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="shadow-sm rounded-2xl border-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold text-gray-900">Quick Stats</CardTitle>
            <CardDescription className="text-gray-500">At a glance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 mt-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-gray-800">Database Size</span>
              </div>
              <span className="text-lg font-bold text-blue-800">2.4 GB</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-sm font-semibold text-gray-800">Avg Response</span>
              </div>
              <span className="text-lg font-bold text-green-800">124ms</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-br from-purple-50 to-fuchsia-50 border border-purple-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-semibold text-gray-800">Active Sessions</span>
              </div>
              <span className="text-lg font-bold text-purple-800">42</span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card className="lg:col-span-3 shadow-sm rounded-2xl border-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold text-gray-900">Recent Users</CardTitle>
            <CardDescription className="text-gray-500">Newly registered users across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mt-4">
              {recentUsers.map((user, index) => (
                <div
                  key={index}
                  className="group flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center shadow-inner">
                      <span className="text-sm font-bold text-white tracking-widest">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{user.name}</p>
                      <p className="text-xs font-medium text-gray-500 mt-0.5">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-base font-bold text-gray-900">{user.documents}</p>
                      <p className="text-xs uppercase tracking-wider font-semibold text-gray-400">docs</p>
                    </div>
                    <p className="text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">{user.joined}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
