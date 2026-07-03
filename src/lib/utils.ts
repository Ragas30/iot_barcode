import { randomBytes, randomUUID } from "crypto";

export function generateId() {
  return randomUUID();
}

export function generateTokenValue() {
  return randomBytes(24).toString("hex");
}

export function createExpiryDate(minutes = 1) {
  return new Date(Date.now() + minutes * 60_000).toISOString();
}

export function isExpired(isoDate: string) {
  return new Date(isoDate).getTime() <= Date.now();
}
