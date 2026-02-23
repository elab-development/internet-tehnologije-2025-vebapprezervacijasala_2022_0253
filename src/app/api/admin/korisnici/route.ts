import { NextResponse } from "next/server";
import { db } from "@/db";
import { korisnik, Uloga } from "@/db/schema";
import { and, lte, gte, eq, lt } from "drizzle-orm";
/**
 * @swagger
 * /api/admin/korisnici:
 *   get:
 *     summary: Lista korisnika
 *     description: Vraća listu svih korisnika sa njihovim ulogama.
 *     tags:
 *       - Admin
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Uspešno učitani korisnici
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Marko Marković
 *                   email:
 *                     type: string
 *                     example: marko@gmail.com
 *                   nazivUloge:
 *                     type: string
 *                     example: admin
 *       500:
 *         description: Greška pri učitavanju korisnika
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Greška pri učitavanju korisnika
 */
export async function GET() {
  try {
    const korisnici = await db.select({
        id:korisnik.idKorisnik,
        name:korisnik.name,
        email:korisnik.email,
        nazivUloge:Uloga.nazivUloge
    }).from(korisnik).leftJoin(Uloga,eq(Uloga.idUloge,korisnik.idUloga));
    
    return NextResponse.json(korisnici);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Greška pri učitavanju korisnika" }, { status: 500 });
  }
}