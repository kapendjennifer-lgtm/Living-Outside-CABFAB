// Bottom pill tab bar from the components sheet: Home, People, Chat, Rewards.
// Only Home is live in milestone 1; the others arrive with the social side.
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors } from '../theme';

export type Tab = 'home' | 'people' | 'chat' | 'rewards';

const icons: Record<Tab, string> = {
  home: 'M12 21v-9 M12 12c0-4 -3-6 -7-6 0 4 3 6 7 6z M12 12c0-4 3-6 7-6 0 4-3 6-7 6z',
  people: 'M4 19c0-3 2-5 4-5s4 2 4 5 M12 19c0-3 2-5 4-5s4 2 4 5',
  chat: 'M4 5h16v11H9l-4 3v-3H4z M8 10h8',
  rewards: 'M5 10h11v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z M16 12h2a2 2 0 0 1 0 4h-2 M9 4v3 M12 4v3',
};

export function TabBar({ active, onSelect }: { active: Tab; onSelect?: (t: Tab) => void }) {
  return (
    <View style={s.bar}>
      {(Object.keys(icons) as Tab[]).map((t) => {
        const on = t === active;
        const stroke = on ? colors.plum : colors.cream;
        return (
          <Pressable key={t} accessibilityRole="tab" accessibilityLabel={t} onPress={() => onSelect?.(t)} style={[s.item, on && s.on]}>
            <Svg width={24} height={24} viewBox="0 0 24 24">
              <Path d={icons[t]} stroke={stroke} strokeWidth={1.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              {t === 'people' ? (
                <>
                  <Circle cx={8} cy={10} r={2.2} stroke={stroke} strokeWidth={1.6} fill="none" />
                  <Circle cx={16} cy={10} r={2.2} stroke={stroke} strokeWidth={1.6} fill="none" />
                </>
              ) : null}
            </Svg>
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  bar: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.plum, borderRadius: 999, padding: 8 },
  item: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  on: { backgroundColor: colors.yellow },
});
