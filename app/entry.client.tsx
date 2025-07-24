import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

const hydrate = () => {
  startTransition(() => {
    hydrateRoot(
      document.getElementById("root")!,
      <StrictMode>
        <HydratedRouter />
      </StrictMode>
    );
  });
};

if (typeof document !== "undefined") {
  hydrate();
}
