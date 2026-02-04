"use client";

import { useEffect, useState } from "react";

type Sala = {
  id: string;
  naziv: string;
  kapacitet: number;
};

type Rezervacija = {
  idRezervacije: string;
  name: string;
  naziv: string;
  pocetak: string;
  kraj: string;
  status: string;
};

type Korisnik = {
  id: string;
  name: string;
  email: string;
  nazivUloge: string;
};

export default function AdminDashboard() {
  const [sale, setSale] = useState<Sala[]>([]);
  const [rezervacije, setRezervacije] = useState<Rezervacija[]>([]);
  const [korisnici, setKorisnici] = useState<Korisnik[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const saleRes = await fetch("/api/admin/sale");
        setSale(await saleRes.json());

        const rezRes = await fetch("/api/admin/rezervacije");
        setRezervacije(await rezRes.json());

        const korisniciRes = await fetch("/api/admin/korisnici");
        setKorisnici(await korisniciRes.json());
      } catch (err) {
        console.error("Greška pri učitavanju admin podataka:", err);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Dobrodošli, Admin!</h1>

      {/* Sale */}
      <div className="bg-[#FFCF71] p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Upravljanje Salama</h2>
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-[#B6771D]">
              <th className="border px-4 py-2">Naziv Sale</th>
              <th className="border px-4 py-2">Kapacitet</th>
            </tr>
          </thead>
          <tbody>
            {sale.map((s) => (
              <tr key={s.id}>
                <td className="border px-4 py-2">{s.naziv}</td>
                <td className="border px-4 py-2">{s.kapacitet}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Rezervacije */}
      <div className="bg-[#FFCF71] p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Najnovije Rezervacije</h2>
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-[#B6771D]">
               <th>Rezervacija</th>
              <th className="border px-4 py-2">Korisnik</th>
              <th className="border px-4 py-2">Sala</th>
              <th className="border px-4 py-2">Početak</th>
              <th className="border px-4 py-2">Kraj</th>
              <th className="border px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {rezervacije.map((r) => (
              <tr key={r.idRezervacije}>
                <td className="border px-4 py-2">{r.idRezervacije}</td>
                <td className="border px-4 py-2">{r.name}</td>
                <td className="border px-4 py-2">{r.naziv}</td>
                <td className="border px-4 py-2">{new Date(r.pocetak).toLocaleString()}</td>
                <td className="border px-4 py-2">{new Date(r.kraj).toLocaleString()}</td>
                <td className={`border px-4 py-2 text-[#FFCF71]  text-center rounded ${r.status === "aktuelno" ? "bg-[#748B6F]" : r.status === "otkazano" ? "bg-[#D05663]" : "bg-[#2A403D]"}`}>
                  {r.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Korisnici */}
      <div className="bg-[#FFCF71] p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Lista Korisnika</h2>
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-[#B6771D]">
              <th className="border px-4 py-2">Ime</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Uloga</th>
            </tr>
          </thead>
          <tbody>
            {korisnici.map((k) => (
              <tr key={k.id}>
                <td className="border px-4 py-2">{k.name}</td>
                <td className="border px-4 py-2">{k.email}</td>
                <td className="border px-4 py-2">{k.nazivUloge}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}