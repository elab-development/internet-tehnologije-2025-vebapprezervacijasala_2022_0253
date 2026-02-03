import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { Sala } from "@/db/schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { naziv, kapacitet, sprat, urlSlike, idTipaSale } = body;

    // 1. Validacija
    if (!naziv || !kapacitet || !sprat || !idTipaSale) {
      return NextResponse.json(
        { error: "Popunite sva obavezna polja" },
        { status: 400 }
      );
    }

    if (kapacitet <= 0) {
      return NextResponse.json(
        { error: "Kapacitet mora biti veći od 0" },
        { status: 400 }
      );
    }

    // 2. Insert u bazu
    await db.insert(Sala).values({
      naziv,
      kapacitet,
      sprat,
      urlSlike: urlSlike || null, // opcionalno
      idTipaSale,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Greška pri dodavanju sale:", error);
    return NextResponse.json(
      { error: "Greška na serveru" },
      { status: 500 }
    );
  }
}