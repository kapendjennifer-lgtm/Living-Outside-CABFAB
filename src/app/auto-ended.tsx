// Nobody tapped out: the app ended the session ("Auto ended session" and
// "Auto check out" in Figma). A session without a tap out counts for 30 minutes.
// "I left earlier" opens the time picker; the end time can only move earlier.
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Chip, InfoRow, Kicker, Label, Note, Sheet, Title } from '../components/kit';
import { Button, Screen } from '../components/ui';
import { AUTO_END_CREDIT_MIN } from '../lib/rules';
import { useStore } from '../lib/store';
import { duration, hhmm } from '../lib/time';
import { colors, fonts, type } from '../theme';

const STEP = 10 * 60000;

export default function AutoEnded() {
  const { meeting } = useLocalSearchParams<{ meeting?: string }>();
  const { lastOutcome: o, moveEndEarlier } = useStore();
  const [picker, setPicker] = useState(false);
  const [pick, setPick] = useState<number | null>(null);
  if (!o) return null;

  const isMeeting = !!meeting;
  const credited = o.auto ? Math.min(o.minutes, AUTO_END_CREDIT_MIN) : o.minutes;
  const latest = o.endedAt;
  const times = Array.from({ length: 5 }, (_, i) => latest - (4 - i) * STEP).filter((t) => t > o.startedAt);
  const confirm = () => router.replace(o.counted ? '/stamp' : `/note?reason=${o.reason}`);

  return (
    <Screen
      scroll
      style={{ gap: 14 }}
      footer={
        <>
          <Button label={isMeeting ? 'Looks right' : 'Confirm'} onPress={confirm} />
          {!isMeeting ? <Button variant="outline" label="I left earlier" onPress={() => setPicker(true)} /> : null}
        </>
      }
    >
      <Kicker>{isMeeting ? 'meeting time is up' : 'oops, forgot to tap out?'}</Kicker>
      <Title>{isMeeting ? 'Meeting ended automatically' : 'Session ended automatically'}</Title>
      <Text style={s.body}>
        {isMeeting ? 'We ended the meeting at the time the host set.' : 'Left earlier or stayed longer? You can adjust your end time.'}
      </Text>

      <View style={s.card}>
        <Chip label={o.auto ? 'Auto ended' : 'Ended'} color={colors.yellow} />
        <Label>Credited</Label>
        <Text style={s.big}>{duration(credited)}</Text>
        <Text style={s.small}>
          {o.auto
            ? 'We ended your session for you. Auto ended sessions count for 30 minutes.'
            : isMeeting
              ? 'Everyone in the meeting gets the full meeting time.'
              : 'Counted up to the end time you set.'}
        </Text>
      </View>

      <InfoRow icon="clock" title={`Started at ${hhmm(o.startedAt)}`} sub="Tapped at the check-in point" />
      <InfoRow
        icon="clock"
        disc={colors.pink}
        title={`Ended at ${hhmm(o.endedAt)}`}
        sub={o.auto || isMeeting ? 'Set automatically' : 'Set by you'}
        right={!isMeeting ? <Chip label="Adjust" onPress={() => setPicker(true)} /> : undefined}
      />
      <Note>{isMeeting ? 'Do not disturb is off and the spot is free again.' : 'Tap out next time to count your full session.'}</Note>

      <Sheet open={picker} onClose={() => setPicker(false)}>
        <Title>I left earlier</Title>
        <Text style={s.body}>You can only move the end time earlier, never later.</Text>
        <View style={s.picker}>
          {times.map((t) => {
            const on = (pick ?? latest) === t;
            return (
              <Pressable key={t} onPress={() => setPick(t)} accessibilityRole="button" accessibilityState={{ selected: on }}>
                <Text style={[s.time, on && s.timeOn]}>{hhmm(t)}</Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={s.small}>Latest possible time: {hhmm(latest)}</Text>
        <Button
          label="Save end time"
          onPress={() => {
            if (pick && pick < latest) moveEndEarlier(pick);
            setPick(null);
            setPicker(false);
          }}
        />
      </Sheet>
    </Screen>
  );
}

const s = StyleSheet.create({
  body: { ...type.body, color: colors.plum },
  small: { ...type.small, color: colors.plum },
  card: { backgroundColor: colors.sky, borderRadius: 24, padding: 24, gap: 8 },
  big: { fontFamily: fonts.bold, fontSize: 56, letterSpacing: -1.7, color: colors.plum },
  picker: { backgroundColor: colors.sky, borderRadius: 24, paddingVertical: 12, alignItems: 'center', gap: 4 },
  time: { fontFamily: fonts.medium, fontSize: 20, color: colors.plum, opacity: 0.6, paddingVertical: 4 },
  timeOn: { fontFamily: fonts.bold, fontSize: 32, opacity: 1, color: colors.plum, backgroundColor: colors.white, borderRadius: 16, paddingHorizontal: 24 },
});
