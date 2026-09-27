# StayFinder API (Hono + TypeScript)

Ett litet REST-API byggt med [Hono](https://hono.dev), för `properties` och `bookings`. Ingen databas ännu — data ligger i `src/data/*.json` och hålls i minnet under körning (ändringar via POST/PUT/DELETE försvinner när servern startas om, precis som i kursens uppgift).

## Komma igång

```bash
npm install
npm run dev
```

Servern startar på `http://localhost:3000` (port styrs av `HONO_PORT` i `.env`).

Andra script:

```bash
npm run typecheck   # kör TypeScript-kontroll utan att bygga
npm run build        # kompilerar till dist/
npm start             # kör den kompilerade versionen (kräver npm run build först)
```

## Struktur

```txt
src/
  data/
    properties.json
    bookings.json
  types/
    property.d.ts
    booking.d.ts
  routes/
    property.ts
    booking.ts
  validators/
    booking.ts       # Zod-schema + zValidator för bookings
  index.ts            # startpunkt, kopplar ihop allt
```

## Endpoints

### Properties

| Metod  | Route                | Beskrivning                          |
|--------|-----------------------|---------------------------------------|
| GET    | `/properties`          | Hämta alla properties                 |
| GET    | `/properties/:id`      | Hämta en specifik property             |
| POST   | `/properties`          | Skapa en ny property                   |
| PUT    | `/properties/:id`      | Uppdatera en property (bonus)          |
| DELETE | `/properties/:id`      | Ta bort en property (bonus)            |

### Bookings

| Metod  | Route              | Beskrivning                                          |
|--------|---------------------|--------------------------------------------------------|
| GET    | `/bookings`          | Hämta alla bokningar                                    |
| GET    | `/bookings/:id`       | Hämta en specifik bokning                                |
| POST   | `/bookings`           | Skapa en ny bokning (valideras med Zod)                  |
| PUT    | `/bookings/:id`       | Uppdatera en bokning (valideras med Zod)                  |
| DELETE | `/bookings/:id`       | Ta bort en bokning                                        |

## Snabbtest

Med servern igång (`npm run dev`):

```bash
curl http://localhost:3000/properties
curl http://localhost:3000/properties/property_1001

curl -X POST http://localhost:3000/properties \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Test property","location":"Malmö","price_per_night":500,"max_guests":2}'

curl -X POST http://localhost:3000/bookings \
  -H "Content-Type: application/json" \
  -d '{"property_id":"property_1001","guest_name":"Test Testsson","guest_email":"test@example.com","check_in":"2026-12-01","check_out":"2026-12-03","guests":2}'
```

## Nästa steg

- Ersätt JSON-filerna med en riktig databas (PostgreSQL via Supabase).
- Lägg till användare och autentisering.
- Persistera ändringar (POST/PUT/DELETE) till fil eller databas istället för bara i minnet.
