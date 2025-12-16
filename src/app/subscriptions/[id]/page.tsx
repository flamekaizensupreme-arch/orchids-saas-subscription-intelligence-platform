"use client";

import { use } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockSubscriptions, mockTeamMembers, popularSaasTools } from "@/lib/data";
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Users,
  Clock,
  Edit,
  Pause,
  XCircle,
  Bell,
  ExternalLink,
  Sparkles,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { format, differenceInDays } from "date-fns";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

const paymentHistory = [
  { date: 'Jan 2025', amount: 12.50 },
  { date: 'Dec 2024', amount: 12.50 },
  { date: 'Nov 2024', amount: 12.50 },
  { date: 'Oct 2024', amount: 12.50 },
  { date: 'Sep 2024', amount: 10.00 },
  { date: 'Aug 2024', amount: 10.00 },
];

const alternatives = [
  { name: 'Microsoft Teams', logo: 'https://logo.clearbit.com/microsoft.com', price: 4.00, savings: 8.50 },
  { name: 'Discord', logo: 'https://logo.clearbit.com/discord.com', price: 0, savings: 12.50 },
  { name: 'Google Chat', logo: 'https://logo.clearbit.com/google.com', price: 0, savings: 12.50 },
];

export default function SubscriptionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const subscription = mockSubscriptions.find(s => s.id === id);

  if (!subscription) {
    return (
      <AppLayout title="Subscription Not Found">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">This subscription could not be found.</p>
          <Link href="/subscriptions">
            <Button>Back to Subscriptions</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const daysUntilRenewal = differenceInDays(new Date(subscription.nextRenewal), new Date());
  const monthlyCost = subscription.billingFrequency === 'annual' ? subscription.cost / 12 : subscription.cost;
  const annualCost = subscription.billingFrequency === 'annual' ? subscription.cost : subscription.cost * 12;
  const isLowUsage = subscription.usagePercentage !== undefined && subscription.usagePercentage < 40;

  const teamMembersUsingThis = mockTeamMembers.filter(
    m => subscription.teamMembers?.includes(m.id)
  );

  return (
    <AppLayout title={subscription.name} subtitle="Subscription details">
      <div className="space-y-6">
        <Link href="/subscriptions" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" />
          Back to subscriptions
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16 rounded-xl border">
                      <AvatarImage src={subscription.logo} alt={subscription.name} className="object-contain p-2" />
                      <AvatarFallback className="rounded-xl bg-muted text-lg font-semibold">
                        {subscription.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-bold">{subscription.name}</h2>
                      <p className="text-muted-foreground capitalize">{subscription.category}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Bell className="w-4 h-4 mr-2" />
                      Set Reminder
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-xs">Monthly Cost</span>
                    </div>
                    <p className="text-xl font-bold">${monthlyCost.toFixed(2)}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs">Next Renewal</span>
                    </div>
                    <p className="text-xl font-bold">{daysUntilRenewal}d</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(subscription.nextRenewal), 'MMM d, yyyy')}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs">Billing</span>
                    </div>
                    <p className="text-xl font-bold capitalize">{subscription.billingFrequency}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-xs">Annual Cost</span>
                    </div>
                    <p className="text-xl font-bold">${annualCost.toFixed(0)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-6">
                  <Badge 
                    className={`${
                      subscription.status === 'active' ? 'bg-success text-white' :
                      subscription.status === 'trial' ? 'bg-chart-4 text-white' :
                      subscription.status === 'paused' ? 'bg-muted text-muted-foreground' :
                      'bg-destructive/10 text-destructive'
                    }`}
                  >
                    {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                  </Badge>
                  {subscription.notes && (
                    <span className="text-sm text-muted-foreground">{subscription.notes}</span>
                  )}
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="history" className="space-y-4">
              <TabsList>
                <TabsTrigger value="history">Payment History</TabsTrigger>
                <TabsTrigger value="usage">Usage</TabsTrigger>
                <TabsTrigger value="team">Team ({teamMembersUsingThis.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Payment History</CardTitle>
                    <CardDescription>Your payment timeline for this subscription</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] mb-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={paymentHistory.reverse()}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis 
                            dataKey="date" 
                            axisLine={false} 
                            tickLine={false}
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false}
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => `$${value}`}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              borderRadius: '8px',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="amount" 
                            stroke="oklch(0.55 0.24 270)" 
                            strokeWidth={2}
                            dot={{ fill: 'oklch(0.55 0.24 270)', strokeWidth: 0 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {subscription.priceHistory && subscription.priceHistory.length > 0 && (
                      <div className="p-4 rounded-lg bg-warning/10 border border-warning/20 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-warning" />
                          <span className="font-medium text-sm">Price Change Detected</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Price increased from ${subscription.priceHistory[0].oldPrice.toFixed(2)} to ${subscription.priceHistory[0].newPrice.toFixed(2)} on {format(new Date(subscription.priceHistory[0].date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    )}

                    <div className="space-y-2">
                      {paymentHistory.map((payment, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30">
                          <span className="text-sm">{payment.date}</span>
                          <span className="font-medium">${payment.amount.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="usage">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Usage Analytics</CardTitle>
                    <CardDescription>Track how much you're using this service</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {subscription.usagePercentage !== undefined ? (
                      <div className="space-y-6">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Overall Usage</span>
                            <span className={`text-sm font-bold ${isLowUsage ? 'text-warning' : 'text-success'}`}>
                              {subscription.usagePercentage}%
                            </span>
                          </div>
                          <Progress 
                            value={subscription.usagePercentage} 
                            className={`h-3 ${isLowUsage ? '[&>div]:bg-warning' : '[&>div]:bg-success'}`}
                          />
                        </div>

                        {isLowUsage && (
                          <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="w-4 h-4 text-warning" />
                              <span className="font-medium text-sm">Low Usage Detected</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              You're only using {subscription.usagePercentage}% of this subscription. Consider downgrading or canceling to save ${monthlyCost.toFixed(2)}/month.
                            </p>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 rounded-lg bg-muted/30">
                            <p className="text-xs text-muted-foreground mb-1">Last Used</p>
                            <p className="font-medium">
                              {subscription.lastUsed ? format(new Date(subscription.lastUsed), 'MMM d, yyyy') : 'N/A'}
                            </p>
                          </div>
                          <div className="p-4 rounded-lg bg-muted/30">
                            <p className="text-xs text-muted-foreground mb-1">Tracking Since</p>
                            <p className="font-medium">{format(new Date(subscription.createdAt), 'MMM d, yyyy')}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>Usage tracking not available for this subscription.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="team">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Team Members</CardTitle>
                    <CardDescription>People in your team using this subscription</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {teamMembersUsingThis.length > 0 ? (
                      <div className="space-y-3">
                        {teamMembersUsingThis.map((member) => (
                          <div key={member.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30">
                            <Avatar>
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{member.name}</p>
                              <p className="text-xs text-muted-foreground">{member.email}</p>
                            </div>
                            <Badge variant="secondary" className="text-xs capitalize">{member.role}</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>No team members assigned to this subscription.</p>
                        <Button variant="link" className="mt-2">Add Team Members</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Pause className="w-4 h-4 mr-2" />
                  Pause Tracking
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="w-4 h-4 mr-2" />
                  Set Renewal Reminder
                </Button>
                <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                  <XCircle className="w-4 h-4 mr-2" />
                  Mark as Canceled
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/5 via-chart-2/5 to-chart-3/5 border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <CardTitle className="text-base">Alternatives</CardTitle>
                </div>
                <CardDescription>Consider these alternatives to save money</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {alternatives.map((alt) => (
                  <div key={alt.name} className="flex items-center gap-3 p-3 rounded-lg bg-background/60 border">
                    <Avatar className="w-8 h-8 rounded-lg border">
                      <AvatarImage src={alt.logo} alt={alt.name} className="object-contain p-1" />
                      <AvatarFallback className="rounded-lg text-xs">{alt.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{alt.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {alt.price === 0 ? 'Free' : `$${alt.price.toFixed(2)}/mo`}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-chart-3 bg-chart-3/10 text-xs">
                      Save ${alt.savings.toFixed(2)}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Cost Projection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">This month</span>
                  <span className="font-semibold">${monthlyCost.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">This quarter</span>
                  <span className="font-semibold">${(monthlyCost * 3).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">This year</span>
                  <span className="font-semibold">${annualCost.toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Lifetime (since tracking)</span>
                    <span className="font-semibold">${(monthlyCost * 10).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
