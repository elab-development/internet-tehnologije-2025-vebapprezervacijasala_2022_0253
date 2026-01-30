import { db } from "@/db";
import { Oprema, Rezervacija, Sala, SalaOprema } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {


    try {

        //  let sale = await db.select().from(Sala);
        const rows = await db
            .select({
                salaId: Sala.id,
                naziv: Sala.naziv,
                kapacitet: Sala.kapacitet,
                sprat: Sala.sprat,
                urlSlike:Sala.urlSlike,

                opremaId: Oprema.id,
                nazivOpreme: Oprema.nazivOpreme,
            })
            .from(Sala)
            .leftJoin(SalaOprema, eq(SalaOprema.salaId, Sala.id))
            .leftJoin(Oprema, eq(SalaOprema.opremaId, Oprema.id));

        // Grupisanje u strukturu po salama
        const map = new Map<string, any>();

        for (const row of rows) {
            if (!map.has(row.salaId)) {
                map.set(row.salaId, {
                    id: row.salaId,
                    naziv: row.naziv,
                    kapacitet: row.kapacitet,
                    sprat: row.sprat,
                    urlSlike:row.urlSlike,
                    oprema: [],
                });
            }

            if (row.opremaId) {
                map.get(row.salaId).oprema.push({
                    id: row.opremaId,
                    naziv: row.nazivOpreme,
                });
            }
        }

        const rezultat = Array.from(map.values());

        return NextResponse.json(rezultat);
        //return NextResponse.json(sale);


    }
    catch (err) {
        console.error("Greska prilikom dovlacanje sala", err);
    }
}