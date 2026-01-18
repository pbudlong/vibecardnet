import { useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Presentation } from "@/components/Presentation";
import { CoverScreen } from "@/components/screens/CoverScreen";
import { PlaceholderScreen } from "@/components/screens/PlaceholderScreen";

function App() {
  const [currentScreen, setCurrentScreen] = useState(0);

  const handleStart = () => {
    setCurrentScreen(1);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Presentation currentScreen={currentScreen} onScreenChange={setCurrentScreen}>
          <CoverScreen onStart={handleStart} />
          <PlaceholderScreen title="Why Now" screenNumber={2} />
          <PlaceholderScreen title="The KYC Insight" screenNumber={3} />
          <PlaceholderScreen title="Value Props" screenNumber={4} />
          <PlaceholderScreen title="Publisher Integration" screenNumber={5} />
          <PlaceholderScreen title="Live Demo" screenNumber={6} />
          <PlaceholderScreen title="Viral Projection" screenNumber={7} />
          <PlaceholderScreen title="Network Vision" screenNumber={8} />
        </Presentation>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
