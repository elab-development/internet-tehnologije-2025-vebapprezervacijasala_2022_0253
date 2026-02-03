import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { Rezervacija } from "@/db/schema";
import { cookies } from "next/headers";
import { verifikujToken } from "@/lib/auth";
import { and, lte, gte, eq, inArray } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    // 1. Proveri korisnika iz cookie
    const token = await cookies().then(c => c.get("auth")?.value);
    if (!token) return NextResponse.json({ error: "Niste ulogovani" }, { status: 401 });

    const korisnik = verifikujToken(token);

    // 2. Parsiraj payload iz frontenda
    const body = await req.json();
    const { salaId, datumPocetka, datumKraj, vremePocetka, vremeKraja, brojUcesnika, napomena } = body;

    if (!salaId || !datumPocetka || !datumKraj || !vremePocetka || !vremeKraja || !brojUcesnika)
      return NextResponse.json({ error: "Nedostaju obavezna polja" }, { status: 400 });

    const start = new Date(`${datumPocetka}T${vremePocetka}`
    );
    const end = new Date(`${datumKraj}T${vremeKraja}`);

    // 3. Proveri da li je sala slobodna
    const rezervacije = await db.select().from(Rezervacija)
      .where(
        and(
          eq(Rezervacija.salaId, salaId),
          lte(Rezervacija.pocetak, end),
          gte(Rezervacija.kraj, start),
          eq(Rezervacija.status,"aktuelno")
        )
      );

    if (rezervacije.length > 0) {
      return NextResponse.json({ error: "Sala je zauzeta u odabranom periodu" }, { status: 409 });
    }

    // 4. Ubaci rezervaciju u bazu
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
  } catch (error) {
    console.error("Greška pri kreiranju rezervacije:", error);
    return NextResponse.json({ error: "Došlo je do greške" }, { status: 500 });
  }
}
