// The concentric "tap here" rings with a phone, used on check-in and check-out.
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors } from '../theme';

export function TapTarget({ mode = 'in' }: { mode?: 'in' | 'out' }) {
  const ring = mode === 'in' ? colors.sky : '#E7B9C6';
  const core = mode === 'in' ? colors.yellow : colors.plum;
  const wave = mode === 'in' ? colors.plum : colors.cream;
  return (
    <View style={s.wrap}>
      <Svg width={240} height={240} viewBox="0 0 240 240">
        <Circle cx={110} cy={120} r={100} fill={ring} opacity={0.35} />
        <Circle cx={110} cy={120} r={74} fill={ring} opacity={0.7} />
        <Circle cx={110} cy={120} r={46} fill={core} />
        <Path d="M98 104 q14 16 0 32 M108 98 q20 22 0 44 M118 92 q26 28 0 56" stroke={wave} strokeWidth={4} fill="none" strokeLinecap="round" />
        <Rect x={168} y={130} width={50} height={92} rx={10} fill={colors.white} stroke={colors.plum} strokeWidth={3} />
        <Circle cx={193} cy={168} r={11} fill={colors.yellow} />
      </Svg>
    </View>
  );
}

const s = StyleSheet.create({ wrap: { alignItems: 'center', marginVertical: 16 } });
