import therapists from '../data/therapists.json';
import availability from '../data/availability.json';

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

describe('Availability data', () => {
  it('uses ISO date keys mapped to valid availability details', () => {
    const dateKeyPattern = /^\d{4}-\d{2}-\d{2}$/;
    const therapistIds = new Set(therapists.map((therapist) => therapist.id));

    Object.entries(availability).forEach(([dateKey, details]) => {
      expect(dateKey).toMatch(dateKeyPattern);

      const parsedDate = new Date(dateKey);
      expect(Number.isNaN(parsedDate.getTime())).toBe(false);
      expect(parsedDate.toISOString().startsWith(dateKey)).toBe(true);

      expect(details.pass).toMatch(/^BLR\d{4}$/);

      expect(Array.isArray(details.therapists)).toBe(true);
      expect(details.therapists.length).toBeGreaterThan(0);
      details.therapists.forEach((therapistId) => {
        expect(therapistId).toMatch(/^t\d+$/);
        expect(therapistIds.has(therapistId)).toBe(true);
      });

      expect(typeof details.note).toBe('string');
      expect(details.note.trim()).not.toHaveLength(0);
    });
  });
});
