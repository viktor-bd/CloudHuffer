import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileManagerComponent } from '../profiles/profile-manager.component';
import { ProfileService } from '../services/profile.service';

describe('ProfileManagerComponent', () => {
  let component: ProfileManagerComponent;
  let fixture: ComponentFixture<ProfileManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileManagerComponent],
      providers: [ProfileService]
    }).compileComponents();
    fixture = TestBed.createComponent(ProfileManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('can create and select a profile', () => {
    const before = component.profiles.length;
    component.newProfileName = 'SpecProfile';
    component.create();
    expect(component.profiles.length).toBeGreaterThanOrEqual(before + 1);
    const active = component.activeProfile;
    expect(active).toBeTruthy();
    expect(active!.name).toBe('SpecProfile');
  });
});
