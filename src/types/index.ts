/* -----------------------------
   USER TYPES
------------------------------ */

export interface User {
  username: string;
  role: UserRole;
}

export type UserRole = "user" | "admin";


/* -----------------------------
   AUTH TYPES
------------------------------ */

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}


/* -----------------------------
   DOCUMENT CLASSIFICATION
------------------------------ */

export type DocumentType =
  | "Invoice"
  | "Purchase Order"
  | "Bank Statement"
  | "Unknown";


export interface ClassificationResult {
  documentType: DocumentType;
  confidenceScore: number;
  textSnippet: string;
}


/* -----------------------------
   JOB PROCESSING
------------------------------ */

export type JobStatusType =
  | "pending"
  | "processing"
  | "completed"
  | "failed";


export interface JobStatus {
  jobId: number;
  status: JobStatusType;

  predictedClass?: DocumentType;
  confidenceScore?: number;

  metrics?: {
    accuracy?: number;
    precision?: number;
    recall?: number;
    f1Score?: number;
  };

  textSnippet?: string;
  error?: string;

  createdAt: string;
  updatedAt: string;
}


/* -----------------------------
   FILE HISTORY
------------------------------ */

export interface FileHistory {
  id: number;
  fileName: string;
  predictedClass: DocumentType;
  timestamp: string;
}


/* -----------------------------
   GENERIC API RESPONSE
------------------------------ */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}