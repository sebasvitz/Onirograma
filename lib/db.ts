import fs from "fs";
import path from "path";
import type { OniricCase } from "@/types";

const DATA_FILE = path.join(process.cwd(), "data", "cases.json");

function ensureDataFile(): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), "utf-8");
  }
}

export function getAllCases(): OniricCase[] {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw) as OniricCase[];
}

export function getCaseById(id: string): OniricCase | null {
  const cases = getAllCases();
  return cases.find((c) => c.id === id) ?? null;
}

export function saveCase(oniricCase: OniricCase): void {
  const cases = getAllCases();
  cases.unshift(oniricCase);
  fs.writeFileSync(DATA_FILE, JSON.stringify(cases, null, 2), "utf-8");
}

export function deleteCaseById(id: string): boolean {
  const cases = getAllCases();
  const filtered = cases.filter((c) => c.id !== id);
  if (filtered.length === cases.length) return false;
  fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2), "utf-8");
  return true;
}
