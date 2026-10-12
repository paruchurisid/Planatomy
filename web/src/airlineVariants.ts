export type AirlineVariant = "delta" | "american" | "united" | "alaska";

export type AirlineLivery = {
  id: AirlineVariant;
  name: string;
  shortName: string;
  wordmark: string;
  white: number;
  navy: number;
  red: number;
  silver: number;
  accent: number;
  tailStyle: "delta" | "stripes" | "globe" | "bands" | "sunset";
  logoAsset: string;
};

const asset = (file: string) => new URL(`../../images/${file}`, import.meta.url).href;

export const AIRLINE_LIVERIES: AirlineLivery[] = [
  { id: "delta", name: "Delta Air Lines", shortName: "Delta", wordmark: "DELTA", white: 0xf5f7fa, navy: 0x101e3d, red: 0xcb173b, silver: 0x93a4b5, accent: 0xe32246, tailStyle: "delta", logoAsset: asset("delta.png") },
  { id: "american", name: "American Airlines", shortName: "American", wordmark: "AMERICAN", white: 0xf7f8fa, navy: 0x12304b, red: 0xc6283e, silver: 0xa6b3c0, accent: 0x6da5c7, tailStyle: "stripes", logoAsset: asset("american-airlines.png") },
  { id: "united", name: "United Airlines", shortName: "United", wordmark: "UNITED", white: 0xf7f8fa, navy: 0x152d57, red: 0xd24a43, silver: 0xaab8c8, accent: 0x5a8dbd, tailStyle: "globe", logoAsset: asset("united-airlines.png") },
  { id: "alaska", name: "Alaska Airlines", shortName: "Alaska", wordmark: "ALASKA", white: 0xf7fafb, navy: 0x102c45, red: 0xc66f38, silver: 0x9fb2bd, accent: 0x5b9da7, tailStyle: "sunset", logoAsset: asset("alaska-airlines.png") },
];

export const DEFAULT_AIRLINE: AirlineVariant = "delta";
export function getLivery(id: AirlineVariant) { return AIRLINE_LIVERIES.find(item => item.id === id) ?? AIRLINE_LIVERIES[0]; }
