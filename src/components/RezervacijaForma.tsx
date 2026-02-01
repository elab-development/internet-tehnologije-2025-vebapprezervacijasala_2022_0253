"use client"

import { date } from "drizzle-orm/mysql-core";
import { useEffect, useState } from "react";
import FormField from "./FormField";

type RezervacijaFormProps = {
  salaId: string;
  salaNaziv: string;
  kapacitet:number;
  onCancel?: () => void; 
};
type Dogadjaj={
    idDogadjaj:string;
    nazivDogadjaja:string;
};

export default function RezervacijaForm({ salaId, salaNaziv,kapacitet,onCancel }: RezervacijaFormProps) {
  const [datumPocetka, setDatumPocetka] = useState("");
  const [datumKraj, setDatumKraj] = useState("");
  const [viseDana, setViseDana] = useState(false);
  const [vremePocetka, setVremePocetka] = useState("");
  const [vremeKraja, setVremeKraja] = useState("");
  const [brojUcesnika, setBrojUcesnika] = useState<number | "">("");
  const [napomena, setNapomena] = useState("");
  // const[dogadjaji,setDogadjaji]=useState<Dogadjaj[]>([]);
   ///const[selektovaniDogadjaj,setSelektovaniDogadjaj]=useState<string>("");
 /*useEffect(()=>{
      async function fetchDogadjaji() {
        
             try {
      const res = await fetch("/api/dogadjaji");
      const data = await res.json();
      setDogadjaji(data);
      console.log(dogadjaji);
    } catch (err) {
      console.error("Greška pri učitavanju tipova sala", err);
    }}
        
      fetchDogadjaji();



    },[]);*/


  const handleSubmit = async () => {
    // osnovne provere
    if (!datumPocetka || !vremePocetka || !vremeKraja || brojUcesnika === "" ) {
        console.log(datumPocetka,vremeKraja,vremePocetka,brojUcesnika);
      alert("Popunite sva obavezna polja!");
      return;
    }

    if(brojUcesnika>kapacitet){
        alert("Premasili ste kapacitet sale!");
      return;
    }

   
    const payload = {
      salaId,
      datumPocetka,
       datumKraj: viseDana ? datumKraj : datumPocetka,
      vremePocetka,
      vremeKraja,
      brojUcesnika,
      napomena,
    };

    try {
      const odgovor = await fetch("/api/rezervacija", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!odgovor.ok) {
        console.error("Greška prilikom pamćenja rezervacije");
        return;
      }

      alert("Rezervacija je uspešno sačuvana!");
     
      setDatumPocetka("");
      setDatumKraj("");
      setVremePocetka("");
      setVremeKraja("");
      setBrojUcesnika("");
      setNapomena("");
    
    } catch (error) {
      console.error("Greška prilikom upisa podataka u bazu", error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-6 text-center">Rezerviši salu: {salaNaziv}</h2>

      <FormField label="Od:" type="date" value={datumPocetka} onChange={setDatumPocetka}   />

          {/* Toggle za više dana */}
         <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={viseDana}
            onChange={() => setViseDana(!viseDana)}
            id="viseDana"
          />
          <label htmlFor="viseDana" className="text-gray-700">Više dana</label>
        </div>

        {/* Datum kraja */}
       {viseDana &&( <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Do:</label>
          <input
            type="date"
            value={datumKraj}
            min={datumPocetka}
            disabled={!datumPocetka}
            onChange={(e) => setDatumKraj(e.target.value)}
            className="p-3 border border-[#7B542F] rounded-md focus:outline-none focus:ring-2 focus:ring-[#B6771D] disabled:bg-gray-100"
          />
        </div>)}

        {/* Vremenski interval */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Vreme:</label>
          <div className="flex gap-2">
            <input
              type="time"
             
              value={vremePocetka}
              onChange={(e) => setVremePocetka(e.target.value)}
              
              className="p-3 border border-[#7B542F] rounded-md focus:outline-none focus:ring-2 focus:ring-[#B6771D]"
              placeholder="Početak"
            />
            <input
              type="time"
              value={vremeKraja}
              
              onChange={(e) => setVremeKraja(e.target.value)}
               
              className="p-3 border border-[#7B542F] rounded-md focus:outline-none focus:ring-2 focus:ring-[#B6771D]"
              placeholder="Kraj"
            />
          </div>
        </div>

        {/* Broj učesnika */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Broj učesnika:</label>
          <input
            type="number"
           // min={1}
            value={brojUcesnika}
          //  onChange={(e) => setBrojUcesnika(parseInt(e.target.value))}
           onChange={(e) => {
    const val = e.target.value;
    setBrojUcesnika(val === "" ? "" : Number(val));}}
            className="p-3 border border-[#7B542F] rounded-md focus:outline-none focus:ring-2 focus:ring-[#B6771D]"
          />
        </div>

        {/* Napomena */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-700">Napomena:</label>
          <textarea
            value={napomena}
            onChange={(e) => setNapomena(e.target.value)}
            className="p-3 border border-[#7B542F] rounded-md focus:outline-none focus:ring-2 focus:ring-[#B6771D]"
            placeholder="Opcionalno"
          />
        </div>
 {/* <select
    value={selektovaniDogadjaj}
  onChange={(e) => setSelektovaniDogadjaj(e.target.value)}
  className="p-3 text-[#FFCF71] rounded-md border border-[#7B542F] focus:outline-none focus:ring-2 focus:ring-[#FF9D00]"
>
  <option value="">Svi dogadjaji</option>
  {dogadjaji.map((dogadjaj) => (
    <option key={dogadjaj.idDogadjaj} value={dogadjaj.idDogadjaj}>
      {dogadjaj.nazivDogadjaja}
    </option>
  ))}</select>*/}
        {/* Dugmad */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
          >
            Otkaži
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Rezerviši
          </button>
        </div>
      </div>
    
  );
}
