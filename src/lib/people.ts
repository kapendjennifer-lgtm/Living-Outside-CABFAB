// Demo colleagues for the social screens until accounts come from Supabase.
export type Colleague = { name: string; state: 'Open to join' | 'Focusing' | 'Planned'; line: string; action: string };

export const COLLEAGUES: Colleague[] = [
  { name: 'Lena', state: 'Open to join', line: 'Deep work · Table 1 · until 17:00', action: 'Join Lena' },
  { name: 'Mara', state: 'Focusing', line: 'Deep work · Table 4 · until 16:00', action: 'Plan a walk after' },
  { name: 'Justin', state: 'Planned', line: 'Coffee walk · 15:00 · 2 spots left', action: "I'm in" },
];

export const STATUS_LABEL = { open: 'Open to join', focusing: 'Focusing', away: 'Away' } as const;

export const WALK_LINES = ['Today · 15:00 · 20 min', 'Meeting point: Binckhaven park entrance'];
