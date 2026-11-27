// "Justin invited you": a coffee walk at 15:00.
import { Redirect, router } from 'expo-router';
import { View } from 'react-native';
import { Chip, Title, TopLink } from '../../components/kit';
import { EventCard } from '../../components/EventCard';
import { TabBar } from '../../components/TabBar';
import { Button, Screen } from '../../components/ui';
import { useStore } from '../../lib/store';
import { WALK_LINES } from '../../lib/people';
import { colors } from '../../theme';

export default function Invite() {
  const { social, setSocial } = useStore();
  if (social.coffeeWalk === 'going') return <Redirect href="/social/going" />;
  return (
    <Screen scroll style={{ gap: 14 }} footer={<TabBar active="chat" />}>
      <TopLink onPress={() => router.replace('/social')} />
      <Title>Justin invited you</Title>
      <EventCard letter="J" title="Coffee walk" lines={WALK_LINES} />
      <Chip label={social.coffeeWalk === 'declined' ? 'Not going' : 'Going: Justin, Lena'} color={colors.straw} />
      <View style={{ gap: 10, marginTop: 12 }}>
        <Button
          label="I'm in"
          onPress={() => {
            setSocial({ coffeeWalk: 'going' });
            router.replace('/social/going');
          }}
        />
        <Button
          variant="outline"
          label="Not now"
          onPress={() => {
            setSocial({ coffeeWalk: 'declined' });
            router.replace('/social');
          }}
        />
      </View>
    </Screen>
  );
}
