export enum PrayerType {
  Fajr = 'Fajr',
  Dhuhr = 'Dhuhr',
  Asr = 'Asr',
  Maghrib = 'Maghrib',
  Isha = 'Isha',
  Witr = 'Witr'
}

export interface PrayerDefinition {
  id: PrayerType;
  label: string;
  rakatsFull: number;
  rakatsQasr: number; // Shortened version
}

export const PRAYERS: PrayerDefinition[] = [
  { id: PrayerType.Maghrib, label: 'Maghrib', rakatsFull: 3, rakatsQasr: 3 },
  { id: PrayerType.Isha, label: 'Isha', rakatsFull: 4, rakatsQasr: 2 },
  { id: PrayerType.Witr, label: 'Witr', rakatsFull: 3, rakatsQasr: 3 }, // Usually treated as full even in travel by many, but logic stays flexible
  { id: PrayerType.Fajr, label: 'Fajr', rakatsFull: 2, rakatsQasr: 2 },
  { id: PrayerType.Dhuhr, label: 'Dhuhr', rakatsFull: 4, rakatsQasr: 2 },
  { id: PrayerType.Asr, label: 'Asr', rakatsFull: 4, rakatsQasr: 2 },
];