// src/utils/ethiopianDate.js
import { toEthiopian, toGregorian } from "ethiopian-date";

export const ETHIOPIAN_MONTHS = [
  "Meskerem",
  "Tikimt",
  "Hidar",
  "Tahsas",
  "Tir",
  "Yekatit",
  "Megabit",
  "Miyazya",
  "Ginbot",
  "Sene",
  "Hamle",
  "Nehase",
  "Pagumen",
];

// Convert a Gregorian Date or ISO string -> Ethiopian object {year, month, day}
export function gregorianToEthiopianObj(g) {
  if (!g) return null;
  const d = g instanceof Date ? g : new Date(g);
  const [ey, em, ed] = toEthiopian(
    d.getFullYear(),
    d.getMonth() + 1,
    d.getDate()
  );
  return { year: Number(ey), month: Number(em), day: Number(ed) };
}

// Convert Ethiopian {year,month,day} -> JavaScript Date in UTC at midnight
// Use UTC to avoid timezone shifts when sending to API.
export function ethiopianToGregorianDateObj({ year, month, day }) {
  if (!year || !month || !day) return null;
  const [gy, gm, gd] = toGregorian(Number(year), Number(month), Number(day));
  // Use Date.UTC to avoid local timezone shifting the day.
  return new Date(Date.UTC(gy, gm - 1, gd));
}

// Convert Ethiopian -> ISO string (UTC midnight)
export function ethiopianToIso({ year, month, day }) {
  const dt = ethiopianToGregorianDateObj({ year, month, day });
  return dt ? dt.toISOString() : null;
}

// Format an ISO / Date into a readable Ethiopian string
export function isoToEthiopianString(iso, opts = { withMonthName: true }) {
  if (!iso) return "";
  const eth = gregorianToEthiopianObj(iso);
  if (!eth) return "";
  if (opts.withMonthName) {
    return `${ETHIOPIAN_MONTHS[eth.month - 1]} ${eth.day}, ${eth.year} ዓ.ም`;
  }
  return `${eth.year}-${String(eth.month).padStart(2, "0")}-${String(
    eth.day
  ).padStart(2, "0")}`;
}
