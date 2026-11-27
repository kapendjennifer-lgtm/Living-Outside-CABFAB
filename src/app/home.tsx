// Home ("Progress collecting stamp"): points to the next stamp, the stamp card, today outside.
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { DayOverview, PointsCard, StampsCard } from '../components/Cards';
import { Icon } from '../components/Icons';
import { IconDisc, Kicker, Title } from '../components/kit';
import { TabBar } from '../components/TabBar';
import { Button, Screen } from '../components/ui';
import { COPY } from '../lib/copy';
import { POINTS_PER_STAMP } from '../lib/rules';
import { useStore } from '../lib/store';
import { today } from '../lib/today';
import { colors, fonts, type } from '../theme';

export default function Home() {
  const { name, points, stamps, active, log, vouchersReady, loadDemo, reset } = useStore();
  const day = today(log, points);

  return (
    <Screen scroll footer={<TabBar active="home" />} style={{ gap: 16 }}>
      <View style={s.head}>
        <View style={{ flex: 1 }}>
          <Kicker>{`hello ${name}!`}</Kicker>
          <Title>{vouchersReady > 0 ? 'Your coffee is ready!' : 'Your next stamp is getting closer!'}</Title>
        </View>
        <IconDisc name="person" color={colors.sky} />
      </View>

      {active ? (
        <Pressable style={s.live} onPress={() => router.push('/session')} accessibilityRole="button">
          <IconDisc name={COPY[active.activity].icon} />
          <Text style={s.liveText}>{COPY[active.activity].activeTitle}: you're checked in</Text>
          <Icon name="arrow" color={colors.cream} />
        </Pressable>
      ) : null}

      {vouchersReady > 0 ? (
        <Pressable style={s.voucher} onPress={() => router.push('/voucher')} accessibilityRole="button">
          <IconDisc name="cup" color={colors.plum} iconColor={colors.yellow} />
          <Text style={s.voucherText}>Your coffee voucher is ready</Text>
          <Icon name="arrow" />
        </Pressable>
      ) : null}

      <PointsCard points={points % POINTS_PER_STAMP} onPress={() => router.push('/points')} />
      <StampsCard stamps={stamps} />
      {!active ? <Button label="Tap to check in" onPress={() => router.push('/checkin')} /> : null}
      <DayOverview {...day} />

      <View style={s.devRow}>
        <Text style={s.dev} onPress={() => router.push('/demo')}>All screens</Text>
        <Text style={s.dev} onPress={() => loadDemo()}>Load demo data</Text>
        <Text style={s.dev} onPress={reset}>Reset</Text>
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  live: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.plum, borderRadius: 20, padding: 14 },
  liveText: { flex: 1, fontFamily: fonts.medium, fontSize: 16, color: colors.cream },
  voucher: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.yellow, borderRadius: 20, padding: 14 },
  voucherText: { flex: 1, fontFamily: fonts.medium, fontSize: 16, color: colors.plum },
  devRow: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 4 },
  dev: { ...type.label, color: colors.plumSoft },
});
