
process.env.JWT_SECRET="testsecret";
import { POST } from '@/app/api/auth/logout/route';
import { NextRequest } from 'next/server';
import { AUTH_COOKIE } from '@/lib/auth';

describe('POST /api/auth/logout', () => {

  it('returns 200 and clears AUTH_COOKIE', async () => {
    const req = new NextRequest('http://localhost/api/auth/logout', {
      method: 'POST'
    });

    const res = await POST();

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({ ok: true });

    // proveri da li je cookie postavljen da se briše
    const setCookie = res.headers.get('set-cookie');
    expect(setCookie).toContain(AUTH_COOKIE);
    expect(setCookie).toContain('Max-Age=0');
  });

});