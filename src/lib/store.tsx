// Local app state for milestone 1. Saved on the phone with AsyncStorage.
// Milestone 2 swaps this for Supabase behind the same hook.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { scoreSession, type ActivityId, type Outcome } from './rules';

export type ActiveSession = { activity: ActivityId; spot: string; startedAt: number };
export type Stamp = { activity: ActivityId; at: number; points: number };

type State = {
  onboarded: boolean;
  active: ActiveSession | null;
  stamps: Stamp[]; // stamps on the current card (resets after a voucher)
  points: number;
  lastOutcome: Outcome | null;
};

const initial: State = { onboarded: false, active: null, stamps: [], points: 0, lastOutcome: null };
const KEY = 'outside-office/v1';

type Api = State & {
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

  const api: Api = {
    ...state,
    ready,
    finishOnboarding: () => setState((s) => ({ ...s, onboarded: true })),
    checkIn: (activity, spot) =>
      setState((s) => ({ ...s, active: { activity, spot, startedAt: Date.now() }, lastOutcome: null })),
    checkOut: (at = Date.now()) => {
      const a = state.active;
      if (!a) return null;
      const outcome = scoreSession(a.activity, a.startedAt, at);
      setState((s) => ({
        ...s,
        active: null,
        lastOutcome: outcome,
        points: s.points + (outcome.counted ? outcome.points : 0),
        stamps: outcome.counted ? [...s.stamps, { activity: a.activity, at, points: outcome.points }] : s.stamps,
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
