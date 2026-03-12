import { AppProviders } from "./providers";
import { AppRoutes } from "./AppRoutes";
import { Toaster } from "@/components/ui/toaster";

export default function App() {
  return (
    <AppProviders>
      <AppRoutes />
      <Toaster />
    </AppProviders>
  );
}
