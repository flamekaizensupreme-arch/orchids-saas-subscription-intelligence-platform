"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  mockSubscriptions, 
  mockAlerts, 
  mockBudgets,
  mockSavingsInsights,
  spendingTrendData,
  categoryBreakdownData,
  calculateMonthlyTotal,
  calculateAnnualProjection
} from "@/lib/data";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  Calendar, 
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Clock,
  PiggyBank
} from "lucide-react";
import Link from "next/link";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { format, differenceInDays } from "date-fns";

export default function DashboardPage() {
  const monthlyTotal = calculateMonthlyTotal(mockSubscriptions);
  const annualProjection = calculateAnnualProjection(mockSubscriptions);
  const activeSubscriptions = mockSubscriptions.filter(s => s.status === 'active' || s.status === 'trial').length;
  const unreadAlerts = mockAlerts.filter(a => !a.isRead);
  const totalBudget = mockBudgets[0];
  const totalPotentialSavings = mockSavingsInsights.reduce((sum, i) => sum + i.potentialSavings, 0);

  const upcomingRenewals = mockSubscriptions
    .filter(s => s.status === 'active' || s.status === 'trial')
    .sort((a, b) => new Date(a.nextRenewal).getTime() - new Date(b.nextRenewal).getTime())
    .slice(0, 4);

  const flaggedSubscriptions = mockSubscriptions.filter(
    s => s.usagePercentage !== undefined && s.usagePercentage < 40 && s.status === 'active'
  );

  return (
    <AppLayout title="Dashboard" subtitle="Your subscription overview">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <Badge variant="secondary" className="gap-1 text-xs">
                  <TrendingUp className="w-3 h-3" />
                  +5.7%
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Monthly Spending</p>
              <p className="text-2xl font-bold tracking-tight">${monthlyTotal.toFixed(2)}</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-chart-2/10 to-transparent rounded-bl-full" />
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-chart-2/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-chart-2" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Active Subscriptions</p>
              <p className="text-2xl font-bold tracking-tight">{activeSubscriptions}</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-chart-4/10 to-transparent rounded-bl-full" />
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-chart-4/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-chart-4" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Annual Projection</p>
              <p className="text-2xl font-bold tracking-tight">${annualProjection.toFixed(0)}</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-chart-3/30 bg-gradient-to-br from-chart-3/5 to-transparent">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-chart-3/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-chart-3" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Potential Savings</p>
              <p className="text-2xl font-bold tracking-tight text-chart-3">${totalPotentialSavings.toFixed(0)}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Spending Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={spendingTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.55 0.24 270)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="oklch(0.55 0.24 270)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 12, fill: 'oklch(0.50 0.02 280)' }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 12, fill: 'oklch(0.50 0.02 280)' }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'oklch(1 0 0)', 
                        border: '1px solid oklch(0.91 0.01 280)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                      formatter={(value: number) => [`$${value}`, 'Spending']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="oklch(0.55 0.24 270)" 
                      strokeWidth={2}
                      fill="url(#colorAmount)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">By Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryBreakdownData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {categoryBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        background: 'oklch(1 0 0)', 
                        border: '1px solid oklch(0.91 0.01 280)',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                      formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {categoryBreakdownData.slice(0, 4).map((cat) => (
                  <div key={cat.name} className="flex items-center gap-2 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-muted-foreground truncate">{cat.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold">Upcoming Renewals</CardTitle>
              <Link href="/subscriptions">
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingRenewals.map((sub) => {
                  const daysUntil = differenceInDays(new Date(sub.nextRenewal), new Date());
                  const isUrgent = daysUntil <= 7;
                  return (
                    <Link key={sub.id} href={`/subscriptions/${sub.id}`}>
                      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group">
                        <Avatar className="w-10 h-10 rounded-lg border">
                          <AvatarImage src={sub.logo} alt={sub.name} className="object-contain p-1" />
                          <AvatarFallback className="rounded-lg bg-muted text-xs font-medium">
                            {sub.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{sub.name}</p>
                          <p className="text-xs text-muted-foreground">
                            ${sub.billingFrequency === 'annual' ? (sub.cost / 12).toFixed(2) : sub.cost.toFixed(2)}/mo
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={isUrgent ? "destructive" : "secondary"} 
                            className="text-xs"
                          >
                            {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(sub.nextRenewal), 'MMM d')}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold">Recent Alerts</CardTitle>
              <Link href="/alerts">
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {unreadAlerts.slice(0, 4).map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      alert.type === 'renewal' ? 'bg-chart-4/10 text-chart-4' :
                      alert.type === 'unused' ? 'bg-destructive/10 text-destructive' :
                      alert.type === 'duplicate' ? 'bg-chart-2/10 text-chart-2' :
                      alert.type === 'price_increase' ? 'bg-warning/10 text-warning' :
                      'bg-primary/10 text-primary'
                    }`}>
                      {alert.type === 'renewal' ? <Clock className="w-4 h-4" /> :
                       alert.type === 'unused' ? <AlertTriangle className="w-4 h-4" /> :
                       alert.type === 'budget' ? <PiggyBank className="w-4 h-4" /> :
                       <TrendingUp className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{alert.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{alert.description}</p>
                    </div>
                  </div>
                ))}
                {unreadAlerts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">No new alerts</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold">Budget Status</CardTitle>
              <Link href="/budget">
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  Manage <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockBudgets.slice(0, 3).map((budget) => {
                  const percentage = (budget.spent / budget.limit) * 100;
                  const isOverBudget = percentage >= 100;
                  const isNearLimit = percentage >= 80;
                  return (
                    <div key={budget.id}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{budget.name}</span>
                        <span className={`text-sm font-medium ${
                          isOverBudget ? 'text-destructive' : isNearLimit ? 'text-warning' : 'text-muted-foreground'
                        }`}>
                          ${budget.spent.toFixed(0)} / ${budget.limit}
                        </span>
                      </div>
                      <Progress 
                        value={Math.min(percentage, 100)} 
                        className={`h-2 ${
                          isOverBudget ? '[&>div]:bg-destructive' : 
                          isNearLimit ? '[&>div]:bg-warning' : ''
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/5 via-chart-2/5 to-chart-3/5 border-primary/20">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold">Savings Opportunities</CardTitle>
              <Link href="/savings">
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockSavingsInsights.slice(0, 3).map((insight) => (
                  <div key={insight.id} className="flex items-center gap-3 p-3 rounded-lg bg-background/60 border border-border/50">
                    <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-chart-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{insight.title}</p>
                      <p className="text-xs text-muted-foreground">{insight.description}</p>
                    </div>
                    <Badge variant="secondary" className="text-chart-3 bg-chart-3/10 font-semibold">
                      +${insight.potentialSavings.toFixed(0)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {flaggedSubscriptions.length > 0 && (
          <Card className="border-warning/30 bg-warning/5">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                <CardTitle className="text-base font-semibold">Needs Attention</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {flaggedSubscriptions.map((sub) => (
                  <Link key={sub.id} href={`/subscriptions/${sub.id}`}>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-background border hover:border-primary/30 transition-colors">
                      <Avatar className="w-10 h-10 rounded-lg border">
                        <AvatarImage src={sub.logo} alt={sub.name} className="object-contain p-1" />
                        <AvatarFallback className="rounded-lg bg-muted text-xs font-medium">
                          {sub.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{sub.name}</p>
                        <p className="text-xs text-warning">
                          {sub.usagePercentage}% usage
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">${sub.cost.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">/mo</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
