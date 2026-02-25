import { POST } from '@/app/api/rezervacija/route';
import { NextRequest } from "next/server";
import { db } from "@/db";
import { korisnik, Uloga, Sala, TipSale, Rezervacija } from "@/db/schema";
import { generisiToken } from "@/lib/auth";
import { eq } from "drizzle-orm";

// 1. Mock-ujemo next/headers pre nego što se išta drugo desi 
jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

// Uvozimo mock-ovanu funkciju da bismo mogli da kontrolišemo njeno ponašanje
import { cookies } from "next/headers";

describe("POST /api/rezervacija - Integracioni test", () => {
  let testUserToken: string;
  let testUserId: string;
  let testSalaId: string;
  let testUlogaId: string;
  let testTipSaleId: string;

  beforeAll(async () => {

    const [uloga] = await db.insert(Uloga).values({ 
      nazivUloge: `test_user_${Date.now()}` 
    }).returning();
    testUlogaId = uloga.idUloge;

    const [user] = await db.insert(korisnik).values({
      name: "Test Korisnik",
      email: `test_${Date.now()}@example.com`,
      passHash: "hash123",
      idUloga: testUlogaId
    }).returning();
    testUserId = user.idKorisnik;

    const [tip] = await db.insert(TipSale).values({ 
      naziv: `Konferencijska_${Date.now()}`, 
      minKapacitet: 20
    }).returning();
    testTipSaleId = tip.id;

    const [sala] = await db.insert(Sala).values({
      naziv: "Velika Sala",
      kapacitet: 50,
      sprat: 2,
      idTipaSale: testTipSaleId
    }).returning();
    testSalaId = sala.id;

    testUserToken = generisiToken({ 
      sub: testUserId, 
      email: user.email, 
      name: user.name, 
      role: "user" 
    });
  });

  afterAll(async () => {
   
    await db.delete(Rezervacija).where(eq(Rezervacija.salaId, testSalaId));
    await db.delete(Sala).where(eq(Sala.id, testSalaId));
    await db.delete(TipSale).where(eq(TipSale.id, testTipSaleId));
    await db.delete(korisnik).where(eq(korisnik.idKorisnik, testUserId));
    await db.delete(Uloga).where(eq(Uloga.idUloge, testUlogaId));
  });

  it("uspešno kreira prvu rezervaciju", async () => {
    // 2. Podešavamo šta cookies() vraća za ovaj test 
    (cookies as jest.Mock).mockReturnValue(Promise.resolve({
      get: (name: string) => name === "auth" ? { value: testUserToken } : undefined
    }));

    const body = {
      salaId: testSalaId,
      datumPocetka: "2026-06-01",
      datumKraj: "2026-06-01",
      vremePocetka: "09:00",
      vremeKraja: "11:00",
      brojUcesnika: 10,
      napomena: "Prva rezervacija"
    };

    const req = new NextRequest("http://localhost/api/rezervacija", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.ok).toBe(true);
  });

  it("vraća 409 ako se termini preklapaju", async () => {
    // Ponovo podešavamo kuki za drugi zahtev
    (cookies as jest.Mock).mockReturnValue(Promise.resolve({
      get: (name: string) => name === "auth" ? { value: testUserToken } : undefined
    }));

    const body = {
      salaId: testSalaId,
      datumPocetka: "2026-06-01",
      datumKraj: "2026-06-01",
      vremePocetka: "10:30", 
      vremeKraja: "12:00",
      brojUcesnika: 5
    };

    const req = new NextRequest("http://localhost/api/rezervacija", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(409);
    expect(data.error).toBe("Sala je zauzeta u odabranom periodu");
  });
});