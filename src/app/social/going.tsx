// "See you at 15:00": coffee walk confirmed.
import { router } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { EventCard } from '../../components/EventCard';
import { Kicker, Title, TopLink } from '../../components/kit';
import { Button, Screen } from '../../components/ui';
import { useStore } from '../../lib/store';
import { colors, type } from '../../theme';
import { WALK_LINES } from '../../lib/people';

export default function Going() {
  const { setSocial } = useStore();
  return (
    <Screen
      style={{ gap: 14 }}
      footer={
        <>
          <Button label="Done" onPress={() => router.replace('/social')} />
          <Button
            variant="outline"
            label="Can't make it"
            onPress={() => {
              setSocial({ coffeeWalk: 'declined' });
              router.replace('/social');
            }}
          />
        </>
      }
    >
      <TopLink onPress={() => router.replace('/social')} />
      <Kicker>you're in!</Kicker>
      <Title>See you at 15:00</Title>
      <EventCard letter="J" title="Coffee walk" lines={WALK_LINES} />
      <Text style={s.body}>Justin and Lena are going. 2 spots left.</Text>
    </Screen>
  );
}

const s = StyleSheet.create({ body: { ...type.body, color: colors.plum } });
