import { useMemo } from "react";
import type { FitnessReport } from "~/shared/types";
import type {
  PieDatum,
  ExerciseDatum,
  WeightDatum,
  ExerciseColumn,
} from "../types/chart";

type Params = {
  basicInfo: FitnessReport["basicInfo"];
  report: NonNullable<FitnessReport["report"]>;
};

function toPercentData(record: Record<string, number>): PieDatum[] {
  return Object.entries(record).map(([type, value]) => ({
    type: type.replace(/_/g, " "),
    value,
  }));
}

export function useReportCardData({ basicInfo, report }: Params) {
  return useMemo(() => {
    const nutritionData = toPercentData(report.nutrition_breakdown);
    const activityData = toPercentData(report.activity_composition);
    const bodyData = toPercentData(report.body_composition);

    const exerciseData: ExerciseDatum[] = report.exercise_effort.map(
      (item) => ({
        day: item.date,
        calories: item.calories_burned,
        minutes: item.duration_minutes,
        exerciseType: item.exercise_type,
      }),
    );

    const weightData: WeightDatum[] = report.weight_progress.weekly_data.map(
      (item) => ({
        week: item.week,
        weight: item.weight,
        category: "progress",
      }),
    );

    const goalData: WeightDatum[] = report.weight_progress.weekly_data.map(
      (item) => ({
        week: item.week,
        weight: report.weight_progress.goal_weight,
        category: "goal",
      }),
    );

    const yWeights = [...weightData, ...goalData].map((item) => item.weight);
    const minWeight = yWeights.length
      ? Math.min(...yWeights)
      : basicInfo.weight;
    const maxWeight = yWeights.length
      ? Math.max(...yWeights)
      : basicInfo.weight;
    const lineData = [...weightData, ...goalData];

    const startWeight = basicInfo.weight;
    const currentWeight =
      weightData.length > 0
        ? weightData[weightData.length - 1].weight
        : startWeight;
    const goalWeight = report.weight_progress.goal_weight;
    const totalNeed = Math.max(0, startWeight - goalWeight);
    const done = Math.max(0, startWeight - currentWeight);
    const timelineProgress =
      totalNeed > 0 ? Math.min(100, (done / totalNeed) * 100) : 100;
    const estimatedWeeks = report.weight_progress.weekly_data.length;

    const exerciseColumns: ExerciseColumn[] = [
      { title: "Date", dataIndex: "day", key: "day" },
      {
        title: "Exercise Type",
        dataIndex: "exerciseType",
        key: "exerciseType",
      },
      { title: "Calories Burned", dataIndex: "calories", key: "calories" },
      { title: "Duration (min)", dataIndex: "minutes", key: "minutes" },
    ];

    return {
      nutritionData,
      activityData,
      bodyData,
      exerciseData,
      weightData,
      goalData,
      lineData,
      minWeight,
      maxWeight,
      timelineProgress,
      estimatedWeeks,
      exerciseColumns,
    };
  }, [basicInfo, report]);
}
