export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="w-64">
        <svg viewBox="0 0 400 100">
          <text
            className="font-headline text-8xl"
            x="50%"
            y="50%"
            dy=".35em"
            textAnchor="middle"
            stroke="black"
            strokeWidth="1"
            fill="transparent"
            strokeDasharray="600"
            strokeDashoffset="600"
            style={{ animation: "splash-draw 1.5s ease-in-out forwards" }}
          >
            Monks
          </text>
          <text
            className="font-headline text-8xl"
            x="50%"
            y="50%"
            dy=".35em"
            textAnchor="middle"
            fill="black"
            fillOpacity="0"
            style={{ animation: "splash-fill 0.5s ease-in forwards 1.5s" }}
          >
            Monks
          </text>
        </svg>
      </div>
    </div>
  );
}
