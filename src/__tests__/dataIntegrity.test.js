import therapists from '../data/therapists.json';

describe('Therapists data', () => {
  it('lists therapists with required fields and valid ratings', () => {
    expect(therapists.length).toBeGreaterThan(0);

    const ids = new Set();

    therapists.forEach((therapist) => {
      expect(therapist.id).toMatch(/^t\d+$/);
      expect(ids.has(therapist.id)).toBe(false);
      ids.add(therapist.id);

      expect(therapist.name).toBeTruthy();
      expect(typeof therapist.photo).toBe('string');
      expect(Array.isArray(therapist.specialties)).toBe(true);
      expect(therapist.specialties.length).toBeGreaterThan(0);
      therapist.specialties.forEach((specialty) => {
        expect(typeof specialty).toBe('string');
      });

      expect(typeof therapist.experience_years).toBe('number');
      expect(Number.isInteger(therapist.experience_years)).toBe(true);
      expect(therapist.experience_years).toBeGreaterThanOrEqual(0);

      expect(Array.isArray(therapist.certifications)).toBe(true);
      therapist.certifications.forEach((certification) => {
        expect(typeof certification).toBe('string');
      });

      expect(Array.isArray(therapist.zones)).toBe(true);
      expect(therapist.zones.length).toBeGreaterThan(0);
      therapist.zones.forEach((zone) => {
        expect(typeof zone).toBe('string');
        expect(zone.trim()).not.toHaveLength(0);
      });

      expect(typeof therapist.bio).toBe('string');
      expect(therapist.bio.trim()).not.toHaveLength(0);

      expect(typeof therapist.rating).toBe('number');
      expect(therapist.rating).toBeGreaterThanOrEqual(0);
      expect(therapist.rating).toBeLessThanOrEqual(5);

      expect(typeof therapist.verified).toBe('boolean');
    });
  });
});

