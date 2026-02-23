export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { verifikujToken } from '@/lib/auth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("auth")?.value;
  const metod = req.method; 


  const javneApiRute = [
    "/api/auth/login",
    "/api/auth/logout",
    "/api/auth/register",
    "/api/auth/me",
    "/api/sale",
    "/api/tipoviSale",
    "/api/swagger"
  ];

  
  if (pathname.startsWith("/api") && !javneApiRute.includes(pathname)) {
    if (!token) {
      return NextResponse.json({ message: "Niste ulogovani" }, { status: 401 });
    }

    try {
      const k = await verifikujToken(token);
      const rola = k.role;

      
      const jeRezervacija = pathname === "/api/rezervacija" || pathname.startsWith("/api/rezervacija/otkazi");
      if (jeRezervacija && (metod === "POST" || metod === "PATCH")) {
        return NextResponse.next();
      }

     
      const samoAdminMetodi = ["DELETE", "PUT"];
      if (samoAdminMetodi.includes(metod) || pathname.startsWith("/api/admin")) {
        if (rola !== "admin") {
          return NextResponse.json({ message: "Ovo može samo admin!" }, { status: 403 });
        }
      }

      return NextResponse.next();
    } catch (error) {
      return NextResponse.json({ message: "Token nije validan" }, { status: 401 });
    }
  }


  
  const adminStranice = ["/dashboard", "/rezervacije", "/sale"];
  
  if (adminStranice.some(stranica => pathname.startsWith(stranica))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
      const k = await verifikujToken(token);
      if (k.role !== "admin") {
        console.log("NEOVLAŠĆEN PRISTUP STRANICI:", pathname);
        return NextResponse.redirect(new URL('/', req.url)); // Vrati ga na početnu
      }
    } catch (e) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {

  matcher: ['/api/:path*', '/dashboard/:path*', '/rezervacije/:path*', '/sale/:path*'],
};