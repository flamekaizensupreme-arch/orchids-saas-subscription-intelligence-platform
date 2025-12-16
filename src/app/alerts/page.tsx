"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockAlerts } from "@/lib/data";
import { Alert } from "@/lib/types";
import { 
  Bell, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  Copy, 
  PiggyBank,
  Check,
  X,
  Clock4,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";

const alertTypeConfig = {
  renewal: { icon: Clock, color: 'text-chart-4', bg: 'bg-chart-4/10', label: 'Renewal' },
  price_increase: { icon: TrendingUp, color: 'text-warning', bg: 'bg-warning/10', label: 'Price Change' },
  unused: { icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Unused' },
  duplicate: { icon: Copy, color: 'text-chart-2', bg: 'bg-chart-2/10', label: 'Duplicate' },
  budget: { icon: PiggyBank, color: 'text-primary', bg: 'bg-primary/10', label: 'Budget' },
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [activeTab, setActiveTab] = useState("all");

  const unreadCount = alerts.filter(a => !a.isRead).length;
  const renewalAlerts = alerts.filter(a => a.type === 'renewal');
  const actionAlerts = alerts.filter(a => a.type !== 'renewal');

  const markAsRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a));
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, isRead: true })));
  };

  const filteredAlerts = activeTab === 'all' 
    ? alerts 
    : activeTab === 'unread' 
      ? alerts.filter(a => !a.isRead)
      : alerts.filter(a => a.type === activeTab);

  const AlertCard = ({ alert }: { alert: Alert }) => {
    const config = alertTypeConfig[alert.type];
    const Icon = config.icon;
    
    return (
      <div className={`p-4 rounded-lg border transition-all ${!alert.isRead ? 'bg-muted/30 border-primary/20' : 'hover:bg-muted/20'}`}>
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${config.bg}`}>
            <Icon className={`w-5 h-5 ${config.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm">{alert.title}</h3>
                  {!alert.isRead && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{alert.description}</p>
              </div>
              <Badge variant="secondary" className={`text-xs flex-shrink-0 ${config.color} ${config.bg}`}>
                {config.label}
              </Badge>
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
              </span>
              <div className="flex items-center gap-2">
                {alert.subscriptionId && (
                  <Link href={`/subscriptions/${alert.subscriptionId}`}>
                    <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                      <ExternalLink className="w-3 h-3" />
                      View
                    </Button>
                  </Link>
                )}
                {!alert.isRead && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 text-xs gap-1"
                    onClick={() => markAsRead(alert.id)}
                  >
                    <Check className="w-3 h-3" />
                    Mark Read
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 text-xs gap-1 text-muted-foreground hover:text-destructive"
                  onClick={() => dismissAlert(alert.id)}
                >
                  <X className="w-3 h-3" />
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AppLayout title="Alerts" subtitle={`${unreadCount} unread notifications`}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{alerts.length}</p>
                  <p className="text-xs text-muted-foreground">Total Alerts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-chart-4/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-chart-4" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{renewalAlerts.length}</p>
                  <p className="text-xs text-muted-foreground">Upcoming Renewals</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{actionAlerts.length}</p>
                  <p className="text-xs text-muted-foreground">Action Required</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock4 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{unreadCount}</p>
                  <p className="text-xs text-muted-foreground">Unread</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base">All Alerts</CardTitle>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">All ({alerts.length})</TabsTrigger>
                <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
                <TabsTrigger value="renewal">Renewals</TabsTrigger>
                <TabsTrigger value="unused">Unused</TabsTrigger>
                <TabsTrigger value="budget">Budget</TabsTrigger>
              </TabsList>

              <div className="space-y-3">
                {filteredAlerts.length > 0 ? (
                  filteredAlerts.map((alert) => (
                    <AlertCard key={alert.id} alert={alert} />
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No alerts in this category</p>
                  </div>
                )}
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
