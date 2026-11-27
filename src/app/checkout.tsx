// "Tap to check out": same rings in pink and plum. Pressing them simulates the tap.
import { Redirect, router } from 'expo-router';
import { TapScreen } from '../components/TapScreen';
import { useStore } from '../lib/store';
import { duration, useNow } from '../lib/time';

export default function CheckOut() {
  const { active } = useStore();
  const now = useNow();
  if (!active) return <Redirect href="/home" />;
  const meeting = active.activity === 'meeting';

  return (
    <TapScreen
      mode="out"
      kicker="all done outside?"
      chip={duration((now - active.startedAt) / 60000)}
      title="Tap to check out"
      body="Hold your phone against the check-in point again to finish your session."
      tip="Forgot? Sessions end on their own after 2 hours."
      cancel={meeting ? 'Stay in the meeting' : 'Keep working'}
      onTap={() => router.replace(`/tap/${active.spot}`)}
      onCancel={() => router.replace('/session')}
    />
  );
}
