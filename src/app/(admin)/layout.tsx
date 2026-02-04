"use client";
import Link from "next/link";
import React from "react";

export default function AdminLayout({ children }:{children:React.ReactNode}) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#7B542F] text-[#FFCF71] flex flex-col">
     <Link href="/">  <div className="p-6 text-2xl font-bold">Admin</div></Link>
        <nav className="flex-1">
          <ul className="space-y-2 px-4">
            <li>
              <Link href="/dashboard" className="block py-2 px-3 rounded hover:bg-[#B6771D]">Dashboard</Link>
            </li>
            <li>
              <Link href="/sale" className="block py-2 px-3 rounded hover:bg-[#B6771D]">Sale</Link>
            </li>
            <li>
              <Link href="/rezervacije" className="block py-2 px-3 rounded hover:bg-[#B6771D]">Rezervacije</Link>
            </li>
            <li>
              <Link href="/admin/korisnici" className="block py-2 px-3 rounded hover:bg-[#B6771D]">Korisnici</Link>
            </li>
            <li>
              <Link href="/admin/podesavanja" className="block py-2 px-3 rounded hover:bg-[#B6771D]">Podešavanja</Link>
            </li>
          </ul>
        </nav>
      
      </aside>

      {/* Glavni sadržaj */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
