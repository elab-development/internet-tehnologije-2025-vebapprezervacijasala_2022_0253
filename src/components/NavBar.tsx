"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";


/*bojezelena #47510B butter #FDFAD8 
seedgreen #CAD23C 
borda #AB1717 pink #FFB6A9 */

/* */

export default function NavBar() {
    const { user, logout } = useAuth();
console.log(user?.role);
    return (

        
        <nav className="w-full bg-[#FFCF71] shadow-md px-8 py-4 flex items-center justify-between ">
            <div className="text-xl font-bold text-[#7B542F]">
                <Link href="/">Moja Sala</Link>
            </div>

            <div className="flex items-center gap-8">
                {user?.role?.trim() === "user" && (
                    <Link href="/moje-rezervacije"
                        className="text-[#7B542F] hover:text-[#B6771D] transition"> {/* Ovde treba izmeniti putanju kada se dodje do tog dela*/}
                        Moje rezervacije
                    </Link>)}

                {user?.role === "admin" && (
                    <Link href="/admin/dashboard"
                        className="text-[#7B542F] hover:text-[#B6771D] transition"> {/* Ovde treba izmeniti putanju kada se dodje do tog dela*/}
                        Admin panel
                    </Link>)}

                {!user ? (
                    <>

                        <Link href="/registracija">
                            {/* rounded-md – srednje zaobljeni uglovi (border-radius) */}
                            <button className="bg-[#B6771D] text-[#7B542F] px-4 py-2 rounded-md hover:bg-[#FFCF71] transition ">
                                Registracija
                            </button>
                        </Link>


                        <Link href="/login">
                            {/* rounded-md – srednje zaobljeni uglovi (border-radius) */}
                            <button className="bg-[#B6771D] text-[#7B542F] px-4 py-2 rounded-md hover:bg-[#FFCF71] transition ">
                                Prijava
                            </button>
                        </Link>
                    </>) : (
                    <>
                        <span className="text-[#7B542F]">
                            👋 {user.name}
                        </span>

                        <button
                            className="bg-[#B6771D] text-[#7B542F] px-4 py-2 rounded-md hover:bg-[#FFCF71] transition"
                            onClick={async () => {
                                await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
                                logout(); // globalni state → dugmad nestaju svuda
                            }}
                        >
                            Logout
                        </button>
                    </>)}
            </div>


        </nav>


    );

}