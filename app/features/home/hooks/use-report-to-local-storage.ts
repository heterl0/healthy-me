import { useEffect, useState } from "react";
import type { FitnessReport } from "~/shared/types";
import {
  loadReportsFromStorage,
  saveReportsToStorage,
} from "~/shared/utils/report-list-storage";
import { setReportList } from "~/store/appSlice";
import { useAppDispatch } from "~/store/hooks";

type Params = {
  reportList: FitnessReport[];
};

export function useReportToLocalStorage({ reportList }: Params) {
  const dispatch = useAppDispatch();
  const [isStorageHydrated, setIsStorageHydrated] = useState(false);

  useEffect(() => {
    const reportsFromStorage = loadReportsFromStorage();
    if (reportsFromStorage.length > 0) {
      dispatch(setReportList(reportsFromStorage));
    }
    setIsStorageHydrated(true);
  }, [dispatch]);

  useEffect(() => {
    if (!isStorageHydrated) {
      return;
    }

    saveReportsToStorage(reportList);
  }, [isStorageHydrated, reportList]);
}
