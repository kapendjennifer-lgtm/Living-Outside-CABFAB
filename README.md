# Outside Office

App for cabfab's Outside Office: tap your phone on a touchpoint outside to check in and out of activities, earn points and stamps, and get a free coffee after 8 stamps.

Built with Expo (React Native + TypeScript) and Expo Router. Backend (Supabase) comes in milestone 2.

## Run it

```bash
npm install
npx expo start        # press w for the browser, or scan the QR code with Expo Go
```

## How a tap works

Every touchpoint gives the phone a link: `outsideoffice://tap/<spot>` (later a web link on our own domain).
The app opens on `src/app/tap/[spot].tsx`: first tap checks you in, the next one checks you out.
So the touchpoint can be a plain NFC sticker today and custom hardware (Arduino + Adafruit NFC + lights) later, with no app change.
Until tags are set up, the check-in screen has "simulate a tap" buttons.

## Where things are

- `src/app/` screens (every file is a route): onboarding, home, checkin, tap/[spot], session, stamp
- `src/components/` shared UI: buttons, cards, tab bar, stamp row, tap rings
- `src/lib/rules.ts` points and minimum minutes per activity
- `src/lib/spots.ts` the list of touchpoints
- `src/lib/store.tsx` app state, saved on the phone for now
- `src/theme.ts` colours and type from the Figma Style Kit

## Milestones

1. Onboarding + deep work loop with a simulated tap (done)
2. Supabase: accounts, sessions and stamps on the server, real NFC tags
3. Other activities and edge cases: team session, walk, break, meetings, 2h reminder, auto end, table claim, voucher
4. Social: who's out, status, plan together, invites
5. Custom touchpoint hardware
