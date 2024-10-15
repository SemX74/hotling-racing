import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Routes from "./routes.tsx";
import "./styles/globals.css";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "react-hot-toast";

const client = new QueryClient({});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={client}>
        <Routes />
        <Toaster position="bottom-right" />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
