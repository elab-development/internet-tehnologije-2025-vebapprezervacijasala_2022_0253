import { db } from "@/db";
import { Oprema, Rezervacija, Sala, SalaOprema, TipSale } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

     
    try {
    const url=new URL(req.url);
    const kapacitetParametar=url.searchParams.get("kapacitet");
    const kapacitet=kapacitetParametar?parseInt(kapacitetParametar):-1;
    const tipParam=url.searchParams.get("tip");
    const pocetakParam=url.searchParams.get("start");
    
    const zavrsetakParama=url.searchParams.get("end");
        //  let sale = await db.select().from(Sala);
        const rows = await db
            .select({
                salaId: Sala.id,
                naziv: Sala.naziv,
                kapacitet: Sala.kapacitet,
                sprat: Sala.sprat,
                urlSlike:Sala.urlSlike,
                tipSale:Sala.idTipaSale,
                opremaId: Oprema.id,
                nazivOpreme: Oprema.nazivOpreme,
            })
            .from(Sala)
            .leftJoin(SalaOprema, eq(SalaOprema.salaId, Sala.id))
            .leftJoin(Oprema, eq(SalaOprema.opremaId, Oprema.id))
            .leftJoin(TipSale,eq(Sala.idTipaSale,TipSale.id));

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
                    tipSale:row.tipSale,
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

        let rezultat = Array.from(map.values());
         if(kapacitet!==-1){
          rezultat=rezultat.filter(s=>s.kapacitet===kapacitet);
    }

       if(tipParam){
         rezultat=rezultat.filter(s=>s.tipSale===tipParam);
    }
    const rezervacije=await db.select().from(Rezervacija).where(inArray(Rezervacija.status,["aktuelno","izmenjeno"]));
    if(pocetakParam && zavrsetakParama){
        const start = new Date(pocetakParam);
        
        const end = new Date(zavrsetakParama);
        const rezervacijeIds=rezervacije.
        filter(r=>{
            const pocetak=r.pocetak;
            const kraj=r.kraj;
            return start<kraj && end>pocetak;
        }).map(r=>r.salaId);

        rezultat=rezultat.filter(r=>!rezervacijeIds.includes(r.id));
    }
        return NextResponse.json(rezultat);
        //return NextResponse.json(sale);


    }
    catch (err) {
        console.error("Greska prilikom dovlacanje sala", err);
    }
}