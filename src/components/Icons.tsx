// Line icons redrawn from the Figma icon set (the original SVG files could not be
// downloaded from this build machine, so these are close hand-drawn matches).
import Svg, { Circle, Path } from 'react-native-svg';
import { colors } from '../theme';

export type IconName =
  | 'nfc' | 'pin' | 'moon' | 'group' | 'cup' | 'sprout' | 'chat' | 'clock' | 'walk'
  | 'back' | 'close' | 'person' | 'check' | 'laptop' | 'arrow' | 'calendar' | 'sun';

const paths: Record<IconName, string> = {
  nfc: 'M6 9a4 4 0 0 1 0 6 M9 6.5a8 8 0 0 1 0 11 M12 4a12 12 0 0 1 0 16',
  pin: 'M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11z',
  moon: 'M19 14.5A7.5 7.5 0 0 1 9.5 5 7.5 7.5 0 1 0 19 14.5z',
  group: 'M3 19c0-2.8 1.8-4.5 4-4.5s4 1.7 4 4.5 M13 19c0-2.8 1.8-4.5 4-4.5s4 1.7 4 4.5 M8.5 19c0-3.2 1.6-5.5 3.5-5.5s3.5 2.3 3.5 5.5',
  cup: 'M5 10h11v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z M16 11.5h1.5a2 2 0 0 1 0 4H16 M9 4.5c-.6.8-.6 1.7 0 2.5 M12.5 4.5c-.6.8-.6 1.7 0 2.5',
  sprout: 'M12 21v-9 M12 12c0-4-3-6-7-6 0 4 3 6 7 6z M12 12c0-4 3-6 7-6 0 4-3 6-7 6z',
  chat: 'M4 5h16v11H9l-4 3v-3H4z M8 10h8',
  clock: 'M12 7v5l3 2',
  walk: 'M13 7.5l-2.5 4 3 2.5-1 5 M10.5 11.5L8 14 M13.5 9.5l2.5 2.5 M10 18.5l-2 2',
  back: 'M15 5l-7 7 7 7',
  close: 'M6 6l12 12 M18 6L6 18',
  person: 'M5 20c0-3.9 3.1-6 7-6s7 2.1 7 6',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  laptop: 'M5 7h14v9H5z M3 19h18',
  arrow: 'M5 12h14 M13 6l6 6-6 6',
  calendar: 'M4 6h16v14H4z M4 10h16 M8 4v4 M16 4v4',
  sun: 'M12 3v2 M12 19v2 M3 12h2 M19 12h2 M5.6 5.6l1.4 1.4 M17 17l1.4 1.4 M5.6 18.4L7 17 M17 7l1.4-1.4',
};

// Extra circles some icons need.
const circles: Partial<Record<IconName, [number, number, number][]>> = {
  pin: [[12, 10, 2.3]],
  group: [[7, 10, 2.3], [17, 10, 2.3], [12, 8.5, 2.5]],
  clock: [[12, 12, 8]],
  walk: [[13.5, 4.5, 1.6]],
  person: [[12, 8, 3.5]],
  sun: [[12, 12, 4]],
};

export function Icon({ name, size = 24, color = colors.plum, stroke = 1.7 }: { name: IconName; size?: number; color?: string; stroke?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d={paths[name]} stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {(circles[name] ?? []).map(([cx, cy, r], i) => (
        <Circle key={i} cx={cx} cy={cy} r={r} stroke={color} strokeWidth={stroke} fill="none" />
      ))}
    </Svg>
  );
}
