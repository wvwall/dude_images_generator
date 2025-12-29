import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Registrazione service worker manuale
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((registration) => {
        console.log("SW registered:", registration);

        // Controlla aggiornamenti ogni 60 secondi
        setInterval(() => {
          registration.update();
        }, 60000);

        // Quando trova un aggiornamento
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;

          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                // Nuova versione installata, ricarica la pagina
                window.location.reload();
              }
            });
          }
        });
      })
      .catch((error) => {
        console.error("SW registration failed:", error);
      });
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
