# Requirement: Backend - Listar Solicitudes por Geolocalizacion

## Story

Como voluntario, quiero ver solicitudes abiertas cerca de mi ubicacion para poder responder primero a los casos mas proximos.

## Objective

Extender el endpoint actual de listado para soportar consulta por proximidad util en el MVP, sin introducir PostGIS, servicios externos ni redisenar el modelo de datos.

## Context

La card publica del board SARA dice: "Como voluntario, puedo ver solicitudes abiertas cerca de mi ubicacion." El backend actual ya persiste `latitude` y `longitude` en `help_requests` y expone `GET /api/help-requests`, pero hoy solo filtra por `status` y ordena por fecha. El siguiente incremento de valor real es reutilizar esa tabla y ese endpoint para geofiltrar.

## Scope

### In scope

- aceptar `latitude`, `longitude` y `radiusKm` en `GET /api/help-requests`
- aplicar filtro de distancia solo cuando se reciban ambas coordenadas
- ordenar por cercania cuando haya filtro geografico
- permitir combinar geofiltro con `status`
- mantener el mismo envelope de respuesta `{ data: [...] }`
- validar coordenadas y radio en la API

### Out of scope

- PostGIS
- geohash
- paginacion
- scoring mixto distancia + urgencia
- auth de voluntarios
- cambios en frontend

## Closed decisions

| Decision | Choice |
|----------|--------|
| Endpoint | Reutilizar `GET /api/help-requests` |
| Filtro geografico | Query params `latitude`, `longitude`, `radiusKm` |
| Formula de distancia | Haversine en SQL |
| Radio por defecto | `10` km |
| Radio maximo | `100` km |
| Estado por defecto | Mantener comportamiento actual; no forzar `open` si no se pide |
| Campo de distancia | Incluir `distanceKm` solo en respuestas geofiltradas |
| Orden de respuesta | Por distancia ascendente cuando hay geofiltro; por `created_at DESC` si no lo hay |

## Expected behavior

### Normal flow

`GET /api/help-requests?latitude=10.48&longitude=-66.90&radiusKm=10` devuelve solicitudes dentro del radio solicitado, ordenadas de la mas cercana a la mas lejana.

`GET /api/help-requests?status=open&latitude=10.48&longitude=-66.90&radiusKm=10` devuelve solo solicitudes abiertas dentro del radio, tambien ordenadas por cercania.

### Edge cases

- si llega `latitude` sin `longitude`, responde `400`
- si llega `longitude` sin `latitude`, responde `400`
- si `radiusKm` no llega, usa `10`
- si `radiusKm` no es numerico, es `<= 0` o supera `100`, responde `400`
- si no se pasan coordenadas, conserva el comportamiento actual del listado

### Failure scenarios

- si la consulta SQL falla, responde `500`

## Expected output

- HTTP `200` en lectura correcta
- HTTP `400` para parametros invalidos o combinaciones incompletas
- respuesta con `{ data: [...] }`
- cada item puede incluir `distanceKm` cuando el geofiltro esta activo

## Success criteria

- el endpoint actual sigue funcionando sin query geografica
- el endpoint devuelve solo resultados dentro del radio cuando se pasan coordenadas
- los resultados geofiltrados salen ordenados por cercania
- los parametros invalidos se rechazan con `400`
- existe al menos una prueba automatizada para la logica nueva

## Verification

### Automated

- `npm test`

### Manual

- poblar varias solicitudes con coordenadas conocidas en Postgres local
- llamar el endpoint con y sin geofiltro
- comprobar inclusion, exclusion y orden por distancia

## Files expected to change

- `backend/src/routes/helpRequests.js`
- `backend/src/helpRequests.js`
- `backend/test/helpRequests.validation.test.js`
- `backend/README.md` solo si cambia el contrato visible

## Execution report

- Implemented geolocation filtering in `GET /api/help-requests`
- Reused the existing route and table; no new dependencies or tables added
- Added query validation for `latitude`, `longitude`, `radiusKm`, and `status`
- Added automated tests for geolocation query validation
- Updated backend README with the visible API contract
- Manual Postgres smoke test pending
