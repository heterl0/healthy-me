import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("features/home/index.tsx"),
  route("welcome", "features/welcome/index.tsx"),
] satisfies RouteConfig;
