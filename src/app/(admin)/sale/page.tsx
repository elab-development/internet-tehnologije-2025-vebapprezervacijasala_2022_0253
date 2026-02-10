"use client";

import DodajSaluForm from "@/components/admin/DodajSaluForm";
import Button from "@/components/Button";
import { useEffect, useState } from "react";
type Sala = {
  id: string;
  naziv: string;
  kapacitet: number;
};
export default function AdminSalePage() {
  const [sale, setSale] = useState<Sala[]>([]);

  const [dodajSaleForma, setDodajSaleForma] = useState(false);
  useEffect(() => {


    fetchData();
  }, []);

  
  async function fetchData() {
    try {
      const saleRes = await fetch("/api/admin/sale"); //vraca sve sale obican select upit
      setSale(await saleRes.json());


    } catch (err) {
      console.error("Greška pri učitavanju admin podataka:", err);
    }
  }


  async function obrisiSalu(id: string) {
    if (!confirm("Da li ste sigurni da želite da obrišete salu?")) return;

    const res = await fetch(`/api/admin/sale/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Greška pri brisanju");
      return;
    }

    alert("Sala uspešno obrisana");
    fetchData(); // ponovo učitaj listu sala
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#7B542F]">Sale</h1>
        {/* <button className="bg-[#B6771D] text-[#7B542F] px-4 py-2 rounded hover:bg-[#FFCF71]" onClick={() => setDodajSaleForma(true)}>
          + Dodaj salu
        </button>*/}
        <Button
          tekst="+ Dodaj salu"
          type="button"
          onClick={() => setDodajSaleForma(true)}


        />

      </div>

      <table className="w-full bg-white rounded-xl shadow overflow-hidden">
        <thead className="bg-[#7B542F] text-[#FFCF71]">
          <tr>
            <th className="p-3 text-left">Naziv</th>
            <th className="p-3 text-left">Kapacitet</th>
            <th className="p-3">Akcije</th>
          </tr>
        </thead>
        <tbody>
          {sale.map((s) => (
            <tr key={s.id} className="border-t">
              <td className="p-3">{s.naziv}</td>
              <td className="p-3">{s.kapacitet}</td>
              <td className="p-3 flex gap-2 justify-center">
                <button className="px-3 py-1 bg-gray-200 rounded">
                  Izmeni
                </button>
                {/*     <button className="px-3 py-1 bg-red-500 text-white rounded"
                onClick={()=>obrisiSalu(s.id)}
                >
                  Obriši
                </button>*/}
                <Button
                  tekst="Obriši"
                  type="button"
                  onClick={() => obrisiSalu(s.id)}
                  
                />

              </td>
            </tr>
          ))}
        </tbody>
      </table>


      {dodajSaleForma && (//ako je pritisnuo dugme true je dodajSaleFormu otvaramo je
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-md w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={() => setDodajSaleForma(false)}
            >
              ✖
            </button>
            <DodajSaluForm
              onSaved={() => {
                fetchData();        // osveži tabelu
                setDodajSaleForma(false); // zatvaramo je
              }}
            />
          </div>
        </div>
      )}
    </div>

  );
}