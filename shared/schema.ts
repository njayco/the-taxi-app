import { z } from "zod";

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

export const callSchema = z.object({
  id: z.string(),
  dispatchCode: z.string(),
  customerName: z.string(),
  customerPhone: z.string(),
  address: z.string(),
  notes: z.string().optional(),
  lat: z.number(),
  lng: z.number(),
  status: callStatusEnum,
  createdAt: z.string(),
});

export const createCallSchema = z.object({
  dispatchCode: z.string(),
  customerName: z.string().min(1, "Customer name is required"),
  customerPhone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  notes: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export const updateCallStatusSchema = z.object({
  callId: z.string(),
  dispatchCode: z.string(),
  status: callStatusEnum,
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
export type Call = z.infer<typeof callSchema>;
export type CallStatus = z.infer<typeof callStatusEnum>;
export type CreateCall = z.infer<typeof createCallSchema>;
export type UpdateCallStatus = z.infer<typeof updateCallStatusSchema>;
export type DispatchLogin = z.infer<typeof dispatchLoginSchema>;
