// The card on "You're joining Lena", "Justin invited you" and "See you at 15:00".
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, type } from '../theme';
import { Avatar } from './kit';

export function EventCard({ letter, title, lines }: { letter: string; title: string; lines: string[] }) {
  return (
    <View style={s.card}>
      <Avatar letter={letter} size={52} />
      <Text style={s.title}>{title}</Text>
      {lines.map((l) => (
        <Text key={l} style={s.line}>{l}</Text>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: colors.sky, borderRadius: 24, padding: 24, gap: 6 },
  title: { fontFamily: fonts.bold, fontSize: 24, color: colors.plum, marginTop: 8 },
  line: { ...type.body, color: colors.plum },
});
