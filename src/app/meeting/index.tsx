// Tapped the meeting table: join the meeting that's forming, or host one.
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Doodles } from '../../components/Started';
import { CloseButton } from '../../components/kit';
import { Button, Screen } from '../../components/ui';
import { colors, fonts } from '../../theme';

export default function JoinOrHost() {
  return (
    <Screen
      dark
      style={{ justifyContent: 'center' }}
      footer={
        <>
          <Button variant="cream" label="Join" onPress={() => router.replace('/meeting/lobby')} />
          <Button variant="outlineCream" label="Host the Meeting" onPress={() => router.replace('/meeting/details')} />
        </>
      }
    >
      <View style={{ position: 'absolute', top: 16, right: 24 }}>
        <CloseButton dark onPress={() => router.replace('/home')} />
      </View>
      <Text style={s.title}>Join Outside Meeting?</Text>
      <Text style={s.with}>with Julie, Max and ...</Text>
      <Doodles />
    </Screen>
  );
}

const s = StyleSheet.create({
  title: { fontFamily: fonts.bold, fontSize: 48, lineHeight: 50, letterSpacing: -1.4, color: colors.cream },
  with: { fontFamily: fonts.medium, fontSize: 20, color: colors.yellow, marginTop: 12, marginBottom: 24 },
});
