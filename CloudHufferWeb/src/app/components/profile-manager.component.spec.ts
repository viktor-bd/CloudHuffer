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

  it('computeEffectiveRate returns base rate in simple mode (ignores bonuses)', () => {
    // ensure simple mode
    component.advancedMode = false;
    const c: any = {
      id: 't_simple',
      name: 'SimpleChar',
      baseRateM3PerSec: 2.5,
      linkBonusPct: 100,
      moduleBonusPct: 50,
      implantBonusPct: 25
    };
    const result = component.computeEffectiveRate(c);
    expect(result).toBeCloseTo(2.5, 6);
  });

  it('computeEffectiveRate applies bonuses in advanced mode', () => {
    component.advancedMode = true;
    const c: any = {
      id: 't_adv',
      name: 'AdvChar',
      baseRateM3PerSec: 2.0,
      linkBonusPct: 10,
      moduleBonusPct: 5,
      implantBonusPct: 0
    };
    // total bonus = 15% -> expected = 2.0 * 1.15 = 2.3
    const result = component.computeEffectiveRate(c);
    expect(result).toBeCloseTo(2.3, 6);
  });
});
