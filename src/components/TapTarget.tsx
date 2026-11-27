// The concentric "tap here" rings from the check-in and check-out screens:
// dashed 330, soft 270 (sky on check-in, pink on check-out), white 190,
// core 110 (yellow in, plum out) with the NFC waves, and the phone leaning in.
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors, fonts } from '../theme';

export function TapTarget({ mode = 'in', scale = 1 }: { mode?: 'in' | 'out'; scale?: number }) {
  const soft = mode === 'in' ? colors.sky : colors.pink;
  const core = mode === 'in' ? colors.yellow : colors.plum;
  const wave = mode === 'in' ? colors.plum : colors.cream;
  const size = 330 * scale;
  return (
    <View style={[s.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 330 330">
        <Circle cx={165} cy={165} r={164} fill="none" stroke={colors.plum} strokeWidth={1.5} strokeDasharray="6 8" opacity={0.5} />
        <Circle cx={165} cy={165} r={135} fill={soft} opacity={0.6} />
        <Circle cx={165} cy={165} r={95} fill={colors.white} />
        <Circle cx={165} cy={165} r={55} fill={core} />
        <Path d="M150 148 q12 17 0 34 M160 140 q20 25 0 50 M170 132 q28 33 0 66" stroke={wave} strokeWidth={4} fill="none" strokeLinecap="round" />
      </Svg>
      <View style={[s.phone, { transform: [{ rotate: '-12deg' }, { scale }] }]}>
        <Text style={s.phoneText}>Stamps</Text>
        <View style={s.phoneDots}>
          {Array.from({ length: 8 }, (_, i) => (
            <View key={i} style={[s.phoneDot, i < 5 && { backgroundColor: colors.yellow }]} />
          ))}
        </View>
      </View>
    </View>
  );
}

// Small "phone on touchpoint" picture used on the reminder and table claim screens.
export function TapMini() {
  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={120} height={110} viewBox="0 0 120 110">
        <Rect x={20} y={70} width={80} height={30} rx={15} fill={colors.yellow} stroke={colors.plum} strokeWidth={2} />
        <Path d="M52 80 q5 5 0 10 M58 77 q8 8 0 16 M64 74 q11 11 0 22" stroke={colors.plum} strokeWidth={2} fill="none" strokeLinecap="round" />
        <Rect x={44} y={6} width={34} height={60} rx={8} fill={colors.plum} transform="rotate(-10 61 36)" />
        <Rect x={49} y={14} width={24} height={40} rx={4} fill={colors.cream} transform="rotate(-10 61 36)" />
      </Svg>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { alignSelf: 'center', alignItems: 'center', justifyContent: 'center' },
  phone: {
    position: 'absolute', right: '8%', bottom: '4%', width: 104, height: 208, borderRadius: 26,
    backgroundColor: colors.plum, padding: 12, paddingTop: 28, borderWidth: 3, borderColor: colors.plum,
  },
  phoneText: { fontFamily: fonts.bold, fontSize: 13, color: colors.cream, marginBottom: 8 },
  phoneDots: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  phoneDot: { width: 16, height: 16, borderRadius: 8, borderWidth: 1.5, borderColor: colors.cream },
});
