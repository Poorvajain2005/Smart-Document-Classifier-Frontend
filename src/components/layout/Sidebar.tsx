import { useLocation } from "wouter";
import { useAuth } from "@/features/auth/context/AuthContext";
import { cn } from "@/lib/utils";
import { 
  FileText, 
  LayoutDashboard, 
  Upload, 
  History, 
  Shield,
  LogOut,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/upload", label: "Upload", icon: Upload },
    { path: "/history", label: "History", icon: History },
  ];

  if (user?.role === "admin") {
    navItems.push({ path: "/admin", label: "Admin", icon: Shield });
  }

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && onClose && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-64 bg-slate-950 border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex flex-shrink-0 items-center justify-between h-16 px-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-600 shadow-sm shadow-indigo-500/20">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg text-slate-100 font-semibold tracking-tight">DocClassifier</span>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden text-slate-400 hover:text-white hover:bg-white/10 h-8 w-8"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {user?.role === "admin" && (
            <div className="px-2 pb-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Management
              </p>
            </div>
          )}
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location === path;
            return (
              <button
                key={path}
                onClick={() => {
                  setLocation(path);
                  onClose?.();
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-indigo-600/10 text-indigo-400"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                )}
              >
                <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-indigo-400" : "text-slate-500")} />
                {label}
              </button>
            );
          })}
        </nav>

        {/* User section */}
        <div className="flex-shrink-0 p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 shadow-inner">
              <span className="text-sm font-bold text-slate-300">
                {user?.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-200 truncate">
                {user?.username}
              </p>
              {user?.role === "admin" ? (
                <p className="text-xs text-indigo-400 font-medium">Administrator</p>
              ) : (
                <p className="text-xs text-slate-500 font-medium">Standard User</p>
              )}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/10"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
