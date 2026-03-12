import { useLocation } from "wouter";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/ui/page-header";
import { StatsCard } from "@/components/ui/stats-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, TrendingUp, Clock, ArrowRight } from "lucide-react";

export function DashboardPage() {
  const [, setLocation] = useLocation();

  const stats = [
    {
      title: "Total Documents",
      value: "124",
      icon: FileText,
      trend: { value: "12% from last month", isPositive: true },
      iconColor: "text-blue-600",
      iconBgColor: "bg-blue-100",
    },
    {
      title: "Invoices Detected",
      value: "48",
      icon: CheckCircle,
      trend: { value: "8% from last month", isPositive: true },
      iconColor: "text-green-600",
      iconBgColor: "bg-green-100",
    },
    {
      title: "Processing",
      value: "3",
      icon: Clock,
      iconColor: "text-orange-600",
      iconBgColor: "bg-orange-100",
    },
    {
      title: "Accuracy Rate",
      value: "98.5%",
      icon: TrendingUp,
      trend: { value: "2% from last month", isPositive: true },
      iconColor: "text-purple-600",
      iconBgColor: "bg-purple-100",
    },
  ];

  const recentActivity = [
    { id: 1, file: "invoice_2024_001.pdf", type: "Invoice", time: "2 minutes ago", status: "completed" },
    { id: 2, file: "purchase_order_march.pdf", type: "Purchase Order", time: "15 minutes ago", status: "completed" },
    { id: 3, file: "bank_statement_q1.pdf", type: "Bank Statement", time: "1 hour ago", status: "completed" },
    { id: 4, file: "invoice_2024_002.pdf", type: "Invoice", time: "2 hours ago", status: "completed" },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's an overview of your document classifications."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl border-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">Recent Activity</CardTitle>
            <CardDescription className="text-gray-500">Your latest document classifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mt-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="group flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-blue-100 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center group-hover:from-blue-100 group-hover:to-indigo-100 transition-colors">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{activity.file}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold px-3 py-1 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 rounded-full border border-emerald-100 shadow-sm">
                      {activity.type}
                    </span>
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              className="w-full mt-6 gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium rounded-xl transition-colors"
              onClick={() => setLocation("/history")}
            >
              View All History
              <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl border-gray-100 flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold text-gray-900">Quick Actions</CardTitle>
            <CardDescription className="text-gray-500">Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 mt-4 flex-1">
            <Button
              onClick={() => setLocation("/history")}
              className="w-full justify-start gap-3 h-12 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm rounded-xl font-medium transition-all hover:border-gray-300"
              variant="outline"
            >
              <FileText className="w-5 h-5 text-gray-500" />
              View Past Classifications
            </Button>
            <Button
              onClick={() => setLocation("/upload")}
              className="w-full justify-start gap-3 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md rounded-xl font-medium transition-all"
            >
              <CheckCircle className="w-5 h-5" />
              Scan New Document
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
