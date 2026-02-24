
import { DELETE } from '@/app/api/admin/sale/[id]/route';
import { NextRequest } from 'next/server';

describe('DELETE /api/admin/sale/:id', () => {

  it('returns 409 if sala ima aktuelne rezervacije', async () => {
    const params = Promise.resolve({ id: '5e51614c-ceee-40fd-846a-91d862da317c' });

    const req = new NextRequest('http://localhost/api/admin/sale/[id]', {
      method: 'DELETE'
    });

    const res = await DELETE(req, { params });

    expect(res.status).toBe(409);
    const data = await res.json();
    expect(data).toHaveProperty('error');
  });

  it('returns 200 if sala nema aktivne rezervacije', async () => {
    const params = Promise.resolve({ id: '9caf07ad-0c21-4752-86bd-6048d68a58d2' });

    const req = new NextRequest('http://localhost/api/admin/sale/[id]', {
      method: 'DELETE'
    });

    const res = await DELETE(req, { params });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({ ok: true });
  });

});