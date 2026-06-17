export interface User {
  id: number;
  email: string;
  name?: string;
  bio?: string;
  picture?: string;
  timezone?: string;
  role: string;
  onboardingCompleted?: boolean;
  createdAt: string;
  subscriptionPlan?: string;
  subscriptionStatus?: string;
  subscriptionEndDate?: string | null;
}
