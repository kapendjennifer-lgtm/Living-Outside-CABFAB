// Small shared building blocks: screen, kicker + title, buttons, card.
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, radius, space, type } from '../theme';

type ScreenProps = { children: ReactNode; dark?: boolean; style?: ViewStyle; scroll?: boolean; footer?: ReactNode; bg?: string };

// A phone-width page. `scroll` lets long screens scroll; `footer` stays pinned (tab bar, main button).
export function Screen({ children, dark, style, scroll, footer, bg }: ScreenProps) {
  const backgroundColor = bg ?? (dark ? colors.plum : colors.cream);
  return (
    <SafeAreaView style={[s.screen, { backgroundColor }]}>
      {scroll ? (
        <ScrollView style={s.scroll} contentContainerStyle={[s.inner, s.scrollInner, style]}>
          {children}
        </ScrollView>
      ) : (
        <View style={[s.inner, style]}>{children}</View>
      )}
      {footer ? <View style={s.footer}>{footer}</View> : null}
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

type Variant = 'solid' | 'outline' | 'yellow' | 'cream' | 'outlineCream' | 'sky';
type BtnProps = { label: string; onPress: () => void; variant?: Variant; small?: boolean; style?: ViewStyle };

const BG: Record<Variant, string> = {
  solid: colors.plum, outline: 'transparent', yellow: colors.yellow, cream: colors.cream, outlineCream: 'transparent', sky: colors.sky,
};

export function Button({ label, onPress, variant = 'solid', small, style }: BtnProps) {
  const bg = BG[variant];
  const fg = variant === 'solid' || variant === 'outlineCream' ? colors.cream : colors.plum;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        s.btn,
        small && s.btnSmall,
        { backgroundColor: bg, opacity: pressed ? 0.8 : 1 },
        variant === 'outline' && s.btnOutline,
        variant === 'outlineCream' && [s.btnOutline, { borderColor: colors.cream }],
        style,
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
  scroll: { width: '100%', maxWidth: 440 },
  scrollInner: { flexGrow: 1 },
  footer: { width: '100%', maxWidth: 440, paddingHorizontal: space(6), paddingBottom: space(4), paddingTop: space(2), gap: 10 },
  inner: { flex: 1, width: '100%', maxWidth: 440, paddingHorizontal: space(6), paddingTop: space(6), paddingBottom: space(4) },
  kicker: { fontFamily: fonts.hand, fontSize: 22, marginBottom: 2 },
  title: type.title,
  btn: { height: 56, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space(6) },
  btnSmall: { height: 40 },
  btnOutline: { borderWidth: 1.5, borderColor: colors.plum },
  btnText: { fontFamily: fonts.medium, fontSize: 16 },
  card: { borderRadius: radius.card, padding: space(6) },
});
