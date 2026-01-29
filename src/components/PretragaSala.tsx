"use client"

import { useEffect, useState } from "react";

export default function PretragaSala(){
    
    return (
 /* rounded-b-3xl – velika zaobljenja donjih uglova */
  <section className="bg-[#B6771D] py-16 px-8 text-center rounded-b-3xl">
   <h1 className="text-4xl font-bold text-[#FFCF71] mb-4">Dobrodošli u sistem za rezervaciju sala</h1>
    <p className="text-[#FFCF71] mb-8">
        Pronadjite slobodnu salu po datumu, vremenu, kapacitetu i tipu sale
    </p> 

  
    <form className="flex flex-col sm:flex-row justify-center items-center gap-4 ">

   <label className="flex items-center gap-2 text-[#7B542F]">
  <input 
    type="checkbox" 
   //onChange
  />
  Višednevna rezervacija
</label>
   
    <input
    type="date"
    //onChange
    className="p-3 text-[#FFCF71] rounded-md border border-[#47510B] focus:outline-none focus:ring-2 focus:ring-[#FF9D00] "
    />
    
  <input 
    type="date" 
    //onChange 
    className="p-3 text-[#FFCF71] rounded-md border border-[#7B542F] focus:outline-none focus:ring-2 focus:ring-[#FF9D00]"
  />

    <input 
    type="time"
    placeholder="Pocetak"
 //onChange
    className="p-3 text-[#FFCF71] rounded-md border border-[#7B542F] focus:outline-none focus:ring-[#FF9D00] focus:ring-2"
    
    />

    <input
    type="time"
    placeholder="Kraj"
 //onChange
    className="p-3 text-[#FFCF71] rounded-md border border-[#7B542F] focus:outline-none focus:ring-2 focus:ring-[#FF9D00]"
    />

    <input
    type="number"
    min="1"
    placeholder="Kapacitet"
//oNChange
    className="p-3 text-[#FFCF71] rounded-md border border-[#7B542F] focus:outline-none focus:ring-2 focus:ring-[#FF9D00]"
    />

    
        <select
  //onChange
  className="p-3 text-[#FFCF71] rounded-md border border-[#7B542F] focus:outline-none focus:ring-2 focus:ring-[#FF9D00]"
>
  <option value="">Svi tipovi sala</option>
{/* popunjavanje combo box tip sala */}
  
</select>
    

    <button
     type="button"
    // onClick
     className="bg-[#7B542F] text-[#FFCF71] px-6 py-3 rounded-md hover:bg-[#FFB6A9] transition font-medium"
    >
          Pretraži
    </button>


    </form>

   </section>
    );



}