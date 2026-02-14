import { useLocation } from "wouter";
import { TaxiLogo } from "@/components/TaxiLogo";

export default function Landing() {
  const [, navigate] = useLocation();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
      style={{ backgroundColor: "hsl(50, 100%, 50%)", color: "hsl(0, 0%, 7%)" }}
      data-testid="landing-page"
    >
      <TaxiLogo size="lg" />

      <h1
        className="text-3xl md:text-5xl font-black tracking-tight mt-10 text-center leading-tight"
        data-testid="text-landing-title"
      >
        DENOKO TAXI<br />DISPATCH
      </h1>

      <p className="text-base md:text-lg font-medium text-center mt-4 leading-relaxed max-w-sm">
        Hybrid dispatch.<br />
        Live driver map<br />
        + call pins.
      </p>

      <div className="flex flex-col gap-5 w-full max-w-md mt-10">
        <button
          onClick={() => navigate("/driver")}
          className="w-full py-5 text-2xl md:text-3xl font-black tracking-wide border-[4px] border-current bg-transparent hover:bg-black/5 active:bg-black/10 transition-colors"
          data-testid="button-driver"
        >
          I'M A DRIVER
        </button>

        <button
          onClick={() => navigate("/dispatch")}
          className="w-full py-5 text-2xl md:text-3xl font-black tracking-wide border-[4px] border-current bg-transparent hover:bg-black/5 active:bg-black/10 transition-colors"
          data-testid="button-dispatch"
        >
          I'M DISPATCH
        </button>
      </div>

      <p className="text-sm font-medium mt-10 tracking-wide">A Denoko Cooperative</p>
    </div>
  );
}
