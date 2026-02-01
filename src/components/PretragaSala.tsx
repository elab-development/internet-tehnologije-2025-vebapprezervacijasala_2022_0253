"use client"

import { useEffect, useState } from "react";
type Sala={
    id:string;
    naziv:string;
    kapacitet:number;
    sprat:number;
}

type TipSale={
 id:string;
 naziv:string;
};

type OpremaDTO = {
  id: string;
  naziv: string;
};
type SalaDTO = {
  id: string;
  naziv: string;
  kapacitet: number;
  sprat: number;
  urlSlike:string;
  oprema: OpremaDTO[];
};
type Props={
    setSale:(sale:SalaDTO[])=>void;//paren callback
}
export default function PretragaSala({setSale}:Props){
     const[tipoviSala,setTipoviSala]=useState<TipSale[]>([]);
     const[kapacite,setKapacitet]=useState<number | "">("");
     const [selectedTip, setSelectedTip] = useState<string>("");
     const[vremePocetka,setVremePocetka]=useState<string>("");
     const[vremeZavrsetka,setVremeZavrsetka]=useState<string>("");
     const[datumPocetka,setDatumPocetka]=useState<string>("");
     const[datumZavrsetka,setDatumZavrsetak]=useState<string>("");
     const[visednevnaPretraga,setVisednevnaPretraga]=useState(false);
     useEffect(()=>{
      async function fetchTipoveSale() {
        
             try {
      const res = await fetch("/api/tipoviSale");
      const data = await res.json();
      setTipoviSala(data);
    } catch (err) {
      console.error("Greška pri učitavanju tipova sala", err);
    }}
        
      fetchTipoveSale();



    },[]);

    const handleSearch=async()=>{
        try{
            const url=new URL("/api/sale",window.location.origin);
            if(kapacite!==""){
                url.searchParams.set("kapacitet",kapacite.toString());
            }
            if (selectedTip) {
            url.searchParams.set("tip", selectedTip);
         }
          
            const start = `${datumPocetka}T${vremePocetka}`;
            url.searchParams.set("start", start);
            const end = visednevnaPretraga && datumZavrsetka 
             ? `${datumZavrsetka}T${vremeZavrsetka}`
             : `${datumPocetka}T${vremeZavrsetka}`;
             url.searchParams.set("end",end);
            
             
            const odgovor=await fetch(url.toString(),{
                method:"GET",
                credentials:"include"
            });
            if(!odgovor.ok){
                console.error("Greska prilikom pretrage sale");
                return;
            }
            const podaci=await odgovor.json();
            setSale(podaci);
        }catch(error){
            console.error("Doslo je do greske",error);
        }
    }
    return (
 /* rounded-b-3xl – velika zaobljenja donjih uglova */
  <section className="bg-[#B6771D] py-16 px-8 text-center rounded-b-3xl">
   <h1 className="text-4xl font-bold text-[#FFCF71] mb-4">Dobrodošli u sistem za rezervaciju sala</h1>
    <p className="text-[#FFCF71] mb-8">
        Pronadjite slobodnu salu po datumu, vremenu, kapacitetu i tipu sale
    </p> 

  
    <form className="flex flex-col sm:flex-row justify-center items-center gap-4 ">

   <label className="flex items-center gap-2 text-[#7B542F]">
  <input 
    type="checkbox" 
    checked={visednevnaPretraga}
    onChange={(e)=>setVisednevnaPretraga(e.target.checked)}
    
  />
  Višednevna rezervacija
</label>
   
    <input
    type="date"
    value={datumPocetka}
    onChange={(e)=>setDatumPocetka(e.target.value)}
    className="p-3 text-[#FFCF71] rounded-md border border-[#47510B] focus:outline-none focus:ring-2 focus:ring-[#FF9D00] "
    />
    
    {visednevnaPretraga &&(
  <input 
    type="date" 
    value={datumZavrsetka}
    onChange={(e)=>setDatumZavrsetak(e.target.value)}
    className="p-3 text-[#FFCF71] rounded-md border border-[#7B542F] focus:outline-none focus:ring-2 focus:ring-[#FF9D00]"
  />)}

  
    <input 
    type="time"
    placeholder="Pocetak"
    value={vremePocetka}
    onChange={(e)=>setVremePocetka(e.target.value)}
    className="p-3 text-[#FFCF71] rounded-md border border-[#7B542F] focus:outline-none focus:ring-[#FF9D00] focus:ring-2"
    
    />

    <input
    type="time"
    placeholder="Kraj"
   value={vremeZavrsetka}
   onChange={(e)=>setVremeZavrsetka(e.target.value)}
    className="p-3 text-[#FFCF71] rounded-md border border-[#7B542F] focus:outline-none focus:ring-2 focus:ring-[#FF9D00]"
    />

    <input
    type="number"
    min="1"
    placeholder="Kapacitet"
    value={kapacite}
    onChange={(e)=>{setKapacitet(e.target.value===""?"":parseInt(e.target.value))}}

    className="p-3 text-[#FFCF71] rounded-md border border-[#7B542F] focus:outline-none focus:ring-2 focus:ring-[#FF9D00]"
    />

    
        <select
    value={selectedTip}
  onChange={(e) => setSelectedTip(e.target.value)}
  className="p-3 text-[#FFCF71] rounded-md border border-[#7B542F] focus:outline-none focus:ring-2 focus:ring-[#FF9D00]"
>
  <option value="">Svi tipovi sala</option>
  {tipoviSala.map((tip) => (
    <option key={tip.id} value={tip.id}>
      {tip.naziv}
    </option>
  ))}
{/* popunjavanje combo box tip sala */}
  
</select>
    

    <button
     type="button"
    onClick={handleSearch}
     className="bg-[#7B542F] text-[#FFCF71] px-6 py-3 rounded-md hover:bg-[#FFB6A9] transition font-medium"
    >
          Pretraži
    </button>


    </form>

   </section>
    );



}