// Coffee voucher: a live code that changes every 60 seconds, so a screenshot
// can't be reused. Each voucher works once, then shows as used.
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Chip, CloseButton, Kicker, Title } from '../components/kit';
import { Button, Screen } from '../components/ui';
import { useStore } from '../lib/store';
import { useNow } from '../lib/time';
import { colors, fonts, type } from '../theme';

const ABC = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
// Stand-in for a server-signed code: changes every minute.
function liveCode(minute: number) {
  let x = (minute * 2654435761) >>> 0;
  let out = '';
  for (let i = 0; i < 6; i++) {
    out += ABC[x % ABC.length];
    x = Math.floor(x / ABC.length) + i * 7919;
  }
  return `${out.slice(0, 3)} ${out.slice(3)}`;
}

function Ring({ seconds }: { seconds: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <View style={s.ring}>
      <Svg width={80} height={80} viewBox="0 0 80 80">
        <Circle cx={40} cy={40} r={r} stroke={colors.white} strokeWidth={6} fill="none" />
        <Circle
          cx={40} cy={40} r={r} stroke={colors.plum} strokeWidth={6} fill="none" strokeLinecap="round"
          strokeDasharray={`${c}`} strokeDashoffset={c * (1 - seconds / 60)} transform="rotate(-90 40 40)"
        />
      </Svg>
      <View style={s.ringText}>
        <Text style={s.sec}>{seconds}</Text>
        <Text style={s.unit}>sec</Text>
      </View>
    </View>
  );
}

export default function Voucher() {
  const { vouchersReady, vouchersUsed, useVoucher } = useStore();
  const now = useNow();
  const lastUsed = vouchersUsed[vouchersUsed.length - 1];
  const live = vouchersReady > 0;
  const seconds = 60 - (Math.floor(now / 1000) % 60);
  const close = () => (router.canGoBack() ? router.back() : router.replace('/home'));

  return (
    <Screen footer={<Button label="Close" variant="outline" onPress={close} />} style={{ gap: 14 }}>
      <CloseButton onPress={close} />
      <Kicker>your reward</Kicker>
      <Title>Coffee voucher</Title>
      {live || lastUsed ? (
        <View style={s.card}>
          <Chip label={live ? 'Live code' : 'Used'} color={live ? colors.yellow : colors.white} />
          <Text style={[s.code, !live && s.used]}>{liveCode(Math.floor(now / 60000))}</Text>
          {live ? (
            <>
              <Ring seconds={seconds} />
              <Text style={s.small}>Show this to the staff</Text>
            </>
          ) : (
            <Text style={s.small}>Used on {new Date(lastUsed).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</Text>
          )}
        </View>
      ) : (
        <View style={s.card}>
          <Text style={s.small}>Fill all 8 stamps on your card to get a free coffee.</Text>
        </View>
      )}
      {live ? <Text style={s.staff} onPress={useVoucher}>Staff: mark as used</Text> : null}
    </Screen>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: colors.sky, borderRadius: 24, padding: 24, gap: 16, alignItems: 'center', marginTop: 12 },
  code: { fontFamily: fonts.bold, fontSize: 48, letterSpacing: 2, color: colors.plum },
  used: { textDecorationLine: 'line-through', opacity: 0.5 },
  ring: { width: 80, height: 80, alignItems: 'center', justifyContent: 'center' },
  ringText: { position: 'absolute', alignItems: 'center' },
  sec: { fontFamily: fonts.bold, fontSize: 22, color: colors.plum },
  unit: { fontFamily: fonts.regular, fontSize: 11, color: colors.plum },
  small: { ...type.body, color: colors.plum, textAlign: 'center' },
  staff: { ...type.label, color: colors.plumSoft, textAlign: 'center' },
});
