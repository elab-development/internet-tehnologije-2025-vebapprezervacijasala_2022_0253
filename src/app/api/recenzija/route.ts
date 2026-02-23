import { NextRequest, NextResponse } from "next/server";

 
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { verifikujToken } from "@/lib/auth";
import { Recenzija, Rezervacija } from "@/db/schema";
import { db } from "@/db";
/**
 * @swagger
 * /api/recenzija:
 *   post:
 *     summary: Kreiranje recenzije
 *     description: Omogućava ulogovanom korisniku da ostavi recenziju za određenu rezervaciju.
 *     tags:
 *       - Recenzije
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rezervacijaId
 *               - ocena
 *               - komentar
 *             properties:
 *               rezervacijaId:
 *                 type: integer
 *                 example: 5
 *               ocena:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               komentar:
 *                 type: string
 *                 example: Sala je bila odlično opremljena i čista.
 *     responses:
 *       200:
 *         description: Recenzija uspešno sačuvana
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Korisnik nije ulogovan (nema validan auth cookie)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Niste ulogovani
 *       500:
 *         description: Greška pri čuvanju recenzije
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Greška pri čuvanju recenzije
 */
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