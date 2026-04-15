import { Button, Empty, Tooltip, Typography } from "antd";
import { Activity, memo, useEffect, useMemo, useState } from "react";
import { useIsMobile } from "~/shared/hooks/use-is-mobile";
import styles from "../styles.module.scss";
import type { ExerciseDatum } from "../types/chart";
import { ChevronLeft, ChevronRight } from "lucide-react";

const { Text } = Typography;

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const EXERCISE_TYPE_COLORS: Record<ExerciseDatum["exerciseType"], string> = {
  cardio: "#ff7875",
  strength: "#597ef7",
  stretching: "#73d13d",
  yoga: "#d3adf7",
  rest: "#bfbfbf",
};

type Props = {
  data: ExerciseDatum[];
  activeMonthKey?: string;
  onMonthChange?: (monthKey: string) => void;
};

type CalendarCell = {
  key: string;
  date: Date | null;
  isoDate: string | null;
  entry?: ExerciseDatum;
};

function formatMonthLabel(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
}

function formatTypeLabel(type: ExerciseDatum["exerciseType"]): string {
  return `${type.charAt(0).toUpperCase()}${type.slice(1)}`;
}

function toMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function parseDate(value: string): Date {
  return new Date(`${value}T00:00:00`);
}

function getMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function buildMonthGrid(
  currentMonth: Date,
  entriesByDate: Map<string, ExerciseDatum>,
) {
  const start = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1,
  );
  const firstDay = start.getDay();
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0,
  ).getDate();

  const cells: CalendarCell[] = [];

  for (let index = 0; index < firstDay; index += 1) {
    cells.push({ key: `empty-leading-${index}`, date: null, isoDate: null });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    const isoDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    cells.push({
      key: isoDate,
      date,
      isoDate,
      entry: entriesByDate.get(isoDate),
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push({
      key: `empty-trailing-${cells.length}`,
      date: null,
      isoDate: null,
    });
  }

  return cells;
}

function ExerciseCalendar({ data, activeMonthKey, onMonthChange }: Props) {
  const isMobile = useIsMobile();
  const sortedDates = useMemo(
    () =>
      [...data]
        .map((item) => parseDate(item.day))
        .filter((date) => !Number.isNaN(date.getTime()))
        .sort((a, b) => a.getTime() - b.getTime()),
    [data],
  );

  const monthKeys = useMemo(() => {
    const keys = new Set<string>();
    for (const date of sortedDates) {
      keys.add(toMonthKey(date));
    }
    return [...keys];
  }, [sortedDates]);

  const [internalActiveMonthKey, setInternalActiveMonthKey] = useState<string>(
    monthKeys[0] ?? "",
  );
  const resolvedActiveMonthKey = activeMonthKey ?? internalActiveMonthKey;

  useEffect(() => {
    if (!monthKeys.length) {
      if (!activeMonthKey) {
        setInternalActiveMonthKey("");
      }
      return;
    }

    if (!monthKeys.includes(resolvedActiveMonthKey)) {
      const nextMonthKey = monthKeys[0];
      if (activeMonthKey) {
        onMonthChange?.(nextMonthKey);
      } else {
        setInternalActiveMonthKey(nextMonthKey);
      }
    }
  }, [activeMonthKey, monthKeys, onMonthChange, resolvedActiveMonthKey]);

  const activeMonthIndex = monthKeys.indexOf(resolvedActiveMonthKey);
  const currentMonth = useMemo(() => {
    if (resolvedActiveMonthKey) {
      const [year, month] = resolvedActiveMonthKey.split("-").map(Number);
      return new Date(year, month - 1, 1);
    }
    return sortedDates.length > 0 ? getMonthStart(sortedDates[0]) : null;
  }, [resolvedActiveMonthKey, sortedDates]);

  const entriesByDate = useMemo(() => {
    const map = new Map<string, ExerciseDatum>();
    for (const item of data) {
      map.set(item.day, item);
    }
    return map;
  }, [data]);

  const visibleTypes = useMemo(() => {
    const unique = new Set<ExerciseDatum["exerciseType"]>();
    for (const item of data) {
      unique.add(item.exerciseType);
    }
    return [...unique];
  }, [data]);

  if (!data.length || !currentMonth || !monthKeys.length) {
    return <Empty description="No exercise data available." />;
  }

  const cells = buildMonthGrid(currentMonth, entriesByDate);
  const canGoPrevious = activeMonthIndex > 0;
  const canGoNext =
    activeMonthIndex >= 0 && activeMonthIndex < monthKeys.length - 1;

  const goPrevious = () => {
    if (!canGoPrevious) return;
    const nextMonthKey = monthKeys[activeMonthIndex - 1];
    if (activeMonthKey) {
      onMonthChange?.(nextMonthKey);
      return;
    }
    setInternalActiveMonthKey(nextMonthKey);
  };

  const goNext = () => {
    if (!canGoNext) return;
    const nextMonthKey = monthKeys[activeMonthIndex + 1];
    if (activeMonthKey) {
      onMonthChange?.(nextMonthKey);
      return;
    }
    setInternalActiveMonthKey(nextMonthKey);
  };

  return (
    <div className={styles.exerciseCalendar}>
      <div className={styles.calendarHeader}>
        <Button onClick={goPrevious} disabled={!canGoPrevious}>
          <ChevronLeft size={16} />
        </Button>
        <Text strong>{formatMonthLabel(currentMonth)}</Text>
        <Button onClick={goNext} disabled={!canGoNext}>
          <ChevronRight size={16} />
        </Button>
      </div>

      <div className={styles.weekdayRow}>
        {WEEKDAY_LABELS.map((label) => (
          <Text key={label} className={styles.weekdayCell}>
            {label}
          </Text>
        ))}
      </div>

      <div className={styles.calendarGrid}>
        {cells.map((cell) => {
          if (!cell.date || !cell.isoDate) {
            return <div key={cell.key} className={styles.emptyDayCell} />;
          }

          if (!cell.entry) {
            return (
              <div key={cell.key} className={styles.dayCell}>
                <Text className={styles.dayNumber}>{cell.date.getDate()}</Text>
              </div>
            );
          }

          const color = EXERCISE_TYPE_COLORS[cell.entry.exerciseType];
          const typeLabel = formatTypeLabel(cell.entry.exerciseType);

          return (
            <Tooltip
              key={cell.key}
              title={
                <div className={styles.calendarTooltip}>
                  <div>{cell.isoDate}</div>
                  <div>Type: {typeLabel}</div>
                  <div>Minutes: {cell.entry.minutes}</div>
                  <div>Calories: {cell.entry.calories}</div>
                </div>
              }
            >
              <div className={styles.dayCell}>
                <Text className={styles.dayNumber}>{cell.date.getDate()}</Text>
                <span
                  className={styles.exerciseBadge}
                  style={{ backgroundColor: color }}
                >
                  <Activity mode={isMobile ? "hidden" : "visible"}>
                    {typeLabel}
                  </Activity>
                </span>
              </div>
            </Tooltip>
          );
        })}
      </div>

      <div className={styles.calendarLegend}>
        {visibleTypes.map((type) => (
          <div key={type} className={styles.legendItem}>
            <span
              className={styles.legendDot}
              style={{ backgroundColor: EXERCISE_TYPE_COLORS[type] }}
            />
            <Text>{formatTypeLabel(type)}</Text>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(ExerciseCalendar);
