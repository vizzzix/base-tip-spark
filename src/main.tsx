import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import { wagmiConfig } from "./lib/wagmi.ts";
import { SafeOnchainKitProvider } from "./components/SafeOnchainKitProvider.tsx";
import { assertElement } from "./lib/guards.ts";
import { initializeDB } from "./lib/db.ts";
import { creatorsStore } from "./lib/creators-store.ts";
import "./index.css";

const queryClient = new QueryClient();

// Initialize IndexedDB
initializeDB().catch(console.error);

// Initialize demo creators store
if (typeof window !== 'undefined') {
  // Force initialize demo creators on app start
  console.log('Force initializing demo creators on app start...');
  creatorsStore.forceInitialize();
}

// Handle runtime errors from browser extensions
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    // Ignore errors from browser extensions
    if (event.message && event.message.includes('Could not establish connection')) {
      event.preventDefault();
      return false;
    }
  });

  // Handle unhandled promise rejections from extensions
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.message && event.reason.message.includes('Could not establish connection')) {
      event.preventDefault();
      return false;
    }
  });
}

// Guard components before rendering
assertElement("App", App);
assertElement("wagmiConfig", wagmiConfig);
assertElement("SafeOnchainKitProvider", SafeOnchainKitProvider);

    createRoot(document.getElementById("root")!).render(
      <BrowserRouter 
        basename="/base-tip-spark/"
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <SafeOnchainKitProvider apiKey={import.meta.env.VITE_ONCHAINKIT_API_KEY}>
              <App />
            </SafeOnchainKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </BrowserRouter>
    );
