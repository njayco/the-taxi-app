import type { Driver, Call, CallStatus } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  upsertDriver(driver: Omit<Driver, "id"> & { id: string }): Promise<Driver>;
  getDriversByDispatchCode(dispatchCode: string): Promise<Driver[]>;
  createCall(call: Omit<Call, "id" | "createdAt">): Promise<Call>;
  getCallsByDispatchCode(dispatchCode: string): Promise<Call[]>;
  updateCallStatus(callId: string, dispatchCode: string, status: CallStatus): Promise<Call | undefined>;
}

export class MemStorage implements IStorage {
  private drivers: Map<string, Driver>;
  private calls: Map<string, Call>;

  constructor() {
    this.drivers = new Map();
    this.calls = new Map();
  }

  async upsertDriver(driver: Omit<Driver, "id"> & { id: string }): Promise<Driver> {
    const existing = this.drivers.get(driver.id);
    const updated: Driver = {
      id: driver.id,
      name: driver.name,
      dispatchCode: driver.dispatchCode,
      lat: driver.lat,
      lng: driver.lng,
      lastSeen: driver.lastSeen,
    };
    this.drivers.set(driver.id, updated);
    return updated;
  }

  async getDriversByDispatchCode(dispatchCode: string): Promise<Driver[]> {
    return Array.from(this.drivers.values()).filter(
      (d) => d.dispatchCode === dispatchCode
    );
  }

  async createCall(call: Omit<Call, "id" | "createdAt">): Promise<Call> {
    const id = randomUUID();
    const newCall: Call = {
      ...call,
      id,
      createdAt: new Date().toISOString(),
    };
    this.calls.set(id, newCall);
    return newCall;
  }

  async getCallsByDispatchCode(dispatchCode: string): Promise<Call[]> {
    return Array.from(this.calls.values())
      .filter((c) => c.dispatchCode === dispatchCode)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async updateCallStatus(callId: string, dispatchCode: string, status: CallStatus): Promise<Call | undefined> {
    const call = this.calls.get(callId);
    if (!call || call.dispatchCode !== dispatchCode) return undefined;
    call.status = status;
    this.calls.set(callId, call);
    return call;
  }
}

export const storage = new MemStorage();
