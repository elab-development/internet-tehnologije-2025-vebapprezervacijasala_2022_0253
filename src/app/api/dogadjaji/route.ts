import { NextResponse } from "next/server";
import { db } from "@/db";
import { Dogadjaj, TipSale } from "@/db/schema";

export async function GET() {
  try {
    const dogadjaji = await db.select().from(Dogadjaj);
    return NextResponse.json(dogadjaji);
  } catch (err) {
    return NextResponse.json(
      { message: "Greška pri učitavanju tipova sala" },
      { status: 500 }
      
    );
  }
}