

import NavBar from "@/components/NavBar";

export default function GlavniLayout({children}:{children:React.ReactNode})
{
 return(
    <div>
      
    <NavBar />
    {children}
    
    </div>
 );
}