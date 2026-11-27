// Game rules, from "How points work" and the 20 Nov anti-cheat deck.
// Later these move to the server so points cannot be faked from a phone.

export type ActivityId = 'deep_work' | 'team_session' | 'walk' | 'break' | 'meeting';

export type Activity = {
  id: ActivityId;
  label: string;
  started: string; // "Deep work started"
  points: number;
  hint: string; // shown on the "you're in" card
};

export const ACTIVITIES: Record<ActivityId, Activity> = {
  deep_work: { id: 'deep_work', label: 'Deep work', started: 'Deep work started', points: 10, hint: '10 points per 30 minutes, max 40 a day' },
  // Assumption: a team session follows the deep work rules and shares its daily cap.
  team_session: { id: 'team_session', label: 'Team session', started: 'Team session started', points: 10, hint: '10 points per 30 minutes, max 40 a day' },
  walk: { id: 'walk', label: 'Mental walk', started: 'Walk started', points: 10, hint: '10 points, once a day' },
  break: { id: 'break', label: 'Rest break', started: 'Break started', points: 5, hint: '5 points, once a day' },
  meeting: { id: 'meeting', label: 'Outdoor meeting', started: 'Meeting started', points: 15, hint: '15 points, max 2 a day' },
};

export const POINTS_PER_STAMP = 50;
export const STAMPS_PER_VOUCHER = 8;
export const BLOCK_MIN = 30; // deep work earns per full 30 minutes
export const WORK_DAILY_CAP = 40;
export const MEETINGS_PER_DAY = 2;
export const REMINDER_AFTER_MIN = 120; // "Still outside?" tap again at 2 hours
export const AUTO_END_CREDIT_MIN = 30; // a session with no tap out counts as 30 min

export type Earned = { activity: ActivityId; at: number; points: number; minutes: number };

export type Outcome =
  | { counted: true; points: number; minutes: number }
  | { counted: false; reason: 'too_short' | 'daily_limit'; minutes: number };

const sameDay = (a: number, b: number) => new Date(a).toDateString() === new Date(b).toDateString();
const isWork = (id: ActivityId) => id === 'deep_work' || id === 'team_session';

export function scoreSession(activity: ActivityId, startedAt: number, endedAt: number, history: Earned[]): Outcome {
  const minutes = Math.floor((endedAt - startedAt) / 60000);
  const today = history.filter((e) => sameDay(e.at, endedAt));

  if (isWork(activity)) {
    const blocks = Math.floor(minutes / BLOCK_MIN);
    if (blocks === 0) return { counted: false, reason: 'too_short', minutes };
    const used = today.filter((e) => isWork(e.activity)).reduce((n, e) => n + e.points, 0);
    const points = Math.min(blocks * ACTIVITIES[activity].points, WORK_DAILY_CAP - used);
    return points > 0 ? { counted: true, points, minutes } : { counted: false, reason: 'daily_limit', minutes };
  }

  const timesToday = today.filter((e) => e.activity === activity).length;
  const limit = activity === 'meeting' ? MEETINGS_PER_DAY : 1;
  if (timesToday >= limit) return { counted: false, reason: 'daily_limit', minutes };
  return { counted: true, points: ACTIVITIES[activity].points, minutes };
}

export const stampsFromPoints = (total: number) => Math.floor(total / POINTS_PER_STAMP);
