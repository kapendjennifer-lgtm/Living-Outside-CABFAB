// Where an NFC tap lands. First tap checks you in, tapping again checks you out.
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Card, Screen, text } from '../../components/ui';
import { ACTIVITIES } from '../../lib/rules';
import { SPOTS } from '../../lib/spots';
import { useStore } from '../../lib/store';
import { colors, type } from '../../theme';

export default function Tap() {
  const { spot: spotId } = useLocalSearchParams<{ spot: string }>();
  const spot = SPOTS[spotId ?? ''];
  const { active, checkIn, checkOut } = useStore();
  const handled = useRef(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (handled.current || !spot) return;
    handled.current = true;
    if (active) {
      checkOut();
      router.replace('/stamp');
    } else {
      checkIn(spot.activity, spot.id);
      setStarted(true);
    }
  }, [spot, active, checkIn, checkOut]);

  if (!spot) {
    return (
      <Screen>
        <Text style={text.heading}>We don't know this touchpoint</Text>
        <Text style={[text.body, { marginVertical: 12 }]}>Try tapping again, or tell the office team.</Text>
        <Button label="Back home" onPress={() => router.replace('/home')} />
      </Screen>
    );
  }
  if (!started) return <Screen dark>{null}</Screen>;

  const a = ACTIVITIES[spot.activity];
  return (
    <Screen dark style={{ justifyContent: 'center' }}>
      <Text style={s.kicker}>you're in!</Text>
      <Text style={s.title}>{a.started}</Text>
      <View style={{ height: 32 }} />
      <Card color={colors.cream}>
        <Text style={text.label}>{spot.name}</Text>
        <Text style={[text.heading, { marginTop: 4 }]}>{a.label} session</Text>
        <Text style={[text.body, { marginTop: 4 }]}>Earn {a.points} points after {a.minMinutes} minutes.</Text>
        <View style={{ height: 16 }} />
        <Button label="See my session" onPress={() => router.replace('/session')} />
      </Card>
    </Screen>
  );
}

const s = StyleSheet.create({
  kicker: { ...type.script, color: colors.yellow, textAlign: 'center' },
  title: { ...type.title, color: colors.cream, textAlign: 'center' },
});
