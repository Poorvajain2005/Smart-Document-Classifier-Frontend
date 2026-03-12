import { Switch, Route, Redirect } from "wouter";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { UploadPage } from "@/pages/UploadPage";
import { HistoryPage } from "@/pages/HistoryPage";
import { AdminDashboardPage } from "@/pages/AdminDashboardPage";
import NotFound from "@/pages/not-found";

export function AppRoutes() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />

      <Route path="/dashboard">
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      </Route>

      <Route path="/upload">
        <ProtectedRoute>
          <UploadPage />
        </ProtectedRoute>
      </Route>

      <Route path="/history">
        <ProtectedRoute>
          <HistoryPage />
        </ProtectedRoute>
      </Route>

      <Route path="/admin">
        <ProtectedRoute>
          <AdminDashboardPage />
        </ProtectedRoute>
      </Route>

      <Route path="/">
        {() => <Redirect to="/login" />}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}
