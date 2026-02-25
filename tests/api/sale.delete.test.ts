
import { DELETE } from '@/app/api/admin/sale/[id]/route';
import { db } from '@/db';
import { Rezervacija, Sala, TipSale } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';

describe('DELETE /api/admin/sale/:id', () => {


  let testSalaId: string;
  it('vraca 409 ako sala ima aktuelne rezervacije',async()=>{
    const [tip]=await db.insert(TipSale).values({
      naziv:"Testni tip",
      minKapacitet:30
    }).returning({id:TipSale.id});

    const [novaSala]=await db.insert(Sala).values({
      naziv:"Test sala 409",
      kapacitet:10,
      sprat:1,
      idTipaSale:tip.id
     }).returning({id:Sala.id});

     await db.insert(Rezervacija).values({
      salaId:novaSala.id,
      status:"aktuelno",
      pocetak:new Date(),
      kraj: new Date(),
      brojUcesnika:40
     });

     const params=Promise.resolve({id:novaSala.id});
     const req=new NextRequest(`http://localhost/api/admin/sale/${novaSala.id}`,{
      method:"DELETE"
     });

     const res=await DELETE(req,{params});
     expect(res.status).toBe(409);
     const data=await res.json();
     expect(data.error).toBe("Sala ima aktivne rezervacije i ne može se obrisati");
    await db.delete(Rezervacija).where(eq(Rezervacija.salaId, novaSala.id));
    await db.delete(Sala).where(eq(Sala.id, novaSala.id));
    await db.delete(TipSale).where(eq(TipSale.id, tip.id));

  });

  it('vraca 200 ako sala nema aktivne rezervacije', async()=>{
    const [tip]=await db.insert(TipSale).values({
      naziv:"Testni tip",
      minKapacitet:30
    }).returning({id:TipSale.id});

    const [novaSala]=await db.insert(Sala).values({
      naziv:"Test sala 200",
      kapacitet:10,
      sprat:1,
      idTipaSale:tip.id
     }).returning({id:Sala.id});

     const params=Promise.resolve({id:novaSala.id});
     const req=new NextRequest(`http://localhost/api/admin/sale/${novaSala.id}`,{
      method:"DELETE"
     });

     const res=await DELETE(req,{params});
     expect(res.status).toBe(200);
     const data=await res.json();
     expect(data.ok).toBe(true);

     const provera=await db.select().from(Sala).where(eq(Sala.id,novaSala.id));
     expect(provera.length).toBe(0);
     await db.delete(TipSale).where(eq(TipSale.id, tip.id));
  });
     it('vraca 500 ili gresku ako prosledimo nevalidan ID format', async()=>{
      const params=Promise.resolve({id:"not-a-uuid"});
      const req=new NextRequest(`http://localhost/api/admin/sale/not-a-uuid`,{
      method:"DELETE"
     });

     const res = await DELETE(req, { params });
     expect(res.status).toBe(500);
     const data = await res.json();
     expect(data.error).toBe("Greška na serveru");
     })

  })
