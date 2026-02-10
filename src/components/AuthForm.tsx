"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import Button from "./Button";
import FormField from "./FormField";

type Mode = "login" | "register";
export default function AuthForm({ mode }: { mode: Mode }) { //kada je pozivamo prosledjujemo mode

  const router = useRouter();//omogucava navigaciju do drugih stranica
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirmpwd, setConfirmPwd] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const title = mode === "login" ? "Prijavi se na svoj nalog" : "Napravi novi nalog";
  const btLabel = mode === "login" ? "Prijavi se" : "Napravi nalog ";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();//da se ne refresuje 

    setErr("");
    setLoading(true);

    if (mode === "register" && pwd !== confirmpwd) {
      setErr("Lozinke se ne poklapaju");
      window.alert(err);
      setLoading(false);
      return;
    }
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "api/auth/register"; //gde se prosledjuje zahtev
      const body = mode === "login" ? { email, password: pwd } : { name, email, password: pwd }; //sta se prosledjuje
      const odgovor = await fetch(endpoint, {//ovde ide ruta inace ovako "api/..."
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })

      if (!odgovor.ok) {
        setErr("Greska prilikom autentifikacije");
        alert("Neispravni kredencijali");
        return;
      }
      if (mode === "login") {
        router.refresh();
        router.push("/");//kad se loginuje vraca na pocetnu
      }
      else {
        router.refresh();
        router.push("/login");//kad se registruje vraca na registraciju
      }
    }
    finally {
      setLoading(false);
    }
  }



  return (
    <div className="min-h-screen flex items-center justify-center bg-[#7B542F] px-4">
      <div className="max-w-md w-full bg-[#FFCF71] p-8 rounded-lg shadow-lg">

        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          {title}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 ">
          {mode === "register" && (

            <div>

              <FormField

                label="Ime i prezime"
                value={name}
                placeholder="Unesite vaše ime"
                onChange={setName}
                required
              />


            </div>
          )}

          {/*Email*/}

          <div>
            <FormField
              label="Email"
              type="email"
              value={email}
              placeholder="primer@gmail.com"
              onChange={setEmail}
              required
            />


          </div>


          {/*Lozinka*/}

          <div>
            <FormField
              label="Lozinka"
              type="password"
              value={pwd}
              placeholder="Unesite lozinku"
              onChange={setPwd}
              required
            />


          </div>
          {/*Ponovite lozinku*/}
          {mode === "register" && (
            <div>

              <FormField
                label="Potvrda lozinke"
                type="password"
                value={confirmpwd}
                placeholder="Ponovite lozinku"
                onChange={setConfirmPwd}
              />
            </div>
          )}



          <Button
            tekst={loading ? "Učitavanje..." : btLabel}
            type="submit"

          />

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