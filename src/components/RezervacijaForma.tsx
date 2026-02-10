"use client"

import { date } from "drizzle-orm/mysql-core";
import { useEffect, useState } from "react";
import FormField from "./FormField";
import Button from "./Button";

type RezervacijaFormProps = {//za popunjavanje podatka i izlaz iz forme
  salaId: string;
  salaNaziv: string;
  kapacitet: number;
  onCancel?: () => void;//moze da se prosledi a i ne mora to znaci ?
};

type Dogadjaj = {
  idDogadjaj: string;
  nazivDogadjaja: string;
};

export default function RezervacijaForm({ salaId, salaNaziv, kapacitet, onCancel }: RezervacijaFormProps) {
  const [datumPocetka, setDatumPocetka] = useState("");
  const [datumKraj, setDatumKraj] = useState("");
  const [viseDana, setViseDana] = useState(false);
  const [vremePocetka, setVremePocetka] = useState("");
  const [vremeKraja, setVremeKraja] = useState("");
  const [brojUcesnika, setBrojUcesnika] = useState<number | "">(""); //ili broj ili prazan string
  const [napomena, setNapomena] = useState("");

// stanja za atribute rezervacije


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
    if (!datumPocetka || !vremePocetka || !vremeKraja || brojUcesnika === "") {
      console.log(datumPocetka, vremeKraja, vremePocetka, brojUcesnika);
      alert("Popunite sva obavezna polja!");//required
      return;
    }

    if (brojUcesnika > kapacitet) {
      alert("Premasili ste kapacitet sale!");
      return;
    }


    const payload = { //sta saljemo, sve sto smo pokupili iz polja
      salaId,
      datumPocetka,
      datumKraj: viseDana ? datumKraj : datumPocetka,
      vremePocetka,
      vremeKraja,
      brojUcesnika,
      napomena,
    };

    try {//saljemo zahtev za upis rezervacije u bazu
      const odgovor = await fetch("/api/rezervacija", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!odgovor.ok) {
        alert((await odgovor.json()).error); //ispisuje odgovor koji mu salje api
        return;
      }

      alert("Rezervacija je uspešno sačuvana!");

      setDatumPocetka("");//resetujemo polja 
      setDatumKraj("");
      setVremePocetka("");
      setVremeKraja("");
      setBrojUcesnika("");
      setNapomena("");

    } catch (error) {
      console.error("Greška prilikom upisa podataka u bazu", error);
    }
  };

  return (//izgled forme 
    <div className="p-6 bg-white rounded-2xl shadow-md w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-6 text-center">Rezerviši salu: {salaNaziv}</h2>

      <FormField label="Od:" //reusable komponenta FormField
        type="date"
        value={datumPocetka}
        onChange={setDatumPocetka}
        required
      />

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
      {viseDana && (<div className="flex flex-col">
     
        <FormField
          label="Do:"
          type="date"
          value={datumKraj}
          min={datumPocetka}
          onChange={setDatumKraj}
          required
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
            setBrojUcesnika(val === "" ? "" : Number(val));//stavili smo da je ili broj ili prazans string
          }}
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
     
      {/* Dugmad */}
      <div className="flex justify-end gap-3 mt-4">

        <Button
          tekst="Otkaži"
          type="button"
          onClick={onCancel}//onCancel je prosledjeno od strane roditelja
        />


        <Button
          tekst="Rezerviši"
          type="button"
          onClick={handleSubmit}
        />

      </div>
    </div>

  );
}
