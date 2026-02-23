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
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Prijava korisnika
 *     description: Proverava email i lozinku korisnika i vraća osnovne podatke o korisniku. Postavlja auth cookie sa JWT tokenom.
 *     tags:
 *       - Autentifikacija
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: marko@gmail.com
 *               password:
 *                 type: string
 *                 example: mojaLozinka123
 *     responses:
 *       200:
 *         description: Uspešna prijava
 *         headers:
 *           Set-Cookie:
 *             description: JWT autentifikacioni cookie
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: Marko Marković
 *                 email:
 *                   type: string
 *                   example: marko@gmail.com
 *                 role:
 *                   type: string
 *                   example: admin
 *       401:
 *         description: Pogrešan email ili lozinka
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Pogresan email ili lozinka
 */

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
   