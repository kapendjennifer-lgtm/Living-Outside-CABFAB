// "you're in! Deep work started" (also walk, break, team session), right after the tap.
import { Redirect, router } from 'expo-router';
import { Started } from '../components/Started';
import { COPY } from '../lib/copy';
import { useStore } from '../lib/store';
import { clock, useNow } from '../lib/time';

export default function SessionStarted() {
  const { active } = useStore();
  const now = useNow();
  if (!active) return <Redirect href="/home" />;
  if (active.meeting) return <Redirect href="/meeting/started" />;
  const c = COPY[active.activity];
  const work = active.activity === 'deep_work' || active.activity === 'team_session';
  return (
    <Started
      title={c.started}
      icon={c.icon}
      cardTitle={c.sessionTitle}
      cardSub={`${c.spotTitle} · ${c.spotSub.split(' · ')[0]}`}
      stats={[{ label: c.timeLabel, value: clock(now - active.startedAt) }]}
      chips={work ? ['Do not disturb on', 'Spot marked busy'] : ['Do not disturb on']}
      button="See my session"
      onButton={() => router.replace('/session')}
      onClose={() => router.replace('/home')}
    />
  );
}
