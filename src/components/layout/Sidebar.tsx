"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  CreditCard, 
  PlusCircle, 
  Bell, 
  PiggyBank, 
  Lightbulb, 
  Users, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockUser, mockAlerts } from "@/lib/data";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/subscriptions", label: "Subscriptions", icon: CreditCard },
  { href: "/subscriptions/add", label: "Add New", icon: PlusCircle },
  { href: "/alerts", label: "Alerts", icon: Bell, badge: mockAlerts.filter(a => !a.isRead).length },
  { href: "/budget", label: "Budget", icon: PiggyBank },
  { href: "/savings", label: "Savings", icon: Lightbulb },
  { href: "/team", label: "Team", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const unreadAlerts = mockAlerts.filter(a => !a.isRead).length;

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out flex flex-col",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center glow-sm">
            <Shield className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <span className="font-bold text-lg tracking-tight text-foreground">SubSentry</span>
          )}
        </Link>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 flex-shrink-0"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href}>
                <div
                  data-tour={item.dataTour}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-md" 
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "drop-shadow-sm")} />
                {!collapsed && (
                  <>
                    <span className="font-medium text-sm">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <Badge 
                        variant={isActive ? "secondary" : "default"} 
                        className={cn(
                          "ml-auto h-5 min-w-5 flex items-center justify-center text-xs",
                          isActive && "bg-white/20 text-white hover:bg-white/30"
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
                {collapsed && item.badge && item.badge > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-white text-[10px] flex items-center justify-center font-semibold">
                    {item.badge}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {!collapsed && mockUser.tier !== 'team' && (
        <div className="p-3">
          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 via-chart-2/10 to-chart-3/10 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">Upgrade to Team</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">Unlock team features and advanced analytics</p>
            <Button size="sm" className="w-full h-8 text-xs">
              View Plans
            </Button>
          </div>
        </div>
      )}

      <div className="p-3 border-t border-sidebar-border">
        <Link href="/settings">
          <div className={cn(
            "flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent transition-colors",
            collapsed && "justify-center"
          )}>
            <Avatar className="w-9 h-9 border-2 border-primary/20">
              <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {mockUser.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{mockUser.name}</p>
                <p className="text-xs text-muted-foreground truncate">{mockUser.tier.charAt(0).toUpperCase() + mockUser.tier.slice(1)} Plan</p>
              </div>
            )}
          </div>
        </Link>
      </div>
    </aside>
  );
}
