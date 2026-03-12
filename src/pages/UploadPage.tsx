import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/features/auth/context/AuthContext";
import { ApiClient } from "@/services/api";
import { JobStatus } from "@/types";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, Loader2, CheckCircle2, XCircle, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";

export function UploadPage() {
  const { accessToken } = useAuth();
  const [, setLocation] = useLocation();
  const fileInput = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [jobId, setJobId] = useState<number | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [error, setError] = useState("");
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isTextExpanded, setIsTextExpanded] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file.type !== "application/pdf") {
      setError("Please select a PDF file");
      return;
    }
    setSelectedFile(file);
    setError("");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !accessToken) {
      setError("Please select a file");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const response = await ApiClient.uploadPdf(selectedFile, accessToken);
      setJobId(response.job_id);
      startPolling(response.job_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setIsUploading(false);
    }
  };

  const startPolling = (jobIdToCheck: number) => {
    if (pollingInterval) clearInterval(pollingInterval);

    const interval = setInterval(async () => {
      try {
        if (!accessToken) return;
        const status = await ApiClient.getJobStatus(jobIdToCheck, accessToken);
        setJobStatus(status);

        if (status.status === "completed" || status.status === "failed") {
          clearInterval(interval);
          setPollingInterval(null);
          setIsUploading(false);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 1000);

    setPollingInterval(interval);
  };

  useEffect(() => {
    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
    };
  }, [pollingInterval]);

  const resetUpload = () => {
    setJobId(null);
    setJobStatus(null);
    setSelectedFile(null);
    setError("");
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Upload Document"
        description="Upload a PDF document for classification"
        action={
          <Button variant="ghost" onClick={() => setLocation("/dashboard")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        }
      />

      {!jobId ? (
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-lg border-gray-100/50 rounded-2xl overflow-hidden bg-white/70 backdrop-blur-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">Select Document</CardTitle>
              <CardDescription className="text-base font-medium">Upload a PDF file to run through our ML pipeline</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onClick={() => fileInput.current?.click()}
                className={`group relative border-2 border-dashed rounded-2xl p-14 text-center cursor-pointer transition-all duration-300 ease-out overflow-hidden ${
                  isDragging
                    ? "border-blue-500 bg-blue-50/50 scale-[1.02] shadow-lg shadow-blue-500/10"
                    : "border-gray-300 hover:border-blue-400 hover:bg-gray-50/50"
                }`}
              >
                {/* Subtle animated background radial gradient on drag */}
                {isDragging && (
                  <div className="absolute inset-0 bg-blue-400/5 blur-3xl animate-pulse" />
                )}
                <div className="relative z-10 flex flex-col items-center gap-5">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors duration-300 ${isDragging ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'}`}>
                    <Upload className="w-10 h-10 transition-transform duration-300 group-hover:-translate-y-1" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">
                      {selectedFile ? selectedFile.name : "Drop your PDF here or click to browse"}
                    </p>
                    <p className="text-sm font-medium text-gray-500 mt-2">
                      PDF files only, safely processed up to 10MB
                    </p>
                  </div>
                </div>
              </div>

              <input
                ref={fileInput}
                type="file"
                accept=".pdf"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                className="hidden"
              />

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {selectedFile && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl shadow-sm gap-4 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-50 rounded-lg">
                      <FileText className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-gray-900 truncate max-w-[200px] sm:max-w-xs">{selectedFile.name}</p>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-0.5">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • PDF Document
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="gap-2 h-12 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all rounded-xl font-semibold"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing via AI...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        Extract Insights
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Status Card */}
          <Card className="shadow-md rounded-2xl border-gray-100">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">Classification Radar</CardTitle>
                  <CardDescription className="font-mono text-xs mt-1 bg-gray-100 px-2 py-1 rounded inline-block">Job ID: {jobId}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {jobStatus && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    {jobStatus.status === "pending" && (
                      <>
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        <div>
                          <p className="font-semibold text-gray-900">Pending</p>
                          <p className="text-sm text-gray-600">Waiting to process...</p>
                        </div>
                      </>
                    )}
                    {jobStatus.status === "processing" && (
                      <>
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        <div>
                          <p className="font-semibold text-gray-900">Processing</p>
                          <p className="text-sm text-gray-600">Analyzing document...</p>
                        </div>
                      </>
                    )}
                    {jobStatus.status === "completed" && (
                      <>
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                        <div>
                          <p className="font-semibold text-gray-900">Completed</p>
                          <p className="text-sm text-gray-600">Classification successful</p>
                        </div>
                      </>
                    )}
                    {jobStatus.status === "failed" && (
                      <>
                        <XCircle className="w-8 h-8 text-red-600" />
                        <div>
                          <p className="font-semibold text-gray-900">Failed</p>
                          <p className="text-sm text-gray-600">Classification failed</p>
                        </div>
                      </>
                    )}
                  </div>

                  {(jobStatus.status === "pending" || jobStatus.status === "processing") && (
                    <Progress value={jobStatus.status === "pending" ? 30 : 70} />
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Card */}
          {jobStatus?.status === "completed" && (
            <Card className="shadow-lg border-gray-100/50 rounded-2xl overflow-hidden bg-white/70 backdrop-blur-xl">
              <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-6 mb-6">
                <CardTitle className="text-2xl font-extrabold text-gray-900">Intelligence Report</CardTitle>
                <CardDescription className="text-base">Document fully analyzed by our ML pipeline</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 px-8 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white shadow-md transform transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-center gap-2 mb-2">
                       <FileText className="w-5 h-5 opacity-80" />
                       <p className="text-sm font-medium opacity-90">Detected Model Type</p>
                    </div>
                    <p className="text-2xl md:text-3xl font-extrabold tracking-tight">{jobStatus.predictedClass || (jobStatus as any).predicted_class || 'Unknown'}</p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl text-white shadow-md transform transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-center gap-2 mb-2">
                       <CheckCircle2 className="w-5 h-5 opacity-80" />
                       <p className="text-sm font-medium opacity-90">Confidence Assessment</p>
                    </div>
                    <p className="text-2xl md:text-3xl font-extrabold tracking-tight">
                      {(((jobStatus.confidenceScore !== undefined ? jobStatus.confidenceScore : (jobStatus as any).confidence_score) || 0) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                  <div className="p-5 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex justify-between items-start mb-2">
                       <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Accuracy</p>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {(((jobStatus.metrics?.accuracy !== undefined ? jobStatus.metrics.accuracy : (jobStatus as any).accuracy) || 0) * 100).toFixed(1)}<span className="text-sm text-gray-500 font-normal">%</span>
                    </p>
                    <p className="text-xs text-gray-400 group-hover:text-blue-600 transition-colors">Overall correctness of the prediction</p>
                  </div>
                  <div className="p-5 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex justify-between items-start mb-2">
                       <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Precision</p>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {(((jobStatus.metrics?.precision !== undefined ? jobStatus.metrics.precision : (jobStatus as any).precision) || 0) * 100).toFixed(1)}<span className="text-sm text-gray-500 font-normal">%</span>
                    </p>
                    <p className="text-xs text-gray-400 group-hover:text-blue-600 transition-colors">Reliability of the prediction</p>
                  </div>
                  <div className="p-5 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex justify-between items-start mb-2">
                       <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Recall</p>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {(((jobStatus.metrics?.recall !== undefined ? jobStatus.metrics.recall : (jobStatus as any).recall) || 0) * 100).toFixed(1)}<span className="text-sm text-gray-500 font-normal">%</span>
                    </p>
                    <p className="text-xs text-gray-400 group-hover:text-blue-600 transition-colors">Ability to find all true cases</p>
                  </div>
                  <div className="p-5 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex justify-between items-start mb-2">
                       <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">F1 Score</p>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mb-2">
                      {(((jobStatus.metrics?.f1Score !== undefined ? jobStatus.metrics.f1Score : (jobStatus as any).f1_score) || 0) * 100).toFixed(1)}<span className="text-sm text-gray-500 font-normal">%</span>
                    </p>
                    <p className="text-xs text-gray-400 group-hover:text-blue-600 transition-colors">Harmonic mean of memory/precision</p>
                  </div>
                </div>

                {(jobStatus.textSnippet || (jobStatus as any).text_snippet) && (
                  <div className="mt-10 overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-slate-950 flex flex-col">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900 transition-colors">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <h3 className="text-sm font-semibold text-slate-200">Raw Extracted Text</h3>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                          <span className="text-xs font-medium text-slate-400">Parsed Successfully</span>
                        </div>
                        <button
                          onClick={() => setIsTextExpanded(!isTextExpanded)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 hover:bg-indigo-500/20 px-2 py-1 rounded cursor-pointer"
                        >
                          {isTextExpanded ? (
                            <>
                              Show Less <ChevronUp className="w-3.5 h-3.5" />
                            </>
                          ) : (
                            <>
                              Read More <ChevronDown className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div 
                        className={`p-6 overflow-y-auto custom-scrollbar bg-slate-950 transition-all duration-300 ease-in-out ${
                          isTextExpanded ? "max-h-[800px]" : "max-h-[140px]"
                        }`}
                      >
                        <p className="text-sm text-slate-300 font-mono whitespace-pre-wrap leading-relaxed break-words">
                          {jobStatus.textSnippet || (jobStatus as any).text_snippet}
                        </p>
                      </div>
                      
                      {/* Gradient overlay when collapsed to indicate more text */}
                      {!isTextExpanded && (
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Error Card */}
          {jobStatus?.error && (
            <Alert variant="destructive">
              <AlertDescription>{jobStatus.error}</AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button onClick={() => setLocation("/dashboard")} variant="outline" className="flex-1 h-14 rounded-xl font-semibold border-2 border-gray-200 text-gray-700 hover:bg-gray-50">
              Return to Dashboard
            </Button>
            <Button onClick={resetUpload} className="flex-1 h-14 rounded-xl font-semibold bg-gray-900 border-2 border-transparent text-white hover:bg-gray-800 shadow-md">
              Process Another File
            </Button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
