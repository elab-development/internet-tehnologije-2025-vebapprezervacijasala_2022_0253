/// <reference types="jest" />
import { POST } from '@/app/api/auth/register/route';
import { db } from '@/db';
import { korisnik, Uloga } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

describe('POST /api/auth/register', () => {
  let createdUserId: string;

  afterEach(async () => {
    if (createdUserId) {
      await db.delete(korisnik).where(eq(korisnik.idKorisnik, createdUserId));
      createdUserId = '';
    }
  });

  it('registers a new user and returns user data', async () => {
    const req = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'Test1234!'
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data).toHaveProperty('id');
    expect(data.name).toBe('Test User');
    expect(data.email).toBe('testuser@example.com');

    createdUserId = data.id;

    // proveri da li cookie postoji
    const setCookie = res.headers.get('set-cookie');
    expect(setCookie).toContain('auth=');
  });

  it('returns 400 if email already exists', async () => {
    // prvo kreiramo korisnika direktno u bazi
    const [role] = await db.select({ id: Uloga.idUloge }).from(Uloga).where(eq(Uloga.nazivUloge, 'user'));
    const passHash = await bcrypt.hash('pass', 10);
    const [u] = await db.insert(korisnik).values({
      name: 'Exist User',
      email: 'exist@example.com',
      passHash,
      idUloga: role.id
    }).returning({ id: korisnik.idKorisnik });
    createdUserId = u.id;

    const req = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Exist User 2',
        email: 'exist@example.com',
        password: 'pass'
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const data = await res.json();
    expect(data.error).toBe('Email vec postoji');
  });

  it('returns 401 if missing fields', async () => {
    const req = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: 'No Email', password: 'pass' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);

    const data = await res.json();
    expect(data.error).toBe('Nedostaju podaci');
  });
});