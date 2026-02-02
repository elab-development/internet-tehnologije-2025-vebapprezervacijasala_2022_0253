"use client"

import { useState, useEffect } from "react";
import RecenzijaForma from "./RecenzijaForma";
import RezervacijaForm from "./RezervacijaForma";


type Rezervacija = {
    
   id: string;
   salaNaziv: string;
   pocetak: string;
   kraj: string;
   status: "aktuelno" | "otkazano" | "zavrsena" | "izmenjena";




};


export default function MojeRezervacije() {
  const [rezervacije, setRezervacije] = useState<Rezervacija[]>([]);
  /*
    useEffect(() => {
      async function fetchRezervacije() {
        try {
          const res = await fetch("/api/rezervacija/moje", {
            credentials: "include",
          });
          const data = await res.json();
          setRezervacije(data);
         
        } catch (err) {
          console.error("Greška pri učitavanju rezervacija", err);
        }
      }
  
      fetchRezervacije();
    }, []);*/

  const [recenzijaForma, setRecenzijaForma] = useState<string | null>(null);
  const [rezervacijaZaIzmenu, setRezervacijaZaIzmenu] = useState<Rezervacija | null>(null);
  useEffect(() => {


    fetchRezervacije();
  }, []);
  async function fetchRezervacije() {
    try {
      const res = await fetch("/api/rezervacija/moje", {
        credentials: "include",
      });
      const data = await res.json();
      setRezervacije(data);
    } catch (err) {
      console.error("Greška pri učitavanju rezervacija", err);
    }
  }

  async function otkaziRezervaciju(rezervacijaId: string) {
    const potvrda = confirm("Da li ste sigurni da želite da otkažete rezervaciju?");
    if (!potvrda) return;

    const res = await fetch("/api/rezervacija/otkazi", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ rezervacijaId }),
    });

    if (res.ok) {

      fetchRezervacije();
    } else {
      alert("Greška pri otkazivanju rezervacije");
    }
  }


  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rezervacije.map((r) => (
        <div key={r.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between">
          <h3 className="text-xl font-bold">{r.salaNaziv}</h3>
          <p>Od: {new Date(r.pocetak).toLocaleString()}</p>
          <p>Do: {new Date(r.kraj).toLocaleString()}</p>
          <p>Status: {r.status}</p>

          {/* Dugmad prikazujemo samo ako je rezervacija aktuelna */}
          {r.status === "aktuelno" && (
            <div className="mt-4 flex gap-2">
              <button className="bg-[#B6771D] text-[#7B542F] px-4 py-2 rounded hover:bg-[#FFCF71]"
                onClick={() => otkaziRezervaciju(r.id)}
              >
                Otkaži
              </button>
              <button className="bg-[#B6771D] text-[#7B542F] px-4 py-2 rounded hover:bg-[#FFCF71]"
                onClick={() => setRezervacijaZaIzmenu(r)}
              >
                Izmeni
              </button>
            </div>
          )}

          {/* Ako je završena, opcija recenzije */}
          {r.status === "zavrsena" && (
            <button className="mt-4 bg-[#B6771D] text-[#7B542F] px-4 py-2 rounded hover:bg-[#FFCF71]"
              onClick={() => setRecenzijaForma(r.id)}
            >
              Recenzija
            </button>
          )}




          {recenzijaForma === r.id && (
            <RecenzijaForma
              rezervacijaId={r.id}
              onClose={() => setRecenzijaForma(null)}
            />
          )}
        </div>
      ))}
     
    </div>
  );
}
