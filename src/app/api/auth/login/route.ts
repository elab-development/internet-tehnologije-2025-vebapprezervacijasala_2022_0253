import { db } from "@/db";
import { korisnik,Uloga } from "@/db/schema";
import {AUTH_COOKIE, cookieOpts, generisiToken} from "@/lib/auth";
import { error } from "console";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
//definisemo Body requesta

type Body={
    email:string;
    password:string;
}

export async  function POST(req:Request){
    const{email,password}=(await req.json()) as Body;
     if(!email || !password){
        return NextResponse.json({error:"Pogresam email ili lozinka"},
            {status:401}
        )
     }
//trazi korisnika sa tim emailom
     const[u]=await db.select(
        {
            idKorisnik:korisnik.idKorisnik,
            name:korisnik.name,
            email:korisnik.email,
            passHash:korisnik.passHash,
            nazivUloge:Uloga.nazivUloge
        }
     ).from(korisnik).leftJoin(Uloga,eq(korisnik.idUloga,Uloga.idUloge)).where(eq(korisnik.email,email));
     if(!u){
        return NextResponse.json({error:"Pogresam email ili lozinka"},
            {status:401}
        )
     }

     //ako je nasao po mejlu, idemo dalje sa proverama
     //posto je sifra u bazi hasirana, hesira i ovu i uporedjuje ih

     const ok=await bcrypt.compare(password,u.passHash);
     if(!ok){
        return NextResponse.json({error:"Pogresam email ili lozinka"},
            {status:401}
        )
     }
     //ako je pronasao korisnika generisi token
     const token=generisiToken({sub:u.idKorisnik,email:u.email,name:u.name,role:u.nazivUloge ?? "user"});

     const odgovor=NextResponse.json({id:u.idKorisnik,name:u.name,email:u.email,role:u.nazivUloge});
     
     //salje se informacija browseru
     odgovor.cookies.set(AUTH_COOKIE,token,cookieOpts())
     return odgovor;
}
   