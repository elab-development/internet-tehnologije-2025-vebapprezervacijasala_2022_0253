import bcrypt from "bcrypt"
import { korisnik } from "./schema"
import { db } from "./index"


const hash = await bcrypt.hash("1234", 10)

await db.transaction(async (tx) => {
    await tx.insert(korisnik).values([
        {
            idKorisnik: "58989f9f-e5ba-4306-99f2-de28b08ad3d4",
            name: "lala Petrovic",
            email: "lalap@gmail.com",
            passHash: hash,
           
        },
        
    ])
})