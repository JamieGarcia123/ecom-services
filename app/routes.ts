import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("services", "routes/services.tsx"),
  route("service/:serviceId", "routes/service.$serviceId.tsx"),
  route("login", "routes/login.tsx"),
  route("provider-dashboard", "routes/provider-dashboard.tsx"),
  route("add-service", "routes/add-service.tsx"),
] satisfies RouteConfig;
