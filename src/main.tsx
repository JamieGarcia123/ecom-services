import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";

import Home from "../app/routes/home";
import Services from "../app/routes/services";
import ServiceDetail from "../app/routes/service.$serviceId";
import Login from "../app/routes/login";
import ProviderDashboard from "../app/routes/provider-dashboard";
import AddService from "../app/routes/add-service";
import TestSupabase from "../app/routes/test-supabase";
import DebugEnv from "../app/routes/debug-env";
import MigrateDuration from "../app/routes/migrate-duration";
import { Header } from "../app/components/Header";

// CSS import
import "../app/app.css";

function Layout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "services", element: <Services /> },
      { path: "service/:serviceId", element: <ServiceDetail /> },
      { path: "login", element: <Login /> },
      { path: "provider-dashboard", element: <ProviderDashboard /> },
      { path: "add-service", element: <AddService /> },
      { path: "test-supabase", element: <TestSupabase /> },
      { path: "debug-env", element: <DebugEnv /> },
      { path: "migrate-duration", element: <MigrateDuration /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
