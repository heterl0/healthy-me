import type { FitnessReport } from "~/shared/types";

export const REPORT_LIST_STORAGE_KEY = "healthy_me_reports_v1";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isValidReportItem(value: unknown): value is FitnessReport {
  if (!isRecord(value) || typeof value.id !== "string") {
    return false;
  }

  if (!isRecord(value.basicInfo)) {
    return false;
  }

  const { basicInfo } = value;
  const hasValidBasicInfo =
    typeof basicInfo.name === "string" &&
    typeof basicInfo.age === "number" &&
    typeof basicInfo.weight === "number" &&
    typeof basicInfo.height === "number" &&
    typeof basicInfo.goalWeight === "number" &&
    typeof basicInfo.timePerDay === "string";

  if (!hasValidBasicInfo) {
    return false;
  }

  if (typeof value.createdAt !== "string") {
    return false;
  }

  return value.updatedAt === undefined || typeof value.updatedAt === "string";
}

function canUseStorage(): boolean {
  return (
    typeof window !== "undefined" && typeof window.localStorage !== "undefined"
  );
}

export function loadReportsFromStorage(): FitnessReport[] {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(REPORT_LIST_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isValidReportItem);
  } catch {
    return [];
  }
}

export function saveReportsToStorage(reportList: FitnessReport[]): void {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(
      REPORT_LIST_STORAGE_KEY,
      JSON.stringify(reportList),
    );
  } catch {
    // Ignore storage write errors to avoid blocking UI flow.
  }
}
