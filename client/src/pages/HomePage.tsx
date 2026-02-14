import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { TaxiLogo } from "@/components/TaxiLogo";

export default function HomePage() {
  const [, navigate] = useLocation();
  const [progress, setProgress] = useState(0);
  const loaded = progress >= 100;

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const remaining = 100 - prev;
        const increment = Math.max(1, Math.random() * remaining * 0.15);
        return Math.min(100, prev + increment);
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: "hsl(50, 100%, 50%)", color: "hsl(0, 0%, 7%)" }}
      data-testid="home-page"
    >
      <TaxiLogo size="lg" />

      <div className="w-full max-w-xs mt-12">
        <div
          className="w-full h-3 border-[3px] border-current overflow-hidden"
          data-testid="loading-bar-container"
        >
          <div
            className="h-full transition-all duration-100 ease-out"
            style={{
              width: `${progress}%`,
              backgroundColor: "hsl(0, 0%, 7%)",
            }}
            data-testid="loading-bar-fill"
          />
        </div>
        <p
          className="text-center text-sm font-bold tracking-wider mt-2"
          data-testid="text-loading-percent"
        >
          {Math.round(progress)}%
        </p>
      </div>

      <div className="mt-8 w-full max-w-xs flex flex-col gap-3">
        <button
          onClick={() => navigate("/select")}
          disabled={!loaded}
          className="w-full py-4 text-xl font-black tracking-widest border-[4px] border-current transition-all duration-300"
          style={{
            opacity: loaded ? 1 : 0.3,
            cursor: loaded ? "pointer" : "not-allowed",
            backgroundColor: loaded ? "hsl(0, 0%, 7%)" : "transparent",
            color: loaded ? "hsl(50, 100%, 50%)" : "hsl(0, 0%, 7%)",
          }}
          data-testid="button-enter-app"
        >
          ENTER APP
        </button>

        <button
          onClick={() => navigate("/about-us")}
          disabled={!loaded}
          className="w-full py-4 text-xl font-black tracking-widest border-[4px] border-current transition-all duration-300"
          style={{
            opacity: loaded ? 1 : 0.3,
            cursor: loaded ? "pointer" : "not-allowed",
            backgroundColor: "transparent",
            color: "hsl(0, 0%, 7%)",
          }}
          data-testid="button-enter-site"
        >
          COMPANY SITE
        </button>
      </div>

      <p className="text-xs font-semibold tracking-[0.2em] uppercase mt-10">
        A Denoko Cooperative
      </p>
    </div>
  );
}
