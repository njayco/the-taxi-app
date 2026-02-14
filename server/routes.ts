import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { driverUpdateSchema, createCallSchema, updateCallStatusSchema, validateDispatchCodeSchema, dispatchLoginSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const DISPATCH_GROUP_CODE = process.env.DISPATCH_GROUP_CODE || "NYAC-TAXI-01";
  const DISPATCH_PASSCODE = process.env.DISPATCH_PASSCODE || "admin";
  const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN || "";

  app.get("/api/mapbox-token", (_req, res) => {
    res.json({ token: MAPBOX_TOKEN });
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
      return res.status(400).json({ error: "Invalid request" });
    }

    const { dispatchCode, address, notes } = result.data;

    if (dispatchCode !== DISPATCH_GROUP_CODE) {
      return res.status(403).json({ error: "Invalid dispatch code" });
    }

    let lat: number, lng: number;
    try {
      const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_TOKEN}&limit=1`;
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

    const call = await storage.createCall({
      dispatchCode,
      address,
      notes,
      lat,
      lng,
      status: "NEW",
    });

    res.json(call);
  });

  app.get("/api/calls/list", async (req, res) => {
    const dispatchCode = req.query.dispatchCode as string;
    if (!dispatchCode) {
      return res.status(400).json({ error: "dispatchCode required" });
    }
    const calls = await storage.getCallsByDispatchCode(dispatchCode);
    res.json(calls);
  });

  app.patch("/api/calls/update-status", async (req, res) => {
    const result = updateCallStatusSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const { callId, dispatchCode, status } = result.data;
    const call = await storage.updateCallStatus(callId, dispatchCode, status);

    if (!call) {
      return res.status(404).json({ error: "Call not found" });
    }

    res.json(call);
  });

  return httpServer;
}
