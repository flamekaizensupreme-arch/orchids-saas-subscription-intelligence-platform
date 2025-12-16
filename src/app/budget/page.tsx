"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockBudgets, mockSubscriptions, categoryBreakdownData } from "@/lib/data";
import { Budget, SubscriptionCategory } from "@/lib/types";
import { 
  PiggyBank, 
  Plus, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  Target,
  DollarSign,
  Edit,
  Trash2
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";

const categoryLabels: Record<SubscriptionCategory, string> = {
  productivity: 'Productivity',
  development: 'Development',
  design: 'Design',
  marketing: 'Marketing',
  finance: 'Finance',
  communication: 'Communication',
  storage: 'Storage',
  security: 'Security',
  analytics: 'Analytics',
  other: 'Other',
};

export default function BudgetPage() {
  const [budgets, setBudgets] = useState(mockBudgets);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const totalBudget = budgets[0];
  const categoryBudgets = budgets.slice(1);

  const budgetUtilization = categoryBreakdownData.map(cat => ({
    name: cat.name,
    spent: cat.value,
    color: cat.color,
  }));

  const BudgetCard = ({ budget }: { budget: Budget }) => {
    const percentage = (budget.spent / budget.limit) * 100;
    const isOverBudget = percentage >= 100;
    const isNearLimit = percentage >= 80;
    const remaining = budget.limit - budget.spent;

    return (
      <Card className={isOverBudget ? 'border-destructive/30 bg-destructive/5' : isNearLimit ? 'border-warning/30 bg-warning/5' : ''}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold">{budget.name}</h3>
              {budget.category && (
                <Badge variant="secondary" className="mt-1 text-xs">
                  {categoryLabels[budget.category]}
                </Badge>
              )}
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-3xl font-bold">${budget.spent.toFixed(0)}</span>
                <span className="text-sm text-muted-foreground">of ${budget.limit}</span>
              </div>
              <Progress 
                value={Math.min(percentage, 100)} 
                className={`h-3 ${
                  isOverBudget ? '[&>div]:bg-destructive' : 
                  isNearLimit ? '[&>div]:bg-warning' : ''
                }`}
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-2">
                {isOverBudget ? (
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                ) : isNearLimit ? (
                  <TrendingUp className="w-4 h-4 text-warning" />
                ) : (
                  <Target className="w-4 h-4 text-success" />
                )}
                <span className={`text-sm font-medium ${
                  isOverBudget ? 'text-destructive' : isNearLimit ? 'text-warning' : 'text-success'
                }`}>
                  {isOverBudget 
                    ? `$${Math.abs(remaining).toFixed(0)} over budget` 
                    : `$${remaining.toFixed(0)} remaining`}
                </span>
              </div>
              <span className={`text-sm font-semibold ${
                isOverBudget ? 'text-destructive' : isNearLimit ? 'text-warning' : ''
              }`}>
                {percentage.toFixed(0)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <AppLayout title="Budget" subtitle="Track and manage your SaaS spending limits">
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Spending by Category</CardTitle>
                <CardDescription>Monthly breakdown of your subscription costs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={budgetUtilization} layout="vertical" margin={{ left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis 
                        type="number" 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                        width={100}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                        formatter={(value: number) => [`$${value.toFixed(2)}`, 'Spent']}
                      />
                      <Bar dataKey="spent" radius={[0, 4, 4, 0]}>
                        {budgetUtilization.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-primary/5 via-chart-2/5 to-chart-3/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <PiggyBank className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Budget</p>
                  <p className="text-2xl font-bold">${totalBudget.limit}/mo</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Used this month</span>
                    <span className="font-semibold">${totalBudget.spent.toFixed(0)}</span>
                  </div>
                  <Progress 
                    value={(totalBudget.spent / totalBudget.limit) * 100} 
                    className="h-3"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                  <div className="p-3 rounded-lg bg-background/60">
                    <p className="text-xs text-muted-foreground mb-1">Remaining</p>
                    <p className="font-bold text-success">${(totalBudget.limit - totalBudget.spent).toFixed(0)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-background/60">
                    <p className="text-xs text-muted-foreground mb-1">Daily Average</p>
                    <p className="font-bold">${(totalBudget.spent / 19).toFixed(2)}</p>
                  </div>
                </div>

                <div className="pt-4">
                  <p className="text-xs text-muted-foreground mb-2">Projected by month end</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">$458</span>
                    <Badge variant="secondary" className="text-warning bg-warning/10">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Near limit
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Category Budgets</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Budget
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Budget</DialogTitle>
                <DialogDescription>
                  Set a spending limit for a specific category
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Budget Name</Label>
                  <Input placeholder="e.g., Marketing Tools" />
                </div>
                <div className="space-y-2">
                  <Label>Category (optional)</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Monthly Limit</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="number" placeholder="0.00" className="pl-9" />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={() => setIsDialogOpen(false)}>
                    Create Budget
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryBudgets.map((budget) => (
            <BudgetCard key={budget.id} budget={budget} />
          ))}
          
          <Card className="border-dashed">
            <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[200px] text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Plus className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="font-medium mb-1">Add Category Budget</p>
              <p className="text-sm text-muted-foreground mb-4">Track spending for a specific category</p>
              <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(true)}>
                Create Budget
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-base">Budget Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-background">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">Set Realistic Limits</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Base your budgets on actual historical spending plus a small buffer for growth.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-background">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-4 h-4 text-success" />
                  <span className="font-medium text-sm">Review Monthly</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Check your budgets at month-end to identify areas for optimization.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-background">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  <span className="font-medium text-sm">Act on Alerts</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  When you hit 80% of a budget, review subscriptions in that category.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
