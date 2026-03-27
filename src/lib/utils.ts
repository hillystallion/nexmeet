import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 7; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(date: Date | string): string {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatDateTime(date: Date | string): string {
  return `${formatDate(date)} at ${formatTime(date)}`;
}

export const EVENT_TYPES = [
  "Meeting",
  "Interview",
  "Workshop",
  "Training",
  "Conference",
  "Seminar",
  "Other",
] as const;

export const EVENT_TYPE_COLORS: Record<string, string> = {
  Meeting: "bg-blue-500",
  Interview: "bg-purple-500",
  Workshop: "bg-emerald-500",
  Training: "bg-amber-500",
  Conference: "bg-rose-500",
  Seminar: "bg-cyan-500",
  Other: "bg-gray-500",
};
