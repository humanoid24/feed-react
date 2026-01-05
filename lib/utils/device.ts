// lib/utils/device.ts
import { v4 as uuidv4 } from "uuid";

export function getDeviceId(): string | null {
  if (typeof window === "undefined") return null;

  let id = localStorage.getItem("device_id");
  if (!id) {
    id = uuidv4();
    localStorage.setItem("device_id", id);
  }

  return id;
}
