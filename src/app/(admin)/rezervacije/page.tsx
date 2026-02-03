"use client";

export default function AdminRezervacijePage() {
  const rezervacije = [
    {
      id: 1,
      korisnik: "Marko P.",
      sala: "Sala A",
      datum: "15.05.2024",
      status: "Aktivna",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#7B542F]">Rezervacije</h1>

      <table className="w-full bg-white rounded-xl shadow">
        <thead className="bg-[#7B542F] text-[#FFCF71]">
          <tr>
            <th className="p-3">Korisnik</th>
            <th className="p-3">Sala</th>
            <th className="p-3">Datum</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {rezervacije.map((r) => (
            <tr key={r.id} className="border-t text-center">
              <td className="p-3">{r.korisnik}</td>
              <td className="p-3">{r.sala}</td>
              <td className="p-3">{r.datum}</td>
              <td className="p-3">
                <span className="px-3 py-1 rounded bg-green-500 text-white">
                  {r.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}