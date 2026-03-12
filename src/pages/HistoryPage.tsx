import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { ApiClient } from "@/services/api";
import { FileHistory } from "@/types";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Loader2, Calendar } from "lucide-react";

export function HistoryPage() {
  const { accessToken } = useAuth();
  const [history, setHistory] = useState<FileHistory[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<FileHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (!accessToken) return;
        const data = await ApiClient.getHistory(accessToken);
        setHistory(data);
        setFilteredHistory(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [accessToken]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = history.filter(
        (item) =>
          item.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.predictedClass.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredHistory(filtered);
    } else {
      setFilteredHistory(history);
    }
  }, [searchQuery, history]);

  const getTypeBadgeColor = (type: string | undefined) => {
    switch (type) {
      case "Invoice":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Purchase Order":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Bank Statement":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Classification History"
        description="View all your classified documents"
      />

      <Card className="shadow-lg border-gray-100/50 rounded-2xl overflow-hidden bg-white/70 backdrop-blur-xl">
        <CardContent className="p-6 md:p-8">
          {/* Search */}
          <div className="mb-8">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <Input
                placeholder="Search by filename or document type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 bg-gray-50/50 border-gray-200 text-base rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:bg-white transition-all shadow-sm"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
              <p className="text-sm text-gray-500">Loading history...</p>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : filteredHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                <FileText className="w-10 h-10 text-gray-300" />
              </div>
              <p className="text-xl font-bold text-gray-900 mb-2">
                {searchQuery ? "No matching documents" : "No classifications yet"}
              </p>
              <p className="text-base text-gray-500 max-w-sm">
                {searchQuery 
                  ? "We couldn't find anything matching your search term. Try another keyword." 
                  : "Upload a document to get started. Your classification history will appear here."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 gap-4"
                >
                  <div className="flex items-center gap-5 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-gray-900 truncate group-hover:text-blue-700 transition-colors">
                        {item.fileName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <p className="text-sm font-medium text-gray-500">
                          {new Date(item.timestamp).toLocaleString(undefined, {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`${getTypeBadgeColor(item.predictedClass)} flex-shrink-0 px-4 py-1.5 text-xs font-bold uppercase tracking-wider shadow-sm border-opacity-50`}
                  >
                    {item.predictedClass}
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {/* Results count */}
          {!isLoading && !error && filteredHistory.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Showing {filteredHistory.length} of {history.length} documents
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
