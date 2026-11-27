// Design tokens from the Figma "Style Kit" page and the final flow screens.
export const colors = {
  plum: '#691641', // primary in the final flow: buttons, headings, dark screens
  yellow: '#FCEA10',
  cream: '#F7F0E3',
  sky: '#B9DCF4',
  white: '#FFFFFF',
  // accents, for shapes only (never small text)
  orange: '#EB5C2C',
  marigold: '#E39544',
  pink: '#E1A2A3',
  clay: '#C1472D',
  ink: '#23211B',
  straw: '#F5ED6A',
  plumSoft: 'rgba(105, 22, 65, 0.55)',
};

export const fonts = {
  regular: 'SpaceGrotesk_400Regular',
  medium: 'SpaceGrotesk_500Medium',
  bold: 'SpaceGrotesk_700Bold',
  hand: 'Caveat_700Bold', // one short handwritten phrase per screen
};

// Type scale from the Style Kit (letterSpacing converted from % of size).
export const type = {
  display: { fontFamily: fonts.bold, fontSize: 56, letterSpacing: -1.7 },
  title: { fontFamily: fonts.bold, fontSize: 32, letterSpacing: -0.64, lineHeight: 36 },
  heading: { fontFamily: fonts.bold, fontSize: 20, letterSpacing: -0.2 },
  body: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 24 },
  label: { fontFamily: fonts.medium, fontSize: 12, letterSpacing: 0.96, textTransform: 'uppercase' as const },
  script: { fontFamily: fonts.hand, fontSize: 28 },
};

export const radius = { card: 24, pill: 999 };
export const space = (n: number) => n * 4;
