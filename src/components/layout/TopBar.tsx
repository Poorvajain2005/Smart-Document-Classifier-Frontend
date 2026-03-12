import { Menu, Search, Bell, Settings, User, CreditCard, Users, Moon, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocation } from "wouter";
import { useAuth } from "@/features/auth/context/AuthContext";
import { LogOut } from "lucide-react";

interface TopBarProps {
  onMenuClick: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const [location, setLocation] = useLocation();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  // Convert current path to a readable title
  const titleMap: Record<string, string> = {
    "/dashboard": "Overview",
    "/upload": "Document Processing",
    "/history": "Classification History",
    "/admin": "Admin Console",
  };
  const title = titleMap[location] || "Dashboard";

  return (
    <header className="sticky top-0 z-30 h-[68px] bg-white/80 backdrop-blur-md border-b border-gray-200/80 transition-all">
      <div className="flex items-center justify-between h-full px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden text-gray-600 hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <span className="text-gray-500 font-medium">Workspace</span>
            <span className="text-gray-400">/</span>
            <h1 className="font-semibold text-gray-900 tracking-tight">
              {title}
            </h1>
          </div>
          
          <h1 className="text-lg font-semibold text-gray-900 sm:hidden">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden md:flex relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Quick search..." 
              className="w-64 h-9 pl-9 pr-4 text-sm bg-gray-100/80 border-transparent rounded-full focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            />
          </div>
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors relative outline-none">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80" align="end">
                <DropdownMenuLabel className="font-semibold text-gray-900">Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer flex items-start gap-3 p-3">
                  <div className="rounded-full bg-blue-100 p-1.5 text-blue-600 mt-0.5">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-gray-900 leading-none">System Update V2.4</p>
                    <p className="text-xs text-gray-500 leading-snug">The platform has been updated with improved ML models.</p>
                    <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer flex items-start gap-3 p-3">
                  <div className="rounded-full bg-emerald-100 p-1.5 text-emerald-600 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-gray-900 leading-none">Job #6459 Completed</p>
                    <p className="text-xs text-gray-500 leading-snug">Invoice classification pipeline finished with 98% confidence.</p>
                    <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="p-2 text-center">
                  <span className="text-xs font-medium text-blue-600 hover:text-blue-700 cursor-pointer">Mark all as read</span>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors hidden sm:block outline-none">
                  <Settings className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>Quick Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => setLocation("/dashboard")}>
                  <User className="w-4 h-4 text-gray-500" />
                  <span>{user?.name || "Account Profile"}</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer gap-2">
                  <CreditCard className="w-4 h-4 text-gray-500" />
                  <span>Billing & Subscriptions</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span>Team Members</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer gap-2">
                  <Moon className="w-4 h-4 text-gray-500" />
                  <span>Dark Mode (Coming Soon)</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer gap-2 text-red-600 focus:text-red-600 focus:bg-red-50" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
