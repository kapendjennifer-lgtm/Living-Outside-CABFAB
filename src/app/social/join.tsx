// "You're joining Lena": she gets a heads-up that you're on your way.
import { router } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { EventCard } from '../../components/EventCard';
import { Title, TopLink } from '../../components/kit';
import { Button, Screen } from '../../components/ui';
import { useStore } from '../../lib/store';
import { colors, type } from '../../theme';

export default function Join() {
  const { setSocial } = useStore();
  return (
    <Screen
      style={{ gap: 14 }}
      footer={
        <>
          <Button
            label="I'm on my way"
            onPress={() => {
              setSocial({ joining: 'Lena' });
              router.replace('/checkin?activity=team_session');
            }}
          />
          <Button variant="outline" label="Cancel" onPress={() => router.replace('/social')} />
        </>
      }
    >
      <TopLink onPress={() => router.replace('/social')} />
      <Title>You're joining Lena</Title>
      <EventCard letter="L" title="Lena" lines={['Deep work · until 17:00', 'Table 1 · 5 min walk from the entrance']} />
      <Text style={s.body}>Lena gets a heads-up that you are on your way.</Text>
    </Screen>
  );
}

const s = StyleSheet.create({ body: { ...type.body, color: colors.plum } });
