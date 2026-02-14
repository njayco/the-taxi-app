import { z } from "zod";
import { pgTable, text, integer, real, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const calls = pgTable("calls", {
  id: serial("id").primaryKey(),
  dispatchCode: text("dispatch_code").notNull(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  address: text("address").notNull(),
  notes: text("notes"),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  status: text("status").notNull().default("NEW"),
  farePriceCents: integer("fare_price_cents"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertCallSchema = createInsertSchema(calls).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCall = z.infer<typeof insertCallSchema>;
export type Call = typeof calls.$inferSelect;

export const driverSchema = z.object({
  id: z.string(),
  name: z.string(),
  dispatchCode: z.string(),
  lat: z.number(),
  lng: z.number(),
  lastSeen: z.string(),
});

export const driverUpdateSchema = z.object({
  driverId: z.string(),
  name: z.string(),
  dispatchCode: z.string(),
  lat: z.number(),
  lng: z.number(),
  timestamp: z.string(),
});

export const callStatusEnum = z.enum(["NEW", "ASSIGNED", "DONE"]);

export const createCallSchema = z.object({
  dispatchCode: z.string(),
  customerName: z.string().min(1, "Customer name is required"),
  customerPhone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  notes: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  farePriceCents: z.number().int().min(0).optional(),
});

export const updateCallStatusSchema = z.object({
  callId: z.number(),
  dispatchCode: z.string(),
  status: callStatusEnum,
  farePriceCents: z.number().int().min(0).optional(),
});

export const validateDispatchCodeSchema = z.object({
  dispatchCode: z.string().min(1, "Dispatch code is required"),
});

export const dispatchLoginSchema = z.object({
  passcode: z.string().min(1, "Admin passcode is required"),
  dispatchCode: z.string().min(1, "Dispatch code is required"),
});

export type Driver = z.infer<typeof driverSchema>;
export type DriverUpdate = z.infer<typeof driverUpdateSchema>;
export type CallStatus = z.infer<typeof callStatusEnum>;
export type CreateCall = z.infer<typeof createCallSchema>;
export type UpdateCallStatus = z.infer<typeof updateCallStatusSchema>;
export type DispatchLogin = z.infer<typeof dispatchLoginSchema>;
