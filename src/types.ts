export type UserRole = 'user' | 'admin';
export type PlanType = 'free' | 'pro' | 'business';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  plan: PlanType;
  credits: number;
  creditsUsed: number;
  avatar: string;
  createdAt?: string;
  lastLogin?: string;
  loginCount?: number;
  lastAction?: string;
  projectCount?: number;
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  type: 'audio' | 'transcribe' | 'writing';
  content: string;
  audioUrl?: string;
  duration?: string;
  createdAt: string;
}

export interface VoiceOption {
  id: string;
  name: string;
  gender: 'female' | 'male';
  accent: string;
  description: string;
  style: string;
  previewUrl?: string;
}

export type ActiveTab = 
  | 'home'
  | 'dashboard'
  | 'voice'
  | 'transcribe'
  | 'writing'
  | 'editor'
  | 'library'
  | 'projects'
  | 'pricing'
  | 'admin';
