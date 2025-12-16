"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { mockSavingsInsights, mockSubscriptions } from "@/lib/data";
import { 
  Sparkles, 
  TrendingDown, 
  Copy, 
  AlertTriangle,
  ArrowDownRight,
  CheckCircle,
  DollarSign,
  Share2,
  Download,
  ChevronRight,
  Zap
} from "lucide-react";
import Link from "next/link";

const insightTypeConfig = {
  unused: { icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Unused' },
  duplicate: { icon: Copy, color: 'text-chart-2', bg: 'bg-chart-2/10', label: 'Duplicate' },
  alternative: { icon: Zap, color: 'text-chart-4', bg: 'bg-chart-4/10', label: 'Alternative' },
  downgrade: { icon: ArrowDownRight, color: 'text-info', bg: 'bg-info/10', label: 'Downgrade' },
};

export default function SavingsPage() {
  const totalPotentialSavings = mockSavingsInsights.reduce((sum, i) => sum + i.potentialSavings, 0);
  const savingsRealized = 245.88;
  const savingsGoal = 500;
  const savingsProgress = (savingsRealized / savingsGoal) * 100;

  return (
    <AppLayout title="Savings" subtitle="Optimize your subscription spending">
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-gradient-to-br from-chart-3/10 via-primary/5 to-chart-2/10 border-chart-3/30">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Potential Annual Savings</p>
                  <p className="text-4xl font-bold text-chart-3">${totalPotentialSavings.toFixed(0)}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Based on {mockSavingsInsights.length} optimization opportunities
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Share2 className="w-4 h-4" />
                    Share Report
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-background/60 border">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    <span className="text-sm font-medium">Unused Tools</span>
                  </div>
                  <p className="text-2xl font-bold">$179.88</p>
                  <p className="text-xs text-muted-foreground">1 subscription</p>
                </div>
                <div className="p-4 rounded-lg bg-background/60 border">
                  <div className="flex items-center gap-2 mb-2">
                    <Copy className="w-4 h-4 text-chart-2" />
                    <span className="text-sm font-medium">Duplicates</span>
                  </div>
                  <p className="text-2xl font-bold">$155.88</p>
                  <p className="text-xs text-muted-foreground">2 subscriptions</p>
                </div>
                <div className="p-4 rounded-lg bg-background/60 border">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowDownRight className="w-4 h-4 text-info" />
                    <span className="text-sm font-medium">Optimization</span>
                  </div>
                  <p className="text-2xl font-bold">$90.00</p>
                  <p className="text-xs text-muted-foreground">2 subscriptions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Savings Realized</p>
                  <p className="text-xl font-bold text-success">${savingsRealized.toFixed(0)}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Annual goal</span>
                  <span className="font-medium">${savingsGoal}</span>
                </div>
                <Progress value={savingsProgress} className="h-3 [&>div]:bg-success" />
                <p className="text-xs text-muted-foreground text-center">
                  {savingsProgress.toFixed(0)}% of your savings goal achieved
                </p>
              </div>

              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-muted-foreground mb-2">Recent savings</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Canceled HotJar</span>
                    <Badge variant="secondary" className="text-success bg-success/10">+$99/yr</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Downgraded Dropbox</span>
                    <Badge variant="secondary" className="text-success bg-success/10">+$60/yr</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Annual Billing Switch</span>
                    <Badge variant="secondary" className="text-success bg-success/10">+$86/yr</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Savings Opportunities</h2>
          <Badge variant="secondary" className="gap-1">
            <Sparkles className="w-3 h-3" />
            {mockSavingsInsights.length} recommendations
          </Badge>
        </div>

        <div className="space-y-4">
          {mockSavingsInsights.map((insight) => {
            const config = insightTypeConfig[insight.type];
            const Icon = config.icon;
            const relatedSubs = mockSubscriptions.filter(s => insight.subscriptionIds.includes(s.id));

            return (
              <Card key={insight.id} className="hover:border-primary/30 transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                      <Icon className={`w-6 h-6 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{insight.title}</h3>
                            <Badge variant="secondary" className={`text-xs ${config.color} ${config.bg}`}>
                              {config.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{insight.description}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-2xl font-bold text-chart-3">+${insight.potentialSavings.toFixed(0)}</p>
                          <p className="text-xs text-muted-foreground">/year</p>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-muted/30 mt-3">
                        <p className="text-sm font-medium mb-2">Recommendation</p>
                        <p className="text-sm text-muted-foreground">{insight.recommendation}</p>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Affected:</span>
                          <div className="flex -space-x-2">
                            {relatedSubs.map((sub) => (
                              <Avatar key={sub.id} className="w-6 h-6 border-2 border-background">
                                <AvatarImage src={sub.logo} alt={sub.name} className="object-contain" />
                                <AvatarFallback className="text-[10px]">{sub.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                          <span className="text-xs font-medium">
                            {relatedSubs.map(s => s.name).join(', ')}
                          </span>
                        </div>
                        <Button size="sm" className="gap-1">
                          Take Action
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-gradient-to-br from-primary/5 to-chart-2/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Get More Savings Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Upgrade to Team plan for advanced analytics, automated optimization suggestions, and team-wide spending reports.
                </p>
              </div>
              <Button>Upgrade Plan</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
