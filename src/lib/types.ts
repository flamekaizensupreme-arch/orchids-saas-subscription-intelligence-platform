export type BillingFrequency = 'monthly' | 'annual' | 'one-time';

export type SubscriptionStatus = 'active' | 'paused' | 'canceled' | 'trial';

export type SubscriptionCategory = 
  | 'productivity'
  | 'development'
  | 'design'
  | 'marketing'
  | 'finance'
  | 'communication'
  | 'storage'
  | 'security'
  | 'analytics'
  | 'other';

export interface Subscription {
  id: string;
  name: string;
  logo?: string;
  cost: number;
  billingFrequency: BillingFrequency;
  nextRenewal: Date;
  status: SubscriptionStatus;
  category: SubscriptionCategory;
  usagePercentage?: number;
  notes?: string;
  createdAt: Date;
  lastUsed?: Date;
  teamMembers?: string[];
  priceHistory?: PriceChange[];
}

export interface PriceChange {
  date: Date;
  oldPrice: number;
  newPrice: number;
}

export interface Alert {
  id: string;
  type: 'renewal' | 'price_increase' | 'unused' | 'duplicate' | 'budget';
  title: string;
  description: string;
  subscriptionId?: string;
  subscriptionName?: string;
  createdAt: Date;
  isRead: boolean;
  actionLabel?: string;
  actionType?: 'dismiss' | 'snooze' | 'view' | 'cancel';
}

export interface Budget {
  id: string;
  name: string;
  limit: number;
  spent: number;
  category?: SubscriptionCategory;
  period: 'monthly' | 'annual';
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'member';
  subscriptions: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  tier: 'free' | 'pro' | 'team';
  createdAt: Date;
}

export interface SavingsInsight {
  id: string;
  type: 'duplicate' | 'unused' | 'alternative' | 'downgrade';
  title: string;
  description: string;
  potentialSavings: number;
  subscriptionIds: string[];
  recommendation: string;
}
