import { useState, useEffect } from "react";
import { TaxiLogo } from "./TaxiLogo";

interface SplashScreenProps {
  message: string;
  onComplete: () => void;
  duration?: number;
}

export function SplashScreen({ message, onComplete, duration = 1800 }: SplashScreenProps) {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const fadeIn = setTimeout(() => setOpacity(1), 50);
    const fadeOut = setTimeout(() => setOpacity(0), duration - 400);
    const done = setTimeout(onComplete, duration);
    return () => {
      clearTimeout(fadeIn);
      clearTimeout(fadeOut);
      clearTimeout(done);
    };
  }, [onComplete, duration]);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-50"
      style={{
        backgroundColor: "hsl(50, 100%, 50%)",
        color: "hsl(0, 0%, 7%)",
        opacity,
        transition: "opacity 0.4s ease-in-out",
      }}
      data-testid="splash-screen"
    >
      <TaxiLogo size="lg" />
      <p className="mt-12 text-base font-medium tracking-wide">{message}</p>
    </div>
  );
}
