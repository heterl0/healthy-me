import { GoogleGenAI, type GenerationConfig } from "@google/genai";
import type { FitnessBasicInfo } from "~/shared/types";

const DEFAULT_MODEL = "gemini-2.5-flash";

export async function generateGeminiOutput(
  prompt: string,
  config?: GenerationConfig,
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: prompt,
    config,
  });
  return response?.text ?? "";
}

export function generatePrompt(basicInfo: FitnessBasicInfo): string {
  return `
  **Role:** You are a professional Health Data Analyst and Fitness Coach.

  **Task:** Using the user metrics provided, calculate a comprehensive fitness projection and nutrition strategy. You must return the data strictly in **JSON format** following the provided Zod schema.

  **User Metrics:**
  * **Name:** ${basicInfo.name}
  * **Age:** ${basicInfo.age}
  * **Gender:** ${basicInfo.gender}
  * **Current Weight:** ${basicInfo.weight} kg
  * **Height:** ${basicInfo.height} cm
  * **Goal Weight:** ${basicInfo.goalWeight} kg
  * **Target:** ${basicInfo.target}
  * **Exercise Capacity:** ${basicInfo.timePerDay} minutes per day

  **Constraint Rules:**
  1. **Nutrition Breakdown:** Represent \`protein\`, \`carbs\`, and \`fat\` as percentages that sum to 100%.
  2. **Activity Composition:** Ensure \`cardio\`, \`strength\`, \`stretching\`, and \`rest\` sum to 100% of the weekly routine.
  3. **Weight Progress:** Project a realistic (4 - 12) weeks weight loss/gain trajectory based on the goal weight and daily exercise time.
  4. **Body Composition:** Estimate realistic percentages based on the user's current weight and height (BMI proxy).
  5. **Exercise Type:** The exercise type should be one of the following: \`cardio\`, \`strength\`, \`stretching\`, \`yoga\`, \`rest\`. Duration could be dynamic in minutes.
  6. **Exercise Effort:** Date start from today ${new Date().toISOString().split("T")[0]} and follow with the number of days equal to weeks suggestions to create realistic calendar.
  7. **Output Format:** Return ONLY a valid JSON object. No markdown prose, no explanations.

  **Required JSON Structure:**
  \`\`\`json
  {
    "summary": "string",
    "nutrition_breakdown": {
      "protein": number,
      "carbs": number,
      "fat": number
    },
    "exercise_effort": [
      { "date": "YYYY-MM-DD", "calories_burned": number, "duration_minutes": number, "exercise_type": "cardio" | "strength" | "stretching" | "yoga" | "rest"  }
    ],
    "weight_progress": {
      "goal_weight": number,
      "weekly_data": [
        { "week": "Week 1", "weight": number }
      ]
    },
    "activity_composition": {
      "cardio": number,
      "strength": number,
      "stretching": number,
      "rest": number
    },
    "body_composition": {
      "muscle": number,
      "fat": number,
      "water": number,
      "bone": number
    }
  }
  \`\`\`
  `;
}
