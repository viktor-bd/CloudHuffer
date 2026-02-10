import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../services/profile.service';
import { Profile, CharacterProfile } from '../models/profile.models';

@Component({
  selector: 'app-profile-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="profile-manager">
      <div class="profile-list">
        <label>Profiles</label>
        <select [(ngModel)]="selectedProfileId" (change)="onSelectProfile()">
          <option [value]="null">-- None --</option>
          <option *ngFor="let p of profiles" [value]="p.id">{{ p.name }}</option>
        </select>
        <div class="import-export">
          <input type="file" (change)="onFileImport($event)" />
        </div>
        <div class="profile-actions">
        <input [(ngModel)]="newProfileName" placeholder="New profile name" />
        <button (click)="create()">Create</button>
        <button (click)="removeActive()" [disabled]="!activeProfile">Delete</button>
        <button (click)="export()">Export</button>
      </div>
    </div>

      <div *ngIf="activeProfile" class="profile-editor">
      <h4>{{ activeProfile.name }}</h4>
      <div *ngFor="let c of activeProfile.characters; let i = index">
        <div class="char-row">
          <input [(ngModel)]="c.name" />
          <label>Base m³/min</label>
          <input type="number" [(ngModel)]="c.baseRateM3PerMin" />
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
      <div class="computed">
        <label>Effective rate:</label>
        <div *ngFor="let c of activeProfile.characters">
          <strong>{{ c.name }}:</strong>
          {{ computeEffectiveRate(c) | number:'1.1-1' }} m³/min
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
  }

  get activeProfile(): Profile | null {
    return this.profileService.getActive();
  }

  reload(): void {
    this.profiles = this.profileService.list();
  }

  create(): void {
    if (!this.newProfileName.trim()) return;
    const p = this.profileService.create(this.newProfileName.trim());
    this.newProfileName = '';
    this.profileService.setActive(p.id);
    this.reload();
  }

  // allow adding/removing characters from profile
  addCharacter(): void {
    const p = this.profileService.getActive();
    if (!p) return;
    p.characters.push({
      id: 'c_' + Date.now(),
      name: 'Character ' + (p.characters.length + 1),
      baseRateM3PerMin: 200,
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
    URL.revokeObjectURL(url);
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
    const totalPct = (c.linkBonusPct + c.moduleBonusPct + c.implantBonusPct) / 100.0;
    return c.baseRateM3PerMin * (1 + totalPct);
  }
}
