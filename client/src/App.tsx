import { useState, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Presentation } from "@/components/Presentation";
import { CoverScreen } from "@/components/screens/CoverScreen";
import { HighlightProblemScreen } from "@/components/screens/HighlightProblemScreen";
import { ValuePropsScreen } from "@/components/screens/ValuePropsScreen";
import { WhyNowScreen } from "@/components/screens/WhyNowScreen";
import { SystemArchitectureScreen } from "@/components/screens/SystemArchitectureScreen";
import { PublisherIntegrationScreen } from "@/components/screens/PublisherIntegrationScreen";
import { ViralProjectionScreen } from "@/components/screens/ViralProjectionScreen";
import { NetworkVisionScreen } from "@/components/screens/NetworkVisionScreen";
import DemoPlaygroundScreen from "@/components/screens/DemoPlaygroundScreen";

const isStandaloneDemo = window.location.pathname === "/demo";

function PresentationApp() {
  const [currentScreen, setCurrentScreen] = useState(() => {
    const saved = localStorage.getItem('vibecard-current-screen');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem('vibecard-current-screen', currentScreen.toString());
  }, [currentScreen]);

  const handleStart = () => {
    setCurrentScreen(1);
  };

  return (
    <Presentation currentScreen={currentScreen} onScreenChange={setCurrentScreen}>
      <CoverScreen onStart={handleStart} />
      <HighlightProblemScreen />
      <ValuePropsScreen />
      <WhyNowScreen />
      <SystemArchitectureScreen />
      <PublisherIntegrationScreen />
      <ViralProjectionScreen />
      <DemoPlaygroundScreen isActive={currentScreen === 7} />
      <NetworkVisionScreen />
    </Presentation>
  );
}

function StandaloneDemoApp() {
  return (
    <div className="h-screen w-screen overflow-y-auto bg-background">
      <DemoPlaygroundScreen isActive={true} />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {isStandaloneDemo ? <StandaloneDemoApp /> : <PresentationApp />}
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
