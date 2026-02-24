import { GET } from '@/app/api/admin/rezervacije/route';

describe('GET /api/admin/rezervacije (real DB)', () => {
  it('returns 200 and array of rezervacije', async () => {
    const response = await GET();

    expect(response.status).toBe(200);

    const data = await response.json();

    expect(Array.isArray(data)).toBe(true);

    if (data.length > 0) {
      expect(data[0]).toHaveProperty('idRezervacije');
      expect(data[0]).toHaveProperty('pocetak');
      expect(data[0]).toHaveProperty('kraj');
      expect(data[0]).toHaveProperty('name');
      expect(data[0]).toHaveProperty('naziv');
      expect(data[0]).toHaveProperty('status');
    }
  });
});