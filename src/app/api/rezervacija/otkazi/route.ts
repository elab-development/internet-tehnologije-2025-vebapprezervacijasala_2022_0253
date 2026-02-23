import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { Rezervacija } from "@/db/schema";
import { cookies } from "next/headers";
import { and, eq } from "drizzle-orm";
import { verifikujToken } from "@/lib/auth";
/**
 * @swagger
 * /api/rezervacija/otkazi:
 *   patch:
 *     summary: Otkazivanje rezervacije
 *     description: |
 *       Otkazuje rezervaciju ulogovanog korisnika.
 *       Može se otkazati samo aktivna rezervacija koja pripada korisniku.
 *     tags:
 *       - Rezervacije
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
 *             properties:
 *               rezervacijaId:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       200:
 *         description: Rezervacija uspešno otkazana
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Nedostaje ID rezervacije
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Nedostaje ID rezervacije
 *       401:
 *         description: Korisnik nije ulogovan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Niste ulogovani
 *       500:
 *         description: Greška na serveru
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Greška na serveru
 */
export async function PATCH(req: NextRequest) {
  try {
    //proverava se token
    const token = await cookies().then(c => c.get("auth")?.value);
    if (!token) {
      return NextResponse.json({ error: "Niste ulogovani" }, { status: 401 });
    }

    //verifikuje se token, ako odgovara vraca se korisnik (sa subom
    const korisnik = verifikujToken(token);

   
    const { rezervacijaId } = await req.json();//prosledjen mu je idRezervacije za izmenu

    if (!rezervacijaId) {//ako ga nema 
      return NextResponse.json({ error: "Nedostaje ID rezervacije" }, { status: 400 });
    }

    
    await db
      .update(Rezervacija)
      .set({ status: "otkazano" })
      .where(
        and(
          eq(Rezervacija.idRezervacije, rezervacijaId),
          eq(Rezervacija.KorisnikId, korisnik.sub),
          eq(Rezervacija.status, "aktuelno")
        )
      );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Greška pri otkazivanju:", err);
    return NextResponse.json(
      { error: "Greška na serveru" },
      { status: 500 }
    );
  }
}