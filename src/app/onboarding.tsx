// First launch: the 11 onboarding screens from "01 · Onboarding" on plum,
// with a yellow round "next" button and a Skip link.
import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { DayOverview, PointsCard, RuleList, StampsCard } from '../components/Cards';
import { Icon } from '../components/Icons';
import { Chip, IconDisc, Label } from '../components/kit';
import { TapTarget } from '../components/TapTarget';
import { Button, Screen } from '../components/ui';
import { ONBOARDING_RULES } from '../lib/rulesCopy';
import { useStore } from '../lib/store';
import { EXAMPLE_DAY } from '../lib/today';
import { colors, fonts, type } from '../theme';

type Step = { n?: string; title: string; body?: string; visual?: ReactNode; chip?: boolean };

function MiniSession({ time, extra }: { time: string; extra?: string }) {
  return (
    <View style={s.mini}>
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <IconDisc name="laptop" size={52} />
        <View>
          <Text style={s.miniTitle}>Work session</Text>
          <Text style={s.miniSub}>Binckhaven Park · Table 4</Text>
        </View>
      </View>
      <Label style={{ marginTop: 16 }}>Session time</Label>
      <Text style={s.miniTime}>{time}</Text>
      {extra ? <Chip label={extra} color={colors.yellow} /> : null}
    </View>
  );
}

// The touchpoint on the table: a post with an NFC face and a light on top.
function Touchpoint() {
  return (
    <Svg width={220} height={230} viewBox="0 0 220 230">
      <Rect x={30} y={190} width={160} height={14} rx={7} fill={colors.cream} opacity={0.3} />
      <Rect x={70} y={40} width={80} height={152} rx={22} fill={colors.cream} />
      <Circle cx={110} cy={62} r={10} fill={colors.yellow} />
      <Circle cx={110} cy={62} r={18} fill={colors.yellow} opacity={0.35} />
      <Circle cx={110} cy={120} r={28} fill={colors.yellow} />
      <Path d="M102 108 q7 12 0 24 M110 103 q12 17 0 34 M118 98 q17 22 0 44" stroke={colors.plum} strokeWidth={3} fill="none" strokeLinecap="round" />
      <Rect x={88} y={160} width={44} height={8} rx={4} fill={colors.plum} opacity={0.3} />
    </Svg>
  );
}

const STEPS: Step[] = [
  { title: 'Make the most of the Outside Office with STAMPS!' },
  { n: '01', title: 'Collect points for different activities', body: 'Work, meet, walk or take a break outside. It all counts!', chip: true },
  {
    title: 'Every activity earns points',
    body: '50 points fills one stamp on your card.',
    visual: <RuleList rows={ONBOARDING_RULES} />,
  },
  { n: '02', title: 'Tap your phone on the check-in point outside', body: "You'll find the check-in points on the tables outside.", visual: <TapTarget scale={0.8} />, chip: true },
  { n: 'P.S.', title: "Here's what the check-in points look like", visual: <Touchpoint />, chip: true },
  { n: '03', title: 'Your session starts right away!', visual: <MiniSession time="00:01" />, chip: true },
  { n: '04', title: 'Earn points every 30 minutes outside', visual: <MiniSession time="00:42:18" extra="+10 pts at 1 hour" />, chip: true },
  { n: '05', title: 'Done? Check out the same way', body: 'Tap your phone at the check-in point again. Your points go straight to your card.', visual: <TapTarget mode="out" scale={0.8} /> },
  { n: '06', title: 'Get closer to a new stamp every time you go outside!', visual: <PointsCard points={30} /> },
  { n: '07', title: 'Fill all 8 stamps to claim your reward!', visual: <StampsCard stamps={5} /> },
  { n: '08', title: 'Your day at a glance', body: 'At the end of each workday, see how much time you spent outside.', visual: <DayOverview {...EXAMPLE_DAY} /> },
];

export default function Onboarding() {
  const [i, setI] = useState(0);
  const { finishOnboarding, name } = useStore();
  const step = STEPS[i];
  const last = i === STEPS.length - 1;
  const done = () => {
    finishOnboarding();
    router.replace('/home');
  };

  if (i === 0) {
    return (
      <Screen dark style={{ justifyContent: 'center' }} footer={<Button variant="yellow" label="Here is how it works →" onPress={() => setI(1)} />}>
        <Text style={s.hello}>Hello {name}!</Text>
        <Text style={s.helloTitle}>{step.title}</Text>
        <View style={s.sun}>
          <Icon name="sun" size={120} color={colors.yellow} stroke={1.2} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen
      dark
      scroll
      footer={
        <View style={s.footer}>
          <Pressable onPress={done} accessibilityRole="button">
            <Text style={s.skip}>{last ? '' : 'Skip'}</Text>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel={last ? 'Start' : 'Next'} onPress={() => (last ? done() : setI(i + 1))} style={s.next}>
            <Icon name={last ? 'check' : 'arrow'} size={26} stroke={2} />
          </Pressable>
        </View>
      }
    >
      <View style={s.dots}>
        {STEPS.slice(1).map((_, k) => (
          <View key={k} style={[s.dot, k + 1 <= i && s.dotOn]} />
        ))}
      </View>
      {step.chip ? <Chip label="Work session" color={colors.yellow} /> : null}
      {step.n ? <Text style={s.n}>{step.n}</Text> : null}
      <Text style={s.title}>{step.title}</Text>
      {step.body ? <Text style={s.body}>{step.body}</Text> : null}
      {step.visual ? <View style={s.visual}>{step.visual}</View> : null}
    </Screen>
  );
}

const s = StyleSheet.create({
  hello: { fontFamily: fonts.hand, fontSize: 44, color: colors.yellow },
  helloTitle: { fontFamily: fonts.bold, fontSize: 44, lineHeight: 46, letterSpacing: -1.3, color: colors.cream },
  sun: { alignItems: 'flex-end', marginTop: 32 },
  dots: { flexDirection: 'row', gap: 6, marginBottom: 20 },
  dot: { flex: 1, height: 3, borderRadius: 2, backgroundColor: 'rgba(247,240,227,0.25)' },
  dotOn: { backgroundColor: colors.yellow },
  n: { ...type.display, color: colors.yellow, marginTop: 12 },
  title: { ...type.title, color: colors.cream, marginTop: 8 },
  body: { ...type.body, color: colors.cream, opacity: 0.85, marginTop: 12 },
  visual: { marginTop: 24, alignItems: 'stretch' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  skip: { ...type.body, color: colors.cream, opacity: 0.7 },
  next: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.yellow, alignItems: 'center', justifyContent: 'center' },
  mini: { backgroundColor: colors.cream, borderRadius: 24, padding: 20, gap: 6 },
  miniTitle: { fontFamily: fonts.bold, fontSize: 18, color: colors.plum },
  miniSub: { ...type.small, color: colors.plum },
  miniTime: { fontFamily: fonts.bold, fontSize: 48, letterSpacing: -1.4, color: colors.plum },
});
