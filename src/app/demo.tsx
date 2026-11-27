// Every screen of the Figma "final flow – all clickable", one tap away, for reviewing
// the app with the team. Buttons that need a session set one up first.
import { router, type Href } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Kicker, Label, Title, TopLink } from '../components/kit';
import { Button, Screen } from '../components/ui';
import type { ActivityId } from '../lib/rules';
import { useStore } from '../lib/store';
import { colors, type } from '../theme';

type Item = { label: string; go: () => void };

export default function Demo() {
  const st = useStore();
  const to = (href: string) => () => router.push(href as Href);
  const live = (a: ActivityId, min: number, href = '/session') => () => {
    st.startAgo(a, min);
    setTimeout(() => router.push(href as Href), 0);
  };
  const done = (a: ActivityId, min: number, auto = false, href = '/stamp') => () => {
    st.simulate(a, min, auto);
    setTimeout(() => router.push(href as Href), 0);
  };

  const groups: [string, Item[]][] = [
    ['01 Onboarding', [{ label: 'Onboarding (11 screens)', go: to('/onboarding') }]],
    ['02 Home & social', [
      { label: 'Home', go: to('/home') },
      { label: "Who's out", go: to('/social') },
      { label: 'Join confirmed', go: to('/social/join') },
      { label: 'My status', go: to('/social/status') },
      { label: 'Plan together', go: to('/social/plan') },
      { label: 'Invite received', go: () => { st.setSocial({ coffeeWalk: 'invited' }); router.push('/social/invite'); } },
      { label: 'Coffee walk confirmed', go: to('/social/going') },
    ]],
    ['03/04 Deep work & team session', [
      { label: 'Check-in tap', go: to('/checkin?activity=deep_work') },
      { label: 'Deep work started', go: live('deep_work', 0, '/started') },
      { label: 'Walk started', go: live('walk', 0, '/started') },
      { label: 'Break started', go: live('break', 0, '/started') },
      { label: 'Active session', go: live('deep_work', 42) },
      { label: 'Team session active', go: live('team_session', 35) },
      { label: '2 hour reminder', go: live('deep_work', 121) },
      { label: 'Push notification', go: live('deep_work', 118, '/reminder') },
      { label: 'Check-out tap', go: live('deep_work', 84, '/checkout') },
      { label: 'Summary', go: done('deep_work', 95) },
      { label: 'Auto check out', go: done('deep_work', 120, true, '/auto-ended') },
    ]],
    ['05 Mental walk', [
      { label: 'Check-in tap', go: to('/checkin?activity=walk') },
      { label: 'Active walk', go: live('walk', 12) },
      { label: 'Check-out tap', go: live('walk', 20, '/checkout') },
      { label: 'Summary', go: done('walk', 22) },
    ]],
    ['06 Break zone', [
      { label: 'Check-in tap', go: to('/checkin?activity=break') },
      { label: 'Active break', go: live('break', 6) },
      { label: 'Check-out tap', go: live('break', 12, '/checkout') },
      { label: 'Summary', go: done('break', 12) },
    ]],
    ['07 Outside meeting', [
      { label: 'Join or host', go: to('/meeting') },
      { label: 'Lobby', go: to('/meeting/lobby') },
      { label: 'Waiting for host', go: to('/meeting/waiting') },
      { label: 'Add meeting details', go: to('/meeting/details') },
      { label: 'Meeting started', go: live('meeting', 0, '/meeting/started') },
      { label: 'Meeting timer', go: live('meeting', 15) },
      { label: 'Summary', go: done('meeting', 45) },
      { label: 'Auto ended meeting', go: done('meeting', 60, false, '/auto-ended?meeting=1') },
    ]],
    ['08 Edge cases & rewards', [
      { label: 'Auto ended + I left earlier', go: done('deep_work', 135, true, '/auto-ended') },
      { label: 'Table claim (newcomer)', go: to('/table-claim') },
      { label: 'Table claim (your table)', go: live('deep_work', 50, '/table-claimed') },
      { label: 'Note: too short', go: to('/note?reason=too_short') },
      { label: 'Note: invite already counted', go: to('/note?reason=invite_used') },
      { label: 'Note: nobody tapped out', go: to('/note?reason=nobody_out') },
      { label: 'Coffee voucher', go: () => { st.loadDemo(400); setTimeout(() => router.push('/voucher'), 0); } },
      { label: 'How points work', go: to('/points') },
    ]],
  ];

  return (
    <Screen scroll style={{ gap: 18 }}>
      <TopLink onPress={() => router.replace('/home')} />
      <Kicker>for the team</Kicker>
      <Title>All screens</Title>
      <Text style={s.body}>Opens each screen of the Figma flow. Buttons that need a running session start one for you.</Text>
      {groups.map(([name, items]) => (
        <View key={name} style={{ gap: 8 }}>
          <Label>{name}</Label>
          {items.map((i) => (
            <Button key={i.label} small variant="outline" label={i.label} onPress={i.go} />
          ))}
        </View>
      ))}
    </Screen>
  );
}

const s = StyleSheet.create({ body: { ...type.body, color: colors.plum } });
