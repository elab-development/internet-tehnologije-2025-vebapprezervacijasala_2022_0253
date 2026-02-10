import NavBar from "@/components/NavBar";
import Link from "next/link";

export default function Layout({children}:{children:React.ReactNode})
{
 return(
    <div>
     <nav className="w-full bg-[#FFCF71] shadow-md px-8 py-4 flex items-center justify-between ">
          <div className="text-xl font-bold text-[#7B542F]">
            <Link href="/">Moja Sala</Link>
            
          </div>
          
           </nav>
      {children}
      </div>
 );
}