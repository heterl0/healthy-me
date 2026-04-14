import { useMemo } from "react";

type Params = {
  name: string;
  createdAt: string;
};

function toSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }
  return date.toISOString().slice(0, 10);
}

export function useReportExportFilename({ name, createdAt }: Params): string {
  return useMemo(() => {
    const safeName = toSlug(name) || "user";
    const date = formatDate(createdAt);

    return `healthyme-report-${safeName}-${date}.pdf`;
  }, [createdAt, name]);
}
