// Words and colours per activity, straight from the Figma flows
// (03/04 deep work, 05 mental walk, 06 break zone, 07 outside meeting).
import type { IconName } from '../components/Icons';
import { colors } from '../theme';
import type { ActivityId } from './rules';

export type ActivityCopy = {
  icon: IconName;
  tapKicker: string; // check-in tap screen
  tapBody: string;
  started: string; // "Deep work started"
  sessionTitle: string; // card on the started screen
  activeKicker: string;
  activeTitle: string;
  card: string; // colour of the timer card
  timeLabel: string;
  hint: string;
  spotTitle: string;
  spotSub: string;
  visibility: string;
  doneKicker: string; // summary
  doneChip: string;
};

const work = {
  icon: 'laptop' as IconName,
  tapKicker: 'ready to settle in?',
  tapBody: 'Hold your phone against the check-in point on your table.',
  activeKicker: 'working outside',
  card: colors.sky,
  timeLabel: 'Session time',
  hint: 'Next stamp at 1 hour',
  spotTitle: 'Binckhaven park',
  spotSub: 'Table 4 · marked as working',
  visibility: 'Colleagues see you outside',
  doneKicker: 'nice work!',
  doneChip: 'Do not disturb off',
};

export const COPY: Record<ActivityId, ActivityCopy> = {
  deep_work: { ...work, started: 'Deep work started', sessionTitle: 'Work session', activeTitle: 'Deep work outside' },
  team_session: {
    ...work, icon: 'group', started: 'Team session started', sessionTitle: 'Team session', activeTitle: 'Team session outside',
    spotSub: 'Table 1 · marked as team session',
  },
  walk: {
    icon: 'walk',
    tapKicker: 'time for a walk?',
    tapBody: 'Hold your phone against the check-in point at the walk start.',
    started: 'Walk started',
    sessionTitle: 'Walk',
    activeKicker: 'mental walk',
    activeTitle: 'Clearing my head',
    card: colors.marigold,
    timeLabel: 'Walk time',
    hint: 'No rush. Take your time.',
    spotTitle: 'Binckhaven park',
    spotSub: 'Walking route · loop 1',
    visibility: "Colleagues see you're on a walk",
    doneKicker: 'fresh mind!',
    doneChip: 'Mental walk',
  },
  break: {
    icon: 'cup',
    tapKicker: 'time for a break?',
    tapBody: 'Hold your phone against the check-in point in the break zone.',
    started: 'Break started',
    sessionTitle: 'Break',
    activeKicker: 'break zone',
    activeTitle: 'Time to recharge',
    card: colors.plum,
    timeLabel: 'Break time',
    hint: 'Enjoy your break.',
    spotTitle: 'Break zone',
    spotSub: 'Binckhaven park · Seat 2',
    visibility: "Colleagues see you're resting",
    doneKicker: 'recharged!',
    doneChip: 'Break zone',
  },
  meeting: {
    ...work,
    icon: 'group',
    started: 'Outside Meeting Has Started',
    sessionTitle: 'Team Meeting',
    activeTitle: 'Outside Meeting',
    timeLabel: 'Time left till the end of the meeting',
    hint: '',
    spotSub: 'Table 1 · marked as meeting',
    visibility: 'Colleagues see you in a meeting',
  },
};
