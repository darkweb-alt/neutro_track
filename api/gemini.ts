
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const mealPlanSchema = {
  type: Type.OBJECT,
  properties: {
    dayName: { type: Type.STRING },
    date: { type: Type.STRING },
    totalCalories: { type: Type.NUMBER },
    meals: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, enum: ["Breakfast", "Lunch", "Dinner", "Snack"] },
          name: { type: Type.STRING },
          calories: { type: Type.NUMBER },
          ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
          macros: {
            type: Type.OBJECT,
            properties: {
              protein: { type: Type.NUMBER },
              carbs: { type: Type.NUMBER },
              fat: { type: Type.NUMBER }
            },
            required: ["protein", "carbs", "fat"]
          }
        },
        required: ["type", "name", "calories", "ingredients", "macros"]
      }
    }
  },
  required: ["dayName", "date", "totalCalories", "meals"]
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, payload } = req.body;

  try {
    switch (action) {
      case 'recognize':
        const visionResponse = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: {
            parts: [
              { inlineData: { mimeType: "image/jpeg", data: payload.image } },
              { text: "Analyze this food image with high cultural awareness. Identify global and regional specialties precisely (e.g., South Indian/Tamil Nadu dishes like Dosa, Idli, Sambar, or international foods like Sushi, Tacos, etc.). Estimate total calories and list the specific main ingredients. Provide nutritional estimates for Protein, Carbs, and Fat in grams based on standard preparations of these regional dishes." }
            ]
          },
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                calories: { type: Type.NUMBER },
                protein: { type: Type.NUMBER },
                carbs: { type: Type.NUMBER },
                fat: { type: Type.NUMBER },
                ingredients: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["name", "calories", "ingredients", "protein", "carbs", "fat"]
            }
          }
        });
        return res.status(200).json(JSON.parse(visionResponse.text));

      case 'chat':
        const chatResponse = await ai.models.generateContent({
          model: 'gemini-3-pro-preview',
          contents: payload.history.concat([{ role: 'user', parts: [{ text: payload.message }] }]),
          config: {
            systemInstruction: `You are the NutriLens AI Health Assistant. Your expertise is STRICTLY limited to food, nutrition, recipes, calorie estimation, and dietary health. 
            RULES:
            1. ONLY answer questions about food, nutrition, calories, and healthy eating habits.
            2. If the user asks about ANY other topic, politely decline.
            3. User Info: ${payload.profile.name}, Goal: ${payload.profile.goal}, Target: ${payload.profile.dailyGoal}kcal.`
          }
        });
        return res.status(200).json({ text: chatResponse.text });

      case 'plan':
        const planResponse = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `STRICT REQUIREMENT: Generate a personalized daily meal plan for today consisting ONLY of authentic Indian Tamil Nadu regional cuisine.
          User Health Goal: ${payload.profile.goal}. Target: ${payload.profile.dailyGoal}kcal.`,
          config: {
            responseMimeType: "application/json",
            responseSchema: mealPlanSchema
          }
        });
        return res.status(200).json(JSON.parse(planResponse.text));

      case 'weekly-plan':
        const weeklyResponse = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Generate a 7-day meal plan of Indian Tamil Nadu specialties. Goal: ${payload.profile.goal}. Target: ${payload.profile.dailyGoal}kcal.`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: { days: { type: Type.ARRAY, items: mealPlanSchema } },
              required: ["days"]
            }
          }
        });
        return res.status(200).json(JSON.parse(weeklyResponse.text));

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
