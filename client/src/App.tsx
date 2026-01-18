import { useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Presentation } from "@/components/Presentation";
import { CoverScreen } from "@/components/screens/CoverScreen";
import { WhyNowScreen } from "@/components/screens/WhyNowScreen";
import { ValuePropsScreen } from "@/components/screens/ValuePropsScreen";
import { PublisherIntegrationScreen } from "@/components/screens/PublisherIntegrationScreen";
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
          <WhyNowScreen />
          <ValuePropsScreen />
          <PublisherIntegrationScreen />
          <PlaceholderScreen title="Live Demo" screenNumber={5} />
          <PlaceholderScreen title="Viral Projection" screenNumber={6} />
          <PlaceholderScreen title="Network Vision" screenNumber={7} />
        </Presentation>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
