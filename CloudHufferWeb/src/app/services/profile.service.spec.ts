import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  let service: ProfileService;

  beforeEach(() => {
    // reset localStorage key used by the service
    localStorage.removeItem('ch_profiles_v1');
    service = new ProfileService();
  });

  it('creates, lists and deletes profiles', () => {
    const p = service.create('Test Profile');
    expect(p.name).toBe('Test Profile');
    const list = service.list();
    expect(list.length).toBeGreaterThan(0);
    service.delete(p.id);
    expect(service.list().find(x => x.id === p.id)).toBeUndefined();
  });

  it('sets and gets active profile', () => {
    const p = service.create('Active Test');
    service.setActive(p.id);
    const active = service.getActive();
    expect(active).not.toBeNull();
    expect(active!.id).toBe(p.id);
  });
});
