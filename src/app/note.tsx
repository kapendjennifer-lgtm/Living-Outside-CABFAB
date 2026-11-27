// "A quick note": friendly message when something did not add points.
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import type { IconName } from '../components/Icons';
import { IconDisc, Kicker, Title } from '../components/kit';
import { Button, Screen } from '../components/ui';
import { MEETINGS_PER_DAY } from '../lib/rules';
import { useStore } from '../lib/store';
import { colors, fonts } from '../theme';

const NOTES: Record<string, { icon: IconName; text: string }> = {
  too_short: { icon: 'clock', text: 'This session was shorter than 30 minutes, so no points this time.' },
  invite_used: { icon: 'group', text: 'You and this colleague already got an invite bonus this week.' },
  nobody_out: { icon: 'nfc', text: 'Nobody tapped out of this meeting, so it could not be counted.' },
  daily_limit: { icon: 'clock', text: "You already reached today's limit for this activity, so no points this time." },
};

export default function Note() {
  const { reason = 'too_short' } = useLocalSearchParams<{ reason?: string }>();
  const { lastOutcome } = useStore();
  let n = NOTES[reason] ?? NOTES.too_short;
  // Shorter-than-minimum walks, breaks and meetings get their own minute count.
  if (reason === 'too_short' && lastOutcome && lastOutcome.activity !== 'deep_work' && lastOutcome.activity !== 'team_session') {
    const min = { walk: 15, break: 10, meeting: 20 }[lastOutcome.activity as 'walk' | 'break' | 'meeting'];
    n = { icon: 'clock', text: `This session was shorter than ${min} minutes, so no points this time.` };
  }
  if (reason === 'daily_limit' && lastOutcome?.activity === 'meeting') {
    n = { icon: 'group', text: `You already had ${MEETINGS_PER_DAY} meetings today, so this one did not add points.` };
  }

  return (
    <Screen footer={<Button label="Got it" onPress={() => router.replace('/home')} />}>
      <Kicker>just so you know</Kicker>
      <Title>A quick note</Title>
      <View style={s.card}>
        <IconDisc name={n.icon} />
        <Text style={s.text}>{n.text}</Text>
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  card: { marginTop: 60, backgroundColor: colors.sky, borderRadius: 24, padding: 24, gap: 16 },
  text: { fontFamily: fonts.medium, fontSize: 22, lineHeight: 29, color: colors.plum },
});
