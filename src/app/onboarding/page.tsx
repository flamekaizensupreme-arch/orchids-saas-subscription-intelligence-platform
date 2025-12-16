"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { popularSaasTools } from "@/lib/data";
import { 
  Shield, 
  CreditCard, 
  Bell, 
  Lightbulb, 
  Check, 
  ArrowRight, 
  Search,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, title: 'Welcome', icon: Shield },
  { id: 2, title: 'Add Subscriptions', icon: CreditCard },
  { id: 3, title: 'Set Alerts', icon: Bell },
  { id: 4, title: 'Get Started', icon: Sparkles },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [alertPrefs, setAlertPrefs] = useState({
    renewals: true,
    unused: true,
    budget: true,
  });

  const filteredTools = searchQuery 
    ? popularSaasTools.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : popularSaasTools;

  const toggleTool = (name: string) => {
    setSelectedTools(prev => 
      prev.includes(name) ? prev.filter(t => t !== name) : [...prev, name]
    );
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(s => s + 1);
    } else {
      router.push("/dashboard");
    }
  };

  const progress = (currentStep / 4) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-2xl mx-auto pt-8">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center glow-sm">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl">SubSentry</span>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isComplete = step.id < currentStep;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                    isComplete ? "bg-primary text-primary-foreground" :
                    isActive ? "bg-primary/10 border-2 border-primary text-primary" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {isComplete ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "w-16 md:w-24 h-0.5 mx-2",
                      step.id < currentStep ? "bg-primary" : "bg-muted"
                    )} />
                  )}
                </div>
              );
            })}
          </div>
          <Progress value={progress} className="h-1 mt-4" />
        </div>

        <Card className="relative">
          <CardContent className="p-8">
            {currentStep === 1 && (
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center mx-auto mb-6 glow">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold mb-3">Welcome to SubSentry!</h1>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Let's get you set up in just a few steps. We'll help you track, manage, and optimize your SaaS subscriptions.
                </p>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <CreditCard className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium">Track Spending</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <Bell className="w-6 h-6 mx-auto mb-2 text-chart-2" />
                    <p className="text-sm font-medium">Get Alerts</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <Lightbulb className="w-6 h-6 mx-auto mb-2 text-chart-3" />
                    <p className="text-sm font-medium">Save Money</p>
                  </div>
                </div>
                <Button onClick={nextStep} size="lg" className="gap-2">
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-bold mb-2 text-center">Add Your Subscriptions</h2>
                <p className="text-muted-foreground mb-6 text-center">
                  Select the tools you're currently paying for. You can always add more later.
                </p>
                
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search for a tool..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-6 max-h-[300px] overflow-y-auto p-1">
                  {filteredTools.map((tool) => (
                    <button
                      key={tool.name}
                      onClick={() => toggleTool(tool.name)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-3 rounded-lg border transition-all",
                        selectedTools.includes(tool.name)
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "hover:border-primary/30 hover:bg-muted/50"
                      )}
                    >
                      <Avatar className="w-10 h-10 rounded-lg border">
                        <AvatarImage src={tool.logo} alt={tool.name} className="object-contain p-1" />
                        <AvatarFallback className="rounded-lg text-xs">{tool.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium text-center truncate w-full">{tool.name}</span>
                      {selectedTools.includes(tool.name) && (
                        <Check className="w-4 h-4 text-primary absolute top-1 right-1" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {selectedTools.length} subscription{selectedTools.length !== 1 ? 's' : ''} selected
                  </p>
                  <div className="flex gap-3">
                    <Button variant="ghost" onClick={() => setCurrentStep(1)}>Back</Button>
                    <Button onClick={nextStep} className="gap-2">
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h2 className="text-2xl font-bold mb-2 text-center">Set Up Alerts</h2>
                <p className="text-muted-foreground mb-6 text-center">
                  Choose what notifications you'd like to receive
                </p>

                <div className="space-y-4 mb-8">
                  <button
                    onClick={() => setAlertPrefs(p => ({ ...p, renewals: !p.renewals }))}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-lg border transition-all text-left",
                      alertPrefs.renewals ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      alertPrefs.renewals ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}>
                      <Bell className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Renewal Reminders</p>
                      <p className="text-sm text-muted-foreground">Get notified 7 days before subscriptions renew</p>
                    </div>
                    <div className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center",
                      alertPrefs.renewals ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"
                    )}>
                      {alertPrefs.renewals && <Check className="w-3 h-3" />}
                    </div>
                  </button>

                  <button
                    onClick={() => setAlertPrefs(p => ({ ...p, unused: !p.unused }))}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-lg border transition-all text-left",
                      alertPrefs.unused ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      alertPrefs.unused ? "bg-chart-2 text-white" : "bg-muted"
                    )}>
                      <Lightbulb className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Unused Tool Alerts</p>
                      <p className="text-sm text-muted-foreground">Notify when subscriptions appear unused for 60+ days</p>
                    </div>
                    <div className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center",
                      alertPrefs.unused ? "border-chart-2 bg-chart-2 text-white" : "border-muted-foreground"
                    )}>
                      {alertPrefs.unused && <Check className="w-3 h-3" />}
                    </div>
                  </button>

                  <button
                    onClick={() => setAlertPrefs(p => ({ ...p, budget: !p.budget }))}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-lg border transition-all text-left",
                      alertPrefs.budget ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      alertPrefs.budget ? "bg-chart-3 text-white" : "bg-muted"
                    )}>
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Budget Warnings</p>
                      <p className="text-sm text-muted-foreground">Alert when approaching your spending limits</p>
                    </div>
                    <div className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center",
                      alertPrefs.budget ? "border-chart-3 bg-chart-3 text-white" : "border-muted-foreground"
                    )}>
                      {alertPrefs.budget && <Check className="w-3 h-3" />}
                    </div>
                  </button>
                </div>

                <div className="flex items-center justify-end gap-3">
                  <Button variant="ghost" onClick={() => setCurrentStep(2)}>Back</Button>
                  <Button onClick={nextStep} className="gap-2">
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-chart-3 to-primary flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-3">You're All Set!</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Your SubSentry account is ready. Start tracking your subscriptions and saving money today.
                </p>

                <div className="p-4 rounded-lg bg-muted/50 mb-8">
                  <p className="text-sm font-medium mb-2">Quick Summary</p>
                  <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                    <span>{selectedTools.length} subscriptions added</span>
                    <span>•</span>
                    <span>{Object.values(alertPrefs).filter(Boolean).length} alerts enabled</span>
                  </div>
                </div>

                <Button onClick={nextStep} size="lg" className="gap-2">
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Need help? <a href="#" className="text-primary hover:underline">Contact support</a>
        </p>
      </div>
    </div>
  );
}
