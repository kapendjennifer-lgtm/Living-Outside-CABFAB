// Radio rows and chip groups for "What's your status?" and "Plan something together".
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, type } from '../theme';
import { Avatar, Chip, Label } from './kit';

export function Radio({ title, sub, on, onPress }: { title: string; sub: string; on: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="radio" accessibilityState={{ checked: on }} style={[s.radio, on && s.radioOn]}>
      <View style={s.circle}>{on ? <View style={s.inner} /> : null}</View>
      <View style={{ flex: 1 }}>
        <Text style={s.title}>{title}</Text>
        <Text style={s.sub}>{sub}</Text>
      </View>
    </Pressable>
  );
}

export function ChipGroup({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <View style={{ gap: 8 }}>
      <Label>{label}</Label>
      <View style={s.chips}>
        {options.map((o) => (
          <Chip key={o} label={o} color={colors.white} selected={o === value} onPress={() => onChange(o)} />
        ))}
      </View>
    </View>
  );
}

export function Check({ name, on, onPress }: { name: string; on: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="checkbox" accessibilityState={{ checked: on }} style={s.check}>
      <Avatar letter={name[0]} />
      <Text style={[s.title, { flex: 1 }]}>{name}</Text>
      <View style={[s.box, on && s.boxOn]}>{on ? <Text style={s.tick}>✓</Text> : null}</View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  radio: { flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: colors.white, borderRadius: 20, borderWidth: 1.5, borderColor: 'transparent', padding: 14 },
  radioOn: { borderColor: colors.plum },
  circle: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: colors.plum, alignItems: 'center', justifyContent: 'center' },
  inner: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.plum },
  title: { fontFamily: fonts.medium, fontSize: 16, color: colors.plum },
  sub: { ...type.small, color: colors.plum, opacity: 0.85 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  check: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.white, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
  box: { width: 24, height: 24, borderRadius: 6, borderWidth: 1.5, borderColor: colors.plum, alignItems: 'center', justifyContent: 'center' },
  boxOn: { backgroundColor: colors.plum },
  tick: { color: colors.cream, fontFamily: fonts.bold, fontSize: 14 },
});
