import { OnchainKitProvider } from "@coinbase/onchainkit";
import { ReactNode } from "react";

interface SafeOnchainKitProviderProps {
  children: ReactNode;
  apiKey?: string;
}

export function SafeOnchainKitProvider({ children, apiKey }: SafeOnchainKitProviderProps) {
  // If no API key or OnchainKit fails, just render children
  if (!apiKey) {
    // Silently render children without OnchainKit features
    return <>{children}</>;
  }

  try {
    return (
      <OnchainKitProvider apiKey={apiKey}>
        {children}
      </OnchainKitProvider>
    );
  } catch (error) {
    console.error("OnchainKitProvider error:", error);
    // Fallback: render children without OnchainKit
    return <>{children}</>;
  }
}
