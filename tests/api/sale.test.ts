import { GET } from '@/app/api/admin/sale/route';

describe('GET /api/admin/sale', () => {
  it('returns list of sale', async () => {
    const response = await GET();

    // status mora biti 200
    expect(response.status).toBe(200);

    const data = await response.json();

    // rezultat je niz
    expect(Array.isArray(data)).toBe(true);

    // ako postoji barem jedna sala, provjeri polja
    if (data.length > 0) {
      expect(data[0]).toHaveProperty('id');       // id sale
      expect(data[0]).toHaveProperty('naziv');    // naziv sale
    }
  });
});