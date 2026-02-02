import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { Rezervacija, Sala } from "@/db/schema";
import { cookies } from "next/headers";
import { and, lte, gte, eq, lt } from "drizzle-orm";
import { verifikujToken } from "@/lib/auth";
export async function GET(req: NextRequest) {
    try {
        // 1. Uzmi token korisnika iz cookie-ja
        const token = await cookies().then(c => c.get("auth")?.value);
        if (!token) return NextResponse.json({ error: "Niste ulogovani" }, { status: 401 });

        const korisnik = verifikujToken(token);
        const sada = new Date();
        console.log(sada);
        await db.update(Rezervacija).set({
            status: "zavrsena"
        }).where(and(eq(Rezervacija.KorisnikId, korisnik.sub), eq(Rezervacija.status, "aktuelno"), lt(Rezervacija.kraj, sada)));
        // 2. Povuci sve rezervacije za tog korisnika
        const rezervacije = await db
            .select(
                {
                    idRezervacije: Rezervacija.idRezervacije,
                    naziv: Sala.naziv,
                    pocetak: Rezervacija.pocetak,
                    kraj: Rezervacija.kraj,
                    status: Rezervacija.status
                }
            )
            .from(Rezervacija).leftJoin(Sala, eq(Sala.id, Rezervacija.salaId))
            .where(eq(Rezervacija.KorisnikId, korisnik.sub));
          

        // 3. Vrati podatke kao JSON
        const response = rezervacije.map((r) => ({
            id: r.idRezervacije,
            salaNaziv: r.naziv,
            pocetak: r.pocetak,
            kraj: r.kraj,
            status: r.status, // AKTIVNA, OTKAZANA, ZAVRSENA
        }));

        return NextResponse.json(response);
    } catch (error) {
        console.error("Greška pri dohvatanju rezervacija:", error);
        return NextResponse.json(
            { message: "Greška pri učitavanju rezervacija" },
            { status: 500 }
        );
    }
}
