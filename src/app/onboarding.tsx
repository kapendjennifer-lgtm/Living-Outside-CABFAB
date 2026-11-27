// First launch: the 8 onboarding steps on plum, with a yellow round "next" button.
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components/ui';
import { TapTarget } from '../components/TapTarget';
import { useStore } from '../lib/store';
import { colors, type } from '../theme';

const STEPS = [
  { n: '', kicker: 'hello there!', title: 'Make the most of the Outside Office with STAMPS!' },
  { n: '01', title: 'Collect points for different activities', body: 'Work, meet, walk or take a break outside.' },
  { n: '02', title: 'Tap in', body: 'Tap your phone on the check-in point outside.', tap: true },
  { n: '03', title: 'Your session starts right away', body: 'No forms, no buttons. The timer just runs.' },
  { n: '04', title: 'Earn points every 30 minutes outside', body: '10 points per 30 minutes of deep work, up to 40 a day.' },
  { n: '05', title: 'Done? Check out the same way', body: 'Tap the same point again on your way back in.', tap: true },
  { n: '06', title: 'Get closer to a new stamp every time you go outside', body: 'Every 50 points fills one stamp.' },
  { n: '07', title: 'Fill all 8 stamps to claim your reward!', body: 'Eight stamps make one free coffee.' },
  { n: '08', title: 'Your day at a glance', body: 'See your points, stamps and who is outside on Home.' },
];

export default function Onboarding() {
  const [i, setI] = useState(0);
  const { finishOnboarding } = useStore();
  const step = STEPS[i];
  const last = i === STEPS.length - 1;

  const next = () => {
    if (!last) return setI(i + 1);
    finishOnboarding();
    router.replace('/home');
  };

  return (
    <Screen dark style={{ justifyContent: 'space-between' }}>
      <View style={s.dots}>
        {STEPS.map((_, k) => (
          <View key={k} style={[s.dot, k === i && s.dotOn]} />
        ))}
      </View>
      <View>
        {step.tap ? <TapTarget /> : null}
        {step.kicker ? <Text style={s.kicker}>{step.kicker}</Text> : null}
        {step.n ? <Text style={s.n}>{step.n}</Text> : null}
        <Text style={s.title}>{step.title}</Text>
        {step.body ? <Text style={s.body}>{step.body}</Text> : null}
      </View>
      <View style={s.footer}>
        <Pressable onPress={() => { finishOnboarding(); router.replace('/home'); }}>
          <Text style={s.skip}>{last ? '' : 'Skip'}</Text>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel={last ? 'Start' : 'Next'} onPress={next} style={s.next}>
          <Text style={s.arrow}>{last ? 'Go' : '→'}</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  dots: { flexDirection: 'row', gap: 6 },
  dot: { flex: 1, height: 3, borderRadius: 2, backgroundColor: 'rgba(247,240,227,0.25)' },
  dotOn: { backgroundColor: colors.yellow },
  kicker: { ...type.script, color: colors.yellow, marginBottom: 4 },
  n: { ...type.display, color: colors.yellow },
  title: { ...type.title, color: colors.cream },
  body: { ...type.body, color: colors.cream, opacity: 0.8, marginTop: 12 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  skip: { ...type.body, color: colors.cream, opacity: 0.7 },
  next: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.yellow, alignItems: 'center', justifyContent: 'center' },
  arrow: { ...type.heading, color: colors.plum },
});
