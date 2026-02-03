import { NextResponse } from "next/server";
import { db } from "@/db";
import { korisnik, Rezervacija, Sala } from "@/db/schema";
import { and, lte, gte, eq, lt } from "drizzle-orm";
export async function GET() {
  // backend (npr. /api/admin/rezervacije)
  try{
const rezervacije = await db.select({
    idRezervacije:Rezervacija.idRezervacije,
    pocetak:Rezervacija.pocetak,
    kraj:Rezervacija.kraj,
    name:korisnik.name,
    naziv:Sala.naziv,
    status:Rezervacija.status
}).from(Rezervacija).leftJoin(korisnik,eq(korisnik.idKorisnik,Rezervacija.KorisnikId)).leftJoin(Sala,eq(Sala.id,Rezervacija.salaId));

return NextResponse.json(rezervacije);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Greška pri učitavanju rezervacija" }, { status: 500 });
  }
}