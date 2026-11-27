// Game rules from "How points work". Later these move to the server
// so points cannot be faked from a phone.

export type ActivityId = 'deep_work' | 'team_session' | 'walk' | 'break' | 'meeting';

export type Activity = {
  id: ActivityId;
  label: string;
  started: string; // "Deep work started"
  points: number;
  minMinutes: number; // shorter sessions earn nothing
};

export const ACTIVITIES: Record<ActivityId, Activity> = {
  deep_work: { id: 'deep_work', label: 'Deep work', started: 'Deep work started', points: 10, minMinutes: 30 },
  team_session: { id: 'team_session', label: 'Team session', started: 'Team session started', points: 10, minMinutes: 30 },
  walk: { id: 'walk', label: 'Mental walk', started: 'Walk started', points: 10, minMinutes: 10 },
  break: { id: 'break', label: 'Rest break', started: 'Break started', points: 5, minMinutes: 5 },
  meeting: { id: 'meeting', label: 'Outdoor meeting', started: 'Meeting started', points: 15, minMinutes: 15 },
};

export const STAMPS_PER_VOUCHER = 8;
export const REMINDER_AFTER_MIN = 120; // "Still outside?" check
export const AUTO_END_CREDIT_MIN = 30; // auto-ended sessions count for 30 min

export type Outcome =
  | { counted: true; points: number; minutes: number }
  | { counted: false; reason: 'too_short'; minutes: number };

export function scoreSession(activity: ActivityId, startedAt: number, endedAt: number): Outcome {
  const minutes = Math.floor((endedAt - startedAt) / 60000);
  const a = ACTIVITIES[activity];
  if (minutes < a.minMinutes) return { counted: false, reason: 'too_short', minutes };
  return { counted: true, points: a.points, minutes };
}
