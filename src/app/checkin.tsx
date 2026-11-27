// "Tap to check in": tells you to tap the touchpoint. Until we have real tags,
// the buttons below simulate a tap by opening the same link a tag would.
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { TapTarget } from '../components/TapTarget';
import { Button, Heading, Screen, text } from '../components/ui';
import { SPOTS } from '../lib/spots';

export default function CheckIn() {
  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <Heading kicker="ready to go outside?" title="Tap to check in" />
        <Text style={text.body}>Hold the top of your phone against the touchpoint outside.</Text>
        <TapTarget />
        <Text style={[text.label, s.sim]}>Simulate a tap (no tag yet)</Text>
        <View style={s.list}>
          {Object.values(SPOTS).map((spot) => (
            <Button key={spot.id} small variant="outline" label={spot.name} onPress={() => router.replace(`/tap/${spot.id}`)} />
          ))}
        </View>
        <View style={{ height: 16 }} />
        <Button label="Cancel" variant="outline" onPress={() => router.back()} />
      </ScrollView>
    </Screen>
  );
}

const s = StyleSheet.create({
  sim: { marginBottom: 8 },
  list: { gap: 8 },
});
