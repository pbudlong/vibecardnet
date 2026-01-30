import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PresentationProps {
  children: React.ReactNode[];
  currentScreen: number;
  onScreenChange: (screen: number) => void;
}

export function Presentation({ children, currentScreen, onScreenChange }: PresentationProps) {
  const totalScreens = children.length;

  const goNext = useCallback(() => {
    if (currentScreen < totalScreens - 1) {
      onScreenChange(currentScreen + 1);
    }
  }, [currentScreen, totalScreens, onScreenChange]);

  const goPrev = useCallback(() => {
    if (currentScreen > 0) {
      onScreenChange(currentScreen - 1);
    }
  }, [currentScreen, onScreenChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="h-full w-full"
        >
          {children[currentScreen]}
        </motion.div>
      </AnimatePresence>

      {currentScreen > 0 && (
        <Button
          variant="ghost"
          size="icon"
          onClick={goPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg z-50"
          data-testid="button-prev-screen"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      )}

      {currentScreen < totalScreens - 1 && (
        <Button
          variant="ghost"
          size="icon"
          onClick={goNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg z-50"
          data-testid="button-next-screen"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      )}

      {currentScreen !== 7 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-50">
          <div className="flex items-center gap-3">
            {currentScreen > 0 && (
              <button
                onClick={goPrev}
                className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                data-testid="button-pagination-prev"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
            <div className="flex gap-2">
              {Array.from({ length: totalScreens }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => onScreenChange(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentScreen
                      ? "w-8 bg-primary"
                      : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  data-testid={`button-dot-${index}`}
                />
              ))}
            </div>
            {currentScreen < totalScreens - 1 && (
              <button
                onClick={goNext}
                className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                data-testid="button-pagination-next"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {currentScreen + 1} / {totalScreens}
          </span>
        </div>
      )}
    </div>
  );
}
