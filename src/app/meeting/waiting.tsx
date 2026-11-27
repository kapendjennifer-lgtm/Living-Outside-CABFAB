// You tapped in; the host is still adding the meeting details.
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Doodles } from '../../components/Started';
import { Screen } from '../../components/ui';
import { spotFor } from '../../lib/spots';
import { useStore } from '../../lib/store';
import { colors, fonts } from '../../theme';

export default function Waiting() {
  const { people = 'Lena' } = useLocalSearchParams<{ people?: string }>();
  const { checkIn } = useStore();

  // Simulated: the host sets a 1 hour meeting after a moment.
  useEffect(() => {
    const id = setTimeout(() => {
      checkIn('meeting', spotFor('meeting'), { host: false, people: ['You', ...people.split(',')], endsAt: Date.now() + 60 * 60000 });
      router.replace('/meeting/started');
    }, 2500);
    return () => clearTimeout(id);
  }, [checkIn, people]);

  return (
    <Screen dark style={{ justifyContent: 'center' }}>
      <Text style={s.title}>Waiting for the host to add meeting details...</Text>
      <Text style={s.sub}>adding time slot...</Text>
      <Doodles />
    </Screen>
  );
}

const s = StyleSheet.create({
  title: { fontFamily: fonts.bold, fontSize: 32, lineHeight: 36, letterSpacing: -0.6, color: colors.cream },
  sub: { fontFamily: fonts.hand, fontSize: 28, color: colors.cream, opacity: 0.71, marginTop: 12, marginBottom: 24 },
});
