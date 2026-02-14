import { useState, useEffect, useCallback, useRef } from "react";
import { SplashScreen } from "@/components/SplashScreen";
import { TaxiLogo } from "@/components/TaxiLogo";

type DriverPhase = "splash" | "setup" | "active";

export default function DriverPage() {
  const [phase, setPhase] = useState<DriverPhase>("splash");
  const [driverName, setDriverName] = useState("");
  const [dispatchCode, setDispatchCode] = useState("");
  const [error, setError] = useState("");
  const [sharing, setSharing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [locationError, setLocationError] = useState("");
  const [driverId, setDriverId] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("taxi_driver");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setDriverName(data.driverName || "");
        setDispatchCode(data.dispatchCode || "");
        setDriverId(data.driverId || "");
        if (data.driverId && data.dispatchCode) {
          setPhase("splash");
        }
      } catch {}
    }
  }, []);

  const sendLocation = useCallback(async (id: string, name: string, code: string) => {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        });
      });

      await fetch("/api/driver/update-location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          driverId: id,
          name,
          dispatchCode: code,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: new Date().toISOString(),
        }),
      });

      setLastUpdate(new Date().toLocaleTimeString());
      setLocationError("");
    } catch (err: any) {
      if (err?.code === 1) {
        setLocationError("Location permission denied. Please enable location access in your browser settings.");
        stopSharing();
      } else if (err?.code === 2) {
        setLocationError("Unable to determine location. Please try again.");
      }
    }
  }, []);

  const startSharing = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setSharing(true);
    setLocationError("");
    sendLocation(driverId, driverName, dispatchCode);

    intervalRef.current = setInterval(() => {
      sendLocation(driverId, driverName, dispatchCode);
    }, 5000);
  }, [driverId, driverName, dispatchCode, sendLocation]);

  const stopSharing = useCallback(() => {
    setSharing(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleSetup = async () => {
    setError("");
    if (!driverName.trim()) {
      setError("Driver name is required");
      return;
    }
    if (!dispatchCode.trim()) {
      setError("Dispatch code is required");
      return;
    }

    try {
      const res = await fetch("/api/validate-dispatch-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dispatchCode: dispatchCode.trim() }),
      });
      const data = await res.json();
      if (!data.valid) {
        setError("Invalid dispatch code");
        return;
      }
    } catch {
      setError("Connection failed. Please try again.");
      return;
    }

    const id = driverId || crypto.randomUUID();
    setDriverId(id);
    localStorage.setItem("taxi_driver", JSON.stringify({
      driverId: id,
      driverName: driverName.trim(),
      dispatchCode: dispatchCode.trim(),
    }));
    setPhase("active");
  };

  if (phase === "splash") {
    return <SplashScreen message="Loading driver tools..." onComplete={() => {
      const saved = localStorage.getItem("taxi_driver");
      if (saved) {
        try {
          const data = JSON.parse(saved);
          if (data.driverId && data.dispatchCode) {
            setDriverId(data.driverId);
            setDriverName(data.driverName);
            setDispatchCode(data.dispatchCode);
            setPhase("active");
            return;
          }
        } catch {}
      }
      setPhase("setup");
    }} />;
  }

  if (phase === "setup") {
    return (
      <div
        className="min-h-screen flex flex-col px-6 py-10"
        style={{ backgroundColor: "hsl(50, 100%, 50%)", color: "hsl(0, 0%, 7%)" }}
        data-testid="driver-setup"
      >
        <div className="flex justify-center mb-8">
          <TaxiLogo size="md" />
        </div>

        <h1 className="text-4xl font-black tracking-tight mb-8" data-testid="text-driver-setup-title">
          DRIVER SETUP
        </h1>

        <label className="text-xl font-bold mb-1">Driver Name</label>
        <div className="border-b-[3px] border-current mb-6">
          <input
            type="text"
            value={driverName}
            onChange={(e) => setDriverName(e.target.value)}
            className="w-full bg-transparent text-lg py-2 outline-none placeholder:text-black/40"
            placeholder="Enter your name"
            data-testid="input-driver-name"
          />
        </div>

        <label className="text-xl font-bold mb-1">Dispatch Code</label>
        <div className="border-b-[3px] border-current mb-2">
          <input
            type="text"
            value={dispatchCode}
            onChange={(e) => setDispatchCode(e.target.value.toUpperCase())}
            className="w-full bg-transparent text-lg py-2 outline-none placeholder:text-black/40 uppercase"
            placeholder="e.g. NYAC-TAXI-01"
            data-testid="input-dispatch-code"
          />
        </div>

        {error && (
          <div
            className="border-2 border-red-600 text-red-600 px-4 py-2 mt-2 font-semibold text-base"
            data-testid="text-error"
          >
            {error}
          </div>
        )}

        <p className="text-sm mt-2 opacity-70">Dispatch Code connects you to your office.</p>

        <div className="flex-1" />

        <button
          onClick={handleSetup}
          className="w-full py-5 text-2xl font-black tracking-wide border-[4px] border-current bg-transparent hover:bg-black/5 active:bg-black/10 transition-colors mt-8"
          data-testid="button-continue"
        >
          CONTINUE
        </button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col px-6 py-10"
      style={{ backgroundColor: "hsl(50, 100%, 50%)", color: "hsl(0, 0%, 7%)" }}
      data-testid="driver-active"
    >
      <h1 className="text-5xl font-black tracking-tight mb-8" data-testid="text-driver-title">
        DRIVER
      </h1>

      <div className="border-[3px] border-current p-6 mb-6">
        <p className="text-xl font-bold mb-3">
          Dispatch Code:<br />
          <span className="text-2xl" data-testid="text-dispatch-code">{dispatchCode}</span>
        </p>

        <p className="text-xl font-bold mb-3">
          Status:<br />
          <span className="text-2xl" data-testid="text-sharing-status">
            {sharing ? "SHARING" : "NOT SHARING"}
            {sharing && <span className="ml-2 inline-block w-5 h-5 bg-green-600 rounded-sm align-middle" />}
          </span>
        </p>

        {lastUpdate && (
          <p className="text-xl font-bold">
            Last Update:<br />
            <span className="text-2xl" data-testid="text-last-update">{lastUpdate}</span>
          </p>
        )}
      </div>

      {locationError && (
        <div className="border-2 border-red-600 text-red-600 px-4 py-3 mb-4 font-semibold text-sm" data-testid="text-location-error">
          {locationError}
        </div>
      )}

      <button
        onClick={sharing ? stopSharing : startSharing}
        className="w-full py-5 text-2xl font-black tracking-wide border-[4px] border-current bg-transparent hover:bg-black/5 active:bg-black/10 transition-colors"
        data-testid="button-toggle-sharing"
      >
        {sharing ? "STOP SHARING" : "START SHARING"}
      </button>

      <p className="text-sm mt-6 text-center opacity-70">Location updates every 5 seconds.</p>

      <button
        onClick={() => {
          stopSharing();
          localStorage.removeItem("taxi_driver");
          setPhase("setup");
          setDriverName("");
          setDispatchCode("");
          setDriverId("");
        }}
        className="mt-4 text-sm font-semibold underline opacity-60 hover:opacity-100 self-center"
        data-testid="button-reset-driver"
      >
        Reset driver setup
      </button>
    </div>
  );
}
