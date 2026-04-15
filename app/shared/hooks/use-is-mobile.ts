import { Grid } from "antd";

export function useIsMobile(): boolean {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  return screens.xs ?? false;
}
