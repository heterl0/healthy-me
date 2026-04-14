import { z } from "zod";

export const FitnessSchema = z.object({
  summary: z.string(),

  nutrition_breakdown: z.object({
    protein: z.number().min(0).max(100),
    carbs: z.number().min(0).max(100),
    fat: z.number().min(0).max(100),
  }),

  exercise_effort: z.array(
    z.object({
      date: z.string(),
      calories_burned: z.number().min(0),
      duration_minutes: z.number().min(0),
    }),
  ),

  weight_progress: z.object({
    goal_weight: z.number(),
    weekly_data: z.array(
      z.object({
        week: z.string(),
        weight: z.number(),
      }),
    ),
  }),

  activity_composition: z.object({
    cardio: z.number().min(0).max(100),
    strength: z.number().min(0).max(100),
    stretching: z.number().min(0).max(100),
    rest: z.number().min(0).max(100),
  }),

  body_composition: z.object({
    muscle: z.number().min(0).max(100),
    fat: z.number().min(0).max(100),
    water: z.number().min(0).max(100),
    bone: z.number().min(0).max(100),
  }),
});

export type FitnessReportSchema = z.infer<typeof FitnessSchema>;
