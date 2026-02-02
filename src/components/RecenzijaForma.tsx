"use client";
import { useState } from "react";

export default function RecenzijaForma({
  rezervacijaId,
  onClose,
}: {
  rezervacijaId: string;
  onClose: () => void;
}) {
  const [ocena, setOcena] = useState(0);
  const [komentar, setKomentar] = useState("");

  async function submit() {
    if (ocena === 0) {
      alert("Izaberite ocenu");
      return;
    }

    await fetch("/api/recenzija", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        rezervacijaId,
        ocena,
        komentar,
      }),
    });

    onClose();
  }

  return (
    <div className="mt-4 p-4 border rounded bg-gray-50">
      <p className="font-semibold mb-2">Vaša ocena:</p>

      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((zvezda) => (
          <button
            key={zvezda}
            onClick={() => setOcena(zvezda)}
            className={zvezda <= ocena ? "text-yellow-500 text-2xl" : "text-gray-400 text-2xl"}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        placeholder="Komentar (opciono)"
        value={komentar}
        onChange={(e) => setKomentar(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <div className="mt-3 flex gap-2">
        <button
          onClick={submit}
          className="bg-[#B6771D] text-[#7B542F] px-4 py-2 rounded hover:bg-[#FFCF71]"
        >
          Sačuvaj
        </button>
        <button
          onClick={onClose}
          className="bg-[#B6771D] text-[#7B542F] px-4 py-2 rounded hover:bg-[#FFCF71]"
        >
          Otkaži
        </button>
      </div>
    </div>
  );
}