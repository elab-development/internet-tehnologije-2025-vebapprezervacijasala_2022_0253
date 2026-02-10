import { NextRequest, NextResponse } from "next/server";

 
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { verifikujToken } from "@/lib/auth";
import { Recenzija, Rezervacija } from "@/db/schema";
import { db } from "@/db";

export async function POST(req: NextRequest) {
  //proverava da li postoji token
  const token = await cookies().then(c => c.get("auth")?.value);
  if (!token) return NextResponse.json({ error: "Niste ulogovani" }, { status: 401 });

  //verifikovanje tokena
  const korisnik = verifikujToken(token);

  const { rezervacijaId, ocena, komentar } = await req.json(); //izvlaci prosledjene podatke o recenziji

  await db.insert(Recenzija).values({//upisuje ih u bazu
    idRezervacija:rezervacijaId,
    ocena:ocena,
    komentar:komentar,
  });

  return NextResponse.json({ success: true });
}