import type { FitnessReportSchema } from "../schema/fitness";

export interface FitnessBasicInfo {
  name: string;
  age: number;
  weight: number;
  height: number;
  goalWeight: number;
  timePerDay: number;
}

export type FitnessFormData = FitnessBasicInfo;

export interface FitnessReport {
  id: string;
  basicInfo: FitnessBasicInfo;
  report?: FitnessReportSchema;
  createdAt: string;
  updatedAt?: string;
}
