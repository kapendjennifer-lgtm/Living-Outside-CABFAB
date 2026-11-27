// "Table check" for someone tapping a table that is marked as working.
// Claiming gives the person at the table 2 minutes to tap and keep it.
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Bar, InfoRow, Kicker, Label, Title } from '../components/kit';
import { TabBar } from '../components/TabBar';
import { Button, Screen } from '../components/ui';
import { clock, useNow } from '../lib/time';
import { colors, fonts, type } from '../theme';

const WINDOW = 2 * 60000;

export default function TableClaim() {
  const [askedAt, setAskedAt] = useState<number | null>(null);
  const now = useNow();
  const left = askedAt ? Math.max(0, WINDOW - (now - askedAt)) : WINDOW;
  const claim = () => router.replace('/tap/terrace-deep-work');

  return (
    <Screen scroll footer={<TabBar active="home" />} style={{ gap: 14 }}>
      <Kicker>table check</Kicker>
      <Title>{askedAt ? 'We asked the person at this table' : 'Is this table empty?'}</Title>
      <InfoRow icon="pin" title="Binckhaven park" sub="Table 4 · marked as working" />
      {askedAt ? (
        <>
          <Text style={s.body}>If they don't tap the touchpoint in time, the table is yours.</Text>
          <View style={s.card}>
            <Label>Time left for them</Label>
            <Text style={s.big}>{clock(left)}</Text>
            <Bar value={left / WINDOW} />
          </View>
          {left === 0 ? <Button label="Check in here" onPress={claim} /> : <Button variant="outline" label="Testing: skip 2 minutes" onPress={claim} />}
        </>
      ) : (
        <View style={{ gap: 10, marginTop: 120 }}>
          <Button label="Yes, claim it" onPress={() => setAskedAt(Date.now())} />
          <Button variant="outline" label="No, cancel" onPress={() => router.replace('/home')} />
        </View>
      )}
    </Screen>
  );
}

const s = StyleSheet.create({
  body: { ...type.body, color: colors.plum },
  card: { backgroundColor: colors.sky, borderRadius: 24, padding: 24, gap: 8 },
  big: { fontFamily: fonts.bold, fontSize: 56, letterSpacing: -1.7, color: colors.plum },
});
