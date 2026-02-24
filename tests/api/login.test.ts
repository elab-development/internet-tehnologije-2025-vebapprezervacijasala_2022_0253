
import { POST } from '@/app/api/auth/login/route';
import { NextRequest } from 'next/server';
import { db } from '@/db';
import { korisnik, Uloga } from '@/db/schema';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

describe('POST /api/auth/login', () => {

  const testEmail = 'testuser@example.com';
  const testPassword = 'Test1234!';
  let testUserId: string;

  beforeAll(async () => {
    // Kreiraj testnog korisnika sa hash-ovanom lozinkom
    const passHash = await bcrypt.hash(testPassword, 10);

    const [u] = await db.insert(korisnik)
      .values({
        name: 'Test User',
        email: testEmail,
        passHash,
        idUloga: '1a532d97-2a35-4884-93f0-63c1f3723786' 
      })
      .returning({id:korisnik.idKorisnik});

    testUserId = u.id;
  });

  afterAll(async () => {
    // Obriši testnog korisnika
    await db.delete(korisnik).where(eq(korisnik.idKorisnik, testUserId));
  });

  it('returns 200 and token cookie for valid credentials', async () => {
    const req = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: testEmail, password: testPassword })
    });

    const res = await POST(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('id', testUserId);
    expect(data).toHaveProperty('email', testEmail);
    expect(data).toHaveProperty('name', 'Test User');
    expect(data).toHaveProperty('role');

    // proveri da li je cookie setovan
    const cookie = res.headers.get('set-cookie');
    expect(cookie).toContain('auth'); // AUTH_COOKIE
  });

  it('returns 401 for wrong password', async () => {
    const req = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: testEmail, password: 'WrongPass' })
    });

    const res = await POST(req);

    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data).toHaveProperty('error');
  });

  it('returns 401 for non-existing email', async () => {
    const req = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'noone@example.com', password: '1234' })
    });

    const res = await POST(req);

    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data).toHaveProperty('error');
  });

});