import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { Layout } from "../app/root";
import Home from "../app/routes/home";
import Services from "../app/routes/services";
import ServiceDetail from "../app/routes/service.$serviceId";
import Login from "../app/routes/login";
import ProviderDashboard from "../app/routes/provider-dashboard";
import AddService from "../app/routes/add-service";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout><div id="root-outlet" /></Layout>,
    children: [
      { index: true, element: <Home /> },
      { path: "services", element: <Services /> },
      { path: "service/:serviceId", element: <ServiceDetail /> },
      { path: "login", element: <Login /> },
      { path: "provider-dashboard", element: <ProviderDashboard /> },
      { path: "add-service", element: <AddService /> },
    ],
  },
], {
  basename: process.env.NODE_ENV === 'production' ? '/ecom-services' : '/'
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
