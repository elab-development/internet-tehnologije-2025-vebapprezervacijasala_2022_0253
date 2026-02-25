import { PATCH } from '@/app/api/rezervacija/otkazi/route';
import { NextRequest } from "next/server";
import { db } from "@/db";
import { Rezervacija, korisnik, Uloga, Sala, TipSale } from "@/db/schema";
import { generisiToken } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

// 1. Mock-ujemo cookies da bismo izbegli "Request Scope" grešku 🎭
jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

import { cookies } from "next/headers";

describe("PATCH /api/rezervacija/otkazi - Integracioni test", () => {
  let testUserToken: string;
  let testUserId: string;
  let testSalaId: string;
  let testRezervacijaId: any; // ID koji ćemo dobiti nakon inserta

  beforeAll(async () => {
    // 2. Priprema podataka: 
    const [uloga] = await db.insert(Uloga).values({ nazivUloge: `user_patch_${Date.now()}` }).returning();
    const [user] = await db.insert(korisnik).values({
      name: "Otkazivač",
      email: `patch_${Date.now()}@test.com`,
      passHash: "sifra",
      idUloga: uloga.idUloge
    }).returning();
    testUserId = user.idKorisnik;

    const [tip] = await db.insert(TipSale).values({ naziv: `Tip_Patch_${Date.now()}`, minKapacitet: 5 }).returning();
    const [sala] = await db.insert(Sala).values({
      naziv: "Sala za otkazivanje",
      kapacitet: 10,
      sprat: 3,
      idTipaSale: tip.id
    }).returning();
    testSalaId = sala.id;

    // 3. Kreiramo rezervaciju koju ćemo otkazati 
    const [rez] = await db.insert(Rezervacija).values({
      salaId: testSalaId,
      KorisnikId: testUserId,
      pocetak: new Date("2026-10-10T10:00:00"),
      kraj: new Date("2026-10-10T12:00:00"),
      brojUcesnika: 5,
      status: "aktuelno"
    }).returning();
    testRezervacijaId = rez.idRezervacije;

    // 4. Generišemo token 🔑
    testUserToken = generisiToken({ sub: testUserId, email: user.email, name: user.name, role: "user" });
  });

  afterAll(async () => {
    // Čišćenje baze 
    await db.delete(Rezervacija).where(eq(Rezervacija.idRezervacije, testRezervacijaId));
    await db.delete(Sala).where(eq(Sala.id, testSalaId));
    await db.delete(korisnik).where(eq(korisnik.idKorisnik, testUserId));
  });

  it("uspešno menja status rezervacije u 'otkazano'", async () => {
    // Postavljamo mock kuki 
    (cookies as jest.Mock).mockReturnValue(Promise.resolve({
      get: (name: string) => name === "auth" ? { value: testUserToken } : undefined
    }));

    const req = new NextRequest("http://localhost/api/rezervacija/otkazi", {
      method: "PATCH",
      body: JSON.stringify({ rezervacijaId: testRezervacijaId }),
    });

    const res = await PATCH(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);

    // 5. Provera u bazi: Da li je status zaista promenjen? 
    const [osvezenaRez] = await db
      .select()
      .from(Rezervacija)
      .where(eq(Rezervacija.idRezervacije, testRezervacijaId));
    
    expect(osvezenaRez.status).toBe("otkazano");
  });
});