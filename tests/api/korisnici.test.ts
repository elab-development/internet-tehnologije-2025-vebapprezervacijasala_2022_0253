
import { GET } from '@/app/api/admin/korisnici/route';
import { createRequest, createResponse } from 'node-mocks-http';

describe('GET /api/admin/korisnici', () => {
  it('returns list of korisnici', async () => {
    const response = await GET(); //poziv metode iz route

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);

    if (data.length > 0) {
      expect(data[0]).toHaveProperty('id');
      expect(data[0]).toHaveProperty('name');
      expect(data[0]).toHaveProperty('email');
      expect(data[0]).toHaveProperty('nazivUloge');
    }
  });
});