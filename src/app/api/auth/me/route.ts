import { db } from "@/db";
import { korisnik, Uloga } from "@/db/schema";
import { AUTH_COOKIE, verifikujToken } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Podaci o trenutno ulogovanom korisniku
 *     description: Vraća podatke o korisniku na osnovu JWT tokena iz auth cookie-ja.
 *     tags:
 *       - Autentifikacija
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Uspešno dohvaćeni podaci korisnika ili null ako nije ulogovan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   oneOf:
 *                     - type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: Marko Marković
 *                         email:
 *                           type: string
 *                           example: marko@gmail.com
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2026-02-20T10:15:30.000Z
 *                         role:
 *                           type: string
 *                           example: user
 *                     - type: "null"
 *       401:
 *         description: Nevažeći ili istekao token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: "null"
 */
export async function GET() {
    //proverava jel postoji token
    const token = (await cookies()).get(AUTH_COOKIE)?.value
    if (!token) {
        return NextResponse.json({ user: null })
    }

    try {
        //verifikuje ga
        const claims = verifikujToken(token);
        
        //iscitava podatke korisnika koji ima isti id (sub) kao ovaj sa tokenom
        const [u] = await db
            .select({ id: korisnik.idKorisnik, name: korisnik.name, email: korisnik.email, createdAt: korisnik.createdAt,role:Uloga.nazivUloge })
            .from(korisnik).leftJoin(Uloga, eq(korisnik.idUloga, Uloga.idUloge))
            .where(eq(korisnik.idKorisnik, claims.sub))

        return NextResponse.json({ user: u ?? null })
    } catch {
        return NextResponse.json({ user: null }, { status: 401 })
    }
}