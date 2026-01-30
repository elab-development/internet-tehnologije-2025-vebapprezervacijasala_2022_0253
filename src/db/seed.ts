import bcrypt from "bcrypt"
import { korisnik, Oprema, Sala, SalaOprema, TipSale } from "./schema"
import { db } from "./index"


const hash = await bcrypt.hash("1234", 10)

await db.transaction(async (tx) => {
 /*   await tx.insert(korisnik).values([
        {
            idKorisnik: "58989f9f-e5ba-4306-99f2-de28b08ad3d4",
            name: "lala Petrovic",
            email: "lalap@gmail.com",
            passHash: hash,
            idUloga: "9547b7f9-c876-4d8e-b975-cf298c8a97af"

        },


    ])*/
   /*
    await tx.insert(TipSale).values([
        {
            id: "86699ca7-8cec-4297-ab70-925dca850923",
            opis: "haha",
            naziv: "Ucionica",
            minKapacitet: 30


        },


    ])
    await tx.insert(Sala).values([
        {
            id: "ab0760b1-8cec-4297-ab70-925dca850923",
            naziv: "Ucionica 1",
            kapacitet: 30,
            sprat: 1,
            idTipaSale: "86699ca7-8cec-4297-ab70-925dca850923"

        },


    ])
     await tx.insert(Sala).values([
        {
            id: "5e51614c-ceee-40fd-846a-91d862da317c",
            naziv: "Ucionica 2",
            kapacitet: 50,
            sprat: 1,
            idTipaSale: "86699ca7-8cec-4297-ab70-925dca850923"

        },


    ])

     await tx.insert(Oprema).values([
        {
            id: "1ad783ea-7ce9-445b-8ce6-549a47befc51",
            nazivOpreme:"Projektor",
            opisOpreme:"TOP",
            
        },


    ])
    
     await tx.insert(Oprema).values([
        {
            id: "46fae041-3c48-4dd7-8553-525a9446ae21",
            nazivOpreme:"Mikrofon",
            opisOpreme:"TOP",
            
        },


    ])*/ 
      await tx.insert(SalaOprema).values([
        {
            salaId: "5e51614c-ceee-40fd-846a-91d862da317c",
            opremaId:"46fae041-3c48-4dd7-8553-525a9446ae21",
            kolicina:3
            
            
        },


    ])
    await tx.insert(SalaOprema).values([
        {
            salaId: "5e51614c-ceee-40fd-846a-91d862da317c",
            opremaId:"1ad783ea-7ce9-445b-8ce6-549a47befc51",
            kolicina:2
            
            
        },


    ])
    await tx.insert(SalaOprema).values([
        {
            salaId: "ab0760b1-8cec-4297-ab70-925dca850923",
            opremaId:"1ad783ea-7ce9-445b-8ce6-549a47befc51",
            kolicina:1
            
            
        },


    ])

})



