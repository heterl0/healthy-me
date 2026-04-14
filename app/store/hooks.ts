import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "./index";
import type { ReportState } from "./appSlice";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export const useReportDispatch = () => useAppDispatch();
export const useReportSelector = () =>
  useAppSelector<ReportState>(({ app }) => app);
