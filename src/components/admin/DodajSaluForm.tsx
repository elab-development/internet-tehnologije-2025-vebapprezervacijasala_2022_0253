"use client";

import { useEffect, useState } from "react";
import ImageSelection from "@/components/ImgeSelection";
import FormField from "../FormField";
import Button from "../Button";

type DodajSaluFormProps = {
  onSaved?: () => void; // opcionalno callback posle dodavanja
};
type TipSale = {
  id: string;
  naziv: string;
};

export default function DodajSaluForm({ onSaved }: DodajSaluFormProps) {
  const [naziv, setNaziv] = useState("");
  const [kapacitet, setKapacitet] = useState<number | "">("");
  const [sprat, setSprat] = useState<number | "">("");
  const [urlSlike, setUrlSlike] = useState("");
  const [idTipaSale, setTipSaleId] = useState<string>("");

  const [tipoviSala, setTipoviSala] = useState<TipSale[]>([]);//za option

  //const[slika,setSlika]=useState("");
  useEffect(() => {
    async function fetchTipoveSale() {

      try {
        const res = await fetch("/api/tipoviSale");
        const data = await res.json();
        setTipoviSala(data);
      } catch (err) {
        console.error("Greška pri učitavanju tipova sala", err);
      }
    }

    fetchTipoveSale();



  }, []);
  const handleSubmit = async () => {
    if (!naziv || !kapacitet || !sprat || !idTipaSale) {
      alert("Popunite sva obavezna polja!");
      return;
    }

    try {// poziva api da doda salu i prosledjuje parametre koje kupi iz svojih polja 
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

      alert("Sala je uspešno dodata!");//osvezimo formu
      setNaziv("");
      setKapacitet("");
      setSprat("");
      setUrlSlike("");
      setTipSaleId("");

      onSaved?.(); 
    } catch (err) {
      console.error(err);
      alert("Došlo je do greške");
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-center">Dodaj Novu Salu</h1>

      <FormField
        label="Naziv sale"
        value={naziv}
        placeholder="Naziv sale"
        onChange={setNaziv}
        required
      />

      <FormField
        label="Kapacitet"
        type="number"
        value={kapacitet}
        placeholder="Kapacitet"
        onChange={(val) =>
          setKapacitet(val === "" ? "" : Number(val))
        }
        required
      />

      <FormField
        label="Sprat"
        type="number"
        value={sprat}
        placeholder="Sprat"
        onChange={(val) =>
          setSprat(val === "" ? "" : Number(val))
        }
        required
      />
     
      <ImageSelection value={urlSlike} onChange={(val) => setUrlSlike(val)} />

      
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

      </select>

      
      <br></br>
        <Button tekst="Dodaj" onClick={handleSubmit} />
        
      </div>
      );
}