// "you're in! Outside Meeting Has Started".
import { Redirect, router } from 'expo-router';
import { Started } from '../../components/Started';
import { useStore } from '../../lib/store';
import { duration, hhmm } from '../../lib/time';

export default function MeetingStarted() {
  const { active } = useStore();
  if (!active?.meeting) return <Redirect href="/home" />;
  const total = Math.round((active.meeting.endsAt - active.startedAt) / 60000);
  return (
    <Started
      title="Outside Meeting Has Started"
      icon="group"
      cardTitle="Team Meeting"
      cardSub="Binckhaven park · Table 1"
      stats={[
        { label: 'Meeting finish time', value: hhmm(active.meeting.endsAt) },
        { label: 'Total', value: duration(total).replace(' ', '') },
      ]}
      chips={['Do not disturb on', 'Spot marked busy']}
      button="See Team Meeting"
      onButton={() => router.replace('/session')}
      onClose={() => router.replace('/home')}
    />
  );
}
