import { Injectable } from '@angular/core';
import { Profile, CharacterProfile } from '../models/profile.models';

const STORAGE_KEY = 'ch_profiles_v1';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private profiles: Profile[] = [];
  private activeProfileId: string | null = null;

  constructor() {
    this.loadFromStorage();
  }

  list(): Profile[] {
    return [...this.profiles];
  }

  get(id: string): Profile | undefined {
    return this.profiles.find(p => p.id === id);
  }

  create(name: string): Profile {
    const now = new Date().toISOString();
    const profile: Profile = {
      id: 'p_' + Date.now(),
      name,
      characters: [this.makeDefaultCharacter()],
      createdAt: now,
      updatedAt: now
    };
    this.profiles.push(profile);
    this.saveToStorage();
    return profile;
  }

  update(profile: Profile): void {
    const idx = this.profiles.findIndex(p => p.id === profile.id);
    if (idx >= 0) {
      profile.updatedAt = new Date().toISOString();
      this.profiles[idx] = profile;
      this.saveToStorage();
    }
  }

  delete(id: string): void {
    this.profiles = this.profiles.filter(p => p.id !== id);
    if (this.activeProfileId === id) this.activeProfileId = null;
    this.saveToStorage();
  }

  setActive(id: string | null): void {
    this.activeProfileId = id;
    this.saveToStorage();
  }

  getActive(): Profile | null {
    if (!this.activeProfileId) return null;
    return this.get(this.activeProfileId) || null;
  }

  import(json: string): Profile[] {
    try {
      const parsed = JSON.parse(json) as Profile[];
      // Basic validation: ensure array and id/name
      if (!Array.isArray(parsed)) return [];
      for (const p of parsed) {
        if (!p.id || !p.name) continue;
        // Skip if profile with same id already exists (avoid duplicates)
        const exists = this.profiles.some(existing => existing.id === p.id);
        if (!exists) {
          this.profiles.push(p);
        }
      }
      this.saveToStorage();
      return this.list();
    } catch {
      return [];
    }
  }

  export(): string {
    return JSON.stringify(this.profiles, null, 2);
  }

  private makeDefaultCharacter(): CharacterProfile {
    return {
      id: 'c_' + Date.now(),
      name: 'Character 1',
      baseRateM3PerSec: 3.3333333, // ~200 m3/min as m3/s
      // default to zeros to align with simple mode being the default
      linkBonusPct: 0,
      moduleBonusPct: 0,
      implantBonusPct: 0
    };
  }

  private loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { profiles?: Profile[]; activeProfileId?: string };
      this.profiles = parsed.profiles || [];
      this.activeProfileId = parsed.activeProfileId || null;
    } catch {
      this.profiles = [];
      this.activeProfileId = null;
    }
  }

  private saveToStorage(): void {
    try {
      const payload = { profiles: this.profiles, activeProfileId: this.activeProfileId };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      // localStorage.setItem can throw (quota exceeded, storage blocked)
      // Log error so users can see it in console, but don't crash the app
      console.error('Failed to save profiles to localStorage:', e);
    }
  }
}
