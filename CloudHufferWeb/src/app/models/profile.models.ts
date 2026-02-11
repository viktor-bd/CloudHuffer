export interface CharacterProfile {
  id: string;
  name: string;
  baseRateM3PerSec: number; // e.g. 3.33 (m³/s)
  linkBonusPct: number; // percent, e.g. 15 means 15%
  moduleBonusPct: number;
  implantBonusPct: number;
}

export interface Profile {
  id: string;
  name: string;
  characters: CharacterProfile[];
  createdAt: string;
  updatedAt: string;
}
