// Touchpoints. Each NFC tag stores a link like
//   https://<our domain>/tap/terrace-deep-work   (or outsideoffice://tap/terrace-deep-work)
// Tapping a phone on the tag opens the app on /tap/[spot].
import type { ActivityId } from './rules';

export type Spot = { id: string; name: string; activity: ActivityId };

export const SPOTS: Record<string, Spot> = {
  'terrace-deep-work': { id: 'terrace-deep-work', name: 'Terrace', activity: 'deep_work' },
  'table-1': { id: 'table-1', name: 'Table 1', activity: 'team_session' },
  'park-walk': { id: 'park-walk', name: 'Park', activity: 'walk' },
  'break-zone': { id: 'break-zone', name: 'Break zone', activity: 'break' },
  'meeting-table': { id: 'meeting-table', name: 'Meeting table', activity: 'meeting' },
};

export const spotFor = (activity: ActivityId) => Object.values(SPOTS).find((s) => s.activity === activity)!.id;
