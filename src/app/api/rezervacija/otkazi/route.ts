import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { Rezervacija } from "@/db/schema";
import { cookies } from "next/headers";
import { and, eq } from "drizzle-orm";
import { verifikujToken } from "@/lib/auth";

export async function PATCH(req: NextRequest) {
  try {
    
    const token = await cookies().then(c => c.get("auth")?.value);
    if (!token) {
      return NextResponse.json({ error: "Niste ulogovani" }, { status: 401 });
    }

    
    const korisnik = verifikujToken(token);

   
    const { rezervacijaId } = await req.json();
    if (!rezervacijaId) {
      return NextResponse.json({ error: "Nedostaje ID rezervacije" }, { status: 400 });
    }

    
    await db
      .update(Rezervacija)
      .set({ status: "otkazano" })
      .where(
        and(
          eq(Rezervacija.idRezervacije, rezervacijaId),
          eq(Rezervacija.KorisnikId, korisnik.sub),
          eq(Rezervacija.status, "aktuelno")
        )
      );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Greška pri otkazivanju:", err);
    return NextResponse.json(
      { error: "Greška na serveru" },
      { status: 500 }
    );
  }
}