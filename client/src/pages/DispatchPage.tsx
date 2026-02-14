import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { SplashScreen } from "@/components/SplashScreen";
import { TaxiLogo } from "@/components/TaxiLogo";
import type { Driver, Call, CallStatus } from "@shared/schema";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

type DispatchPhase = "splash" | "login" | "dashboard";

interface AddressSuggestion {
  place_name: string;
  center: [number, number];
  place_id: string;
}

interface SelectedAddress {
  address: string;
  lat: number;
  lng: number;
  placeId: string;
}

type DateRange = "TODAY" | "LAST_7_DAYS" | "LAST_30_DAYS" | "LAST_6_MONTHS" | "LAST_12_MONTHS" | "ALL_TIME" | "CUSTOM";
type StatusFilter = "ALL" | "NEW" | "COMPLETED";

const DATE_RANGE_LABELS: Record<DateRange, string> = {
  TODAY: "Today",
  LAST_7_DAYS: "Last 7 Days",
  LAST_30_DAYS: "Last 30 Days",
  LAST_6_MONTHS: "Last 6 Months",
  LAST_12_MONTHS: "Last 12 Months",
  ALL_TIME: "All Time",
  CUSTOM: "Custom",
};

const STATUS_LABELS: Record<StatusFilter, string> = {
  ALL: "All",
  NEW: "New",
  COMPLETED: "Completed",
};

function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7;
}

function formatFare(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function parseFareInput(value: string): number | null {
  const cleaned = value.replace(/[^0-9.]/g, "");
  const num = parseFloat(cleaned);
  if (isNaN(num) || num < 0) return null;
  return Math.round(num * 100);
}

function getFiltersFromUrl(): { status: StatusFilter; range: DateRange; startDate: string; endDate: string } {
  const params = new URLSearchParams(window.location.search);
  return {
    status: (params.get("status") as StatusFilter) || "ALL",
    range: (params.get("range") as DateRange) || "TODAY",
    startDate: params.get("startDate") || "",
    endDate: params.get("endDate") || "",
  };
}

function updateUrlFilters(filters: { status: StatusFilter; range: DateRange; startDate: string; endDate: string }) {
  const params = new URLSearchParams(window.location.search);
  params.set("status", filters.status);
  params.set("range", filters.range);
  if (filters.range === "CUSTOM" && filters.startDate) {
    params.set("startDate", filters.startDate);
  } else {
    params.delete("startDate");
  }
  if (filters.range === "CUSTOM" && filters.endDate) {
    params.set("endDate", filters.endDate);
  } else {
    params.delete("endDate");
  }
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, "", newUrl);
}

export default function DispatchPage() {
  const [phase, setPhase] = useState<DispatchPhase>("splash");
  const [passcode, setPasscode] = useState("");
  const [dispatchCode, setDispatchCode] = useState("");
  const [passcodeError, setPasscodeError] = useState("");
  const [codeError, setCodeError] = useState("");
  const [authed, setAuthed] = useState(false);

  const [selectedCall, setSelectedCall] = useState<Call | null>(null);

  const urlFilters = getFiltersFromUrl();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(urlFilters.status);
  const [dateRange, setDateRange] = useState<DateRange>(urlFilters.range);
  const [customStartDate, setCustomStartDate] = useState(urlFilters.startDate);
  const [customEndDate, setCustomEndDate] = useState(urlFilters.endDate);

  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [newFare, setNewFare] = useState("");
  const [addCallError, setAddCallError] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<SelectedAddress | null>(null);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previewMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const [mapToken, setMapToken] = useState("");
  const [mapError, setMapError] = useState("");

  useEffect(() => {
    updateUrlFilters({ status: statusFilter, range: dateRange, startDate: customStartDate, endDate: customEndDate });
  }, [statusFilter, dateRange, customStartDate, customEndDate]);

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

  const buildQueryString = () => {
    const params = new URLSearchParams();
    params.set("dispatchCode", dispatchCode);
    params.set("status", statusFilter);
    params.set("range", dateRange);
    if (dateRange === "CUSTOM") {
      if (customStartDate) params.set("startDate", customStartDate);
      if (customEndDate) params.set("endDate", customEndDate);
    }
    return params.toString();
  };

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

  const callsQueryKey = ["/api/calls/list", dispatchCode, statusFilter, dateRange, customStartDate, customEndDate];

  const { data: calls = [], isLoading: callsLoading } = useQuery<Call[]>({
    queryKey: callsQueryKey,
    queryFn: async () => {
      const res = await fetch(`/api/calls/list?${buildQueryString()}`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: authed && !!dispatchCode,
    refetchInterval: 3000,
  });

  const sortedCalls = [...calls].sort((a, b) => {
    if (a.status === "DONE" && b.status !== "DONE") return 1;
    if (a.status !== "DONE" && b.status === "DONE") return -1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const activeCalls = calls.filter((c) => c.status !== "DONE");
  const completedCalls = calls.filter((c) => c.status === "DONE");

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setSuggestionsLoading(true);
    try {
      const res = await fetch(`/api/geocode/autocomplete?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSuggestions(data.suggestions || []);
      setShowSuggestions(true);
      setHighlightedIndex(-1);
    } catch {
      setSuggestions([]);
    } finally {
      setSuggestionsLoading(false);
    }
  }, []);

  const handleAddressInput = (value: string) => {
    setNewAddress(value);
    setSelectedAddress(null);
    setAddCallError("");

    if (previewMarkerRef.current) {
      previewMarkerRef.current.remove();
      previewMarkerRef.current = null;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 300);
  };

  const selectSuggestion = (suggestion: AddressSuggestion) => {
    const [lng, lat] = suggestion.center;
    setNewAddress(suggestion.place_name);
    setSelectedAddress({
      address: suggestion.place_name,
      lat,
      lng,
      placeId: suggestion.place_id,
    });
    setSuggestions([]);
    setShowSuggestions(false);
    setAddCallError("");

    if (previewMarkerRef.current) {
      previewMarkerRef.current.remove();
    }
    if (mapRef.current) {
      const el = document.createElement("div");
      el.style.cssText = "width:24px;height:24px;border-left:12px solid transparent;border-right:12px solid transparent;border-bottom:24px solid hsl(50,100%,50%);filter:drop-shadow(0 2px 4px rgba(0,0,0,.5));opacity:0.7;box-sizing:border-box;";
      previewMarkerRef.current = new mapboxgl.Marker({ element: el, anchor: "bottom" })
        .setLngLat([lng, lat])
        .addTo(mapRef.current);
      mapRef.current.flyTo({ center: [lng, lat], zoom: 15, duration: 800 });
    }
  };

  const handleAddressKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[highlightedIndex]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const addCallMutation = useMutation({
    mutationFn: async (data: { customerName: string; customerPhone: string; address: string; notes?: string; lat: number; lng: number; farePriceCents?: number }) => {
      const res = await fetch("/api/calls/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dispatchCode: dispatchCode.trim(),
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          address: data.address,
          notes: data.notes,
          lat: data.lat,
          lng: data.lng,
          farePriceCents: data.farePriceCents,
        }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to add call");
      }
      return res.json();
    },
    onSuccess: () => {
      setNewCustomerName("");
      setNewCustomerPhone("");
      setNewAddress("");
      setNewNotes("");
      setNewFare("");
      setAddCallError("");
      setSelectedAddress(null);
      if (previewMarkerRef.current) {
        previewMarkerRef.current.remove();
        previewMarkerRef.current = null;
      }
      queryClient.invalidateQueries({ queryKey: ["/api/calls/list"] });
    },
    onError: (err: Error) => {
      setAddCallError(err.message || "Failed to add call");
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (data: { callId: number; status: CallStatus; farePriceCents?: number }) => {
      const res = await fetch("/api/calls/update-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          callId: data.callId,
          dispatchCode: dispatchCode.trim(),
          status: data.status,
          farePriceCents: data.farePriceCents,
        }),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/calls/list"] });
    },
  });

  useEffect(() => {
    if (phase !== "dashboard" || !authed || !mapToken || !mapContainerRef.current) return;
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
  }, [phase, authed, mapToken]);

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
      const markerId = `call-${call.id}`;
      existingIds.add(markerId);
      const isCompleted = call.status === "DONE";

      if (markersRef.current.has(markerId)) {
        const marker = markersRef.current.get(markerId)!;
        const el = marker.getElement();
        const pinColor = isCompleted ? "hsl(140,70%,40%)" : "hsl(50,100%,50%)";
        el.style.cssText = `width:20px;height:20px;border-left:10px solid transparent;border-right:10px solid transparent;border-bottom:20px solid ${pinColor};filter:drop-shadow(0 1px 2px rgba(0,0,0,.5));cursor:pointer;box-sizing:border-box;`;
      } else {
        const pinColor = isCompleted ? "hsl(140,70%,40%)" : "hsl(50,100%,50%)";
        const el = document.createElement("div");
        el.style.cssText = `width:20px;height:20px;border-left:10px solid transparent;border-right:10px solid transparent;border-bottom:20px solid ${pinColor};filter:drop-shadow(0 1px 2px rgba(0,0,0,.5));cursor:pointer;box-sizing:border-box;`;

        const fareText = call.farePriceCents ? ` | ${formatFare(call.farePriceCents)}` : "";
        const popupContent = `<div style="font-weight:700;font-size:13px;color:#111;">${call.customerName}${fareText}</div><div style="font-size:12px;color:#333;">${call.address}</div>`;
        const popup = new mapboxgl.Popup({ offset: 15, closeButton: false }).setHTML(popupContent);

        const marker = new mapboxgl.Marker({ element: el, anchor: "bottom" })
          .setLngLat([call.lng, call.lat])
          .setPopup(popup)
          .addTo(map);

        el.addEventListener("click", () => setSelectedCall(call));
        markersRef.current.set(markerId, marker);
      }
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
    if (!newCustomerName.trim()) {
      setAddCallError("Customer name is required");
      return;
    }
    if (!newCustomerPhone.trim() || !isValidPhone(newCustomerPhone)) {
      setAddCallError("A valid phone number is required");
      return;
    }
    if (!newAddress.trim()) {
      setAddCallError("Address is required");
      return;
    }
    if (!selectedAddress) {
      setAddCallError("Please select an address from the suggestions list.");
      return;
    }

    let farePriceCents: number | undefined;
    if (newFare.trim()) {
      const parsed = parseFareInput(newFare);
      if (parsed === null) {
        setAddCallError("Invalid fare price. Enter a valid amount (e.g., 12.50).");
        return;
      }
      farePriceCents = parsed;
    }

    setAddCallError("");
    addCallMutation.mutate({
      customerName: newCustomerName.trim(),
      customerPhone: newCustomerPhone.trim(),
      address: selectedAddress.address,
      notes: newNotes.trim() || undefined,
      lat: selectedAddress.lat,
      lng: selectedAddress.lng,
      farePriceCents,
    });
  };

  const handleUpdateStatus = (callId: number, status: CallStatus, farePriceCents?: number) => {
    updateStatusMutation.mutate({ callId, status, farePriceCents });
    if (selectedCall?.id === callId) {
      setSelectedCall((prev) => (prev ? { ...prev, status } : null));
    }
  };

  const handlePickedUp = (callId: number) => {
    handleUpdateStatus(callId, "DONE");
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
          className="w-full py-5 text-2xl font-black tracking-wide border-[4px] border-current bg-transparent transition-colors mt-8"
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
          {/* Unified Filter Bar */}
          <div className="px-4 py-3 border-b-[3px] border-current space-y-2">
            <h3 className="text-sm font-black tracking-wide" data-testid="text-filters-heading">FILTERS</h3>
            <div className="flex gap-2 flex-wrap">
              {(Object.keys(STATUS_LABELS) as StatusFilter[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className="px-3 py-1.5 text-xs font-black border-2 border-current transition-colors"
                  style={{
                    backgroundColor: statusFilter === s ? "hsl(0, 0%, 7%)" : "transparent",
                    color: statusFilter === s ? "hsl(50, 100%, 50%)" : "inherit",
                  }}
                  data-testid={`button-filter-status-${s.toLowerCase()}`}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>

            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as DateRange)}
              className="w-full border-2 border-current bg-transparent px-3 py-1.5 font-bold text-xs outline-none appearance-none cursor-pointer"
              data-testid="select-date-range"
            >
              {(Object.keys(DATE_RANGE_LABELS) as DateRange[]).map((r) => (
                <option key={r} value={r}>{DATE_RANGE_LABELS[r]}</option>
              ))}
            </select>

            {dateRange === "CUSTOM" && (
              <div className="flex gap-2">
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="flex-1 border-2 border-current bg-transparent px-2 py-1 text-xs font-bold outline-none"
                  data-testid="input-custom-start-date"
                />
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="flex-1 border-2 border-current bg-transparent px-2 py-1 text-xs font-bold outline-none"
                  data-testid="input-custom-end-date"
                />
              </div>
            )}
          </div>

          {/* Stats Header */}
          <div className="flex items-center gap-4 px-4 py-2 border-b-[3px] border-current flex-wrap">
            <div className="flex items-center gap-2" data-testid="stats-active-calls">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(50,100%,50%)", border: "2px solid currentColor" }} />
              <span className="text-sm font-black">Active: {activeCalls.length}</span>
            </div>
            <div className="flex items-center gap-2" data-testid="stats-completed-calls">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(140,70%,40%)" }} />
              <span className="text-sm font-black">Completed: {completedCalls.length}</span>
            </div>
            {callsLoading && (
              <span className="text-xs font-bold opacity-50 ml-auto">Loading...</span>
            )}
          </div>

          {/* Calls */}
          <div className="border-b-[3px] border-current p-4">
            <h2 className="text-2xl font-black mb-3" data-testid="text-calls-heading">CALLS</h2>
            <div className="space-y-2 max-h-48 lg:max-h-[400px] overflow-y-auto">
              {sortedCalls.length === 0 && (
                <p className="text-sm opacity-60 font-medium">{callsLoading ? "Loading calls..." : "No calls found"}</p>
              )}
              {sortedCalls.map((call) => {
                const isCompleted = call.status === "DONE";
                return (
                  <div
                    key={call.id}
                    className={`w-full text-left p-3 border-2 border-current transition-colors ${
                      isCompleted ? "opacity-60" : ""
                    } ${selectedCall?.id === call.id ? "bg-black/10" : ""}`}
                    style={isCompleted ? { backgroundColor: "hsla(140,60%,70%,0.3)" } : undefined}
                    data-testid={`card-call-${call.id}`}
                  >
                    <button
                      onClick={() => {
                        setSelectedCall(call);
                        focusOnMap(call.lat, call.lng);
                      }}
                      className="w-full text-left"
                      data-testid={`button-call-${call.id}`}
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-0 h-0 shrink-0"
                            style={{
                              borderLeft: "6px solid transparent",
                              borderRight: "6px solid transparent",
                              borderBottom: `12px solid ${isCompleted ? "hsl(140,70%,40%)" : "currentColor"}`,
                            }}
                          />
                          <span className="font-black text-sm" data-testid={`text-call-name-${call.id}`}>{call.customerName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {call.farePriceCents && (
                            <span className="text-xs font-black px-2 py-0.5 border border-current bg-white/60" data-testid={`text-call-fare-${call.id}`}>
                              {formatFare(call.farePriceCents)}
                            </span>
                          )}
                          <span
                            className={`text-xs font-black px-2 py-0.5 border border-current ${
                              call.status === "NEW"
                                ? "bg-white/80"
                                : call.status === "ASSIGNED"
                                ? "bg-orange-200"
                                : "bg-green-300"
                            }`}
                            data-testid={`badge-call-status-${call.id}`}
                          >
                            {isCompleted ? "COMPLETED" : call.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs font-bold mt-1" data-testid={`text-call-phone-${call.id}`}>{call.customerPhone}</p>
                      <p className="text-xs opacity-70 mt-0.5 truncate" data-testid={`text-call-address-${call.id}`}>{call.address}</p>
                      <p className="text-xs opacity-50 mt-0.5">
                        {new Date(call.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                      </p>
                    </button>

                    {!isCompleted && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePickedUp(call.id);
                        }}
                        className="mt-2 w-full py-2 text-sm font-black tracking-wide border-2 border-current transition-colors"
                        style={{ backgroundColor: "hsl(140,70%,85%)" }}
                        data-testid={`button-picked-up-${call.id}`}
                      >
                        PICKED UP
                      </button>
                    )}

                    {isCompleted && (
                      <div
                        className="mt-2 w-full py-2 text-sm font-black tracking-wide border-2 text-center opacity-70"
                        style={{ backgroundColor: "hsl(140,70%,40%)", color: "white", borderColor: "hsl(140,70%,30%)" }}
                        data-testid={`badge-completed-${call.id}`}
                      >
                        COMPLETED
                      </div>
                    )}
                  </div>
                );
              })}
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
                    className={`w-full text-left py-1.5 px-2 transition-colors flex items-center gap-2 ${
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

            <label className="text-sm font-bold">Customer Name</label>
            <input
              type="text"
              value={newCustomerName}
              onChange={(e) => { setNewCustomerName(e.target.value); setAddCallError(""); }}
              className="w-full border-2 border-current bg-transparent px-3 py-2 text-sm font-medium mb-3 outline-none"
              placeholder="Enter customer name"
              data-testid="input-customer-name"
            />

            <label className="text-sm font-bold">Phone Number</label>
            <input
              type="tel"
              value={newCustomerPhone}
              onChange={(e) => {
                setNewCustomerPhone(formatPhoneNumber(e.target.value));
                setAddCallError("");
              }}
              className="w-full border-2 border-current bg-transparent px-3 py-2 text-sm font-medium mb-3 outline-none"
              placeholder="(555) 123-4567"
              data-testid="input-customer-phone"
            />

            <label className="text-sm font-bold">Address</label>
            <div className="relative">
              <input
                type="text"
                value={newAddress}
                onChange={(e) => handleAddressInput(e.target.value)}
                onKeyDown={handleAddressKeyDown}
                onFocus={() => { if (suggestions.length > 0 && !selectedAddress) setShowSuggestions(true); }}
                onBlur={() => { setTimeout(() => setShowSuggestions(false), 200); }}
                className={`w-full border-2 border-current bg-transparent px-3 py-2 text-sm font-medium outline-none ${selectedAddress ? "bg-green-100/30" : ""}`}
                placeholder="Start typing an address..."
                data-testid="input-call-address"
              />
              {selectedAddress && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-green-700 text-xs font-bold">
                  Selected
                </span>
              )}
              {showSuggestions && (
                <div
                  ref={suggestionsRef}
                  className="absolute left-0 right-0 top-full z-50 border-2 border-current border-t-0 max-h-48 overflow-y-auto"
                  style={{ backgroundColor: "hsl(50, 100%, 85%)" }}
                  data-testid="address-suggestions"
                >
                  {suggestionsLoading && (
                    <div className="px-3 py-2 text-sm font-medium opacity-60">Searching...</div>
                  )}
                  {!suggestionsLoading && suggestions.length === 0 && newAddress.length >= 2 && (
                    <div className="px-3 py-2 text-sm font-medium opacity-60">No results found</div>
                  )}
                  {suggestions.map((s, i) => (
                    <button
                      key={s.place_id}
                      onMouseDown={(e) => { e.preventDefault(); selectSuggestion(s); }}
                      className={`w-full text-left px-3 py-2 text-sm font-medium cursor-pointer transition-colors ${
                        i === highlightedIndex ? "bg-black/10" : ""
                      }`}
                      data-testid={`suggestion-${i}`}
                    >
                      {s.place_name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="mb-3" />

            <label className="text-sm font-bold">Fare Price</label>
            <div className="relative mb-3">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold opacity-60">$</span>
              <input
                type="text"
                value={newFare}
                onChange={(e) => { setNewFare(e.target.value); setAddCallError(""); }}
                className="w-full border-2 border-current bg-transparent pl-7 pr-3 py-2 text-sm font-medium outline-none"
                placeholder="0.00"
                data-testid="input-fare-price"
              />
            </div>

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
              className="w-full py-3 text-lg font-black tracking-wide border-[3px] border-current bg-transparent transition-colors disabled:opacity-50"
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
                <span>Active Calls</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent" style={{ borderBottom: "10px solid hsl(140,70%,40%)" }} />
                <span>Completed</span>
              </div>
            </div>
          </div>

          {/* Call Details - Right Panel */}
          {selectedCall && (
            <div className="lg:w-72 xl:w-80 border-l-0 lg:border-l-[3px] border-current p-4 shrink-0 overflow-y-auto">
              <h2 className="text-xl font-black mb-4" data-testid="text-call-details-heading">
                CALL DETAILS
              </h2>

              <p className="font-bold text-sm mb-1">Customer:</p>
              <p className="text-base font-medium mb-2" data-testid="text-call-detail-name">
                {selectedCall.customerName}
              </p>

              <p className="font-bold text-sm mb-1">Phone:</p>
              <p className="text-base font-medium mb-2" data-testid="text-call-detail-phone">
                {selectedCall.customerPhone}
              </p>

              <p className="font-bold text-sm mb-1">Address:</p>
              <p className="text-base font-medium mb-2" data-testid="text-call-detail-address">
                {selectedCall.address}
              </p>

              {selectedCall.farePriceCents && (
                <>
                  <p className="font-bold text-sm mb-1">Fare:</p>
                  <p className="text-base font-black mb-2" data-testid="text-call-detail-fare">
                    {formatFare(selectedCall.farePriceCents)}
                  </p>
                </>
              )}

              {selectedCall.notes && (
                <>
                  <p className="font-bold text-sm mb-1">Notes:</p>
                  <p className="text-base font-medium mb-2" data-testid="text-call-detail-notes">
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

              {selectedCall.completedAt && (
                <>
                  <p className="font-bold text-sm mb-1">Completed:</p>
                  <p className="text-base font-medium mb-4" data-testid="text-call-detail-completed-time">
                    {new Date(selectedCall.completedAt).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </>
              )}

              <p className="font-bold text-sm mb-2">Status:</p>
              <select
                value={selectedCall.status}
                onChange={(e) => handleUpdateStatus(selectedCall.id, e.target.value as CallStatus)}
                className="w-full border-2 border-current bg-transparent px-3 py-2 font-bold text-sm outline-none mb-4 appearance-none cursor-pointer"
                disabled={selectedCall.status === "DONE"}
                data-testid="select-call-status"
              >
                <option value="NEW">NEW</option>
                <option value="ASSIGNED">ASSIGNED</option>
                <option value="DONE">COMPLETED</option>
              </select>

              {selectedCall.status !== "DONE" ? (
                <button
                  onClick={() => handlePickedUp(selectedCall.id)}
                  className="w-full py-3 text-lg font-black tracking-wide border-[3px] border-current transition-colors"
                  style={{ backgroundColor: "hsl(140,70%,85%)" }}
                  data-testid="button-picked-up-detail"
                >
                  PICKED UP
                </button>
              ) : (
                <div
                  className="w-full py-3 text-lg font-black tracking-wide border-[3px] text-center"
                  style={{ backgroundColor: "hsl(140,70%,40%)", color: "white", borderColor: "hsl(140,70%,30%)" }}
                  data-testid="badge-completed-detail"
                >
                  COMPLETED
                </div>
              )}

              <button
                onClick={() => setSelectedCall(null)}
                className="w-full mt-3 py-2 text-sm font-bold underline opacity-60"
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
