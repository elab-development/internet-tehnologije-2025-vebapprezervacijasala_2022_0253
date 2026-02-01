import { table, timeStamp } from "console";
import { integer, pgTable, varchar, uuid, timestamp, date, doublePrecision, primaryKey } from "drizzle-orm/pg-core";

export const TipSale=pgTable("TipSale",{
    id: uuid("idTipa").primaryKey().defaultRandom(),
    opis: varchar("opisTipaSale",{length:100}),
    naziv: varchar("nazivTipaSale",{length:250}).notNull(),
    minKapacitet: integer("minKapacitet").notNull(),
    createdAt: timestamp("created_at").defaultNow()
});

export const Sala=pgTable("Sala",{
    id:uuid("idSale").primaryKey().defaultRandom(),
    naziv: varchar("nazivSale",{length:100}).notNull(),
    kapacitet:integer("kapacitetSale").notNull(),
    sprat:integer("sprat").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    urlSlike:varchar("urlSlike",{length:200}),
    idTipaSale:uuid("idTipaSale").notNull().references(()=>TipSale.id)
});

export const Cena=pgTable("Cena",{
    salaId:uuid("idSale").notNull().references(()=>Sala.id),
    datumOd:date("datumOd").notNull(),
    iznos:doublePrecision("iznos").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
},(table)=>({
    pk: primaryKey({ columns: [table.salaId, table.datumOd] })
}));

export const Oprema=pgTable("Oprema",{
    id:uuid("idOprema").primaryKey().defaultRandom(),
    nazivOpreme: varchar("nazivOpreme",{length:100}).notNull(),
     opisOpreme:varchar("opisOpreme",{length:200}).notNull()
});

export const SalaOprema=pgTable("salaOprema",{
    salaId:uuid("idSala").notNull().references(()=>Sala.id),
    opremaId:uuid("idOprema").notNull().references(()=>Oprema.id),
    kolicina:integer("kolicina").notNull()

},(table)=>({
    primaryKey:[table.salaId,table.opremaId]
}));

export const Uloga=pgTable("Uloga",{

     idUloge:uuid("idUloge").primaryKey().defaultRandom(),
     nazivUloge:varchar("NazivUloge",{length:100}).notNull()
});

export const korisnik = pgTable("korisnik", {
    idKorisnik: uuid("idKorisnik").primaryKey().defaultRandom(),
    name: varchar("ime", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passHash: varchar("pass_hash", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
   idUloga: uuid("idUloga").notNull().references(()=>Uloga.idUloge)
});

export const Dogadjaj=pgTable("dogadjaj",{
    idDogadjaja:uuid("idDogadjaja").primaryKey().defaultRandom(),
    nazivDogadjaja:varchar("nazivDogadjaja",{length:100}).notNull()
});

export const Rezervacija=pgTable("rezervacija",{
    idRezervacije:uuid("idReezrvacija").primaryKey().defaultRandom(),
    napomena:varchar("napomena",{length:100}),
    pocetak:timestamp("pocetak").notNull(),
    kraj:timestamp("kraj").notNull(),
    brojUcesnika:integer("brojUcesnika").notNull(),
    ukupnaCena:doublePrecision("ukupnaCena"),
   // status:varchar("status",{length:100}),
    salaId:uuid("Salaid").notNull().references(()=>Sala.id),
    dogadjajId:uuid("Dogadjajid").references(()=>Dogadjaj.idDogadjaja),
    KorisnikId:uuid("Korsinikid").references(()=>korisnik.idKorisnik)
}
);


export const Recenzija=pgTable("recenzija",{
    idRezervacija:uuid("idRezervacija").notNull().references(()=>Rezervacija.idRezervacije),
    idRecenzije:uuid("idRecenzije").notNull(),
    ocena:doublePrecision("ocena").notNull(),
    komentar:varchar("komentar",{length:3000}),
    createdAt: timestamp("created_at").defaultNow(),
},(table)=>({
    pk: primaryKey({ columns: [table.idRezervacija, table.idRecenzije] })
}));