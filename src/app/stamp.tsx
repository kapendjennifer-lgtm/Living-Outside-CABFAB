// Check-out summary on plum: "nice work!" / "fresh mind!" / "recharged!",
// the new stamp, and the card with duration and stamps so far.
import { Redirect, router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from '../components/Icons';
import { Chip, CloseButton, Kicker, Label } from '../components/kit';
import { StampDots } from '../components/Stamps';
import { Button, Screen } from '../components/ui';
import { COPY } from '../lib/copy';
import { POINTS_PER_STAMP, STAMPS_PER_VOUCHER } from '../lib/rules';
import { useStore } from '../lib/store';
import { duration } from '../lib/time';
import { colors, fonts, type } from '../theme';

const words = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight'];

export default function Summary() {
  const { lastOutcome: o, stamps, points } = useStore();
  if (!o || !o.counted) return <Redirect href="/home" />;
  const c = COPY[o.activity];
  const onCard = stamps % STAMPS_PER_VOUCHER || (stamps > 0 ? STAMPS_PER_VOUCHER : 0);
  const left = STAMPS_PER_VOUCHER - onCard;
  const full = onCard === STAMPS_PER_VOUCHER;
  const chips = o.activity === 'walk' || o.activity === 'break' ? [c.doneChip] : [c.spotTitle, c.doneChip];
  const go = () => router.replace(full && o.newStamp ? '/voucher' : '/home');

  return (
    <Screen dark scroll style={{ justifyContent: 'space-between', gap: 16 }}>
      <View style={{ alignItems: 'center' }}>
        <CloseButton dark onPress={() => router.replace('/home')} />
        <Kicker dark center>{c.doneKicker}</Kicker>
        <Text style={s.title}>{o.newStamp ? '1 stamp added' : `+${o.points} points`}</Text>
        <View style={s.slot}>
          <View style={s.stamp}>
            <Icon name={c.icon} size={60} stroke={1.5} />
            <Text style={s.stampPts}>+{o.points} pts</Text>
          </View>
        </View>
        <View style={s.chips}>
          {chips.map((t) => (
            <Chip key={t} label={t} />
          ))}
        </View>
      </View>

      <View style={s.card}>
        <View style={s.stats}>
          <View>
            <Label>Duration</Label>
            <Text style={s.value}>{duration(o.minutes)}</Text>
          </View>
          <View>
            <Label>Stamps</Label>
            <Text style={s.value}>{onCard} of {STAMPS_PER_VOUCHER}</Text>
          </View>
        </View>
        <StampDots count={stamps} fresh={o.newStamp} />
        <Text style={s.body}>
          {full
            ? 'Your card is full. Enjoy a free coffee!'
            : o.newStamp
              ? `${words[left]} more ${left === 1 ? 'stamp' : 'stamps'} for a free coffee.`
              : `${POINTS_PER_STAMP - (points % POINTS_PER_STAMP)} more points to your next stamp.`}
        </Text>
        <Button label={full && o.newStamp ? 'Claim my coffee' : 'Done'} onPress={go} />
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  title: { fontFamily: fonts.bold, fontSize: 48, lineHeight: 50, letterSpacing: -1.4, color: colors.cream, textAlign: 'center' },
  slot: {
    marginTop: 20, width: 184, height: 184, borderRadius: 92, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.cream,
    alignItems: 'center', justifyContent: 'center',
  },
  stamp: { width: 136, height: 136, borderRadius: 68, backgroundColor: colors.yellow, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-8deg' }] },
  stampPts: { fontFamily: fonts.bold, fontSize: 14, color: colors.plum },
  chips: { flexDirection: 'row', gap: 8, marginTop: 16 },
  card: { backgroundColor: colors.cream, borderRadius: 24, padding: 24, gap: 14 },
  stats: { flexDirection: 'row', gap: 40 },
  value: { fontFamily: fonts.bold, fontSize: 24, color: colors.plum },
  body: { ...type.small, color: colors.plum },
});
