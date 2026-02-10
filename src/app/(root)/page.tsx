"use client"
import PregledSala from "@/components/PregledSala";
import PretragaSala from "@/components/PretragaSala";
import { useEffect, useState } from "react";
/*
type Sala = {
  id: string;
  naziv: string;
  kapacitet: number;
  sprat: number;
};*/
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

export default function Home() {
  const [sale, setSale] = useState<SalaDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSveSale() { 

      try {
        const odgovor = await fetch("/api/sale");
        const podaci = await odgovor.json();
        setSale(podaci);
      } catch (err) {
        console.error("Greska prilikom ucitavanja sala");
      }
      finally {
        setLoading(false);
      }
    }


    fetchSveSale();
  }, [])

  return (
    <div> 
      <PretragaSala setSale={setSale}/>
      {loading ? ( <p className="text-black text-center py-10">Učitavanje sala...</p>):

      <PregledSala sale={sale}/>}
    </div>

  )
}