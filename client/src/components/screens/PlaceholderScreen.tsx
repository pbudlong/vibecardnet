interface PlaceholderScreenProps {
  title: string;
  screenNumber: number;
}

export function PlaceholderScreen({ title, screenNumber }: PlaceholderScreenProps) {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl font-display font-bold text-muted-foreground/20 mb-4">
          {screenNumber}
        </div>
        <h2 className="text-2xl font-display font-semibold text-foreground">
          {title}
        </h2>
        <p className="text-muted-foreground mt-2">Coming soon...</p>
      </div>
    </div>
  );
}
