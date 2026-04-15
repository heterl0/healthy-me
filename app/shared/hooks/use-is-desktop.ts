import { Grid } from "antd";

export function useIsDesktop(): boolean {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  return !!screens.lg;
}
