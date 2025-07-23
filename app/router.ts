// router.ts
import { createBrowserRouter } from "react-router-dom";
import { createRoutesFromConfig } from "@react-router/dev";
import routes from "./routes";

const routeObjects = createRoutesFromConfig(routes); // 👈 convert route config

export const router = createBrowserRouter(routeObjects, {
  basename: "/ecom-services", // ✅ necessary for GitHub Pages
});
