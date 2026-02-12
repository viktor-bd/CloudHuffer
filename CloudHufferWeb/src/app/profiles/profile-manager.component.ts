import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../services/profile.service';
import { Profile, CharacterProfile } from '../models/profile.models';

@Component({
  selector: 'app-profile-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [
    `.profile-manager { display:block; gap:10px; }
     .profile-list { display:flex; flex-direction:column; gap:8px; }
     .profile-actions { display:flex; align-items:center; gap:6px; }
     .profile-editor { margin-top:12px; }
     .char-row { display:flex; align-items:center; gap:8px; margin-bottom:6px }
     .char-row input[type=number]{ width:90px }
     .import-export input { color: #ccc }
     button { cursor:pointer }
    `
  ],
  template: `
  <div class="profile-manager">
      <div class="profile-list">
        <label>Profiles</label>
        <select [(ngModel)]="selectedProfileId" (change)="onSelectProfile()">
          <option [ngValue]="null">-- None --</option>
          <option *ngFor="let p of profiles" [ngValue]="p.id">{{ p.name }}</option>
        </select>
        <div class="import-export">
          <input type="file" (change)="onFileImport($event)" />
        </div>
        <div class="profile-actions">
          <input [(ngModel)]="newProfileName" placeholder="New profile name" />
          <button (click)="create()">Create</button>
          <button (click)="removeActive()" [disabled]="!activeProfile">Delete</button>
          <button (click)="export()">Export</button>
          <label class="mode-toggle">
            <input type="checkbox" [(ngModel)]="advancedMode" /> Advanced
          </label>
        </div>
      </div>

      <div *ngIf="activeProfile" class="profile-editor">
      <h4>{{ activeProfile.name }}</h4>

      <!-- Simple mode: single numeric input per character (user-entered rate) -->
      <div *ngIf="!advancedMode">
        <div *ngFor="let c of activeProfile.characters; let i = index" class="char-row">
          <input [(ngModel)]="c.name" />
          <label>Rate (m³/s)</label>
          <input type="number" step="0.001" [(ngModel)]="c.baseRateM3PerSec" />
          <button (click)="removeCharacter(i)">Remove</button>
        </div>
        <div class="editor-actions">
          <button (click)="addCharacter()">Add Character</button>
          <button (click)="save()">Save</button>
        </div>
      </div>

      <!-- Advanced mode: detailed bonus breakdown -->
      <div *ngIf="advancedMode">
        <div *ngFor="let c of activeProfile.characters; let i = index">
          <div class="char-row">
            <input [(ngModel)]="c.name" />
            <label>Base m³/s</label>
            <input type="number" step="0.001" [(ngModel)]="c.baseRateM3PerSec" />
            <button (click)="removeCharacter(i)">Remove</button>
          </div>
          <div class="bonus-row">
            <label>Link %</label>
            <input type="number" [(ngModel)]="c.linkBonusPct" />
            <label>Module %</label>
            <input type="number" [(ngModel)]="c.moduleBonusPct" />
            <label>Implant %</label>
            <input type="number" [(ngModel)]="c.implantBonusPct" />
          </div>
        </div>
        <div class="editor-actions">
          <button (click)="addCharacter()">Add Character</button>
          <button (click)="save()">Save</button>
        </div>
      </div>
      <div class="computed">
        <label>Effective rate:</label>
        <div *ngFor="let c of activeProfile.characters">
          <strong>{{ c.name }}:</strong>
          {{ computeEffectiveRate(c) | number:'1.3-3' }} m³/s
        </div>
      </div>
    </div>
  </div>
  `
})
export class ProfileManagerComponent implements OnInit {
  profiles: Profile[] = [];
  selectedProfileId: string | null = null;
  newProfileName = '';

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.reload();
    const active = this.profileService.getActive();
    this.selectedProfileId = active ? active.id : null;
    // default to simple mode (advanced toggled off)
    this.advancedMode = false;
  }

  get activeProfile(): Profile | null {
    return this.profileService.getActive();
  }

  advancedMode = false;

  reload(): void {
    this.profiles = this.profileService.list();
  }

  create(): void {
    if (!this.newProfileName.trim()) return;
    const p = this.profileService.create(this.newProfileName.trim());
    this.newProfileName = '';
    this.profileService.setActive(p.id);
    this.selectedProfileId = p.id;
    this.reload();
  }

  // allow adding/removing characters from profile
  addCharacter(): void {
    const p = this.profileService.getActive();
    if (!p) return;
    p.characters.push({
      id: 'c_' + Date.now(),
      name: 'Character ' + (p.characters.length + 1),
      baseRateM3PerSec: 3.3333333,
      // set bonuses to zero explicitly; advanced mode will read these when toggled on
      linkBonusPct: 0,
      moduleBonusPct: 0,
      implantBonusPct: 0
    });
    this.profileService.update(p);
    this.reload();
  }

  removeCharacter(index: number): void {
    const p = this.profileService.getActive();
    if (!p) return;
    p.characters.splice(index, 1);
    this.profileService.update(p);
    this.reload();
  }

  onSelectProfile(): void {
    this.profileService.setActive(this.selectedProfileId);
    // when switching profiles, ensure simple/advanced state does not implicitly apply hidden bonuses
    // if advanced is off, we will ignore any bonus fields in computation (handled in computeEffectiveRate)
  }

  save(): void {
    const p = this.profileService.getActive();
    if (p) this.profileService.update(p);
    this.reload();
  }

  removeActive(): void {
    const p = this.profileService.getActive();
    if (!p) return;
    this.profileService.delete(p.id);
    this.profileService.setActive(null);
    this.reload();
    this.selectedProfileId = null;
  }

  export(): void {
    const text = this.profileService.export();
    // quick download
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ch_profiles_export.json';
    a.click();
    // Defer revocation to next event loop tick to allow download to start
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  // allow exporting JSON string to clipboard as well (convenience)
  exportToClipboard(): void {
    const text = this.profileService.export();
    navigator.clipboard?.writeText(text).catch(() => {});
  }

  onFileImport(evt: Event): void {
    const input = evt.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      this.profileService.import(text);
      this.reload();
    };
    reader.readAsText(file);
    // clear input
    input.value = '';
  }

  computeEffectiveRate(c: CharacterProfile): number {
    // If not in advanced mode, bonuses should be ignored — simple mode uses the base rate directly.
    if (!this.advancedMode) {
      return c.baseRateM3PerSec;
    }

    const totalPct = (c.linkBonusPct + c.moduleBonusPct + c.implantBonusPct) / 100.0;
    return c.baseRateM3PerSec * (1 + totalPct);
  }
}
