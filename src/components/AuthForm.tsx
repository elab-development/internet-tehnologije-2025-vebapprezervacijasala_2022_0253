"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type Mode = "login" | "register";
export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();//omogucava navigaciju do drugih stranica
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const title = mode === "login" ? "Prijavi se na svoj nalog" : "Napravi novi nalog";
  const btLabel = mode === "login" ? "Prijavi se" : "Napravi nalog ";

  const handleSubmit=async(e:FormEvent)=>{
     e.preventDefault();
     setErr("");
    setLoading(true);
     
     try{
      const endpoint=mode==="login"?"/api/auth/login":"api/auth/register";
      const body=mode==="login"?{email,password:pwd}:{name,email,password:pwd};
      const odgovor=await fetch(endpoint,{
        method:"POST",
        credentials:"include",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(body)
      })

      if(!odgovor.ok){
        setErr("Greska prilikom autentifikacije");
        return;
      }
      if(mode==="login"){
        router.refresh();
        router.push("/");
      }
      else{
        router.refresh();
        router.push("/login");
      }
     }
     finally{
        setLoading(false);
     }
    }



  return (
    <div className="min-h-screen flex items-center justify-center bg-[#7B542F] px-4">
      <div className="max-w-md w-full bg-[#FFCF71] p-8 rounded-lg shadow-lg">

        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          {title}
        </h2>

        <form onSubmit={handleSubmit}  className="space-y-4 ">
          {mode === "register" && (

            <div>
              <label className="block text-gray-700 mb-1">Ime i prezime</label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Unesite vase ime"
                className="w-full p-3 border border-[#7B542F] rounded-md focus:outline-none focus:ring-2 focus:ring-[#B6771D]"
                required
              />

            </div>
          )}

          {/*Email*/}

          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              placeholder="primer@gmail.com"
              className="w-full p-3 border border-[#7B542F] rounded-md focus:outline-none focus:ring-2 focus:ring-[#B6771D]"
              required
            />
          </div>

          {/*Lozinka*/}

          <div>
            <label className="block text-gray-700 mb-1">Lozinka</label>
            <input
              type="password"
              name="password"
               value={pwd}
         onChange={(e)=>setPwd(e.target.value)}
              placeholder="Unesite lozinku"
              className="w-full p-3 border border-[#7B542F] rounded-md focus:outline-none focus:ring-2 focus:ring-[#B6771D]"
              required
            />
          </div>
          {/*Ponovite lozinku*/}
          {mode === "register" && (
            <div>
              <label className="block text-gray-700 mb-1">Potvrda lozinke</label>
              <input
                type="password"
                name="confirmPassword"
                //onChange
                placeholder="Ponovite lozinku"
                className="w-full p-3 border border-[#7B542F] rounded-md focus:outline-none focus:ring-2 focus:ring-[#B6771D]"
                required
              />
            </div>
          )}

          {/* Dugme */}
          <button
            type="submit"
            className="w-full bg-[#7B542F] text-[#B6771D] py-3 rounded-md font-medium hover:bg-[#FFCF71] transition"
          >
            {btLabel}
          </button>

        </form>
        {mode === "login" && (
          <p className="mt-4 text-[#7B542F] text-sm text-center">
            Nemate nalog?{" "}
            <Link href="/registracija" className="text-[#B6771D] hover:underline">
              Registrujte se
            </Link>
          </p>)}

        {mode === "register" && (
          <p className="mt-4 text-[#7B542F] text-sm text-center">
            Već imate nalog?{" "}
            <Link href="/login" className="text-[#B6771D] hover:underline">
              Prijavite se
            </Link>
          </p>)}
      </div>
    </div>
  );

}