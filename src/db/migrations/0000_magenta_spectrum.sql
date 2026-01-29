CREATE TABLE "Cena" (
	"idSale" uuid NOT NULL,
	"datumOd" date NOT NULL,
	"iznos" double precision NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "Cena_idSale_datumOd_pk" PRIMARY KEY("idSale","datumOd")
);
--> statement-breakpoint
CREATE TABLE "dogadjaj" (
	"idDogadjaja" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nazivDogadjaja" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Oprema" (
	"idOprema" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nazivOpreme" varchar(100) NOT NULL,
	"opisOpreme" varchar(200) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recenzija" (
	"idRezervacija" uuid NOT NULL,
	"idRecenzije" uuid NOT NULL,
	"ocena" double precision NOT NULL,
	"komentar" varchar(3000),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "recenzija_idRezervacija_idRecenzije_pk" PRIMARY KEY("idRezervacija","idRecenzije")
);
--> statement-breakpoint
CREATE TABLE "rezervacija" (
	"idReezrvacija" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"napomena" varchar(100),
	"pocetak" timestamp NOT NULL,
	"kraj" timestamp NOT NULL,
	"brojUcesnika" integer NOT NULL,
	"ukupnaCena" double precision,
	"Salaid" uuid NOT NULL,
	"Dogadjajid" uuid,
	"Korsinikid" uuid
);
--> statement-breakpoint
CREATE TABLE "Sala" (
	"idSale" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nazivSale" varchar(100) NOT NULL,
	"kapacitetSale" integer NOT NULL,
	"sprat" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"urlSlike" varchar(200),
	"idTipaSale" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "salaOprema" (
	"idSala" uuid NOT NULL,
	"idOprema" uuid NOT NULL,
	"kolicina" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "TipSale" (
	"idTipa" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"opisTipaSale" varchar(100),
	"nazivTipaSale" varchar(250) NOT NULL,
	"minKapacitet" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "Uloga" (
	"idUloge" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"NazivUloge" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "korisnik" (
	"idKorisnik" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ime" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"pass_hash" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "korisnik_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "Cena" ADD CONSTRAINT "Cena_idSale_Sala_idSale_fk" FOREIGN KEY ("idSale") REFERENCES "public"."Sala"("idSale") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recenzija" ADD CONSTRAINT "recenzija_idRezervacija_rezervacija_idReezrvacija_fk" FOREIGN KEY ("idRezervacija") REFERENCES "public"."rezervacija"("idReezrvacija") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rezervacija" ADD CONSTRAINT "rezervacija_Salaid_Sala_idSale_fk" FOREIGN KEY ("Salaid") REFERENCES "public"."Sala"("idSale") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rezervacija" ADD CONSTRAINT "rezervacija_Dogadjajid_dogadjaj_idDogadjaja_fk" FOREIGN KEY ("Dogadjajid") REFERENCES "public"."dogadjaj"("idDogadjaja") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rezervacija" ADD CONSTRAINT "rezervacija_Korsinikid_korisnik_idKorisnik_fk" FOREIGN KEY ("Korsinikid") REFERENCES "public"."korisnik"("idKorisnik") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Sala" ADD CONSTRAINT "Sala_idTipaSale_TipSale_idTipa_fk" FOREIGN KEY ("idTipaSale") REFERENCES "public"."TipSale"("idTipa") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "salaOprema" ADD CONSTRAINT "salaOprema_idSala_Sala_idSale_fk" FOREIGN KEY ("idSala") REFERENCES "public"."Sala"("idSale") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "salaOprema" ADD CONSTRAINT "salaOprema_idOprema_Oprema_idOprema_fk" FOREIGN KEY ("idOprema") REFERENCES "public"."Oprema"("idOprema") ON DELETE no action ON UPDATE no action;