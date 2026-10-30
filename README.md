# StayFinder – backend

REST-API för StayFinder (boenden och bokningar). Byggt med Hono, TypeScript och Supabase (Auth + Postgres med RLS).

Frontend: <länk till frontend-repot>

## Teknik

- Hono (webbramverk) med TypeScript
- Supabase: autentisering (cookie-sessioner via `@supabase/ssr`) och Postgres
- Zod för validering (`@hono/zod-validator`)
- Row Level Security i databasen

## Kom igång

```bash
npm install
cp .env.example .env   # fyll i dina egna värden
npm run dev
```

API:t körs på `http://localhost:3000`.

### Miljövariabler

Se `.env.example` för namnen. Värden ska aldrig checkas in.
`FRONTEND_URL` anger vilken frontend-origin CORS tillåter (lokalt `http://localhost:3001`).

## Endpoints

| Metod | Sökväg | Inloggning | Beskrivning |
|---|---|---|---|
| POST | `/auth/register` | nej | Skapa konto |
| POST | `/auth/login` | nej | Logga in (sätter sessionscookie) |
| POST | `/auth/logout` | ja | Logga ut |
| GET | `/auth/me` | ja | Vem är inloggad |
| GET | `/properties` | nej | Lista, med `city`, `maxPrice`, `guests`, `sort=price`, `order=asc\|desc` |
| GET | `/properties/:id` | nej | Ett boende |
| POST / PUT / DELETE | `/properties`, `/properties/:id` | ja | Skapa, ändra, ta bort boende |
| GET | `/bookings` | ja | Lista, valfritt `?property_id=` |
| GET | `/bookings/:id` | ja | En bokning |
| POST | `/bookings` | ja | Skapa bokning |
| PUT | `/bookings/:id` | ja | Ändra bokning |
| DELETE | `/bookings/:id` | ja | Ta bort bokning |

Testanrop med förväntade statuskoder finns i [`docs/api-tests.http`](docs/api-tests.http) (REST Client i VS Code). Lägg `TEST_EMAIL` och `TEST_PASSWORD` i `.env` för ett separat testkonto.

## Uppfyllda kriterier (G)

Alla G-kriterier är uppfyllda. Jag siktar på betyget G.

**Konto och inloggning**

- **G1** Skapa konto, logga in, logga ut. Backend: `/auth/*`. Frontend: `AuthForm`, `lib/auth.ts`.
- **G2** Inloggningen finns kvar vid reload. Sessionen ligger i en httpOnly-cookie. Frontend anropar `/auth/me` vid start (`UserContext`).
- **G3** Olika navigering för inloggad/utloggad. Frontend: `Navbar`.

**Boenden**

- **G4** Lista och detaljsida. Backend: `GET /properties`, `GET /properties/:id`. Frontend: startsidan och `properties/[id]`.
- **G5** Filtrering på stad, maxpris och antal gäster. Backend: `propertyQueryValidator` + `getProperties`. Frontend: `PropertyFilterForm` (filtren ligger i URL:en).
- **G6** Bara inloggade kan skapa, ändra och ta bort boenden. API: `requireAuth`. Databas: RLS-policies på `properties` (publik SELECT, INSERT/UPDATE/DELETE endast för `authenticated`).
- **G7** Formulär för att skapa boende. Frontend: `PropertyForm`, `properties/new`.
- **G8** Sortering på pris, stigande/fallande, i backend (`order("price_per_night", ...)` i `getProperties`).

**Bokningar**

- **G9** Boka från detaljsidan; utloggad uppmanas logga in. Frontend: `BookingForm`.
- **G10** Ogiltiga bokningar nekas (ogiltig e-post, noll gäster, utcheckning före incheckning; även fler gäster än `max_guests`). Backend: Zod-validering + kontroller i `routes/booking.ts`. Frontend visar felet i formuläret.
- **G11** Antal nätter och totalpris visas före bokning. Frontend: `countNights` i `BookingForm`.
- **G12** Se, ändra och ta bort bokningar för ett boende. Backend: `/bookings`. Frontend: `BookingList`.

**Kvalitet**

- **G13** Laddningsvy, felvy och egen sida när boende saknas. Frontend: `loading.tsx`, `error.tsx`, `not-found.tsx`.
- **G14** Statuskoder: 200 lyckat, 201 skapat, 400 ogiltig data, 401 ej inloggad, 404 saknas.
- **G15** RLS är aktiverat på tabellerna, med policies för `properties` och `bookings`. Databasen skyddar sig själv även om API:t kringgås.
- **G16** All data är typad. Backend: Zod-scheman med `z.infer` och typer för `Property`/`Booking`. Frontend: `src/types/`.

## Designval

- Regler om *form* (vilka fält, vilka typer) valideras med Zod. Regler om *innehåll* (t.ex. gäster mot boendets max) kontrolleras i routen mot databasen.
- Frontend validerar bara för användarens skull. Backend och databasen är det verkliga skyddet.
- Bokningar är i nuläget synliga för alla inloggade användare. Ägarskap per användare (VG1) är inte implementerat.