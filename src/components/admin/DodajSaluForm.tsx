"use client";

import { useEffect, useState } from "react";
import ImageSelection from "@/components/ImgeSelection";

type DodajSaluFormProps = {
  onSaved?: () => void; // opcionalno callback posle dodavanja
};
type TipSale={
 id:string;
 naziv:string;
};

export default function DodajSaluForm({ onSaved }: DodajSaluFormProps) {
  const [naziv, setNaziv] = useState("");
  const [kapacitet, setKapacitet] = useState<number | "">("");
  const [sprat, setSprat] = useState<number | "">("");
  const [urlSlike, setUrlSlike] = useState("");
  const [idTipaSale, setTipSaleId] = useState<string>("");
  const[tipoviSala,setTipoviSala]=useState<TipSale[]>([]);
  
  //const[slika,setSlika]=useState("");
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
  const handleSubmit = async () => {
    if (!naziv || !kapacitet || !sprat || !idTipaSale) {
      alert("Popunite sva obavezna polja!");
      return;
    }

    try {
      const res = await fetch("/api/admin/sale/dodaj-sale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          naziv,
          kapacitet: Number(kapacitet),
          sprat: Number(sprat),
          urlSlike,
          idTipaSale,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      alert("Sala je uspešno dodata!");
      setNaziv("");
      setKapacitet("");
      setSprat("");
      setUrlSlike("");
      setTipSaleId("");

      onSaved?.(); // poziva callback ako je definisan
    } catch (err) {
      console.error(err);
      alert("Došlo je do greške");
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-center">Dodaj Novu Salu</h1>

      <input
        type="text"
        placeholder="Naziv sale"
        value={naziv}
        onChange={(e) => setNaziv(e.target.value)}
        className="p-3 border rounded w-full"
      />

      <input
        type="number"
        placeholder="Kapacitet"
        value={kapacitet}
        onChange={(e) =>
          setKapacitet(e.target.value === "" ? "" : Number(e.target.value))
        }
        className="p-3 border rounded w-full"
      />

      <input
        type="number"
        placeholder="Sprat"
        value={sprat}
        onChange={(e) =>
          setSprat(e.target.value === "" ? "" : Number(e.target.value))
        }
        className="p-3 border rounded w-full"
      />

   {/*   <input
        type="text"
        placeholder="URL slike (opciono)"
        value={urlSlike}
        onChange={(e) => setUrlSlike(e.target.value)}
        className="p-3 border rounded w-full"
      />*/}
      <ImageSelection  value={urlSlike} onChange={(val)=>setUrlSlike(val)}/>

     {/*<input
        type="text"
        placeholder="Tip sale ID"
        value={idTipaSale}
        onChange={(e) => setTipSaleId(e.target.value)}
        className="p-3 border rounded w-full"
      />*/}
        <select
    value={idTipaSale}
  onChange={(e) => setTipSaleId(e.target.value)}
  className="p-3 text-[#FFCF71] rounded-md border border-[#7B542F] focus:outline-none focus:ring-2 focus:ring-[#FF9D00]"
>
  <option value="">Izaberite tip sale</option>
  {tipoviSala.map((tip) => (
    <option key={tip.id} value={tip.id}>
      {tip.naziv}
    </option>
  ))}
{/* popunjavanje combo box tip sala */}
  
</select>

      <button
        onClick={handleSubmit}
        className="w-full bg-[#B6771D] text-[#7B542F] py-3 rounded hover:bg-[#FFCF71] transition"
      >
        Dodaj
      </button>
    </div>
  );
}