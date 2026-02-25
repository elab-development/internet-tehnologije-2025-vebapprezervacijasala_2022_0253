
import { POST } from '@/app/api/admin/sale/dodaj-sale/route';
import { db } from '@/db';
import { Sala, TipSale } from '@/db/schema';
import { privateEncrypt } from 'crypto';
import { eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';

describe('POST /api/admin/sale/dodaj-sale', () => {
//ciscenje nakon svakog testa
  let privremeniTipId: string|undefined;
  afterEach(async()=>{
    if(privremeniTipId){
      await db.delete(Sala).where(eq(Sala.idTipaSale,privremeniTipId));
      await db.delete(TipSale).where(eq(TipSale.id,privremeniTipId));
      privremeniTipId=undefined;
    }

  })
  it('vraca 400 ako nedostaju obavezna polja', async () => {
    const body = {naziv: "Samo naziv"}; //proveravamo da li nam radi if u apiju da su sva polja obavezna
    const req = new NextRequest('http://localhost/api/admin/sale/dodaj-sale', {
      method: 'POST',
      body: JSON.stringify(body)
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Popunite sva obavezna polja");
    
  });

  it('vraca 400 ako je kapacitet <= 0', async () => {
    const body = { naziv: 'Sala A', kapacitet: -1, sprat: 1, idTipaSale: "00000000-0000-0000-0000-000000000000" };
    const req = new NextRequest('http://localhost/api/admin/sale/dodaj-sale', {
      method: 'POST',
      body: JSON.stringify(body)
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Kapacitet mora biti veći od 0");
  });

  it('vraca 200 ako su sva polja validna', async () => {
    const [noviTip] = await db.insert(TipSale).values({
      naziv: "Tip Sale za Test",
      minKapacitet:20
    }).returning({ id: TipSale.id });
    privremeniTipId=noviTip.id;
    const body = { naziv: 'Sala Test dodavanje', kapacitet: 20, sprat: 1, idTipaSale: noviTip.id };
    const req = new NextRequest('http://localhost/api/admin/sale/dodaj-sale', {
      method: 'POST',
      body: JSON.stringify(body)
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true)
    const provera=await db.select().from(Sala).where(eq(Sala.naziv,"Sala Test dodavanje"));
    expect(provera.length).toBe(1);
    expect(provera[0].kapacitet).toBe(20);
  
  });

});