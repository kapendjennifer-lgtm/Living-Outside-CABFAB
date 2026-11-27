// "Plan something together": what, when, who. An invite counts toward your
// stamps once they join (10 for you, 5 for them, max 2 a week per colleague).
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Check, ChipGroup } from '../../components/Choice';
import { Label, Title, TopLink } from '../../components/kit';
import { Button, Screen } from '../../components/ui';
import { useStore } from '../../lib/store';
import { colors, type } from '../../theme';

export default function Plan() {
  const { who: preset } = useLocalSearchParams<{ who?: string }>();
  const { social, setSocial } = useStore();
  const [what, setWhat] = useState('Walk');
  const [when, setWhen] = useState('16:00');
  const [who, setWho] = useState<string[]>(preset ? [preset] : []);
  const toggle = (n: string) => setWho((w) => (w.includes(n) ? w.filter((x) => x !== n) : [...w, n]));

  const send = () => {
    if (!who.length) return;
    // Already got an invite bonus with this colleague this week: say so kindly.
    if (who.some((n) => social.invited.includes(n))) {
      router.replace('/note?reason=invite_used');
      return;
    }
    setSocial({ invited: [...social.invited, ...who] });
    router.replace('/social');
  };

  return (
    <Screen
      scroll
      style={{ gap: 16 }}
      footer={
        <>
          <Button label="Send invite" onPress={send} />
          <Text style={s.small}>Counts toward your stamps once they join.</Text>
        </>
      }
    >
      <TopLink onPress={() => router.replace('/social')} />
      <Title>Plan something together</Title>
      <ChipGroup label="What" options={['Walk', 'Coffee', 'Work outside']} value={what} onChange={setWhat} />
      <ChipGroup label="When" options={['16:00', '16:30', '17:00']} value={when} onChange={setWhen} />
      <View style={{ gap: 8 }}>
        <Label>Who</Label>
        {['Lena', 'Mara', 'Justin'].map((n) => (
          <Check key={n} name={n} on={who.includes(n)} onPress={() => toggle(n)} />
        ))}
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({ small: { ...type.small, color: colors.plum, textAlign: 'center' } });
