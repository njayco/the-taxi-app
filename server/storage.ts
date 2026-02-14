import type { Driver, Call, CallStatus, InsertCall } from "@shared/schema";
import { calls } from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc } from "drizzle-orm";

export interface CallFilters {
  dispatchCode: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface IStorage {
  upsertDriver(driver: Omit<Driver, "id"> & { id: string }): Promise<Driver>;
  getDriversByDispatchCode(dispatchCode: string): Promise<Driver[]>;
  createCall(data: InsertCall): Promise<Call>;
  getCalls(filters: CallFilters): Promise<Call[]>;
  updateCallStatus(callId: number, dispatchCode: string, status: CallStatus, farePriceCents?: number): Promise<Call | undefined>;
}

class DriverMemStore {
  private drivers: Map<string, Driver> = new Map();

  upsert(driver: Omit<Driver, "id"> & { id: string }): Driver {
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

  getByDispatchCode(dispatchCode: string): Driver[] {
    return Array.from(this.drivers.values()).filter(
      (d) => d.dispatchCode === dispatchCode
    );
  }
}

const driverStore = new DriverMemStore();

export class DatabaseStorage implements IStorage {
  async upsertDriver(driver: Omit<Driver, "id"> & { id: string }): Promise<Driver> {
    return driverStore.upsert(driver);
  }

  async getDriversByDispatchCode(dispatchCode: string): Promise<Driver[]> {
    return driverStore.getByDispatchCode(dispatchCode);
  }

  async createCall(data: InsertCall): Promise<Call> {
    const [call] = await db.insert(calls).values(data).returning();
    return call;
  }

  async getCalls(filters: CallFilters): Promise<Call[]> {
    const conditions = [eq(calls.dispatchCode, filters.dispatchCode)];

    if (filters.status && filters.status !== "ALL") {
      if (filters.status === "NEW") {
        conditions.push(eq(calls.status, "NEW"));
      } else if (filters.status === "COMPLETED") {
        conditions.push(eq(calls.status, "DONE"));
      } else {
        conditions.push(eq(calls.status, filters.status));
      }
    }

    if (filters.startDate) {
      conditions.push(gte(calls.createdAt, new Date(filters.startDate)));
    }
    if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      conditions.push(lte(calls.createdAt, end));
    }

    return db
      .select()
      .from(calls)
      .where(and(...conditions))
      .orderBy(desc(calls.createdAt));
  }

  async updateCallStatus(callId: number, dispatchCode: string, status: CallStatus, farePriceCents?: number): Promise<Call | undefined> {
    const updateData: Record<string, any> = {
      status,
      updatedAt: new Date(),
    };

    if (status === "DONE") {
      updateData.completedAt = new Date();
    }

    if (farePriceCents !== undefined) {
      updateData.farePriceCents = farePriceCents;
    }

    const [updated] = await db
      .update(calls)
      .set(updateData)
      .where(and(eq(calls.id, callId), eq(calls.dispatchCode, dispatchCode)))
      .returning();

    return updated || undefined;
  }
}

export const storage = new DatabaseStorage();
