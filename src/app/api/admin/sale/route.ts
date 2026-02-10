import { NextResponse } from "next/server";
import { db } from "@/db";
import { Sala } from "@/db/schema";

export async function GET() {
  try {
    const sale = await db.select().from(Sala);

    return NextResponse.json(sale);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Greška pri učitavanju sala" }, { status: 500 });
  }
}