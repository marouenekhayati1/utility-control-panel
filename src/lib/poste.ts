import { useEffect, useState } from "react";

export type Poste = "nuit" | "matin" | "apres-midi";

/** Determine the current work shift from the clock. */
export function currentPoste(date = new Date()): Poste {
  const h = date.getHours();
  if (h >= 22 || h < 6) return "nuit";
  if (h < 14) return "matin";
  return "apres-midi";
}

export const POSTE_META: Record<Poste, { label: string }> = {
  nuit: { label: "Nuit" },
  matin: { label: "Matin" },
  "apres-midi": { label: "Après-midi" },
};

/** Tick on an interval — returns the current date, re-rendering the caller. */
export function useNow(intervalMs = 1000): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  return now;
}
