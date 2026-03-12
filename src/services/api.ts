import { AuthTokens, JobStatus, FileHistory } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export class ApiClient {
  private static getHeaders(token?: string) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  static async register(username: string, password: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ username, password, role: "user" }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Registration failed");
    }
  }

  static async login(username: string, password: string): Promise<AuthTokens> {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData,
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Login failed");
    }
    const data = await response.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token
    };
  }

  static async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!response.ok) {
      throw new Error("Token refresh failed");
    }
    return response.json();
  }

  static async uploadPdf(file: File, accessToken: string): Promise<{ job_id: number }> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/api/v1/classify`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: formData,
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Authentication failed. Please log in again.");
      }
      const error = await response.json().catch(() => ({ detail: "Upload failed" }));
      throw new Error(error.detail || "Upload failed");
    }
    return response.json();
  }

  static async getJobStatus(jobId: number, accessToken: string): Promise<JobStatus> {
    const response = await fetch(`${API_BASE_URL}/api/v1/classify/status/${jobId}`, {
      method: "GET",
      headers: this.getHeaders(accessToken),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch job status");
    }
    return response.json();
  }

  static async getHistory(accessToken: string): Promise<FileHistory[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/history`, {
      method: "GET",
      headers: this.getHeaders(accessToken),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch history");
    }
    const data = await response.json();
    return data.map((item: any) => ({
      id: item.id,
      fileName: item.file_name || item.fileName,
      predictedClass: item.predicted_class || item.predictedClass,
      timestamp: item.timestamp
    }));
  }
}
