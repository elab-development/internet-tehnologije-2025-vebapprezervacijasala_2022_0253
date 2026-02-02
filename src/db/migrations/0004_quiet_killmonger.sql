ALTER TABLE "rezervacija" RENAME COLUMN "idReezrvacija" TO "idRezrvacija";--> statement-breakpoint
ALTER TABLE "recenzija" DROP CONSTRAINT "recenzija_idRezervacija_rezervacija_idReezrvacija_fk";
--> statement-breakpoint
ALTER TABLE "recenzija" ADD CONSTRAINT "recenzija_idRezervacija_rezervacija_idRezrvacija_fk" FOREIGN KEY ("idRezervacija") REFERENCES "public"."rezervacija"("idRezrvacija") ON DELETE no action ON UPDATE no action;