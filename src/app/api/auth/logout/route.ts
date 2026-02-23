import { AUTH_COOKIE } from "@/lib/auth";
import { NextResponse } from "next/server";
/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Odjava korisnika
 *     description: Briše autentifikacioni cookie i odjavljuje trenutno prijavljenog korisnika.
 *     tags:
 *       - Autentifikacija
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Uspešna odjava
 *         headers:
 *           Set-Cookie:
 *             description: Briše JWT autentifikacioni cookie (postavlja prazan cookie sa isteklim rokom)
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Korisnik nije autentifikovan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Niste prijavljeni
 */
export async function POST() {
    const res = NextResponse.json({ ok: true })

    res.cookies.set(AUTH_COOKIE, "", {
        httpOnly: true, // ne moze da se pristupi kroz JS, stiti od XSS
        sameSite: "lax" as const, // stiti od CSRF
        secure: process.env.NODE_ENV === "production", // samo HTTPS na produkciji
        path: "/",
        maxAge: 0,
        expires: new Date(0) //01.01.1970. stavljamo da nam je kuku istekao
        //api/auth/me ce da vrati unautheni...
    })

    return res
}