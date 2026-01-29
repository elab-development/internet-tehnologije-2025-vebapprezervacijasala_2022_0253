export default function Footer() {
  return (

    <footer className="bg-[#674627] text-[#FFCF71] py-10 px-8 mt-12 ">

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/*O nama / Tim*/}
        <div>
          {/* text-lg – veća veličina teksta (~18px) */}
          <h3 className="text-lg font-bold mb-3">O nama</h3>
          <p className="text-[#B6771D]">
            MojaSala
            <br></br>
            Osnivači:
            <br></br>
            Andrijana Nikolić, Đorđe Nenadić i
            Saška Savić
          </p>
        </div>

        {/*Kontakt*/}
        <div>
          <h3 className="text-lg font-bold mb-3">Kontakt</h3>
          <ul className="text-[#B6771D] space-y-1">
            <li>Email:mojasala@gmail.com</li>
            <li>Telefon +381 11 123 4567</li>
            <li>Adresa:Jove Ilića 154, Beograd, Srbija</li>
          </ul>


        </div>


        {/* Linkovi */}
        {/*Izmeniti putanje na linkovima kada dodje na red to*/}
        <div>
          <h3 className="text-[#FFCF71] font-bold mb-3">Linkovi</h3>
          <ul className="text-[#B6771D] space-y-1">
            <li><a href="#" className="hover:text-[#FFCF71] transition">Politika privatnosti</a></li>
            <li><a href="#" className="hover:text-[#FFCF71] transition">Uslovi korišćenja</a></li>
          </ul>
        </div>





      </div>
      <div className="mt-10 text-center text-[#FFCF71] text-sm">
        &copy; 2026 MojaSala. Sva prava zadržana.
      </div>

    </footer>

  );
}