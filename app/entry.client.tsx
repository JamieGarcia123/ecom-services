import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

// Import components
import Root from "./root";
import Home from "./routes/home";
import Services from "./routes/services";
import ServiceDetail from "./routes/service.$serviceId";
import Login from "./routes/login";
import ProviderDashboard from "./routes/provider-dashboard";
import AddService from "./routes/add-service";

// Create the router manually for SPA mode
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      { path: "services", element: <Services /> },
      { path: "service/:serviceId", element: <ServiceDetail /> },
      { path: "login", element: <Login /> },
      { path: "provider-dashboard", element: <ProviderDashboard /> },
      { path: "add-service", element: <AddService /> },
    ],
  },
]);

startTransition(() => {
  hydrateRoot(
    document.getElementById("root")!,
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
});
