// The points tables as written on the onboarding and "How points work" screens.
import type { RuleRow } from '../components/Cards';

export const ONBOARDING_RULES: RuleRow[] = [
  { icon: 'laptop', title: 'Deep work outside', sub: 'Per 30 min in a deep work zone · max 4 a day', points: 10 },
  { icon: 'group', title: 'Outdoor meeting', sub: '2+ people, 20+ min', points: 15 },
  { icon: 'walk', title: 'Mental walk', sub: '15+ min walk · once a day', points: 10 },
  { icon: 'cup', title: 'Rest break', sub: '10+ min · once a day', points: 5 },
  { icon: 'chat', title: 'Invite a colleague', sub: 'When they join, they get 5 too', points: 10 },
];

export const HOW_POINTS_WORK: RuleRow[] = [
  { icon: 'laptop', title: 'Deep work', sub: '10 points per 30 minutes · max 40 a day', points: 10 },
  { icon: 'group', title: 'Outdoor meeting', sub: 'Max 2 a day', points: 15 },
  { icon: 'walk', title: 'Mental walk', sub: 'Once a day', points: 10 },
  { icon: 'cup', title: 'Rest break', sub: 'Once a day', points: 5 },
  { icon: 'chat', title: 'Invite a colleague', sub: '10 points for you and 5 for your colleague · max 2 a week', points: 10 },
];

export const FAIR_PLAY = [
  'Always tap in and tap out',
  'Sessions without a tap out count for 30 minutes',
  'Everyone taps their own phone for a meeting',
  'Vouchers work once',
];
