// "Tap to check in". A real NFC tag opens /tap/<spot> directly; until tags are up,
// pressing the rings simulates that tap. The chips pick which touchpoint you're at.
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Chip, Label } from '../components/kit';
import { TapScreen } from '../components/TapScreen';
import { COPY } from '../lib/copy';
import { ACTIVITIES, type ActivityId } from '../lib/rules';
import { spotFor } from '../lib/spots';
import { useStore } from '../lib/store';
import { colors } from '../theme';

const ORDER: ActivityId[] = ['deep_work', 'team_session', 'walk', 'break', 'meeting'];

export default function CheckIn() {
  const { activity: param } = useLocalSearchParams<{ activity?: ActivityId }>();
  const { active } = useStore();
  if (active) return <Redirect href="/session" />;
  const activity: ActivityId = param && param in ACTIVITIES ? param : 'deep_work';
  const c = COPY[activity];

  return (
    <TapScreen
      mode="in"
      kicker={c.tapKicker}
      chip="Scanning…"
      title="Tap to check in"
      body={c.tapBody}
      tip="Your phone buzzes when it's connected."
      cancel="Cancel"
      onTap={() => router.replace(`/tap/${spotFor(activity)}`)}
      onCancel={() => (router.canGoBack() ? router.back() : router.replace('/home'))}
      extra={
        <View style={s.sim}>
          <Label>Testing: which touchpoint are you at?</Label>
          <View style={s.chips}>
            {ORDER.map((id) => (
              <Chip
                key={id}
                label={ACTIVITIES[id].label}
                selected={id === activity}
                onPress={() => router.setParams({ activity: id })}
              />
            ))}
            <Chip label="Table 4 (taken)" color={colors.pink} onPress={() => router.push('/table-claim')} />
          </View>
        </View>
      }
    />
  );
}

const s = StyleSheet.create({
  sim: { marginTop: 20, gap: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
