import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FitnessReport } from "~/shared/types";

export interface ReportState {
  report: FitnessReport | null;
  reportList: FitnessReport[];
}

export interface AppState extends ReportState {
  appName: "Healthy Me";
}

const initialState: AppState = {
  appName: "Healthy Me",
  report: null,
  reportList: [],
} as const;

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setReport: (state, action: PayloadAction<FitnessReport | null>) => {
      state.report = action.payload;
    },
    setReportList: (state, action: PayloadAction<FitnessReport[]>) => {
      state.reportList = action.payload;
    },
    addReport: (state, action: PayloadAction<FitnessReport>) => {
      state.reportList.push(action.payload);
    },
    updateReport: (state, action: PayloadAction<FitnessReport>) => {
      const index = state.reportList.findIndex(
        (report) => report.id === action.payload.id,
      );
      if (index !== -1) {
        state.reportList[index] = action.payload;
      }
    },
    removeReport: (state, action: PayloadAction<string>) => {
      state.reportList = state.reportList.filter(
        (report) => report.id !== action.payload,
      );
    },
  },
});

export const {
  setReport,
  setReportList,
  addReport,
  updateReport,
  removeReport,
} = appSlice.actions;

export default appSlice.reducer;
