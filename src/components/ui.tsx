// Small shared building blocks: screen, kicker + title, buttons, card.
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, radius, space, type } from '../theme';

export function Screen({ children, dark, style }: { children: ReactNode; dark?: boolean; style?: ViewStyle }) {
  return (
    <SafeAreaView style={[s.screen, { backgroundColor: dark ? colors.plum : colors.cream }]}>
      <View style={[s.inner, style]}>{children}</View>
    </SafeAreaView>
  );
}

export function Heading({ kicker, title, dark }: { kicker?: string; title: string; dark?: boolean }) {
  const c = dark ? colors.cream : colors.plum;
  return (
    <View style={{ marginBottom: space(5) }}>
      {kicker ? <Text style={[s.kicker, { color: dark ? colors.yellow : c }]}>{kicker}</Text> : null}
      <Text style={[s.title, { color: c }]}>{title}</Text>
    </View>
  );
}

type BtnProps = { label: string; onPress: () => void; variant?: 'solid' | 'outline' | 'yellow'; small?: boolean };

export function Button({ label, onPress, variant = 'solid', small }: BtnProps) {
  const bg = variant === 'solid' ? colors.plum : variant === 'yellow' ? colors.yellow : 'transparent';
  const fg = variant === 'solid' ? colors.cream : colors.plum;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        s.btn,
        small && s.btnSmall,
        { backgroundColor: bg, opacity: pressed ? 0.8 : 1 },
        variant === 'outline' && s.btnOutline,
      ]}
    >
      <Text style={[s.btnText, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

export function Card({ children, color = colors.sky, style }: { children: ReactNode; color?: string; style?: ViewStyle }) {
  return <View style={[s.card, { backgroundColor: color }, style]}>{children}</View>;
}

export const text = StyleSheet.create({
  body: { ...type.body, color: colors.plum },
  label: { ...type.label, color: colors.plum },
  heading: { ...type.heading, color: colors.plum },
  big: { ...type.display, color: colors.plum },
});

const s = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center' },
  inner: { flex: 1, width: '100%', maxWidth: 440, paddingHorizontal: space(6), paddingTop: space(6), paddingBottom: space(4) },
  kicker: { fontFamily: fonts.hand, fontSize: 22, marginBottom: 2 },
  title: type.title,
  btn: { height: 52, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space(6) },
  btnSmall: { height: 40 },
  btnOutline: { borderWidth: 1.5, borderColor: colors.plum },
  btnText: { fontFamily: fonts.medium, fontSize: 16 },
  card: { borderRadius: radius.card, padding: space(5) },
});
