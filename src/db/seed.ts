import bcrypt from "bcrypt";
import { 
    korisnik, 
    Oprema, 
    Sala, 
    SalaOprema, 
    TipSale, 
    Uloga 
} from "./schema";
import { db } from "./index";

async function main() {
    const hash = await bcrypt.hash("1234", 10);

    console.log("Započinjem seedovanje baze...");

    try {
        await db.transaction(async (tx) => {
            // 1. ULOGE
            await tx.insert(Uloga).values([
                { idUloge: "9547b7f9-c876-4d8e-b975-cf298c8a97af", nazivUloge: "admin" },
                { idUloge: "1a532d97-2a35-4884-93f0-63c1f3723786", nazivUloge: "user" }
            ]).onConflictDoNothing();

            // 2. TIP SALE
            await tx.insert(TipSale).values([
                {
                    id: "86699ca7-8cec-4297-ab70-925dca850923",
                    naziv: "Ucionica",
                    opis: "Standardna učionica za predavanja",
                    minKapacitet: 30
                },
                {
                    id: "43175ccb-e658-4afa-8b32-90b0f0990c38",
                    naziv: "Konferencijska sala",
                    opis: "Sala za poslovne sastanke",
                    minKapacitet: 10
                }
            ]).onConflictDoNothing();

            // 3. OPREMA
            await tx.insert(Oprema).values([
                { id: "1ad783ea-7ce9-445b-8ce6-549a47befc51", nazivOpreme: "Projektor", opisOpreme: "Full HD projektor" },
                { id: "46fae041-3c48-4dd7-8553-525a9446ae21", nazivOpreme: "Mikrofon", opisOpreme: "Bežični mikrofon" },
                { id: "6e0f4d04-9138-4474-a146-2e9ff1b226f4", nazivOpreme: "TV", opisOpreme: "Smart TV 55 inča" },
                { id: "911f51a9-465e-455f-900f-6b49e68e0f99", nazivOpreme: "Pametna tabla", opisOpreme: "Digitalna bela tabla" }
            ]).onConflictDoNothing();

            // 4. KORISNICI
            await tx.insert(korisnik).values([
                {
                    idKorisnik: "58989f9f-e5ba-4306-99f2-de28b08ad3d4",
                    name: "Lala Petrovic",
                    email: "lalap@gmail.com",
                    passHash: hash,
                    idUloga: "9547b7f9-c876-4d8e-b975-cf298c8a97af"
                },
                {
                    idKorisnik: "7b5591f9-02fc-4c9c-a3ca-48dd2a570989",
                    name: "Andrijana",
                    email: "andri@gmail.com",
                    passHash: hash,
                    idUloga: "1a532d97-2a35-4884-93f0-63c1f3723786"
                }
            ]).onConflictDoNothing();

            // 5. SALE
            await tx.insert(Sala).values([
                {
                    id: "ab0760b1-8cec-4297-ab70-925dca850923",
                    naziv: "Ucionica 1",
                    kapacitet: 30,
                    sprat: 1,
                    idTipaSale: "86699ca7-8cec-4297-ab70-925dca850923"
                },
                {
                    id: "5e51614c-ceee-40fd-846a-91d862da317c",
                    naziv: "Ucionica 2",
                    kapacitet: 50,
                    sprat: 1,
                    idTipaSale: "86699ca7-8cec-4297-ab70-925dca850923"
                },
                {
                    id: "4f390749-da6b-4757-a173-14d0d2a0c099",
                    naziv: "Konferencijska sala 1",
                    kapacitet: 20,
                    sprat: 2,
                    idTipaSale: "43175ccb-e658-4afa-8b32-90b0f0990c38",
                    urlSlike: "/konferencijska1.jpeg"
                },
                {
                    id: "17d6e2ef-f75f-4079-810e-9b9fdfc4c549",
                    naziv: "Konferencijska sala 2",
                    kapacitet: 50,
                    sprat: 2,
                    idTipaSale: "43175ccb-e658-4afa-8b32-90b0f0990c38",
                    urlSlike: "/konferencijska2.jpeg"
                }
            ]).onConflictDoNothing();

            // 6. SALA-OPREMA
            await tx.insert(SalaOprema).values([
                { salaId: "5e51614c-ceee-40fd-846a-91d862da317c", opremaId: "46fae041-3c48-4dd7-8553-525a9446ae21", kolicina: 3 },
                { salaId: "5e51614c-ceee-40fd-846a-91d862da317c", opremaId: "1ad783ea-7ce9-445b-8ce6-549a47befc51", kolicina: 2 },
                { salaId: "ab0760b1-8cec-4297-ab70-925dca850923", opremaId: "1ad783ea-7ce9-445b-8ce6-549a47befc51", kolicina: 1 },
                { salaId: "17d6e2ef-f75f-4079-810e-9b9fdfc4c549", opremaId: "911f51a9-465e-455f-900f-6b49e68e0f99", kolicina: 1 },
                { salaId: "4f390749-da6b-4757-a173-14d0d2a0c099", opremaId: "911f51a9-465e-455f-900f-6b49e68e0f99", kolicina: 1 },
                { salaId: "17d6e2ef-f75f-4079-810e-9b9fdfc4c549", opremaId: "46fae041-3c48-4dd7-8553-525a9446ae21", kolicina: 50 }
            ]).onConflictDoNothing();
        });

        console.log("Seedovanje baze uspešno završeno!");
    } catch (error) {
        console.error("Greška tokom seedovanja:", error);
        
    }
}

main();