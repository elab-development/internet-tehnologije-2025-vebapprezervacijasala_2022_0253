import { NextResponse } from "next/server";
import { db } from "@/db";
import { TipSale } from "@/db/schema";
/**
 * @swagger
 * /api/tipoviSale:
 *   get:
 *     summary: Dohvatanje svih tipova sala
 *     description: Vraća listu svih tipova sala iz baze podataka.
 *     tags:
 *       - Tipovi sala
 *     responses:
 *       200:
 *         description: Uspešno dohvaćeni tipovi sala
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "1"
 *                   naziv:
 *                     type: string
 *                     example: konferencijska
 *       500:
 *         description: Greška pri učitavanju tipova sala
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Greška pri učitavanju tipova sala
 */
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