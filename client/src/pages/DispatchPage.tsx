import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { SplashScreen } from "@/components/SplashScreen";
import { TaxiLogo } from "@/components/TaxiLogo";
import type { Driver, Call, CallStatus } from "@shared/schema";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

type DispatchPhase = "splash" | "login" | "dashboard";

export default function DispatchPage() {
  const [phase, setPhase] = useState<DispatchPhase>("splash");
  const [passcode, setPasscode] = useState("");
  const [dispatchCode, setDispatchCode] = useState("");
  const [passcodeError, setPasscodeError] = useState("");
  const [codeError, setCodeError] = useState("");
  const [authed, setAuthed] = useState(false);

  const [selectedCall, setSelectedCall] = useState<Call | null>(null);

  const [newAddress, setNewAddress] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [addCallError, setAddCallError] = useState("");

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const [mapToken, setMapToken] = useState("");
  const [mapError, setMapError] = useState("");

  useEffect(() => {
    fetch("/api/mapbox-token")
      .then((r) => r.json())
      .then((d) => {
        if (d.token) {
          setMapToken(d.token);
        } else {
          setMapError("Map token not configured. Please set MAPBOX_TOKEN.");
        }
      })
      .catch(() => {
        setMapError("Failed to load map configuration.");
      });
  }, []);

  const { data: drivers = [] } = useQuery<Driver[]>({
    queryKey: ["/api/driver/list", dispatchCode],
    queryFn: async () => {
      const res = await fetch(`/api/driver/list?dispatchCode=${encodeURIComponent(dispatchCode)}`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: authed && !!dispatchCode,
    refetchInterval: 3000,
  });

  const { data: calls = [] } = useQuery<Call[]>({
    queryKey: ["/api/calls/list", dispatchCode],
    queryFn: async () => {
      const res = await fetch(`/api/calls/list?dispatchCode=${encodeURIComponent(dispatchCode)}`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: authed && !!dispatchCode,
    refetchInterval: 3000,
  });

  const addCallMutation = useMutation({
    mutationFn: async (data: { address: string; notes?: string }) => {
      const res = await fetch("/api/calls/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dispatchCode: dispatchCode.trim(),
          address: data.address,
          notes: data.notes,
        }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to add call");
      }
      return res.json();
    },
    onSuccess: () => {
      setNewAddress("");
      setNewNotes("");
      setAddCallError("");
      queryClient.invalidateQueries({ queryKey: ["/api/calls/list", dispatchCode] });
    },
    onError: (err: Error) => {
      const msg = err.message || "";
      setAddCallError(
        msg.toLowerCase().includes("geocod")
          ? "Could not find that address. Please try a more specific address."
          : msg || "Failed to add call"
      );
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (data: { callId: string; status: CallStatus }) => {
      const res = await fetch("/api/calls/update-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          callId: data.callId,
          dispatchCode: dispatchCode.trim(),
          status: data.status,
        }),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/calls/list", dispatchCode] });
    },
  });

  useEffect(() => {
    if (!authed || !mapToken || !mapContainerRef.current) return;
    if (mapRef.current) return;

    mapboxgl.accessToken = mapToken;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-73.985, 40.748],
      zoom: 12,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [authed, mapToken]);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const existingIds = new Set<string>();

    drivers.forEach((driver) => {
      const markerId = `driver-${driver.id}`;
      existingIds.add(markerId);

      const lastSeenMs = Date.now() - new Date(driver.lastSeen).getTime();
      const isStale = lastSeenMs > 12000;

      if (markersRef.current.has(markerId)) {
        const marker = markersRef.current.get(markerId)!;
        marker.setLngLat([driver.lng, driver.lat]);
        const el = marker.getElement();
        el.style.opacity = isStale ? "0.4" : "1";
      } else {
        const el = document.createElement("div");
        el.style.cssText = `width:16px;height:16px;background:hsl(0,0%,7%);border-radius:50%;border:3px solid hsl(50,100%,50%);opacity:${isStale ? "0.4" : "1"};`;

        const popup = new mapboxgl.Popup({ offset: 12, closeButton: false }).setHTML(
          `<div style="font-weight:700;font-size:13px;color:#111;">${driver.name}</div>`
        );

        const marker = new mapboxgl.Marker(el)
          .setLngLat([driver.lng, driver.lat])
          .setPopup(popup)
          .addTo(map);

        markersRef.current.set(markerId, marker);
      }
    });

    calls.forEach((call) => {
      if (call.status === "DONE") return;
      const markerId = `call-${call.id}`;
      existingIds.add(markerId);

      if (markersRef.current.has(markerId)) {
        return;
      }

      const el = document.createElement("div");
      el.style.cssText = `width:0;height:0;border-left:10px solid transparent;border-right:10px solid transparent;border-bottom:20px solid hsl(50,100%,50%);filter:drop-shadow(0 1px 2px rgba(0,0,0,.5));cursor:pointer;`;

      const popup = new mapboxgl.Popup({ offset: 15, closeButton: false }).setHTML(
        `<div style="font-weight:700;font-size:13px;color:#111;">${call.address}</div>`
      );

      const marker = new mapboxgl.Marker(el)
        .setLngLat([call.lng, call.lat])
        .setPopup(popup)
        .addTo(map);

      el.addEventListener("click", () => setSelectedCall(call));
      markersRef.current.set(markerId, marker);
    });

    markersRef.current.forEach((marker, id) => {
      if (!existingIds.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });
  }, [drivers, calls]);

  const handleLogin = async () => {
    setPasscodeError("");
    setCodeError("");

    try {
      const res = await fetch("/api/dispatch/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passcode: passcode.trim(),
          dispatchCode: dispatchCode.trim(),
        }),
      });
      const data = await res.json();

      if (res.ok && data.valid) {
        setAuthed(true);
        setPhase("dashboard");
      } else {
        const errorMsg = data.error || "";
        if (errorMsg.toLowerCase().includes("passcode")) {
          setPasscodeError("Wrong admin passcode");
        } else if (errorMsg.toLowerCase().includes("dispatch")) {
          setCodeError("Invalid dispatch code");
        } else {
          setPasscodeError("Wrong admin passcode");
          setCodeError("Invalid dispatch code");
        }
      }
    } catch {
      setPasscodeError("Connection failed. Please try again.");
    }
  };

  const handleAddCall = () => {
    if (!newAddress.trim()) {
      setAddCallError("Address is required");
      return;
    }
    setAddCallError("");
    addCallMutation.mutate({
      address: newAddress.trim(),
      notes: newNotes.trim() || undefined,
    });
  };

  const handleUpdateStatus = (callId: string, status: CallStatus) => {
    updateStatusMutation.mutate({ callId, status });
    if (selectedCall?.id === callId) {
      setSelectedCall((prev) => (prev ? { ...prev, status } : null));
    }
  };

  const focusOnMap = (lat: number, lng: number) => {
    mapRef.current?.flyTo({ center: [lng, lat], zoom: 15, duration: 800 });
  };

  const getTimeSince = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  if (phase === "splash") {
    return <SplashScreen message="Loading dispatch dashboard..." onComplete={() => setPhase("login")} />;
  }

  if (phase === "login") {
    return (
      <div
        className="min-h-screen flex flex-col px-6 py-10"
        style={{ backgroundColor: "hsl(50, 100%, 50%)", color: "hsl(0, 0%, 7%)" }}
        data-testid="dispatch-login"
      >
        <h1 className="text-4xl font-black tracking-tight mb-10" data-testid="text-dispatch-login-title">
          DISPATCH LOGIN
        </h1>

        <label className="text-xl font-bold mb-1">Admin Passcode</label>
        <div className="border-b-[3px] border-current mb-2">
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="w-full bg-transparent text-lg py-2 outline-none placeholder:text-black/40"
            placeholder="Enter passcode"
            data-testid="input-passcode"
          />
        </div>
        {passcodeError && (
          <div className="border-2 border-red-600 text-red-600 px-4 py-2 font-semibold text-sm mb-4" data-testid="text-passcode-error">
            {passcodeError}
          </div>
        )}

        <label className="text-xl font-bold mb-1 mt-6">Dispatch Code</label>
        <div className="border-b-[3px] border-current mb-2">
          <input
            type="text"
            value={dispatchCode}
            onChange={(e) => setDispatchCode(e.target.value.toUpperCase())}
            className="w-full bg-transparent text-lg py-2 outline-none placeholder:text-black/40 uppercase"
            placeholder="e.g. NYAC-TAXI-01"
            data-testid="input-login-dispatch-code"
          />
        </div>
        {codeError && (
          <div className="border-2 border-red-600 text-red-600 px-4 py-2 font-semibold text-sm" data-testid="text-code-error">
            {codeError}
          </div>
        )}

        <div className="flex-1" />

        <button
          onClick={handleLogin}
          className="w-full py-5 text-2xl font-black tracking-wide border-[4px] border-current bg-transparent hover:bg-black/5 active:bg-black/10 transition-colors mt-8"
          data-testid="button-enter-dashboard"
        >
          ENTER DASHBOARD
        </button>
      </div>
    );
  }

  return (
    <div
      className="h-screen flex flex-col"
      style={{ backgroundColor: "hsl(50, 100%, 50%)", color: "hsl(0, 0%, 7%)" }}
      data-testid="dispatch-dashboard"
    >
      {/* Header */}
      <header className="flex items-center justify-between gap-2 px-4 py-3 border-b-[3px] border-current shrink-0 flex-wrap">
        <TaxiLogo size="sm" />
        <h1 className="text-xl md:text-2xl font-black tracking-tight text-center flex-1" data-testid="text-dashboard-title">
          DISPATCH DASHBOARD
        </h1>
        <span className="text-sm font-bold whitespace-nowrap" data-testid="text-header-dispatch-code">
          Dispatch Code: {dispatchCode}
        </span>
      </header>

      {/* Content */}
      <div className="flex flex-1 min-h-0 flex-col lg:flex-row">
        {/* Left Panel */}
        <div className="lg:w-80 xl:w-96 border-r-0 lg:border-r-[3px] border-current overflow-y-auto shrink-0 flex flex-col">
          {/* Calls */}
          <div className="border-b-[3px] border-current p-4">
            <h2 className="text-2xl font-black mb-3" data-testid="text-calls-heading">CALLS</h2>
            <div className="space-y-2 max-h-48 lg:max-h-64 overflow-y-auto">
              {calls.length === 0 && (
                <p className="text-sm opacity-60 font-medium">No calls yet</p>
              )}
              {calls.map((call) => (
                <button
                  key={call.id}
                  onClick={() => {
                    setSelectedCall(call);
                    focusOnMap(call.lat, call.lng);
                  }}
                  className={`w-full text-left p-3 border-2 border-current hover:bg-black/5 transition-colors ${
                    selectedCall?.id === call.id ? "bg-black/10" : ""
                  }`}
                  data-testid={`button-call-${call.id}`}
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-bold text-sm truncate">{call.address}</span>
                    <span
                      className={`text-xs font-black px-2 py-0.5 border border-current ${
                        call.status === "NEW"
                          ? "bg-white/80"
                          : call.status === "ASSIGNED"
                          ? "bg-orange-200"
                          : "bg-green-200"
                      }`}
                    >
                      {call.status}
                    </span>
                  </div>
                  <p className="text-xs opacity-60 mt-1">
                    {new Date(call.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Drivers Live */}
          <div className="border-b-[3px] border-current p-4">
            <h2 className="text-xl font-black mb-2" data-testid="text-drivers-heading">DRIVERS LIVE</h2>
            <div className="space-y-1">
              {drivers.length === 0 && (
                <p className="text-sm opacity-60 font-medium">No drivers online</p>
              )}
              {drivers.map((driver) => {
                const lastSeenMs = Date.now() - new Date(driver.lastSeen).getTime();
                const isStale = lastSeenMs > 12000;
                return (
                  <button
                    key={driver.id}
                    onClick={() => focusOnMap(driver.lat, driver.lng)}
                    className={`w-full text-left py-1.5 px-2 hover:bg-black/5 transition-colors flex items-center gap-2 ${
                      isStale ? "opacity-40" : ""
                    }`}
                    data-testid={`button-driver-${driver.id}`}
                  >
                    <span className="w-3 h-3 rounded-full bg-current shrink-0" />
                    <span className="font-bold text-sm">{driver.name}</span>
                    <span className="text-xs opacity-60 ml-auto">
                      {isStale ? "(stale) " : ""}last seen {getTimeSince(driver.lastSeen)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add Call */}
          <div className="p-4">
            <h2 className="text-xl font-black mb-3" data-testid="text-add-call-heading">ADD CALL</h2>
            <label className="text-sm font-bold">Address</label>
            <input
              type="text"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              className="w-full border-2 border-current bg-transparent px-3 py-2 text-sm font-medium mb-3 outline-none"
              placeholder="e.g. 123 Main St, New York"
              data-testid="input-call-address"
            />
            <label className="text-sm font-bold">Notes</label>
            <input
              type="text"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              className="w-full border-2 border-current bg-transparent px-3 py-2 text-sm font-medium mb-3 outline-none"
              placeholder="Optional notes"
              data-testid="input-call-notes"
            />
            {addCallError && (
              <div className="text-red-600 text-sm font-semibold mb-2" data-testid="text-add-call-error">
                {addCallError}
              </div>
            )}
            <button
              onClick={handleAddCall}
              disabled={addCallMutation.isPending}
              className="w-full py-3 text-lg font-black tracking-wide border-[3px] border-current bg-transparent hover:bg-black/5 active:bg-black/10 transition-colors disabled:opacity-50"
              data-testid="button-drop-pin"
            >
              {addCallMutation.isPending ? "ADDING..." : "DROP PIN"}
            </button>
          </div>
        </div>

        {/* Map + Right Panel */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">
          {/* Map */}
          <div className="flex-1 relative border-b-[3px] lg:border-b-0 border-current min-h-[300px]">
            <div
              className="absolute top-3 left-3 z-10 px-3 py-1.5 font-black text-sm"
              style={{ backgroundColor: "hsl(50, 100%, 50%)" }}
            >
              LIVE MAP
            </div>
            <div ref={mapContainerRef} className="absolute inset-0" data-testid="map-container" />
            {mapError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <p className="text-red-600 font-bold text-sm text-center px-4" data-testid="text-map-error">
                  {mapError}
                </p>
              </div>
            )}
            {/* Legend */}
            <div
              className="absolute bottom-3 left-3 z-10 px-3 py-2 border-2 border-current text-xs font-bold space-y-1"
              style={{ backgroundColor: "hsl(50, 100%, 50%)" }}
            >
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-current" />
                <span>Drivers</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[10px] border-b-current" />
                <span>Calls</span>
              </div>
            </div>
          </div>

          {/* Call Details - Right Panel */}
          {selectedCall && (
            <div className="lg:w-72 xl:w-80 border-l-0 lg:border-l-[3px] border-current p-4 shrink-0 overflow-y-auto">
              <h2 className="text-xl font-black mb-4" data-testid="text-call-details-heading">
                CALL DETAILS
              </h2>

              <p className="font-bold text-sm mb-1">Address:</p>
              <p className="text-base font-medium mb-4" data-testid="text-call-detail-address">
                {selectedCall.address}
              </p>

              {selectedCall.notes && (
                <>
                  <p className="font-bold text-sm mb-1">Notes:</p>
                  <p className="text-base font-medium mb-4" data-testid="text-call-detail-notes">
                    {selectedCall.notes}
                  </p>
                </>
              )}

              <p className="font-bold text-sm mb-1">Created:</p>
              <p className="text-base font-medium mb-4" data-testid="text-call-detail-time">
                {new Date(selectedCall.createdAt).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>

              <p className="font-bold text-sm mb-2">Status:</p>
              <select
                value={selectedCall.status}
                onChange={(e) => handleUpdateStatus(selectedCall.id, e.target.value as CallStatus)}
                className="w-full border-2 border-current bg-transparent px-3 py-2 font-bold text-sm outline-none mb-6 appearance-none cursor-pointer"
                data-testid="select-call-status"
              >
                <option value="NEW">NEW</option>
                <option value="ASSIGNED">ASSIGNED</option>
                <option value="DONE">DONE</option>
              </select>

              {selectedCall.status !== "DONE" && (
                <button
                  onClick={() => handleUpdateStatus(selectedCall.id, "DONE")}
                  className="w-full py-3 text-lg font-black tracking-wide border-[3px] border-current bg-transparent hover:bg-black/5 active:bg-black/10 transition-colors"
                  data-testid="button-mark-done"
                >
                  MARK AS DONE
                </button>
              )}

              <button
                onClick={() => setSelectedCall(null)}
                className="w-full mt-3 py-2 text-sm font-bold underline opacity-60 hover:opacity-100"
                data-testid="button-close-details"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
