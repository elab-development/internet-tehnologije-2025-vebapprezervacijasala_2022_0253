import { NextResponse } from "next/server";
import { db } from "@/db";
import { korisnik, Uloga } from "@/db/schema";
import { and, lte, gte, eq, lt } from "drizzle-orm";
export async function GET() {
  try {
    const korisnici = await db.select({
        id:korisnik.idKorisnik,
        name:korisnik.name,
        email:korisnik.email,
        nazivUloge:Uloga.nazivUloge
    }).from(korisnik).leftJoin(Uloga,eq(Uloga.idUloge,korisnik.idUloga));
    return NextResponse.json(korisnici);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Greška pri učitavanju korisnika" }, { status: 500 });
  }
}