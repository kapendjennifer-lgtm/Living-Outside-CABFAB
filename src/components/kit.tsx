// The small pieces every screen in the final flow is built from:
// kicker + title, chips, info rows, icon discs, progress bars, notes, avatars, sheets.
import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { colors, fonts, type } from '../theme';
import { Icon, type IconName } from './Icons';

export function Kicker({ children, dark, center }: { children: string; dark?: boolean; center?: boolean }) {
  return (
    <Text style={[s.kicker, dark && s.kickerDark, center && { textAlign: 'center' }]}>{children}</Text>
  );
}

export function Title({ children, dark, big, center }: { children: string; dark?: boolean; big?: boolean; center?: boolean }) {
  return (
    <Text style={[big ? s.titleBig : type.title, { color: dark ? colors.cream : colors.plum }, center && { textAlign: 'center' }]}>
      {children}
    </Text>
  );
}

export function Label({ children, dark, style }: { children: string; dark?: boolean; style?: object }) {
  return <Text style={[type.label, { color: dark ? colors.cream : colors.plum }, style]}>{children}</Text>;
}

export function Chip({ label, color = colors.sky, onPress, selected, dark }: { label: string; color?: string; onPress?: () => void; selected?: boolean; dark?: boolean }) {
  const bg = selected ? colors.plum : color;
  const fg = selected || dark ? colors.cream : colors.plum;
  const body = (
    <View style={[s.chip, { backgroundColor: bg }]}>
      <Text style={[s.chipText, { color: fg }]}>{label}</Text>
    </View>
  );
  return onPress ? <Pressable accessibilityRole="button" onPress={onPress}>{body}</Pressable> : body;
}

export function IconDisc({ name, color = colors.yellow, size = 44, iconColor = colors.plum }: { name: IconName; color?: string; size?: number; iconColor?: string }) {
  return (
    <View style={[s.disc, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]}>
      <Icon name={name} size={size * 0.6} color={iconColor} />
    </View>
  );
}

export function InfoRow({ icon, disc, title, sub, right, onPress }: { icon: IconName; disc?: string; title: string; sub?: string; right?: ReactNode; onPress?: () => void }) {
  const row = (
    <View style={s.row}>
      <IconDisc name={icon} color={disc} />
      <View style={{ flex: 1 }}>
        <Text style={s.rowTitle}>{title}</Text>
        {sub ? <Text style={s.rowSub}>{sub}</Text> : null}
      </View>
      {right}
    </View>
  );
  return onPress ? <Pressable onPress={onPress}>{row}</Pressable> : row;
}

export function Bar({ value, track = colors.white, fill = colors.plum, height = 10 }: { value: number; track?: string; fill?: string; height?: number }) {
  return (
    <View style={{ height, borderRadius: 999, backgroundColor: track, overflow: 'hidden' }}>
      <View style={{ height, width: `${Math.max(0, Math.min(1, value)) * 100}%`, backgroundColor: fill }} />
    </View>
  );
}

export function Note({ children, icon, style }: { children: string; icon?: IconName; style?: ViewStyle }) {
  return (
    <View style={[s.note, style]}>
      {icon ? <Icon name={icon} size={28} /> : null}
      <Text style={s.noteText}>{children}</Text>
    </View>
  );
}

export function Avatar({ letter, size = 36, color = colors.yellow }: { letter: string; size?: number; color?: string }) {
  return (
    <View style={[s.disc, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]}>
      <Text style={[s.avatar, { fontSize: size * 0.42 }]}>{letter}</Text>
    </View>
  );
}

export function PersonRow({ name, right }: { name: string; right?: ReactNode }) {
  return (
    <View style={s.person}>
      <Avatar letter={name[0]} />
      <Text style={s.personName}>{name}</Text>
      {right}
    </View>
  );
}

export function TopLink({ label = 'Back', onPress, dark }: { label?: string; onPress: () => void; dark?: boolean }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={s.back}>
      <Icon name="back" size={16} color={dark ? colors.cream : colors.plum} stroke={2} />
      <Text style={[s.backText, dark && { color: colors.cream }]}>{label}</Text>
    </Pressable>
  );
}

export function CloseButton({ onPress, dark }: { onPress: () => void; dark?: boolean }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={onPress} style={s.close}>
      <Icon name="close" size={22} color={dark ? colors.cream : colors.plum} stroke={2} />
    </Pressable>
  );
}

// Bottom sheet over a dimmed plum backdrop (2 hour reminder, "I left earlier").
export function Sheet({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  return (
    <Modal transparent visible={open} animationType="fade" onRequestClose={onClose}>
      <Pressable style={s.dim} onPress={onClose} accessibilityLabel="Close sheet" />
      <View style={s.sheet}>
        <View style={s.grip} />
        {children}
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  kicker: { fontFamily: fonts.hand, fontSize: 28, lineHeight: 35, color: colors.plum },
  kickerDark: { fontSize: 36, lineHeight: 44, color: colors.yellow },
  titleBig: { fontFamily: fonts.bold, fontSize: 48, lineHeight: 50, letterSpacing: -1.4 },
  chip: { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 7, alignSelf: 'flex-start' },
  chipText: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 21 },
  disc: { alignItems: 'center', justifyContent: 'center' },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 72, paddingHorizontal: 14, paddingVertical: 12,
    backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.plum, borderRadius: 20,
  },
  rowTitle: { fontFamily: fonts.medium, fontSize: 18, color: colors.plum },
  rowSub: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 21, color: colors.plum, opacity: 0.8 },
  note: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.straw, borderRadius: 24, paddingHorizontal: 18, paddingVertical: 16 },
  noteText: { flex: 1, fontFamily: fonts.regular, fontSize: 14, lineHeight: 21, color: colors.plum },
  avatar: { fontFamily: fonts.bold, color: colors.plum },
  person: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.white, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
  personName: { flex: 1, fontFamily: fonts.bold, fontSize: 15, color: colors.plum },
  back: { flexDirection: 'row', alignItems: 'center', gap: 4, height: 44, alignSelf: 'flex-start', marginLeft: -12, paddingHorizontal: 12 },
  backText: { fontFamily: fonts.medium, fontSize: 14, color: colors.plum },
  close: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end', marginRight: -10 },
  dim: { flex: 1, backgroundColor: 'rgba(105,22,65,0.6)' },
  sheet: {
    position: 'absolute', left: 0, right: 0, bottom: 0, maxWidth: 440, alignSelf: 'center', width: '100%',
    backgroundColor: colors.cream, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 36, gap: 14,
  },
  grip: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(105,22,65,0.25)', marginBottom: 4 },
});
