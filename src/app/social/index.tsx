// Who's out in the sunshine: colleagues outside right now, and your own status.
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon } from '../../components/Icons';
import { Avatar, Chip, IconDisc, Kicker, Label, Title } from '../../components/kit';
import { TabBar } from '../../components/TabBar';
import { Button, Screen } from '../../components/ui';
import { COLLEAGUES, STATUS_LABEL } from '../../lib/people';
import { useStore } from '../../lib/store';
import { colors, fonts, type } from '../../theme';

const CHIP = { 'Open to join': colors.sky, Focusing: colors.pink, Planned: colors.yellow };

export default function WhosOut() {
  const { name, social } = useStore();
  const st = social.status;

  const act = (who: string) => {
    if (who === 'Lena') router.push('/social/join');
    else if (who === 'Mara') router.push('/social/plan?who=Mara');
    else router.push(social.coffeeWalk === 'going' ? '/social/going' : '/social/invite');
  };

  return (
    <Screen scroll footer={<TabBar active="people" />} style={{ gap: 14 }}>
      <View style={s.head}>
        <View style={{ flex: 1 }}>
          <Kicker>{`hello ${name}!`}</Kicker>
          <Title>Who's out in the sunshine?</Title>
        </View>
        <IconDisc name="person" color={colors.sky} />
      </View>

      {COLLEAGUES.map((c) => {
        const invited = c.name === 'Mara' && social.invited.includes('Mara');
        const going = c.name === 'Justin' && social.coffeeWalk === 'going';
        return (
          <View key={c.name} style={s.card}>
            <View style={s.row}>
              <Avatar letter={c.name[0]} size={44} />
              <View style={{ flex: 1 }}>
                <Text style={s.name}>{c.name}</Text>
                <Text style={s.line}>{c.line}</Text>
              </View>
              <Chip label={c.state} color={CHIP[c.state]} />
            </View>
            {invited ? (
              <Chip label="Invite sent" color={colors.straw} />
            ) : (
              <Button small variant={going ? 'sky' : 'outline'} label={going ? 'Going' : c.action} onPress={() => act(c.name)} />
            )}
          </View>
        );
      })}

      <Pressable style={s.status} onPress={() => router.push('/social/status')} accessibilityRole="button">
        <Avatar letter={name[0]} size={44} color={colors.cream} />
        <View style={{ flex: 1 }}>
          <Label dark>Your status</Label>
          <Text style={s.statusText}>
            {st.kind === 'away' ? 'Away' : `${STATUS_LABEL[st.kind]} · ${st.where} · until ${st.until}`}
          </Text>
        </View>
        <Icon name="arrow" color={colors.cream} />
      </Pressable>
      <Button variant="outline" label="Plan something together" onPress={() => router.push('/social/plan')} />
    </Screen>
  );
}

const s = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  card: { backgroundColor: colors.white, borderRadius: 24, borderWidth: 1.5, borderColor: colors.plum, padding: 16, gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  name: { fontFamily: fonts.bold, fontSize: 18, color: colors.plum },
  line: { ...type.small, color: colors.plum },
  status: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.plum, borderRadius: 24, padding: 16 },
  statusText: { fontFamily: fonts.medium, fontSize: 16, color: colors.cream },
});
