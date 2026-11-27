// Local app state for milestone 1. Saved on the phone with AsyncStorage.
// Milestone 2 swaps this for Supabase behind the same hook.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { scoreSession, stampsFromPoints, type ActivityId, type Earned, type Outcome } from './rules';

export type ActiveSession = { activity: ActivityId; spot: string; startedAt: number };
type State = {
  onboarded: boolean;
  active: ActiveSession | null;
  earned: Earned[]; // every counted session
  lastOutcome: (Outcome & { newStamp: boolean }) | null;
};

const initial: State = { onboarded: false, active: null, earned: [], lastOutcome: null };
const KEY = 'outside-office/v2';

type Api = State & {
  points: number; // all-time total
  stamps: number; // all-time stamps (50 points each)
  ready: boolean;
  finishOnboarding: () => void;
  checkIn: (activity: ActivityId, spot: string) => void;
  checkOut: (at?: number) => Outcome | null;
  devShiftStart: (minutes: number) => void; // testing aid: pretend the session started earlier
  reset: () => void;
};

const Ctx = createContext<Api | null>(null);

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

  const api: Api = {
    ...state,
    points,
    stamps: stampsFromPoints(points),
    ready,
    finishOnboarding: () => setState((s) => ({ ...s, onboarded: true })),
    checkIn: (activity, spot) =>
      setState((s) => ({ ...s, active: { activity, spot, startedAt: Date.now() }, lastOutcome: null })),
    checkOut: (at = Date.now()) => {
      const a = state.active;
      if (!a) return null;
      const outcome = scoreSession(a.activity, a.startedAt, at, state.earned);
      const gained = outcome.counted ? outcome.points : 0;
      const newStamp = stampsFromPoints(points + gained) > stampsFromPoints(points);
      setState((s) => ({
        ...s,
        active: null,
        lastOutcome: { ...outcome, newStamp },
        earned: outcome.counted ? [...s.earned, { activity: a.activity, at, points: gained, minutes: outcome.minutes }] : s.earned,
      }));
      return outcome;
    },
    devShiftStart: (minutes) =>
      setState((s) => (s.active ? { ...s, active: { ...s.active, startedAt: s.active.startedAt - minutes * 60000 } } : s)),
    reset: () => setState({ ...initial, onboarded: true }),
  };

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useStore must be inside StoreProvider');
  return v;
}
