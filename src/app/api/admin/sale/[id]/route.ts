import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { Sala, Rezervacija } from "@/db/schema";

import { and, lte, gte, eq, lt } from "drizzle-orm";
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params; 
    const salaId = id;

    

    const aktivneRezervacije = await db
      .select({ id: Rezervacija.idRezervacije})
      .from(Rezervacija)
      .where(
        and(
          eq(Rezervacija.salaId, salaId),
          eq(Rezervacija.status, "aktuelno") // ili "aktivna"
        )
      );

    if (aktivneRezervacije.length > 0) {
      return NextResponse.json(
        { error: "Sala ima aktivne rezervacije i ne može se obrisati" },
        { status: 409 }
      );
    }

    // 2. Brisanje sale
    await db.delete(Sala).where(eq(Sala.id, salaId));

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Greška pri brisanju sale:", error);
    return NextResponse.json(
      { error: "Greška na serveru" },
      { status: 500 }
    );
  }
}