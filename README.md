# Veb aplikacija za rezervaciju sala

## Opis projekta

Ovaj projekat predstavlja web aplikaciju za rezervaciju sala koja omogućava korisnicima pregled dostupnih sala, kreiranje rezervacija, otkazivanje rezervacija i ostavljanje recenzija. Sistem je implementiran korišćenjem modernih web tehnologija i prati princip REST arhitekture.

Backend deo aplikacije razvijen je korišćenjem Next.js API ruta, dok je za pristup bazi podataka korišćen Drizzle ORM. Podaci se čuvaju u PostgreSQL bazi, a autentifikacija korisnika realizovana je pomoću JWT tokena koji se čuva u HTTP-only cookie-ju radi povećanja sigurnosti.

Aplikacija je kontejnerizovana korišćenjem Docker tehnologije, što omogućava jednostavno lokalno pokretanje i deployment sistema. Dokumentacija API-ja je dostupna putem Swagger UI interfejsa.

---
## Struktura projekta

src/
 ├── app/
 │    ├── api/
 │    ├── api-docs/
 │    ├── (admin)/
 │    ├── (autentifikacija)/
 │    ├── (rezervacije)/
 │    └── (root)/
 │
 ├── components/
 ├── db/
 └── lib/

---

## Arhitektura sistema

Sistem se sastoji od tri glavne komponente:

- Frontend aplikacija 
- Backend 
- PostgreSQL baza podataka


Komunikacija između komponenti odvija se putem **REST API zahteva**.

Tipovi zahteva koji su korišćeni:
- GET
- POST
- PATCH

---

## Korišćene tehnologije

- Next.js (App Router)
- TypeScript
- Drizzle ORM
- PostgreSQL
- Docker 
- JWT autentifikacija
- Swagger

---

## Autentifikacija

Sistem koristi JWT autentifikaciju gde se token čuva u HTTP-only cookie-ju pod nazivom **auth**.  
Ovaj pristup povećava sigurnost sistema jer štiti aplikaciju od XSS napada.

---

## Baza podataka

Podaci se skladište u **PostgreSQL** bazi.

Automatska inicijalizacija baze vrši se pomoću:

- Drizzle ORM migracija  
- Seed skripte za početne podatke  

---
## Lokalno pokretanje projekta
```bash
npm run dev
```
---
## Pokretanje projekta pomoću Dockera

### Build projekta 
```bash
docker-compose up --build
```
### Bez build-ovanja
```bash
docker compose up
```
---
## Pristup aplikaciji

[Frontend](http://localhost:3000)

[Swagger dokumentacija](http://localhost:3000/api-docs)

