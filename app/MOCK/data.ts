import type { FitnessReport } from "~/shared/types";

export const mockReport: FitnessReport = {
  id: "ee024cdd-9c66-49e6-b62d-56892d21e5af",
  basicInfo: {
    name: "Lê Văn Hiếu",
    age: 23,
    weight: 70,
    height: 167,
    goalWeight: 63,
    timePerDay: "30",
  },
  createdAt: "2026-04-14T10:56:21.692Z",
  report: {
    summary:
      "Lê Văn Hiếu, 23, currently 70kg (BMI 25.09, overweight) at 167cm, aims to reach 63kg. A balanced nutrition plan and consistent 30-minute daily exercise, focusing on a mix of cardio and strength, are projected to achieve steady progress towards the goal over 4 weeks.",
    nutrition_breakdown: {
      protein: 35,
      carbs: 45,
      fat: 20,
    },
    exercise_effort: [
      {
        date: "2024-07-01",
        calories_burned: 250,
        duration_minutes: 30,
      },
      {
        date: "2024-07-08",
        calories_burned: 260,
        duration_minutes: 30,
      },
      {
        date: "2024-07-15",
        calories_burned: 270,
        duration_minutes: 30,
      },
      {
        date: "2024-07-22",
        calories_burned: 280,
        duration_minutes: 30,
      },
    ],
    weight_progress: {
      goal_weight: 63,
      weekly_data: [
        {
          week: "Week 1",
          weight: 69,
        },
        {
          week: "Week 2",
          weight: 67.8,
        },
        {
          week: "Week 3",
          weight: 66.5,
        },
        {
          week: "Week 4",
          weight: 65.2,
        },
      ],
    },
    activity_composition: {
      cardio: 45,
      strength: 30,
      stretching: 15,
      rest: 10,
    },
    body_composition: {
      muscle: 15,
      fat: 28,
      water: 50,
      bone: 7,
    },
  },
};
