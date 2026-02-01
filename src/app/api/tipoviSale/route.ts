import { NextResponse } from "next/server";
import { db } from "@/db";
import { TipSale } from "@/db/schema";

export async function GET() {
  try {
    const tipovi = await db.select().from(TipSale);
    return NextResponse.json(tipovi);
  } catch (err) {
    return NextResponse.json(
      { message: "Greška pri učitavanju tipova sala" },
      { status: 500 }
    );
  }
}