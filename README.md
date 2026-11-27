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
Until tags are set up, pressing the rings on a "Tap to check in / out" screen simulates the tap.

## Try every screen

Home has an **All screens** link (`/demo`) that opens each screen of the Figma "final flow - all clickable",
setting up a running session first when a screen needs one. Session screens also have small "Testing:" links
to skip ahead 15 minutes, jump to the 2 hour check, or let a timer run out.

## Where things are

- `src/app/` screens (every file is a route)
  - `onboarding` (11 steps), `home`, `demo` (all screens)
  - `checkin`, `tap/[spot]`, `started`, `session` (with the 2 hour sheet), `reminder` (lock screen push), `checkout`, `stamp` (summary)
  - `auto-ended` (with "I left earlier"), `table-claim`, `table-claimed`, `note` (no points messages)
  - `meeting/` join or host, `lobby`, `waiting`, `details`, `started`
  - `voucher`, `points` (How points work)
  - `social/` who's out, `join`, `status`, `plan`, `invite`, `going`
- `src/components/` shared UI: `kit` (chips, info rows, sheets), `Cards`, `TapScreen`, `Started`, `Icons`, tab bar, stamps
- `src/lib/copy.ts` words and colours per activity, `rulesCopy.ts` the points tables
- `src/lib/rules.ts` points and minimum minutes per activity
- `src/lib/spots.ts` the list of touchpoints
- `src/lib/store.tsx` app state, saved on the phone for now
- `src/theme.ts` colours and type from the Figma Style Kit

## Milestones

1. Onboarding + deep work loop with a simulated tap (done)
2. Every screen of the final flow: all activities, edge cases, voucher, social, with local demo data (done)
3. Supabase: accounts, sessions, stamps, colleagues and invites on the server, push notifications, real NFC tags
4. Custom touchpoint hardware
