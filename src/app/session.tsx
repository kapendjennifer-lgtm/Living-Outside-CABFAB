// Active session (deep work, team session, walk, break, meeting): live timer, your spot,
// and the 2 hour "Still outside?" sheet. No tap 15 minutes after that ends the session.
import { Redirect, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Bar, Chip, InfoRow, Kicker, Label, Sheet, Title } from '../components/kit';
import { TabBar } from '../components/TabBar';
import { TapMini } from '../components/TapTarget';
import { Button, Screen } from '../components/ui';
import { COPY } from '../lib/copy';
import { BLOCK_MIN, REMINDER_AFTER_MIN } from '../lib/rules';
import { useStore } from '../lib/store';
import { clock, useNow } from '../lib/time';
import { colors, fonts, type } from '../theme';

const MIN = 60000;
const TAP_WINDOW_MIN = 15;

export default function Session() {
  const { active, tapAgain, checkOut, devShiftStart } = useStore();
  const now = useNow();
  const [details, setDetails] = useState(true);

  const sinceTap = active ? (now - active.lastTapAt) / MIN : 0;
  const reminder = !!active && !active.meeting && sinceTap >= REMINDER_AFTER_MIN;
  const autoEnd = reminder && sinceTap >= REMINDER_AFTER_MIN + TAP_WINDOW_MIN;
  const meetingOver = !!active?.meeting && now >= active.meeting.endsAt;

  useEffect(() => {
    if (!active) return;
    if (autoEnd) {
      checkOut({ at: active.lastTapAt + REMINDER_AFTER_MIN * MIN, auto: true });
      router.replace('/auto-ended');
    } else if (meetingOver && active.meeting) {
      checkOut({ at: active.meeting.endsAt });
      router.replace('/auto-ended?meeting=1');
    }
  }, [autoEnd, meetingOver, active, checkOut]);

  if (!active) return <Redirect href="/home" />;
  const c = COPY[active.activity];
  const meeting = active.meeting;
  const dark = active.activity === 'break';
  const ink = dark ? colors.cream : colors.plum;
  const mins = (now - active.startedAt) / MIN;
  const perBlock = active.activity === 'deep_work' || active.activity === 'team_session';
  const progress = meeting
    ? (now - active.startedAt) / (meeting.endsAt - active.startedAt)
    : perBlock ? (mins % BLOCK_MIN) / BLOCK_MIN : Math.min(1, mins / 20);
  const leftToTap = Math.max(0, REMINDER_AFTER_MIN + TAP_WINDOW_MIN - sinceTap) * MIN;

  return (
    <Screen scroll footer={<TabBar active="home" />} style={{ gap: 14 }}>
      <View style={s.top}>
        <Kicker>{c.activeKicker}</Kicker>
        <Chip label="DND on" color={colors.yellow} />
      </View>
      <Title>{c.activeTitle}</Title>

      <View style={[s.card, { backgroundColor: c.card }]}>
        <Label dark={dark}>{c.timeLabel}</Label>
        <Text style={[s.timer, { color: ink }]}>{meeting ? clock(meeting.endsAt - now) : clock(now - active.startedAt)}</Text>
        <Bar value={progress} fill={dark ? colors.yellow : colors.plum} />
        {c.hint ? <Text style={[s.hint, { color: ink }]}>{c.hint}</Text> : null}
      </View>

      <Pressable onPress={() => setDetails(!details)} accessibilityRole="button">
        <Text style={s.toggle}>{details ? 'Hide details' : 'More details'}</Text>
      </Pressable>
      {details ? (
        <View style={{ gap: 8 }}>
          <Label>Your spot</Label>
          <InfoRow icon={active.activity === 'break' ? 'cup' : 'pin'} title={c.spotTitle} sub={c.spotSub} />
          <InfoRow icon="moon" disc={colors.sky} title="Do not disturb" sub="On until you check out" />
          <InfoRow icon="group" disc={colors.marigold} title="Visible to your team" sub={c.visibility} />
          {meeting ? <InfoRow icon="group" disc={colors.straw} title="With" sub={meeting.people.join(', ')} /> : null}
        </View>
      ) : null}

      <Button label={meeting ? 'Leave the meeting' : 'Check out'} onPress={() => router.push('/checkout')} />
      <Text style={s.note}>Tap your phone at the check-in point to finish.</Text>

      <View style={s.dev}>
        <Text style={s.devText} onPress={() => devShiftStart(15)}>Testing: skip ahead 15 min</Text>
        <Text style={s.devText} onPress={() => devShiftStart(REMINDER_AFTER_MIN)}>Testing: jump to the 2 hour check</Text>
        <Text style={s.devText} onPress={() => router.push('/reminder')}>Testing: lock screen reminder</Text>
        <Text style={s.devText} onPress={() => router.push('/table-claimed')}>Testing: someone wants my table</Text>
      </View>

      <Sheet open={reminder && !autoEnd} onClose={() => {}}>
        <Kicker>time check</Kicker>
        <Title>Still outside?</Title>
        <Text style={s.sheetBody}>Tap the touchpoint to keep your table.</Text>
        <TapMini />
        <View style={[s.card, { backgroundColor: colors.sky }]}>
          <Label>Time left to tap</Label>
          <Text style={[s.timer, { color: colors.plum }]}>{clock(leftToTap)}</Text>
          <Bar value={leftToTap / (TAP_WINDOW_MIN * MIN)} />
        </View>
        <Button label="Simulate tap" onPress={tapAgain} />
        <Button variant="outline" label="End session" onPress={() => router.push('/checkout')} />
        <Text style={s.devText} onPress={() => devShiftStart(TAP_WINDOW_MIN)}>Testing: let the 15 minutes run out</Text>
      </Sheet>
    </Screen>
  );
}

const s = StyleSheet.create({
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  card: { borderRadius: 24, padding: 24, gap: 10 },
  timer: { fontFamily: fonts.bold, fontSize: 56, letterSpacing: -1.7, fontVariant: ['tabular-nums'] },
  hint: { ...type.small },
  toggle: { fontFamily: fonts.medium, fontSize: 14, color: colors.plum, textDecorationLine: 'underline' },
  note: { ...type.small, color: colors.plum, textAlign: 'center' },
  dev: { gap: 10, alignItems: 'center', marginTop: 6 },
  devText: { ...type.label, color: colors.plumSoft },
  sheetBody: { ...type.body, color: colors.plum },
});
