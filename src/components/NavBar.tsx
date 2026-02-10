"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import Button from "./Button";




export default function NavBar() {
    const { user, logout } = useAuth();

    console.log(user?.role);
    
    return (


        <nav className="w-full bg-[#FFCF71] shadow-md px-8 py-4 flex items-center justify-between ">
            <div className="text-xl font-bold text-[#7B542F]">
                <Link href="/">Moja Sala</Link>
            </div>

            <div className="flex items-center gap-8">

                {user?.role?.trim() === "user" && (// ako je obican korisnik omoguci mu dugme Moje Rezervacije
                    <Link href="/moje-rezervacije"
                        className="text-[#7B542F] hover:text-[#B6771D] transition"> {/* Ovde treba izmeniti putanju kada se dodje do tog dela*/}
                        Moje rezervacije
                    </Link>)}

                {user?.role === "admin" && (//ako je admin omoguci mu dugme za Admin panel
                    <Link href="/dashboard"
                        className="text-[#7B542F] hover:text-[#B6771D] transition"> {/* Ovde treba izmeniti putanju kada se dodje do tog dela*/}
                        Admin panel
                    </Link>)}

                {!user ? ( //ako nije ulogovan prikazi Registraciju i Prijavu
                    <>

                        <Link href="/registracija">

                            <Button tekst="Registracija" />
                        </Link>


                        <Link href="/login">

                            <Button tekst="Prijava" />
                        </Link>
                    </>) : (// u suprotnom, ako je ulogovan cao i logout
                    <>
                        <span className="text-[#7B542F]">
                            👋 {user.name}
                        </span>

                        <Button
                            tekst="Logout"
                            onClick={async () => {
                                await fetch("/api/auth/logout", {
                                    method: "POST",
                                    credentials: "include",
                                });
                                logout();
                            }}
                        />



                    </>)}
            </div>


        </nav>


    );

}