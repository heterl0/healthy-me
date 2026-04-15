export type PieDatum = {
  type: string;
  value: number;
};

export type ExerciseDatum = {
  day: string;
  calories: number;
  minutes: number;
};

export type WeightDatum = {
  week: string;
  weight: number;
  category: "progress" | "goal";
};

export type ExerciseColumn = {
  title: string;
  dataIndex: keyof ExerciseDatum;
  key: keyof ExerciseDatum;
};
