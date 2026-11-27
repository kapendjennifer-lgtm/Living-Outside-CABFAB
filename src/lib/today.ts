// Builds the "Today outside" overview from the session log.
import type { DayRow } from '../components/Cards';
import { COPY } from './copy';
import { ACTIVITIES, POINTS_PER_STAMP, type ActivityId } from './rules';
import type { LogEntry } from './store';
import { short } from './time';

export function today(log: LogEntry[], points: number) {
  const day = new Date().toDateString();
  const mine = log.filter((l) => new Date(l.endedAt).toDateString() === day);
  const by = new Map<ActivityId, { min: number; pts: number }>();
  for (const l of mine) {
    const v = by.get(l.activity) ?? { min: 0, pts: 0 };
    v.min += (l.endedAt - l.startedAt) / 60000;
    v.pts += l.points;
    by.set(l.activity, v);
  }
  const rows: DayRow[] = [...by].map(([id, v]) => ({ icon: COPY[id].icon, label: ACTIVITIES[id].label, time: short(v.min), points: v.pts }));
  const totalMin = [...by.values()].reduce((n, v) => n + v.min, 0);
  return { rows, total: short(totalMin), toNext: POINTS_PER_STAMP - (points % POINTS_PER_STAMP) };
}

// Example day from the onboarding screen "08 Your day at a glance".
export const EXAMPLE_DAY = {
  total: '2h 00m',
  toNext: 5,
  rows: [
    { icon: 'laptop', label: 'Deep work', time: '1h 30m', points: 30 },
    { icon: 'walk', label: 'Mental walk', time: '20m', points: 10 },
    { icon: 'cup', label: 'Rest break', time: '10m', points: 5 },
  ] as DayRow[],
};
