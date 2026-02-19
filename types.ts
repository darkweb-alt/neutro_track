
export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  timestamp: number;
  imageUrl?: string;
}

export type HealthGoal = 'Weight Loss' | 'Maintain' | 'Muscle Gain';
export type ActivityLevel = 'Sedentary' | 'Lightly Active' | 'Moderately Active' | 'Very Active';
export type Gender = 'Male' | 'Female' | 'Other';
export type AppTheme = 'light' | 'dark';

export interface UserProfile {
  name: string;
  gender: Gender;
  dailyGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
  weight: number;
  height: number;
  age: number;
  activityLevel: ActivityLevel;
  goal: HealthGoal;
  allergies: string[];
  preferences: string[];
  waterReminderEnabled: boolean;
  waterReminderInterval: number; // in minutes
  theme: AppTheme;
}

export interface AuthUser {
  email: string;
  name: string;
}

export interface MealSuggestion {
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  name: string;
  calories: number;
  ingredients: string[];
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface DailyMealPlan {
  dayName: string;
  date: string;
  meals: MealSuggestion[];
  totalCalories: number;
}

export interface WeeklyMealPlan {
  days: DailyMealPlan[];
}

export interface DailyStats {
  date: string;
  calories: number;
  water: number;
  items: FoodItem[];
}

export enum AppTab {
  DASHBOARD = 'dashboard',
  PLANNER = 'planner',
  SCAN = 'scan',
  CHAT = 'chat',
  PROFILE = 'profile',
  LOG = 'log'
}
