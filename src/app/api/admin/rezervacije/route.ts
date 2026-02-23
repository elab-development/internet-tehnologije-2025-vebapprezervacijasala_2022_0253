import { NextResponse } from "next/server";
import { db } from "@/db";
import { korisnik, Rezervacija, Sala } from "@/db/schema";
import { and, lte, gte, eq, lt } from "drizzle-orm";
/**
 * @swagger
 * /api/admin/rezervacije:
 *   get:
 *     summary: Lista svih rezervacija (admin)
 *     description: |
 *       Vraća sve rezervacije iz sistema.
 *       Automatski označava rezervacije kao završene ako je njihov kraj prošao.
 *     tags:
 *       - Admin
 *       - Rezervacije
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lista rezervacija
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   idRezervacije:
 *                     type: integer
 *                     example: 12
 *                   pocetak:
 *                     type: string
 *                     format: date-time
 *                     example: 2026-02-25T10:00:00.000Z
 *                   kraj:
 *                     type: string
 *                     format: date-time
 *                     example: 2026-02-25T12:00:00.000Z
 *                   name:
 *                     type: string
 *                     example: Marko Marković
 *                   naziv:
 *                     type: string
 *                     example: Sala A
 *                   status:
 *                     type: string
 *                     example: aktuelno
 *       500:
 *         description: Greška pri učitavanju rezervacija
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Greška pri učitavanju rezervacija
 */
export async function GET() {
  // backend (npr. /api/admin/rezervacije)
  try {
    const sada = new Date();

    await db.update(Rezervacija).set({
      status: "zavrsena"
    }).where(and(eq(Rezervacija.status, "aktuelno"), lt(Rezervacija.kraj, sada)));
    const rezervacije = await db.select({
      idRezervacije: Rezervacija.idRezervacije,
      pocetak: Rezervacija.pocetak,
      kraj: Rezervacija.kraj,
      name: korisnik.name,
      naziv: Sala.naziv,
      status: Rezervacija.status
    }).from(Rezervacija).leftJoin(korisnik, eq(korisnik.idKorisnik, Rezervacija.KorisnikId)).leftJoin(Sala, eq(Sala.id, Rezervacija.salaId));

    return NextResponse.json(rezervacije);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Greška pri učitavanju rezervacija" }, { status: 500 });
  }
}