import { db } from "@/db";
import { korisnik } from "@/db/schema";
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

     const[u]=await db.select().from(korisnik).where(eq(korisnik.email,email));
     if(!u){
        return NextResponse.json({error:"Pogresam email ili lozinka"},
            {status:401}
        )
     }

     //ako je nasao po mejlu, idemo dalje sa proverama
     const ok=await bcrypt.compare(password,u.passHash);
     if(!ok){
        return NextResponse.json({error:"Pogresam email ili lozinka"},
            {status:401}
        )
     }
     //ako je pronasao korisnika generisi token
     const token=generisiToken({sub:u.idKorisnik,email:u.email,name:u.name});
     const odgovor=NextResponse.json({id:u.idKorisnik,name:u.name,email:u.email});
     odgovor.cookies.set(AUTH_COOKIE,token,cookieOpts())
     return odgovor;
}
   