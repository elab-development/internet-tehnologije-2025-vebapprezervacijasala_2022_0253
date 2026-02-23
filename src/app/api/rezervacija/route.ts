import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { Rezervacija } from "@/db/schema";
import { cookies } from "next/headers";
import { verifikujToken } from "@/lib/auth";
import { and, lte, gte, eq } from "drizzle-orm";
/**
 * @swagger
 * /api/rezervacija:
 *   post:
 *     summary: Kreiranje rezervacije sale
 *     description: |
 *       Kreira novu rezervaciju ako sala nije zauzeta u željenom terminu.
 *       Zahteva autentifikovanog korisnika (cookie auth).
 *     tags:
 *       - Rezervacije
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - salaId
 *               - datumPocetka
 *               - datumKraj
 *               - vremePocetka
 *               - vremeKraja
 *               - brojUcesnika
 *             properties:
 *               salaId:
 *                 type: string
 *                 example: "1"
 *               datumPocetka:
 *                 type: string
 *                 format: date
 *                 example: "2026-02-25"
 *               datumKraj:
 *                 type: string
 *                 format: date
 *                 example: "2026-02-25"
 *               vremePocetka:
 *                 type: string
 *                 example: "10:00"
 *               vremeKraja:
 *                 type: string
 *                 example: "12:00"
 *               brojUcesnika:
 *                 type: integer
 *                 example: 10
 *               napomena:
 *                 type: string
 *                 example: Projekat sastanak
 *     responses:
 *       200:
 *         description: Rezervacija uspešno kreirana
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Nedostaju obavezna polja
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Nedostaju obavezna polja
 *       401:
 *         description: Korisnik nije ulogovan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Niste ulogovani
 *       409:
 *         description: Sala je zauzeta u odabranom periodu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Sala je zauzeta u odabranom periodu
 *       500:
 *         description: Greška na serveru
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Došlo je do greške
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Proveri korisnika iz cookie
    const token = await cookies().then(c => c.get("auth")?.value);
    if (!token) return NextResponse.json({ error: "Niste ulogovani" }, { status: 401 });

    const korisnik = verifikujToken(token);

    // 2. Parsiraj payload iz frontenda
    const body = await req.json();
    const { salaId, datumPocetka, datumKraj, vremePocetka, vremeKraja, brojUcesnika, napomena } = body;//iz bodija izvlacimo polja za rezervaciju 

    if (!salaId || !datumPocetka || !datumKraj || !vremePocetka || !vremeKraja || !brojUcesnika)
      return NextResponse.json({ error: "Nedostaju obavezna polja" }, { status: 400 });

    const start = new Date(`${datumPocetka}T${vremePocetka}` // spaja se u jedan tip podatka
    );
    const end = new Date(`${datumKraj}T${vremeKraja}`);

    // 3. Proveri da li je sala slobodna
    const rezervacije = await db.select().from(Rezervacija)//upis za dovlacenje svih rezervacija za tu salu u tom terminu
      .where(
        and(
          eq(Rezervacija.salaId, salaId),
          lte(Rezervacija.pocetak, end),
          gte(Rezervacija.kraj, start),
        eq(Rezervacija.status,"aktuelno")
        )
      );

    if (rezervacije.length > 0) {//ako ih ima onda vracamo error da je zauzeta
      return NextResponse.json({ error: "Sala je zauzeta u odabranom periodu" }, { status: 409 });
    }

    // 4. Ubaci rezervaciju u bazu
    //u suprotnom ubacujemo vrednosti koje smo izvukli iz bodija u bazu
    await db.insert(Rezervacija).values({
      salaId,
      KorisnikId: korisnik.sub,
      pocetak: start,
      kraj: end,
      brojUcesnika,
      napomena,
      status: "aktuelno"
    });

    return NextResponse.json({ ok: true });
  } catch (error) {//ako ne moze da se upise salji da je doslo do greske
    console.error("Greška pri kreiranju rezervacije:", error);
    return NextResponse.json({ error: "Došlo je do greške" }, { status: 500 });
  }
}
