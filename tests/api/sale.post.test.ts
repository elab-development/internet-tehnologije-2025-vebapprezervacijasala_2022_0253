
import { POST } from '@/app/api/admin/sale/dodaj-sale/route';
import { NextRequest } from 'next/server';

describe('POST /api/admin/sale/dodaj-sale', () => {

  it('returns 400 if required fields are missing', async () => {
    const body = {}; // prazno tijelo
    const req = new NextRequest('http://localhost/api/admin/sale/dodaj-sale', {
      method: 'POST',
      body: JSON.stringify(body)
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data).toHaveProperty('error');
  });

  it('returns 400 if kapacitet <= 0', async () => {
    const body = { naziv: 'Sala A', kapacitet: 0, sprat: 1, idTipaSale: "43175ccb-e658-4afa-8b32-90b0f0990c38" };
    const req = new NextRequest('http://localhost/api/admin/sale/dodaj-sale', {
      method: 'POST',
      body: JSON.stringify(body)
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data).toHaveProperty('error');
  });

  it('returns 200 if all fields are valid', async () => {
    const body = { naziv: 'Sala Test', kapacitet: 20, sprat: 1, idTipaSale: "43175ccb-e658-4afa-8b32-90b0f0990c38" };
    const req = new NextRequest('http://localhost/api/admin/sale/dodaj-sale', {
      method: 'POST',
      body: JSON.stringify(body)
    });

    const res = await POST(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({ ok: true });
  });

});