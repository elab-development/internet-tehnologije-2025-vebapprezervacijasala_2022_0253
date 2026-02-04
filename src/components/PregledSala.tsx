"use client"
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "./AuthProvider";
import RezervacijaForm from "./RezervacijaForma";
import Button from "./Button";


/*
type Sala = {
  id: string;
  naziv: string;
  kapacitet: number;
  sprat: number;
};
*/
type OpremaDTO = {
  id: string;
  naziv: string;
};

type SalaDTO = {
  id: string;
  naziv: string;
  kapacitet: number;
  sprat: number;
  urlSlike: string;
  oprema: OpremaDTO[];
};

type PregledSalaProps = {
  sale: SalaDTO[];
};




export default function PregledSala({ sale }: PregledSalaProps) {
  const { user } = useAuth();
  const [selektovanaSala, setSelektovanaSala] = useState<SalaDTO | null>(null);
  const [prikaziFormu, setPrikaziFormu] = useState(false);

  return (
    <section className="px-8 py-12 bg-[#7B542F]">
      <h2 className="text-2xl font-bold text-[#FFCF71] mb-6">Dostupne sale</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sale.map((sala) => (
          <div
            key={sala.id}
            className="bg-[#FFCF71] rounded-lg shadow-md p-6 flex flex-col justify-between"
          >
            <div className="relative h-48 w-full">
              <Image
                src={sala.urlSlike}

                alt={"Slika sale"}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{sala.naziv}</h3>
              <p className="text-[#B6771D] mb-2">Kapacitet: {sala.kapacitet}</p>
              <p className="text-[#B6771D] mb-4">Sprat: {sala.sprat}</p>
            </div>

            {/* Oprema */}
            <div className="mt-3">
              <h3 className="font-semibold">Oprema:</h3>

              {sala.oprema.length === 0 ? (
                <p className="text-gray-500">Nema dodatne opreme</p>
              ) : (
                <ul className="list-disc list-inside">
                  {sala.oprema.map((o) => (
                    <li key={o.id}>{o.naziv}</li>
                  ))}
                </ul>
              )}
            </div>
            <br></br>
          
    {user && (
              <div className="mt-auto">
                <Button
                  tekst="Rezerviši"
                  onClick={() => {
                    setSelektovanaSala(sala);
                    setPrikaziFormu(true);
                  }}

                />
              </div>
            )}
          </div>
        ))}
      </div>
        


            {/* Modal sa formom */}
            {selektovanaSala && prikaziFormu && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                <RezervacijaForm
                  salaId={selektovanaSala.id}
                  salaNaziv={selektovanaSala.naziv}
                  kapacitet={selektovanaSala.kapacitet}
                  onCancel={() => setPrikaziFormu(false)}
                />
              </div>
            )}

          </section>
        );
}
