// Time helpers shared by the session, reminder and summary screens.
import { useEffect, useState } from 'react';

const pad = (n: number) => String(n).padStart(2, '0');

/** 00:42 under an hour, 1:05:09 above. */
export function clock(ms: number) {
  const t = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  return h ? `${h}:${pad(m)}:${pad(t % 60)}` : `${pad(m)}:${pad(t % 60)}`;
}

/** 14:10 */
export const hhmm = (ts: number) => {
  const d = new Date(ts);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

/** "1 h 24 min", "20 min" */
export function duration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (!h) return `${m} min`;
  return m ? `${h} h ${m} min` : `${h} h`;
}

/** "1h 30m" for the day overview */
export const short = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return h ? `${h}h ${pad(m)}m` : `${m}m`;
};

/** Re-renders every second while the screen is open. */
export function useNow(ms = 1000) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(id);
  }, [ms]);
  return now;
}
