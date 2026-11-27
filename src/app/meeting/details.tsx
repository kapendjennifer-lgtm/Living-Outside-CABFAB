// Host: "Add Meeting Details": how long, and who's in. Meetings count from 20 minutes.
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { IconDisc, Label, TopLink } from '../../components/kit';
import { Button, Screen } from '../../components/ui';
import { spotFor } from '../../lib/spots';
import { useStore } from '../../lib/store';
import { colors, fonts } from '../../theme';

const PEOPLE = ['You', 'Julie', 'Max'];

export default function Details() {
  const { checkIn } = useStore();
  const [min, setMin] = useState(0);
  const step = (d: number) => setMin((m) => Math.max(0, Math.min(180, m + d)));
  const label = `${Math.floor(min / 60)}h ${String(min % 60).padStart(2, '0')}min`;

  return (
    <Screen
      dark
      scroll
      style={{ gap: 16 }}
      footer={
        <Button
          variant="cream"
          label="Set the Details"
          onPress={() => {
            if (!min) return;
            checkIn('meeting', spotFor('meeting'), { host: true, people: PEOPLE, endsAt: Date.now() + min * 60000 });
            router.replace('/meeting/started');
          }}
        />
      }
    >
      <TopLink dark onPress={() => router.replace('/meeting')} />
      <Text style={s.title}>Add Meeting Details</Text>
      <View style={s.card}>
        <IconDisc name="group" size={52} />
        <Label>Set meeting duration</Label>
        <View style={s.stepper}>
          <Pressable accessibilityRole="button" accessibilityLabel="Shorter" onPress={() => step(-15)} style={s.round}>
            <Text style={s.roundText}>−</Text>
          </Pressable>
          <View style={s.pill}>
            <Text style={s.pillText}>{label}</Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Longer" onPress={() => step(15)} style={s.round}>
            <Text style={s.roundText}>+</Text>
          </Pressable>
        </View>
        {min > 0 && min < 20 ? <Text style={s.hint}>Meetings count for points from 20 minutes.</Text> : null}
        <Label>Participants</Label>
        <View style={s.people}>
          {PEOPLE.map((p) => (
            <View key={p} style={s.person}>
              <Text style={s.personText}>{p}</Text>
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  title: { fontFamily: fonts.bold, fontSize: 48, lineHeight: 50, letterSpacing: -1.4, color: colors.cream },
  card: { backgroundColor: colors.cream, borderRadius: 24, padding: 24, gap: 14 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  round: { width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, borderColor: colors.plum, alignItems: 'center', justifyContent: 'center' },
  roundText: { fontFamily: fonts.bold, fontSize: 22, color: colors.plum },
  pill: { flex: 1, backgroundColor: colors.white, borderRadius: 999, borderWidth: 1.5, borderColor: colors.plum, paddingVertical: 12, alignItems: 'center' },
  pillText: { fontFamily: fonts.bold, fontSize: 22, color: colors.plum },
  hint: { fontFamily: fonts.regular, fontSize: 13, color: colors.plum },
  people: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  person: { backgroundColor: colors.plum, borderRadius: 999, paddingHorizontal: 18, paddingVertical: 10 },
  personText: { fontFamily: fonts.medium, fontSize: 15, color: colors.cream },
});
