import { db } from "@/db";
import { korisnik, Uloga } from "@/db/schema";
import { AUTH_COOKIE, verifikujToken } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const token = (await cookies()).get(AUTH_COOKIE)?.value
    if (!token) {
        return NextResponse.json({ user: null })
    }

    try {
        const claims = verifikujToken(token);
        const [u] = await db
            .select({ id: korisnik.idKorisnik, name: korisnik.name, email: korisnik.email, createdAt: korisnik.createdAt,role:Uloga.nazivUloge })
            .from(korisnik).leftJoin(Uloga, eq(korisnik.idUloga, Uloga.idUloge))
            .where(eq(korisnik.idKorisnik, claims.sub))

        return NextResponse.json({ user: u ?? null })
    } catch {
        return NextResponse.json({ user: null }, { status: 401 })
    }
}