import { Redirect } from 'expo-router';
import { useStore } from '../lib/store';

export default function Index() {
  const { onboarded, active } = useStore();
  if (!onboarded) return <Redirect href="/onboarding" />;
  return <Redirect href={active ? '/session' : '/home'} />;
}
