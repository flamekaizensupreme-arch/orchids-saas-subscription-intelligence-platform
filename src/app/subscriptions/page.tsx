"use client";

import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockSubscriptions, calculateMonthlyTotal } from "@/lib/data";
import { Subscription, SubscriptionCategory, SubscriptionStatus, BillingFrequency } from "@/lib/types";
import { 
  Search, 
  Filter, 
  ArrowUpDown,
  MoreHorizontal,
  Edit,
  Pause,
  XCircle,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  LayoutGrid,
  List
} from "lucide-react";
import Link from "next/link";
import { format, differenceInDays } from "date-fns";
import { Progress } from "@/components/ui/progress";

type SortField = 'name' | 'cost' | 'nextRenewal' | 'usage';
type SortDirection = 'asc' | 'desc';

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

const statusLabels: Record<SubscriptionStatus, string> = {
  active: 'Active',
  paused: 'Paused',
  canceled: 'Canceled',
  trial: 'Trial',
};

const frequencyLabels: Record<BillingFrequency, string> = {
  monthly: 'Monthly',
  annual: 'Annual',
  'one-time': 'One-time',
};

export default function SubscriptionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [frequencyFilter, setFrequencyFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const filteredAndSortedSubscriptions = useMemo(() => {
    let result = [...mockSubscriptions];

    if (searchQuery) {
      result = result.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      result = result.filter(s => s.category === categoryFilter);
    }

    if (statusFilter !== 'all') {
      result = result.filter(s => s.status === statusFilter);
    }

    if (frequencyFilter !== 'all') {
      result = result.filter(s => s.billingFrequency === frequencyFilter);
    }

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'cost':
          const aCost = a.billingFrequency === 'annual' ? a.cost / 12 : a.cost;
          const bCost = b.billingFrequency === 'annual' ? b.cost / 12 : b.cost;
          comparison = aCost - bCost;
          break;
        case 'nextRenewal':
          comparison = new Date(a.nextRenewal).getTime() - new Date(b.nextRenewal).getTime();
          break;
        case 'usage':
          comparison = (a.usagePercentage || 0) - (b.usagePercentage || 0);
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [searchQuery, categoryFilter, statusFilter, frequencyFilter, sortField, sortDirection]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-3.5 h-3.5" /> : 
      <ChevronDown className="w-3.5 h-3.5" />;
  };

  const monthlyTotal = calculateMonthlyTotal(filteredAndSortedSubscriptions);

  return (
    <AppLayout title="Subscriptions" subtitle={`${filteredAndSortedSubscriptions.length} subscriptions tracked`}>
      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search subscriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {Object.entries(categoryLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={frequencyFilter} onValueChange={setFrequencyFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Billing</SelectItem>
                    {Object.entries(frequencyLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex border rounded-lg overflow-hidden">
                  <Button 
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                    size="icon"
                    className="rounded-none h-9 w-9"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                    size="icon"
                    className="rounded-none h-9 w-9"
                    onClick={() => setViewMode('grid')}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Showing {filteredAndSortedSubscriptions.length} of {mockSubscriptions.length} subscriptions</span>
          <span>Monthly total: <span className="font-semibold text-foreground">${monthlyTotal.toFixed(2)}</span></span>
        </div>

        {viewMode === 'list' ? (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left p-4 font-medium text-sm">
                      <button 
                        onClick={() => toggleSort('name')}
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                      >
                        Service <SortIcon field="name" />
                      </button>
                    </th>
                    <th className="text-left p-4 font-medium text-sm">
                      <button 
                        onClick={() => toggleSort('cost')}
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                      >
                        Cost <SortIcon field="cost" />
                      </button>
                    </th>
                    <th className="text-left p-4 font-medium text-sm hidden md:table-cell">Billing</th>
                    <th className="text-left p-4 font-medium text-sm">
                      <button 
                        onClick={() => toggleSort('nextRenewal')}
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                      >
                        Next Renewal <SortIcon field="nextRenewal" />
                      </button>
                    </th>
                    <th className="text-left p-4 font-medium text-sm hidden lg:table-cell">Status</th>
                    <th className="text-left p-4 font-medium text-sm hidden xl:table-cell">
                      <button 
                        onClick={() => toggleSort('usage')}
                        className="flex items-center gap-1 hover:text-foreground transition-colors"
                      >
                        Usage <SortIcon field="usage" />
                      </button>
                    </th>
                    <th className="text-right p-4 font-medium text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedSubscriptions.map((sub) => {
                    const daysUntil = differenceInDays(new Date(sub.nextRenewal), new Date());
                    const monthlyCost = sub.billingFrequency === 'annual' ? sub.cost / 12 : sub.cost;
                    const isLowUsage = sub.usagePercentage !== undefined && sub.usagePercentage < 40;
                    
                    return (
                      <tr key={sub.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="p-4">
                          <Link href={`/subscriptions/${sub.id}`} className="flex items-center gap-3">
                            <Avatar className="w-10 h-10 rounded-lg border">
                              <AvatarImage src={sub.logo} alt={sub.name} className="object-contain p-1.5" />
                              <AvatarFallback className="rounded-lg bg-muted text-xs font-medium">
                                {sub.name.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{sub.name}</p>
                              <p className="text-xs text-muted-foreground">{categoryLabels[sub.category]}</p>
                            </div>
                          </Link>
                        </td>
                        <td className="p-4">
                          <p className="font-semibold">${monthlyCost.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">/month</p>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <Badge variant="secondary" className="text-xs">
                            {frequencyLabels[sub.billingFrequency]}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <p className="text-sm">{format(new Date(sub.nextRenewal), 'MMM d, yyyy')}</p>
                          <p className={`text-xs ${daysUntil <= 7 ? 'text-destructive' : 'text-muted-foreground'}`}>
                            {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `in ${daysUntil} days`}
                          </p>
                        </td>
                        <td className="p-4 hidden lg:table-cell">
                          <Badge 
                            variant={sub.status === 'active' ? 'default' : sub.status === 'trial' ? 'secondary' : 'outline'}
                            className={`text-xs ${
                              sub.status === 'active' ? 'bg-success text-white' :
                              sub.status === 'trial' ? 'bg-chart-4 text-white' :
                              sub.status === 'paused' ? 'bg-muted text-muted-foreground' :
                              'bg-destructive/10 text-destructive'
                            }`}
                          >
                            {statusLabels[sub.status]}
                          </Badge>
                        </td>
                        <td className="p-4 hidden xl:table-cell">
                          {sub.usagePercentage !== undefined ? (
                            <div className="w-24">
                              <div className="flex items-center justify-between mb-1">
                                <span className={`text-xs font-medium ${isLowUsage ? 'text-warning' : ''}`}>
                                  {sub.usagePercentage}%
                                </span>
                              </div>
                              <Progress 
                                value={sub.usagePercentage} 
                                className={`h-1.5 ${isLowUsage ? '[&>div]:bg-warning' : ''}`}
                              />
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">N/A</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/subscriptions/${sub.id}`}>
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Pause className="w-4 h-4 mr-2" />
                                {sub.status === 'paused' ? 'Resume' : 'Pause'} Tracking
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <XCircle className="w-4 h-4 mr-2" />
                                Mark as Canceled
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAndSortedSubscriptions.map((sub) => {
              const daysUntil = differenceInDays(new Date(sub.nextRenewal), new Date());
              const monthlyCost = sub.billingFrequency === 'annual' ? sub.cost / 12 : sub.cost;
              const isLowUsage = sub.usagePercentage !== undefined && sub.usagePercentage < 40;

              return (
                <Link key={sub.id} href={`/subscriptions/${sub.id}`}>
                  <Card className="hover:border-primary/30 transition-colors h-full">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12 rounded-xl border">
                            <AvatarImage src={sub.logo} alt={sub.name} className="object-contain p-2" />
                            <AvatarFallback className="rounded-xl bg-muted text-sm font-medium">
                              {sub.name.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{sub.name}</p>
                            <p className="text-xs text-muted-foreground">{categoryLabels[sub.category]}</p>
                          </div>
                        </div>
                        <Badge 
                          variant="secondary"
                          className={`text-xs ${
                            sub.status === 'active' ? 'bg-success/10 text-success' :
                            sub.status === 'trial' ? 'bg-chart-4/10 text-chart-4' :
                            'bg-muted text-muted-foreground'
                          }`}
                        >
                          {statusLabels[sub.status]}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-baseline justify-between">
                          <span className="text-2xl font-bold">${monthlyCost.toFixed(2)}</span>
                          <span className="text-sm text-muted-foreground">/{frequencyLabels[sub.billingFrequency].toLowerCase()}</span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Next renewal</span>
                          <span className={daysUntil <= 7 ? 'text-destructive font-medium' : ''}>
                            {format(new Date(sub.nextRenewal), 'MMM d')}
                          </span>
                        </div>

                        {sub.usagePercentage !== undefined && (
                          <div>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-muted-foreground">Usage</span>
                              <span className={isLowUsage ? 'text-warning font-medium' : ''}>
                                {sub.usagePercentage}%
                              </span>
                            </div>
                            <Progress 
                              value={sub.usagePercentage} 
                              className={`h-1.5 ${isLowUsage ? '[&>div]:bg-warning' : ''}`}
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        {filteredAndSortedSubscriptions.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No subscriptions found matching your filters.</p>
              <Button variant="link" onClick={() => {
                setSearchQuery("");
                setCategoryFilter("all");
                setStatusFilter("all");
                setFrequencyFilter("all");
              }}>
                Clear all filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
