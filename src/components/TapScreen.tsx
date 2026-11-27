// Shared layout of every "Tap to check in" / "Tap to check out" screen.
// Pressing the rings simulates the NFC tap until real tags are in place.
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, type } from '../theme';
import { Chip, Kicker, Label, Title } from './kit';
import { TapTarget } from './TapTarget';
import { Button, Screen } from './ui';

type Props = {
  mode: 'in' | 'out';
  kicker: string;
  chip: string;
  title: string;
  body: string;
  tip: string;
  cancel: string;
  onTap: () => void;
  onCancel: () => void;
  extra?: ReactNode;
};

export function TapScreen({ mode, kicker, chip, title, body, tip, cancel, onTap, onCancel, extra }: Props) {
  return (
    <Screen scroll footer={<Button variant="outline" label={cancel} onPress={onCancel} />}>
      <View style={s.top}>
        <Kicker>{kicker}</Kicker>
        <Chip label={chip} color={mode === 'in' ? colors.yellow : colors.sky} />
      </View>
      <Title>{title}</Title>
      <Text style={s.body}>{body}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel="Simulate a tap" onPress={onTap} style={s.rings}>
        <TapTarget mode={mode} scale={0.9} />
      </Pressable>
      <Label>Tip</Label>
      <Text style={s.tip}>{tip}</Text>
      {extra}
    </Screen>
  );
}

const s = StyleSheet.create({
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  body: { ...type.body, color: colors.plum, marginTop: 8 },
  rings: { marginVertical: 12 },
  tip: { ...type.small, color: colors.plum, marginTop: 4 },
});
