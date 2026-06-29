# Backend - SARA

API Node.js para el MVP de SARA.

## Stack

- Node.js
- Express
- PostgreSQL

## Arranque local

1. Instala dependencias:

```bash
npm install
```

2. Crea variables de entorno:

```bash
cp .env.example .env
```

3. Crea la base y aplica el esquema:

```bash
createdb sara
psql "$DATABASE_URL" -f sql/schema.sql
```

4. Arranca la API:

```bash
npm start
```

## Endpoints

- `GET /health`
- `GET /api/help-requests`
- `POST /api/help-requests`

## Geolocalizacion en listado

`GET /api/help-requests` acepta estos query params opcionales:

- `status`: `open`, `assigned`, `resolved`
- `latitude`
- `longitude`
- `radiusKm`

Reglas:

- `latitude` y `longitude` deben enviarse juntos
- `radiusKm` es opcional y por defecto vale `10`
- `radiusKm` maximo: `100`
- cuando hay geofiltro, la respuesta se ordena por cercania e incluye `distanceKm`

Ejemplo:

```http
GET /api/help-requests?status=open&latitude=10.4806&longitude=-66.9036&radiusKm=10
```

## Ejemplo de payload

```json
{
  "requesterName": "Ana Perez",
  "contactMethod": "phone",
  "contactValue": "+584141234567",
  "needType": "transport",
  "description": "Necesito llegar a un refugio accesible",
  "latitude": 10.4806,
  "longitude": -66.9036,
  "urgency": "high"
}
```

## Tipos de necesidad

- `equipment`
- `medication`
- `transport`
- `companionship`
- `interpreter`
- `accessible_information`
- `neurodivergent_support`
- `psychosocial_support`
