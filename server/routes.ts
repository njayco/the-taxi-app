import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { driverUpdateSchema, createCallSchema, updateCallStatusSchema, assignCallSchema, validateDispatchCodeSchema, dispatchLoginSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const DISPATCH_GROUP_CODE = process.env.DISPATCH_GROUP_CODE || "NYAC-TAXI-01";
  const DISPATCH_PASSCODE = process.env.DISPATCH_PASSCODE || "admin";
  const MAPBOX_TOKEN_PUBLIC = process.env.MAPBOX_TOKEN_PUBLIC || "";

  app.get("/api/mapbox-token", (_req, res) => {
    res.json({ token: MAPBOX_TOKEN_PUBLIC });
  });

  app.get("/api/geocode/autocomplete", async (req, res) => {
    const q = (req.query.q as string || "").trim();
    if (!q || q.length < 2) {
      return res.json({ suggestions: [] });
    }

    const token = MAPBOX_TOKEN_PUBLIC;
    if (!token) {
      return res.status(500).json({ error: "Mapbox token not configured" });
    }

    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json?access_token=${token}&autocomplete=true&country=us&types=address,poi,place&limit=5`;
      const geocodeRes = await fetch(url);
      const data = await geocodeRes.json();

      const suggestions = (data.features || []).map((f: any) => ({
        place_name: f.place_name,
        center: f.center,
        place_id: f.id,
      }));

      res.json({ suggestions });
    } catch {
      res.status(500).json({ error: "Geocoding request failed" });
    }
  });

  app.post("/api/validate-dispatch-code", (req, res) => {
    const result = validateDispatchCodeSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ valid: false, error: "Invalid request" });
    }
    const valid = result.data.dispatchCode === DISPATCH_GROUP_CODE;
    res.json({ valid });
  });

  app.post("/api/dispatch/login", (req, res) => {
    const result = dispatchLoginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ valid: false, error: "Invalid request" });
    }

    const { passcode, dispatchCode } = result.data;

    if (passcode !== DISPATCH_PASSCODE) {
      return res.status(401).json({ valid: false, error: "Wrong admin passcode" });
    }
    if (dispatchCode !== DISPATCH_GROUP_CODE) {
      return res.status(401).json({ valid: false, error: "Invalid dispatch code" });
    }

    res.json({ valid: true });
  });

  app.post("/api/driver/update-location", async (req, res) => {
    const result = driverUpdateSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const { driverId, name, dispatchCode, lat, lng, timestamp } = result.data;

    if (dispatchCode !== DISPATCH_GROUP_CODE) {
      return res.status(403).json({ error: "Invalid dispatch code" });
    }

    const driver = await storage.upsertDriver({
      id: driverId,
      name,
      dispatchCode,
      lat,
      lng,
      lastSeen: timestamp,
    });

    res.json(driver);
  });

  app.get("/api/driver/list", async (req, res) => {
    const dispatchCode = req.query.dispatchCode as string;
    if (!dispatchCode) {
      return res.status(400).json({ error: "dispatchCode required" });
    }
    const drivers = await storage.getDriversByDispatchCode(dispatchCode);
    res.json(drivers);
  });

  app.post("/api/calls/create", async (req, res) => {
    const result = createCallSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid request", details: result.error.flatten() });
    }

    const { dispatchCode, customerName, customerPhone, address, notes, lat: providedLat, lng: providedLng, farePriceCents } = result.data;

    if (dispatchCode !== DISPATCH_GROUP_CODE) {
      return res.status(403).json({ error: "Invalid dispatch code" });
    }

    let lat: number, lng: number;

    if (providedLat !== undefined && providedLng !== undefined) {
      lat = providedLat;
      lng = providedLng;
    } else {
      try {
        const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_TOKEN_PUBLIC}&limit=1`;
        const geocodeRes = await fetch(geocodeUrl);
        const geocodeData = await geocodeRes.json();

        if (!geocodeData.features || geocodeData.features.length === 0) {
          return res.status(400).json({ error: "Could not geocode address. Please try a more specific address." });
        }

        const [lngResult, latResult] = geocodeData.features[0].center;
        lat = latResult;
        lng = lngResult;
      } catch {
        return res.status(500).json({ error: "Geocoding failed" });
      }
    }

    try {
      const call = await storage.createCall({
        dispatchCode,
        customerName,
        customerPhone,
        address,
        notes: notes || null,
        lat,
        lng,
        status: "NEW",
        farePriceCents: farePriceCents || null,
      });

      res.json(call);
    } catch (err) {
      console.error("Failed to create call:", err);
      res.status(500).json({ error: "Failed to save call" });
    }
  });

  app.get("/api/calls/list", async (req, res) => {
    const dispatchCode = req.query.dispatchCode as string;
    if (!dispatchCode) {
      return res.status(400).json({ error: "dispatchCode required" });
    }

    const status = (req.query.status as string) || "ALL";
    const range = (req.query.range as string) || "ALL_TIME";
    const startDateParam = req.query.startDate as string;
    const endDateParam = req.query.endDate as string;

    let startDate: string | undefined;
    let endDate: string | undefined;

    const now = new Date();

    switch (range) {
      case "TODAY": {
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        startDate = today.toISOString();
        break;
      }
      case "LAST_7_DAYS": {
        const d = new Date(now);
        d.setDate(d.getDate() - 7);
        startDate = d.toISOString();
        break;
      }
      case "LAST_30_DAYS": {
        const d = new Date(now);
        d.setDate(d.getDate() - 30);
        startDate = d.toISOString();
        break;
      }
      case "LAST_6_MONTHS": {
        const d = new Date(now);
        d.setMonth(d.getMonth() - 6);
        startDate = d.toISOString();
        break;
      }
      case "LAST_12_MONTHS": {
        const d = new Date(now);
        d.setFullYear(d.getFullYear() - 1);
        startDate = d.toISOString();
        break;
      }
      case "CUSTOM": {
        if (startDateParam) startDate = startDateParam;
        if (endDateParam) endDate = endDateParam;
        break;
      }
      case "ALL_TIME":
      default:
        break;
    }

    try {
      const callsList = await storage.getCalls({
        dispatchCode,
        status,
        startDate,
        endDate,
      });
      res.json(callsList);
    } catch (err) {
      console.error("Failed to fetch calls:", err);
      res.status(500).json({ error: "Failed to fetch calls" });
    }
  });

  app.patch("/api/calls/assign", async (req, res) => {
    const result = assignCallSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid request", details: result.error.flatten() });
    }

    const { callId, dispatchCode, driverId, driverName } = result.data;

    if (dispatchCode !== DISPATCH_GROUP_CODE) {
      return res.status(403).json({ error: "Invalid dispatch code" });
    }

    try {
      const call = await storage.assignCall(callId, dispatchCode, driverId, driverName);
      if (!call) {
        return res.status(404).json({ error: "Call not found" });
      }
      res.json(call);
    } catch (err) {
      console.error("Failed to assign call:", err);
      res.status(500).json({ error: "Failed to assign call" });
    }
  });

  app.get("/api/driver/stats", async (req, res) => {
    const dispatchCode = req.query.dispatchCode as string;
    const driverId = req.query.driverId as string;
    if (!dispatchCode || !driverId) {
      return res.status(400).json({ error: "dispatchCode and driverId required" });
    }

    const status = (req.query.status as string) || "ALL";
    const range = (req.query.range as string) || "ALL_TIME";
    const startDateParam = req.query.startDate as string;
    const endDateParam = req.query.endDate as string;

    let startDate: string | undefined;
    let endDate: string | undefined;
    const now = new Date();

    switch (range) {
      case "TODAY": {
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        startDate = today.toISOString();
        break;
      }
      case "LAST_7_DAYS": {
        const d = new Date(now);
        d.setDate(d.getDate() - 7);
        startDate = d.toISOString();
        break;
      }
      case "LAST_30_DAYS": {
        const d = new Date(now);
        d.setDate(d.getDate() - 30);
        startDate = d.toISOString();
        break;
      }
      case "LAST_6_MONTHS": {
        const d = new Date(now);
        d.setMonth(d.getMonth() - 6);
        startDate = d.toISOString();
        break;
      }
      case "LAST_12_MONTHS": {
        const d = new Date(now);
        d.setFullYear(d.getFullYear() - 1);
        startDate = d.toISOString();
        break;
      }
      case "CUSTOM": {
        if (startDateParam) startDate = startDateParam;
        if (endDateParam) endDate = endDateParam;
        break;
      }
      case "ALL_TIME":
      default:
        break;
    }

    try {
      const driverCalls = await storage.getCallsForDriver(driverId, {
        dispatchCode,
        status,
        startDate,
        endDate,
      });

      const tripsAssigned = driverCalls.length;
      const revenue = driverCalls.reduce((sum, c) => sum + (c.farePriceCents || 0), 0);

      res.json({ tripsAssigned, revenue });
    } catch (err) {
      console.error("Failed to get driver stats:", err);
      res.status(500).json({ error: "Failed to get driver stats" });
    }
  });

  app.patch("/api/calls/update-status", async (req, res) => {
    const result = updateCallStatusSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid request", details: result.error.flatten() });
    }

    const { callId, dispatchCode, status, farePriceCents } = result.data;

    try {
      const call = await storage.updateCallStatus(callId, dispatchCode, status, farePriceCents);

      if (!call) {
        return res.status(404).json({ error: "Call not found" });
      }

      res.json(call);
    } catch (err) {
      console.error("Failed to update call:", err);
      res.status(500).json({ error: "Failed to update call" });
    }
  });

  return httpServer;
}
