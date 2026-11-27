// Where an NFC tap lands (outsideoffice://tap/<spot> or https://…/tap/<spot>).
// No session: check in (meetings go to "join or host" first).
// Same spot while checked in: check out. Another spot: one session at a time.
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Text } from 'react-native';
import { Kicker, Title } from '../../components/kit';
import { Button, Screen, text } from '../../components/ui';
import { COPY } from '../../lib/copy';
import { SPOTS } from '../../lib/spots';
import { useStore } from '../../lib/store';

type Result = 'busy' | null;

export default function Tap() {
  const { spot: spotId } = useLocalSearchParams<{ spot: string }>();
  const spot = SPOTS[spotId ?? ''];
  const { active, checkIn, checkOut } = useStore();
  const handled = useRef(false);
  const [result, setResult] = useState<Result>(null);

  useEffect(() => {
    if (handled.current || !spot) return;
    handled.current = true;
    if (active && active.spot === spot.id) {
      const out = checkOut();
      router.replace(out?.counted ? '/stamp' : `/note?reason=${out?.counted === false ? out.reason : 'too_short'}`);
    } else if (active) {
      setResult('busy');
    } else if (spot.activity === 'meeting') {
      router.replace('/meeting');
    } else {
      checkIn(spot.activity, spot.id);
      router.replace('/started');
    }
  }, [spot, active, checkIn, checkOut]);

  if (!spot) {
    return (
      <Screen>
        <Title>We don't know this touchpoint</Title>
        <Text style={[text.body, { marginVertical: 12 }]}>Try tapping again, or tell the office team.</Text>
        <Button label="Back home" onPress={() => router.replace('/home')} />
      </Screen>
    );
  }
  if (result === 'busy' && active) {
    return (
      <Screen footer={<Button label="See my session" onPress={() => router.replace('/session')} />}>
        <Kicker>one at a time</Kicker>
        <Title>You're already checked in</Title>
        <Text style={[text.body, { marginTop: 12 }]}>
          {`Check out of ${COPY[active.activity].activeTitle.toLowerCase()} first, then tap here again.`}
        </Text>
      </Screen>
    );
  }
  return <Screen dark>{null}</Screen>;
}
