import type { FitnessReportSchema } from "../schema/fitness";

export interface FitnessBasicInfo {
  name: string;
  age: number;
  weight: number;
  height: number;
  goalWeight: number;
  timePerDay: string;
  gender?: "Male" | "Female";
  target?: "Weight Loss" | "Weight Gain" | "Maintenance";
}

export type FitnessFormData = FitnessBasicInfo;

export interface FitnessReport {
  id: string;
  basicInfo: FitnessBasicInfo;
  report?: FitnessReportSchema;
  createdAt: string;
  createdBy?: string;
  updatedAt?: string;
}
