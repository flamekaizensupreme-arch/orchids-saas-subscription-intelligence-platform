"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { popularSaasTools } from "@/lib/data";
import { SubscriptionCategory, BillingFrequency } from "@/lib/types";
import { CalendarIcon, Check, Search, ArrowLeft, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";

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

export default function AddSubscriptionPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTool, setSelectedTool] = useState<typeof popularSaasTools[0] | null>(null);
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [billingFrequency, setBillingFrequency] = useState<BillingFrequency>("monthly");
  const [category, setCategory] = useState<SubscriptionCategory>("other");
  const [renewalDate, setRenewalDate] = useState<Date>();
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredTools = useMemo(() => {
    if (!searchQuery) return popularSaasTools.slice(0, 8);
    return popularSaasTools.filter(tool =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSelectTool = (tool: typeof popularSaasTools[0]) => {
    setSelectedTool(tool);
    setName(tool.name);
    setCategory(tool.category as SubscriptionCategory);
    setSearchQuery("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    router.push("/subscriptions");
  };

  const isFormValid = name && cost && renewalDate && category;

  return (
    <AppLayout title="Add Subscription" subtitle="Track a new SaaS subscription">
      <div className="max-w-2xl mx-auto">
        <Link href="/subscriptions" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to subscriptions
        </Link>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Quick Add</CardTitle>
            <CardDescription>Select from popular tools or search for a service</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search for a service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {filteredTools.map((tool) => (
                <button
                  key={tool.name}
                  type="button"
                  onClick={() => handleSelectTool(tool)}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-lg border transition-all text-left",
                    selectedTool?.name === tool.name
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "hover:border-primary/30 hover:bg-muted/50"
                  )}
                >
                  <Avatar className="w-8 h-8 rounded-lg border">
                    <AvatarImage src={tool.logo} alt={tool.name} className="object-contain p-1" />
                    <AvatarFallback className="rounded-lg bg-muted text-xs">
                      {tool.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium truncate flex-1">{tool.name}</span>
                  {selectedTool?.name === tool.name && (
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Subscription Details</CardTitle>
            <CardDescription>Enter the details of your subscription</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Service Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Slack, Notion"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={(v) => setCategory(v as SubscriptionCategory)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="cost"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                      className="pl-7"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequency">Billing Frequency *</Label>
                  <Select value={billingFrequency} onValueChange={(v) => setBillingFrequency(v as BillingFrequency)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="annual">Annual</SelectItem>
                      <SelectItem value="one-time">One-time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Next Renewal Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !renewalDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {renewalDate ? format(renewalDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={renewalDate}
                      onSelect={setRenewalDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes about this subscription..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              {isFormValid && (
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Summary</span>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>
                      <span className="font-medium text-foreground">{name}</span> - ${parseFloat(cost || "0").toFixed(2)}/{billingFrequency}
                    </p>
                    <p>Category: {categoryLabels[category]}</p>
                    {renewalDate && <p>Next renewal: {format(renewalDate, "MMMM d, yyyy")}</p>}
                    {billingFrequency === 'monthly' && (
                      <p className="text-primary">Annual cost: ${(parseFloat(cost || "0") * 12).toFixed(2)}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={!isFormValid || isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add Subscription"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
