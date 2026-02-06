import { db } from "@/db";
import { korisnik, Uloga } from "@/db/schema";
import { error } from "console";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"
import { AUTH_COOKIE, cookieOpts, generisiToken } from "@/lib/auth";

type Body={

    name:string;
    email:string;
    password:string
}

export async function POST(req:Request){

    const{name,email,password}=(await req.json()) as Body;
    if(!name || !email || !password){
        return NextResponse.json({error:"Nedostaju podaci"},
            {status:401}
        )
    }
    //ako je validacija prosla, proveravamo da li ovakav user vec postoj
    const postoji=await db.select().from(korisnik).where(eq(korisnik.email,email));
    if(postoji.length){
        return NextResponse.json({error:"Email vec postoji"},{status:400})
    }

    //ako ne postoji, uzmi sifru i hesiraj je
    const passHash=await bcrypt.hash(password,10);

    const [userRole] = await db
  .select({ id: Uloga.idUloge })
  .from(Uloga)
  .where(eq(Uloga.nazivUloge, "user"));
    //upisi u bazu
    const [u]=await db.insert(korisnik).
    values({name,email,passHash, idUloga:userRole.id}).
    returning({id:korisnik.idKorisnik, name:korisnik.name,email:korisnik.email});

    const token=generisiToken({sub:u.id,email:u.email,name:u.name,role:"user"});
      const res = NextResponse.json(u)
    res.cookies.set(AUTH_COOKIE, token, cookieOpts())

    //return user data - response
    return res;

}