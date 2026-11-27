// "What's your status?": open to join, focusing or away, where and until when.
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ChipGroup, Radio } from '../../components/Choice';
import { Title, TopLink } from '../../components/kit';
import { Button, Screen } from '../../components/ui';
import { useStore, type StatusKind } from '../../lib/store';
import { colors, type } from '../../theme';

const KINDS: { id: StatusKind; title: string; sub: string }[] = [
  { id: 'open', title: 'Open to join', sub: 'Colleagues can join you outside' },
  { id: 'focusing', title: 'Focusing', sub: 'Busy now, others can plan a walk after' },
  { id: 'away', title: 'Away', sub: 'You do not show in the outside list' },
];

export default function Status() {
  const { social, setSocial } = useStore();
  const [st, setSt] = useState(social.status);
  return (
    <Screen
      scroll
      style={{ gap: 14 }}
      footer={
        <>
          <Button
            label="Share status"
            onPress={() => {
              setSocial({ status: st });
              router.replace('/social');
            }}
          />
          <Text style={s.small}>Your team, including your manager, sees the same status.</Text>
        </>
      }
    >
      <TopLink onPress={() => router.replace('/social')} />
      <Title>What's your status?</Title>
      <View style={{ gap: 8 }}>
        {KINDS.map((k) => (
          <Radio key={k.id} title={k.title} sub={k.sub} on={st.kind === k.id} onPress={() => setSt({ ...st, kind: k.id })} />
        ))}
      </View>
      {st.kind !== 'away' ? (
        <>
          <ChipGroup label="Where" options={['Table 1', 'Terrace', 'Park']} value={st.where} onChange={(where) => setSt({ ...st, where })} />
          <ChipGroup label="Until" options={['15:00', '16:00', '17:00']} value={st.until} onChange={(until) => setSt({ ...st, until })} />
        </>
      ) : null}
    </Screen>
  );
}

const s = StyleSheet.create({ small: { ...type.small, color: colors.plum, textAlign: 'center' } });
