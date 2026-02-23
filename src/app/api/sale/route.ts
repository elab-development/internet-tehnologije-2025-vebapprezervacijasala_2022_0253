import { db } from "@/db";
import { Oprema, Rezervacija, Sala, SalaOprema, TipSale } from "@/db/schema";
import { and, eq, inArray, lt } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
/**
 * @swagger
 * /api/sale:
 *   get:
 *     summary: Pretraga i filtriranje sala
 *     description: |
 *       Vraća listu sala sa pripadajućom opremom.
 *       Podržava filtriranje po kapacitetu, tipu sale i vremenskom intervalu dostupnosti.
 *       Automatski ažurira status rezervacija kojima je istekao termin.
 *     tags:
 *       - Sale
 *     parameters:
 *       - in: query
 *         name: kapacitet
 *         required: false
 *         schema:
 *           type: integer
 *           example: 20
 *         description: Minimalni kapacitet sale
 *       - in: query
 *         name: tip
 *         required: false
 *         schema:
 *           type: string
 *           example: konferencijska
 *         description: Tip sale
 *       - in: query
 *         name: start
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *           example: 2026-02-25T10:00:00.000Z
 *         description: Početak željenog termina rezervacije
 *       - in: query
 *         name: end
 *         required: false
 *         schema:
 *           type: string
 *           format: date-time
 *           example: 2026-02-25T12:00:00.000Z
 *         description: Kraj željenog termina rezervacije
 *     responses:
 *       200:
 *         description: Lista dostupnih sala
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
 *                     example: Sala A
 *                   kapacitet:
 *                     type: integer
 *                     example: 30
 *                   sprat:
 *                     type: integer
 *                     example: 2
 *                   urlSlike:
 *                     type: string
 *                     example: https://example.com/sala.jpg
 *                   tipSale:
 *                     type: string
 *                     example: konferencijska
 *                   oprema:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "1"
 *                         naziv:
 *                           type: string
 *                           example: Projektor
 *       500:
 *         description: Greška prilikom dohvatanja sala
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Greška prilikom dovlačenja sala
 */
export async function GET(req: NextRequest) {


    try {

        const sada = new Date();

        await db.update(Rezervacija).set({
            status: "zavrsena"
        }).where(and(eq(Rezervacija.status, "aktuelno"), lt(Rezervacija.kraj, sada)));

        const url = new URL(req.url);
        const kapacitetParametar = url.searchParams.get("kapacitet");
        const kapacitet = kapacitetParametar ? parseInt(kapacitetParametar) : -1;
        const tipParam = url.searchParams.get("tip");
        const pocetakParam = url.searchParams.get("start");

        const zavrsetakParama = url.searchParams.get("end");
        //  let sale = await db.select().from(Sala);
        const rows = await db
            .select({
                salaId: Sala.id,
                naziv: Sala.naziv,
                kapacitet: Sala.kapacitet,
                sprat: Sala.sprat,
                urlSlike: Sala.urlSlike,
                tipSale: Sala.idTipaSale,
                opremaId: Oprema.id,
                nazivOpreme: Oprema.nazivOpreme,
            })
            .from(Sala)
            .leftJoin(SalaOprema, eq(SalaOprema.salaId, Sala.id))
            .leftJoin(Oprema, eq(SalaOprema.opremaId, Oprema.id))
            .leftJoin(TipSale, eq(Sala.idTipaSale, TipSale.id)); //da bi imali podatke za filtriranje po tipu, i da bi se ispisuje oprema

        //dobili smo pojedinacne redove  { salaId: "1", naziv: "Sala A", opremaId: "1", nazivOpreme: "Projektor" },
        // { salaId: "1", naziv: "Sala A", opremaId: "2", nazivOpreme: "Tabla" },
        //{ salaId: "2", naziv: "Sala B", opremaId: null }

        //a hocemo da ih grupisemo da svaka sala ima listu opreme
        // Grupisanje u strukturu po salama
        const map = new Map<string, any>();

        for (const row of rows) { //grupisanje 
            if (!map.has(row.salaId)) {
                map.set(row.salaId, {
                    id: row.salaId,
                    naziv: row.naziv,
                    kapacitet: row.kapacitet,
                    sprat: row.sprat,
                    urlSlike: row.urlSlike,
                    tipSale: row.tipSale,
                    oprema: [],
                });
            }

            if (row.opremaId) {//ako ima opremu ubaci u listu opreme za tu salu
                map.get(row.salaId).oprema.push({
                    id: row.opremaId,
                    naziv: row.nazivOpreme,
                });
            }
        }

        let rezultat = Array.from(map.values()); //pretvaranje mape u niz

        if (kapacitet !== -1) {//ako je prosledjen kapacitet filtriraj po njem
            rezultat = rezultat.filter(s => s.kapacitet >= kapacitet);
        }

        const rezervacije = await db.select().from(Rezervacija).where(inArray(Rezervacija.status, ["aktuelno", "izmenjeno"]));
        if (pocetakParam && zavrsetakParama) {//ako su prosledjeni filtrira se ako ne nista
            const start = new Date(pocetakParam);

            const end = new Date(zavrsetakParama);
            const rezervacijeIds = rezervacije.
                filter(r => {
                    const pocetak = r.pocetak;
                    const kraj = r.kraj;
                    return start < kraj && end > pocetak;
                }).map(r => r.salaId);

            rezultat = rezultat.filter(r => !rezervacijeIds.includes(r.id));//vracamo sale koje nisu rezervisale za tad
        }
        if (tipParam) {
            rezultat = rezultat.filter(s => s.tipSale === tipParam);
        }

        return NextResponse.json(rezultat);
        //return NextResponse.json(sale);


    }
    catch (err) {
        console.error("Greska prilikom dovlacanje sala", err);
    }
}