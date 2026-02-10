

import { AuthProvider } from "@/components/AuthProvider";
import NavBar from "@/components/NavBar";

export default function GlavniLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <AuthProvider>

        <NavBar />
        {children}
      </AuthProvider>


    </div>
  );
}