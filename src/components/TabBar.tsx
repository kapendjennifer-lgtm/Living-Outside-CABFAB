// Bottom pill tab bar: Home (sprout), People, Chat, Rewards (cup). Yellow circle on the active tab.
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors } from '../theme';
import { Icon, type IconName } from './Icons';

export type Tab = 'home' | 'people' | 'chat' | 'rewards';

const TABS: { id: Tab; icon: IconName; href: string; label: string }[] = [
  { id: 'home', icon: 'sprout', href: '/home', label: 'Home' },
  { id: 'people', icon: 'group', href: '/social', label: "Who's out" },
  { id: 'chat', icon: 'chat', href: '/social/invite', label: 'Invites' },
  { id: 'rewards', icon: 'cup', href: '/points', label: 'Rewards' },
];

export function TabBar({ active }: { active: Tab }) {
  return (
    <View style={s.bar}>
      {TABS.map((t) => {
        const on = t.id === active;
        return (
          <Pressable
            key={t.id}
            accessibilityRole="tab"
            accessibilityLabel={t.label}
            accessibilityState={{ selected: on }}
            onPress={() => !on && router.replace(t.href as never)}
            style={[s.item, on && s.on]}
          >
            <Icon name={t.icon} size={26} color={on ? colors.plum : colors.cream} />
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  bar: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: colors.plum, borderRadius: 999, height: 64, paddingHorizontal: 8 },
  item: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  on: { backgroundColor: colors.yellow },
});
