"use client"
import Image from "next/image";
import { useState } from "react";

const sale=[
    {
        id:1,
        naziv:"Ucionica 1",
        kapacitet:30,
        sprat:1
    },
      {
        id:2,
        naziv:"Ucionica 2",
        kapacitet:50,
        sprat:1
    },
      {
        id:3,
        naziv:"Konferencijska sala 1",
        kapacitet:100,
        sprat:2
    }
    
]




export default function PregledSala() {
 
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
                src={"/public/slika.jpg"}
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

            
              <button
               // onClick
                className="mt-auto bg-[#7B542F] text-[#B6771D] py-2 px-4 rounded-md hover:bg-[#FFCF71] text-center transition"
              >
                Rezerviši
              </button>
            
          </div>
        ))}
      </div>

      
      
    </section>
  );
}
