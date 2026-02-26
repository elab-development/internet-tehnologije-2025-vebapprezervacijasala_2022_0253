
import { POST } from '@/app/api/auth/login/route';
import { NextRequest } from 'next/server';
import { db } from '@/db';
import { korisnik, Uloga } from '@/db/schema';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { AUTH_COOKIE } from '@/lib/auth';


describe('POST /api/auth/login', () => {

  const testEmail = 'test@gmail.com';
  const testPassword = 'Test1234!';
  let testUserId: string;
  let testUlogaId: string;

  beforeAll(async () => {
    // Kreiranje nove uloge da bi imali validan strani kljuc
    const [novaUloga]=await db.insert(Uloga).values({
      nazivUloge:"test_uloga_login"
    }).returning({id:Uloga.idUloge});
    testUlogaId=novaUloga.id;

    //Hasiramo lozinku i pravimo korisnika
    const passHash = await bcrypt.hash(testPassword, 10);
    const [u] = await db.insert(korisnik)
      .values({
        name: 'Test User',
        email: testEmail,
        passHash,
        idUloga: testUlogaId
      })
      .returning({id:korisnik.idKorisnik});

    testUserId = u.id;
  });

  afterAll(async () => {
    // Brisanje tekstnog korisnika i uloge
    await db.delete(korisnik).where(eq(korisnik.idKorisnik, testUserId));
    await db.delete(Uloga).where(eq(Uloga.idUloge,testUlogaId));
  });

  it('uspesna prijava:vraca 200 i postavlja auth kolacic', async () => {
    const req = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: testEmail, password: testPassword })
    });

    const res = await POST(req);

    expect(res.status).toBe(200);
    const data = await res.json();
    //provera da li se poklapaju posati podaci
    expect(data.id).toBe(testUserId);
    expect(data.email).toBe(testEmail);
    expect(data.name).toBe('Test User');
    expect(data).toHaveProperty('role');

    // proveri da li je cookie setovan !
    const cookie = res.headers.get('set-cookie');
    expect(cookie).not.toBeNull();
    expect(cookie).toContain(AUTH_COOKIE); // AUTH_COOKIE
  });

  it('neuspesna prijava: pogresna lozinka vraća 401', async () => {
    const req = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: testEmail, password: 'WrongPass' }) //provera sa pogresnom lozinkom
    });

    const res = await POST(req);

    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe("Pogresam email ili lozinka");
  });

  it('neuspesna prijava: nepostojeci email vraca 401', async () => {
    const req = new NextRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'noone@example.com', password: '1234' })//provera sa pogresnim mejlom
    });

    const res = await POST(req);

    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe("Pogresam email ili lozinka");
  
  });

});