"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockTeamMembers, mockSubscriptions, mockUser } from "@/lib/data";
import { 
  Users, 
  Plus, 
  Mail,
  MoreHorizontal,
  Shield,
  Edit,
  Trash2,
  UserPlus,
  Crown,
  DollarSign,
  CreditCard
} from "lucide-react";

const roleConfig = {
  owner: { label: 'Owner', color: 'bg-primary text-primary-foreground', icon: Crown },
  admin: { label: 'Admin', color: 'bg-chart-2/10 text-chart-2', icon: Shield },
  member: { label: 'Member', color: 'bg-muted text-muted-foreground', icon: Users },
};

export default function TeamPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");

  const totalTeamSpending = mockSubscriptions
    .filter(s => s.status === 'active')
    .reduce((sum, s) => sum + (s.billingFrequency === 'annual' ? s.cost / 12 : s.cost), 0);

  const avgPerMember = totalTeamSpending / mockTeamMembers.length;

  return (
    <AppLayout title="Team" subtitle="Manage your team and permissions">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{mockTeamMembers.length}</p>
                  <p className="text-xs text-muted-foreground">Team Members</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-chart-2/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-chart-2" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{mockSubscriptions.filter(s => s.status === 'active').length}</p>
                  <p className="text-xs text-muted-foreground">Shared Subscriptions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-chart-4/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-chart-4" />
                </div>
                <div>
                  <p className="text-2xl font-bold">${totalTeamSpending.toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground">Monthly Team Cost</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-chart-3" />
                </div>
                <div>
                  <p className="text-2xl font-bold">${avgPerMember.toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground">Avg per Member</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Team Members</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <UserPlus className="w-4 h-4" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>
                  Send an invitation to join your SubSentry team
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      type="email" 
                      placeholder="colleague@company.com" 
                      className="pl-9"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={inviteRole} onValueChange={setInviteRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Admin - Can manage subscriptions and team
                        </div>
                      </SelectItem>
                      <SelectItem value="member">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Member - Can view and use subscriptions
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={() => setIsDialogOpen(false)}>
                    Send Invitation
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockTeamMembers.map((member) => {
            const config = roleConfig[member.role];
            const RoleIcon = config.icon;
            const memberSubscriptions = mockSubscriptions.filter(s => member.subscriptions.includes(s.id));
            const memberSpending = memberSubscriptions.reduce((sum, s) => 
              sum + (s.billingFrequency === 'annual' ? s.cost / 12 : s.cost), 0
            );

            return (
              <Card key={member.id} className="hover:border-primary/30 transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12 border-2 border-primary/20">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Member
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Shield className="w-4 h-4 mr-2" />
                          Change Role
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove from Team
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <Badge className={`${config.color} text-xs mb-4`}>
                    <RoleIcon className="w-3 h-3 mr-1" />
                    {config.label}
                  </Badge>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Subscriptions</span>
                      <span className="font-medium">{memberSubscriptions.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Monthly cost</span>
                      <span className="font-medium">${memberSpending.toFixed(2)}</span>
                    </div>
                    <div className="flex -space-x-2 pt-2">
                      {memberSubscriptions.slice(0, 5).map((sub) => (
                        <Avatar key={sub.id} className="w-7 h-7 border-2 border-background">
                          <AvatarImage src={sub.logo} alt={sub.name} className="object-contain" />
                          <AvatarFallback className="text-[10px]">{sub.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                      ))}
                      {memberSubscriptions.length > 5 && (
                        <div className="w-7 h-7 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] font-medium">
                          +{memberSubscriptions.length - 5}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <Card className="border-dashed">
            <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[250px] text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <UserPlus className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="font-medium mb-1">Invite Team Member</p>
              <p className="text-sm text-muted-foreground mb-4">Add colleagues to share subscription access</p>
              <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(true)}>
                Send Invite
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Subscription Usage by Team</CardTitle>
            <CardDescription>See which subscriptions are most used across your team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockSubscriptions
                .filter(s => s.teamMembers && s.teamMembers.length > 0)
                .sort((a, b) => (b.teamMembers?.length || 0) - (a.teamMembers?.length || 0))
                .slice(0, 5)
                .map((sub) => {
                  const usersCount = sub.teamMembers?.length || 0;
                  const usagePercent = (usersCount / mockTeamMembers.length) * 100;
                  const teamMembersUsing = mockTeamMembers.filter(m => sub.teamMembers?.includes(m.id));

                  return (
                    <div key={sub.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/30">
                      <Avatar className="w-10 h-10 rounded-lg border">
                        <AvatarImage src={sub.logo} alt={sub.name} className="object-contain p-1" />
                        <AvatarFallback className="rounded-lg">{sub.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-sm">{sub.name}</p>
                          <span className="text-sm text-muted-foreground">{usersCount}/{mockTeamMembers.length} members</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${usagePercent}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex -space-x-1">
                        {teamMembersUsing.slice(0, 3).map((member) => (
                          <Avatar key={member.id} className="w-6 h-6 border-2 border-background">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback className="text-[10px]">{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        {mockUser.tier !== 'team' && (
          <Card className="bg-gradient-to-br from-primary/5 via-chart-2/5 to-chart-3/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Unlock Full Team Features</h3>
                  <p className="text-sm text-muted-foreground">
                    Upgrade to Team plan for unlimited members, department-level budgets, and advanced permission controls.
                  </p>
                </div>
                <Button>Upgrade to Team</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
