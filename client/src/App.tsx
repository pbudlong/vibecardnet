import { useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Presentation } from "@/components/Presentation";
import { CoverScreen } from "@/components/screens/CoverScreen";
import { HighlightProblemScreen } from "@/components/screens/HighlightProblemScreen";
import { ValuePropsScreen } from "@/components/screens/ValuePropsScreen";
import { WhyNowScreen } from "@/components/screens/WhyNowScreen";
import { PublisherIntegrationScreen } from "@/components/screens/PublisherIntegrationScreen";
import { LiveDemoScreen } from "@/components/screens/LiveDemoScreen";
import { ViralProjectionScreen } from "@/components/screens/ViralProjectionScreen";
import { NetworkVisionScreen } from "@/components/screens/NetworkVisionScreen";

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
          <HighlightProblemScreen />
          <ValuePropsScreen />
          <WhyNowScreen />
          <PublisherIntegrationScreen />
          <LiveDemoScreen />
          <ViralProjectionScreen />
          <NetworkVisionScreen />
        </Presentation>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
