// Plum "you're in!" screen shown right after a check-in (and when a meeting starts).

import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, fonts } from '../theme';
import type { IconName } from './Icons';
import { Chip, CloseButton, IconDisc, Kicker, Label } from './kit';
import { Button, Screen } from './ui';

type Stat = { label: string; value: string };
type Props = {
  title: string;
  icon: IconName;
  cardTitle: string;
  cardSub: string;
  stats: Stat[];
  chips: string[];
  button: string;
  onButton: () => void;
  onClose: () => void;
};

// Hand-drawn sparkles and squiggles from the Figma doodle set (redrawn).
export function Doodles({ color = colors.yellow }: { color?: string }) {
  return (
    <Svg width="100%" height={120} viewBox="0 0 354 120" preserveAspectRatio="xMidYMid meet">
      <Path d="M40 60 l6 -18 l6 18 l18 6 l-18 6 l-6 18 l-6 -18 l-18 -6z" fill={color} />
      <Path d="M120 90 q20 -40 40 0 t40 0 t40 0" stroke={color} strokeWidth={4} fill="none" strokeLinecap="round" />
      <Path d="M300 30 l4 -12 l4 12 l12 4 l-12 4 l-4 12 l-4 -12 l-12 -4z" fill={color} />
      <Path d="M270 95 a10 10 0 1 0 0.1 0" stroke={color} strokeWidth={4} fill="none" />
    </Svg>
  );
}

export function Started({ title, icon, cardTitle, cardSub, stats, chips, button, onButton, onClose }: Props) {
  return (
    <Screen dark scroll style={{ justifyContent: 'space-between' }}>
      <View>
        <CloseButton dark onPress={onClose} />
        <Kicker dark center>you're in!</Kicker>
        <Text style={s.title}>{title}</Text>
        <Doodles />
      </View>
      <View style={s.card}>
        <View style={s.head}>
          <IconDisc name={icon} size={52} />
          <View style={{ flex: 1 }}>
            <Text style={s.cardTitle}>{cardTitle}</Text>
            <Text style={s.cardSub}>{cardSub}</Text>
          </View>
        </View>
        <View style={s.stats}>
          {stats.map((st) => (
            <View key={st.label}>
              <Label>{st.label}</Label>
              <Text style={s.value}>{st.value}</Text>
            </View>
          ))}
        </View>
        <View style={s.chips}>
          {chips.map((c) => (
            <Chip key={c} label={c} />
          ))}
        </View>
        <Button label={button} onPress={onButton} />
      </View>
    </Screen>
  );
}


const s = StyleSheet.create({
  title: { fontFamily: fonts.bold, fontSize: 56, lineHeight: 58, letterSpacing: -1.7, color: colors.cream, textAlign: 'center', marginTop: 6 },
  card: { backgroundColor: colors.cream, borderRadius: 24, padding: 24, gap: 16 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  cardTitle: { fontFamily: fonts.bold, fontSize: 20, color: colors.plum },
  cardSub: { fontFamily: fonts.regular, fontSize: 14, color: colors.plum },
  stats: { flexDirection: 'row', gap: 32 },
  value: { fontFamily: fonts.bold, fontSize: 32, letterSpacing: -0.6, color: colors.plum },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
