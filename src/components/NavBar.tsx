"use client"

import Link from "next/link";
import { useEffect, useState } from "react";


/*bojezelena #47510B butter #FDFAD8 
seedgreen #CAD23C 
borda #AB1717 pink #FFB6A9 */

/* */

export default function NavBar() {


    return (

        <nav className="w-full bg-[#FFCF71] shadow-md px-8 py-4 flex items-center justify-between ">
            <div className="text-xl font-bold text-[#7B542F]">
                <Link href="/">Moja Sala</Link>
            </div>

            <div className="flex items-center gap-8">

                <Link href="/moje-rezervacije"
                    className="text-[#7B542F] hover:text-[#B6771D] transition"> {/* Ovde treba izmeniti putanju kada se dodje do tog dela*/}
                    Moje rezervacije
                </Link>


                <Link href="/admin/dashboard"
                    className="text-[#7B542F] hover:text-[#B6771D] transition"> {/* Ovde treba izmeniti putanju kada se dodje do tog dela*/}
                    Admin panel
                </Link>



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

                <span className="text-[#7B542F]">
                    👋 cao
                </span>

                <button
                    className="bg-[#B6771D] text-[#7B542F] px-4 py-2 rounded-md hover:bg-[#FFCF71] transition"

                >
                    Logout
                </button>

            </div>


        </nav>


    );

}