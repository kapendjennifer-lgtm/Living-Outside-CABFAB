// Local app state, saved on the phone with AsyncStorage.
// Milestone 2 swaps this for Supabase behind the same hook.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { SPOTS } from './spots';
import { AUTO_END_CREDIT_MIN, scoreSession, stampsFromPoints, STAMPS_PER_VOUCHER, type ActivityId, type Earned, type Outcome } from './rules';

export type Meeting = { host: boolean; people: string[]; endsAt: number };
export type ActiveSession = { activity: ActivityId; spot: string; startedAt: number; lastTapAt: number; meeting?: Meeting };
export type Finished = Outcome & {
  activity: ActivityId;
  spot: string;
  startedAt: number;
  endedAt: number;
  auto: boolean; // ended by the app because nobody tapped out
  newStamp: boolean;
};
export type LogEntry = { activity: ActivityId; startedAt: number; endedAt: number; points: number };
export type StatusKind = 'open' | 'focusing' | 'away';
export type Social = {
  status: { kind: StatusKind; where: string; until: string };
  invited: string[]; // colleagues you sent an invite to today
  joining: string | null; // colleague you're walking over to
  coffeeWalk: 'invited' | 'going' | 'declined';
};

type State = {
  onboarded: boolean;
  active: ActiveSession | null;
  earned: Earned[]; // every counted session
  log: LogEntry[]; // every finished session, counted or not (for "Today outside")
  lastOutcome: Finished | null;
  vouchersUsed: number[]; // when each voucher was used
  social: Social;
};

const initialSocial: Social = {
  status: { kind: 'open', where: 'Table 1', until: '17:00' },
  invited: [],
  joining: null,
  coffeeWalk: 'invited',
};
const initial: State = { onboarded: false, active: null, earned: [], log: [], lastOutcome: null, vouchersUsed: [], social: initialSocial };
const KEY = 'outside-office/v3';

type Api = State & {
  name: string;
  points: number; // all-time total
  stamps: number; // all-time stamps (50 points each)
  vouchersReady: number; // full cards not yet used
  ready: boolean;
  finishOnboarding: () => void;
  checkIn: (activity: ActivityId, spot: string, meeting?: Meeting) => void;
  tapAgain: () => void; // "Still outside?" tap keeps your table
  checkOut: (opts?: { at?: number; auto?: boolean }) => Finished | null;
  moveEndEarlier: (at: number) => void;
  useVoucher: () => void;
  setSocial: (patch: Partial<Social>) => void;
  devShiftStart: (minutes: number) => void; // testing aid: pretend the session started earlier
  loadDemo: (points?: number) => void;
  simulate: (activity: ActivityId, minutes: number, auto?: boolean) => void; // testing: a finished session
  startAgo: (activity: ActivityId, minutes: number) => void; // testing: a session that began earlier
  reset: () => void;
};

const Ctx = createContext<Api | null>(null);
const MIN = 60000;

function finish(state: State, a: ActiveSession, endedAt: number, auto: boolean, history: Earned[], basePoints: number): { outcome: Finished; earned: Earned[]; points: number } {
  // A session nobody tapped out of counts as 30 minutes.
  const scoredEnd = auto ? Math.min(endedAt, a.startedAt + AUTO_END_CREDIT_MIN * MIN) : endedAt;
  const o = scoreSession(a.activity, a.startedAt, scoredEnd, history);
  const gained = o.counted ? o.points : 0;
  const newStamp = stampsFromPoints(basePoints + gained) > stampsFromPoints(basePoints);
  const earned = o.counted ? [...history, { activity: a.activity, at: endedAt, points: gained, minutes: o.minutes }] : history;
  return { outcome: { ...o, activity: a.activity, spot: a.spot, startedAt: a.startedAt, endedAt, auto, newStamp }, earned, points: gained };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => raw && setState({ ...initial, ...JSON.parse(raw) }))
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) AsyncStorage.setItem(KEY, JSON.stringify(state));
  }, [state, ready]);

  const points = state.earned.reduce((n, e) => n + e.points, 0);
  const stamps = stampsFromPoints(points);

  const api: Api = {
    ...state,
    name: 'Alex',
    points,
    stamps,
    vouchersReady: Math.floor(stamps / STAMPS_PER_VOUCHER) - state.vouchersUsed.length,
    ready,
    finishOnboarding: () => setState((s) => ({ ...s, onboarded: true })),
    checkIn: (activity, spot, meeting) =>
      setState((s) => ({ ...s, active: { activity, spot, startedAt: Date.now(), lastTapAt: Date.now(), meeting }, lastOutcome: null })),
    tapAgain: () => setState((s) => (s.active ? { ...s, active: { ...s.active, lastTapAt: Date.now() } } : s)),
    checkOut: ({ at = Date.now(), auto = false } = {}) => {
      const a = state.active;
      if (!a) return null;
      const r = finish(state, a, at, auto, state.earned, points);
      setState((s) => ({
        ...s,
        active: null,
        lastOutcome: r.outcome,
        earned: r.earned,
        log: [...s.log, { activity: a.activity, startedAt: a.startedAt, endedAt: at, points: r.points }],
      }));
      return r.outcome;
    },
    moveEndEarlier: (at) =>
      setState((s) => {
        const last = s.lastOutcome;
        if (!last || at >= last.endedAt) return s;
        // Undo the old result, then score again with the earlier end time.
        const history = last.counted ? s.earned.filter((e) => !(e.at === last.endedAt && e.activity === last.activity)) : s.earned;
        const base = history.reduce((n, e) => n + e.points, 0);
        const fake: ActiveSession = { activity: last.activity, spot: last.spot, startedAt: last.startedAt, lastTapAt: last.startedAt };
        const r = finish(s, fake, at, false, history, base);
        const log = s.log.map((l) => (l.startedAt === last.startedAt ? { ...l, endedAt: at, points: r.points } : l));
        return { ...s, earned: r.earned, lastOutcome: r.outcome, log };
      }),
    useVoucher: () => setState((s) => ({ ...s, vouchersUsed: [...s.vouchersUsed, Date.now()] })),
    setSocial: (patch) => setState((s) => ({ ...s, social: { ...s.social, ...patch } })),
    devShiftStart: (minutes) =>
      setState((s) =>
        s.active
          ? {
              ...s,
              active: {
                ...s.active,
                startedAt: s.active.startedAt - minutes * MIN,
                lastTapAt: s.active.lastTapAt - minutes * MIN,
                meeting: s.active.meeting && { ...s.active.meeting, endsAt: s.active.meeting.endsAt - minutes * MIN },
              },
            }
          : s,
      ),
    // Matches the Figma home screen: 5 stamps and 30 points towards the next one.
    loadDemo: (pts = 280) =>
      setState((s) => ({
        ...s,
        onboarded: true,
        earned: [{ activity: 'deep_work', at: Date.now() - 7 * 24 * 60 * MIN, points: pts, minutes: 0 }],
        vouchersUsed: [],
      })),
    simulate: (activity, minutes, auto = false) =>
      setState((s) => {
        const end = Date.now();
        const fake: ActiveSession = { activity, spot: Object.values(SPOTS).find((x) => x.activity === activity)!.id, startedAt: end - minutes * MIN, lastTapAt: end - minutes * MIN };
        const base = s.earned.reduce((n, e) => n + e.points, 0);
        const r = finish(s, fake, end, auto, s.earned, base);
        return { ...s, active: null, earned: r.earned, lastOutcome: r.outcome, log: [...s.log, { activity, startedAt: fake.startedAt, endedAt: end, points: r.points }] };
      }),
    startAgo: (activity, minutes) =>
      setState((s) => {
        const t = Date.now() - minutes * MIN;
        const spot = Object.values(SPOTS).find((x) => x.activity === activity)!.id;
        const meeting = activity === 'meeting' ? { host: true, people: ['You', 'Julie', 'Max'], endsAt: t + 60 * MIN } : undefined;
        return { ...s, active: { activity, spot, startedAt: t, lastTapAt: t, meeting }, lastOutcome: null };
      }),
    reset: () => setState({ ...initial, onboarded: true }),
  };

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useStore must be inside StoreProvider');
  return v;
}
