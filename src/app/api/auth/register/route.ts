import { db } from "@/db";
import { korisnik, Uloga } from "@/db/schema";
import { error } from "console";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"
import { AUTH_COOKIE, cookieOpts, generisiToken } from "@/lib/auth";
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registracija korisnika
 *     description: Kreira novog korisnika, dodeljuje mu ulogu "user", generiše JWT token i postavlja autentifikacioni cookie.
 *     tags:
 *       - Autentifikacija
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Marko Marković
 *               email:
 *                 type: string
 *                 format: email
 *                 example: marko@gmail.com
 *               password:
 *                 type: string
 *                 example: mojaLozinka123
 *     responses:
 *       200:
 *         description: Uspešna registracija
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
 *       400:
 *         description: Email već postoji
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Email vec postoji
 *       401:
 *         description: Nedostaju podaci
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Nedostaju podaci
 */
type Body = {

    name: string;
    email: string;
    password: string
}

export async function POST(req: Request) {

    const { name, email, password } = (await req.json()) as Body;
    if (!name || !email || !password) {
        return NextResponse.json({ error: "Nedostaju podaci" },
            { status: 401 }
        )
    }
    //ako je validacija prosla, proveravamo da li ovakav user vec postoj
    const postoji = await db.select().from(korisnik).where(eq(korisnik.email, email));
    if (postoji.length) {
        return NextResponse.json({ error: "Email vec postoji" }, { status: 400 })
    }

    //ako ne postoji, uzmi sifru i hesiraj je
    const passHash = await bcrypt.hash(password, 10);

    const [userRole] = await db //izvlacimo id uloge
        .select({ id: Uloga.idUloge })
        .from(Uloga)
        .where(eq(Uloga.nazivUloge, "user"));

    //upisi u bazu
    const [u] = await db.insert(korisnik).
        values({ name, email, passHash, idUloga: userRole.id }).
        returning({ id: korisnik.idKorisnik, name: korisnik.name, email: korisnik.email });

    //za novog korisnika generisetoken i setuje ga
    const token = generisiToken({ sub: u.id, email: u.email, name: u.name, role: "user" });
    const res = NextResponse.json(u)
    
    //za browser
    res.cookies.set(AUTH_COOKIE, token, cookieOpts())

    //return user data - response
    return res;

}