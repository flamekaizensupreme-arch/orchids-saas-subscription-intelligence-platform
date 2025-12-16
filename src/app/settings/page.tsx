"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockUser } from "@/lib/data";
import { 
  User,
  Bell,
  Mail,
  Download,
  Upload,
  Shield,
  CreditCard,
  Sparkles,
  Check,
  LogOut,
  Trash2,
  Key,
  Globe,
  Moon,
  Sun
} from "lucide-react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    renewalReminders: true,
    priceChanges: true,
    unusedAlerts: true,
    budgetWarnings: true,
    weeklyDigest: false,
    marketingEmails: false,
  });

  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');

  const plans = [
    {
      name: 'Free',
      price: 0,
      features: ['Up to 10 subscriptions', 'Basic alerts', 'Manual tracking'],
      current: mockUser.tier === 'free',
    },
    {
      name: 'Pro',
      price: 9,
      features: ['Unlimited subscriptions', 'Advanced analytics', 'Price history', 'Export reports'],
      current: mockUser.tier === 'pro',
      popular: true,
    },
    {
      name: 'Team',
      price: 19,
      features: ['Everything in Pro', 'Team management', 'Department budgets', 'Priority support'],
      current: mockUser.tier === 'team',
    },
  ];

  return (
    <AppLayout title="Settings" subtitle="Manage your account and preferences">
      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="data">Data & Export</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Profile Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <Avatar className="w-20 h-20 border-4 border-primary/20">
                      <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                      <AvatarFallback className="text-xl bg-primary/10 text-primary">
                        {mockUser.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" size="sm">Change Photo</Button>
                      <p className="text-xs text-muted-foreground mt-2">JPG, PNG or GIF. Max 2MB.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input defaultValue={mockUser.name} />
                    </div>
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input defaultValue={mockUser.email} type="email" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input defaultValue="(UTC-08:00) Pacific Time" className="pl-9" />
                    </div>
                  </div>

                  <Button>Save Changes</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Appearance</CardTitle>
                  <CardDescription>Customize how SubSentry looks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setTheme('light')}
                      className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                        theme === 'light' ? 'border-primary bg-primary/5' : 'border-transparent bg-muted/50 hover:bg-muted'
                      }`}
                    >
                      <Sun className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-sm font-medium">Light</p>
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                        theme === 'dark' ? 'border-primary bg-primary/5' : 'border-transparent bg-muted/50 hover:bg-muted'
                      }`}
                    >
                      <Moon className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-sm font-medium">Dark</p>
                    </button>
                    <button
                      onClick={() => setTheme('system')}
                      className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                        theme === 'system' ? 'border-primary bg-primary/5' : 'border-transparent bg-muted/50 hover:bg-muted'
                      }`}
                    >
                      <div className="w-6 h-6 mx-auto mb-2 flex">
                        <Sun className="w-3 h-6" />
                        <Moon className="w-3 h-6" />
                      </div>
                      <p className="text-sm font-medium">System</p>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notification Preferences</CardTitle>
                <CardDescription>Choose what alerts you receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Subscription Alerts</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Renewal Reminders</p>
                      <p className="text-xs text-muted-foreground">Get notified 7 days before renewals</p>
                    </div>
                    <Switch 
                      checked={notifications.renewalReminders}
                      onCheckedChange={(checked) => setNotifications(n => ({ ...n, renewalReminders: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Price Changes</p>
                      <p className="text-xs text-muted-foreground">Alert when subscription prices change</p>
                    </div>
                    <Switch 
                      checked={notifications.priceChanges}
                      onCheckedChange={(checked) => setNotifications(n => ({ ...n, priceChanges: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Unused Subscription Alerts</p>
                      <p className="text-xs text-muted-foreground">Notify when tools appear unused</p>
                    </div>
                    <Switch 
                      checked={notifications.unusedAlerts}
                      onCheckedChange={(checked) => setNotifications(n => ({ ...n, unusedAlerts: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Budget Warnings</p>
                      <p className="text-xs text-muted-foreground">Alert when approaching budget limits</p>
                    </div>
                    <Switch 
                      checked={notifications.budgetWarnings}
                      onCheckedChange={(checked) => setNotifications(n => ({ ...n, budgetWarnings: checked }))}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Email Preferences</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Weekly Digest</p>
                      <p className="text-xs text-muted-foreground">Summary of your subscription activity</p>
                    </div>
                    <Switch 
                      checked={notifications.weeklyDigest}
                      onCheckedChange={(checked) => setNotifications(n => ({ ...n, weeklyDigest: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Marketing Emails</p>
                      <p className="text-xs text-muted-foreground">Tips, updates, and new features</p>
                    </div>
                    <Switch 
                      checked={notifications.marketingEmails}
                      onCheckedChange={(checked) => setNotifications(n => ({ ...n, marketingEmails: checked }))}
                    />
                  </div>
                </div>

                <Button>Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Current Plan</CardTitle>
                  <CardDescription>You're currently on the {mockUser.tier.charAt(0).toUpperCase() + mockUser.tier.slice(1)} plan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {plans.map((plan) => (
                      <div 
                        key={plan.name}
                        className={`p-4 rounded-lg border-2 relative ${
                          plan.current ? 'border-primary bg-primary/5' : 'border-border'
                        }`}
                      >
                        {plan.popular && !plan.current && (
                          <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary">
                            Popular
                          </Badge>
                        )}
                        <h3 className="font-semibold mb-1">{plan.name}</h3>
                        <div className="flex items-baseline gap-1 mb-4">
                          <span className="text-2xl font-bold">${plan.price}</span>
                          <span className="text-sm text-muted-foreground">/month</span>
                        </div>
                        <ul className="space-y-2 mb-4">
                          {plan.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-2 text-sm">
                              <Check className="w-4 h-4 text-success" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        {plan.current ? (
                          <Button variant="outline" className="w-full" disabled>
                            Current Plan
                          </Button>
                        ) : (
                          <Button variant={plan.popular ? 'default' : 'outline'} className="w-full">
                            {plan.price > (mockUser.tier === 'free' ? 0 : mockUser.tier === 'pro' ? 9 : 19) ? 'Upgrade' : 'Downgrade'}
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Payment Method</CardTitle>
                  <CardDescription>Manage your payment details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">•••• •••• •••• 4242</p>
                        <p className="text-xs text-muted-foreground">Expires 12/25</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Update</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="data">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Import Data</CardTitle>
                  <CardDescription>Import subscriptions from a CSV file</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
                    <p className="font-medium mb-1">Drop your CSV file here</p>
                    <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                    <Button variant="outline">Choose File</Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Supported format: CSV with columns for name, cost, billing frequency, and renewal date
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Export Data</CardTitle>
                  <CardDescription>Download your subscription data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium text-sm">All Subscriptions</p>
                      <p className="text-xs text-muted-foreground">Export complete subscription list</p>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      CSV
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium text-sm">Spending Report</p>
                      <p className="text-xs text-muted-foreground">Monthly spending breakdown</p>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      PDF
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium text-sm">Savings Report</p>
                      <p className="text-xs text-muted-foreground">Optimization recommendations</p>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Password</CardTitle>
                  <CardDescription>Change your account password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Current Password</Label>
                    <Input type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm New Password</Label>
                    <Input type="password" />
                  </div>
                  <Button>Update Password</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Two-Factor Authentication</CardTitle>
                  <CardDescription>Add an extra layer of security</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <Key className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Authenticator App</p>
                        <p className="text-xs text-muted-foreground">Not configured</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-destructive/30">
                <CardHeader>
                  <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
                  <CardDescription>Irreversible account actions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/20">
                    <div>
                      <p className="font-medium text-sm">Sign Out Everywhere</p>
                      <p className="text-xs text-muted-foreground">Sign out from all devices</p>
                    </div>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out All
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/20">
                    <div>
                      <p className="font-medium text-sm">Delete Account</p>
                      <p className="text-xs text-muted-foreground">Permanently delete your account and data</p>
                    </div>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
