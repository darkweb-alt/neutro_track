
import { FoodItem, UserProfile, DailyMealPlan, WeeklyMealPlan } from "../types";

const callApi = async (action: string, payload: any) => {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, payload })
  });
  
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to connect to AI server');
  }
  
  return response.json();
};

export const recognizeFood = async (base64Image: string): Promise<Partial<FoodItem>> => {
  return callApi('recognize', { image: base64Image });
};

export const getNutritionAdvice = async (message: string, profile: UserProfile, chatHistory: any[]) => {
  try {
    const result = await callApi('chat', { message, profile, history: chatHistory });
    return result.text;
  } catch (error) {
    console.error("Chat error:", error);
    return "I'm having trouble connecting to the kitchen right now. Please try again later!";
  }
};

export const generateMealPlan = async (profile: UserProfile): Promise<DailyMealPlan> => {
  return callApi('plan', { profile });
};

export const generateWeeklyMealPlan = async (profile: UserProfile): Promise<WeeklyMealPlan> => {
  return callApi('weekly-plan', { profile });
};
