# Requirement: Backend - Voluntario Acepta Solicitud

## Story

Como voluntario, quiero aceptar una solicitud abierta para indicar que voy a atenderla y evitar que varios voluntarios tomen el mismo caso a la vez.

## Objective

Agregar una accion minima de asignacion sobre solicitudes existentes para cerrar el siguiente paso del flujo MVP despues del listado por geolocalizacion.

## Context

El backend actual ya permite crear solicitudes y listarlas, incluyendo filtro geografico. La siguiente card natural del board es "Backend - Voluntario Acepta Solicitud". Sin esta accion, un voluntario puede ver casos cercanos pero no puede reservar ni reclamar uno, y tampoco existe una forma de evitar asignaciones duplicadas.

## Scope

### In scope

- exponer un endpoint para aceptar una solicitud existente
- permitir aceptar solo solicitudes en estado `open`
- guardar datos minimos del voluntario que acepta la solicitud
- cambiar el estado de la solicitud a `assigned`
- devolver la solicitud actualizada
- rechazar intentos de aceptar solicitudes ya asignadas o resueltas

### Out of scope

- autenticacion
- registro completo de voluntarios
- chat
- historial de reasignaciones
- cancelacion de asignacion
- notificaciones
- concurrencia distribuida mas alla de la proteccion basica en base de datos

## Closed decisions

| Decision | Choice |
|----------|--------|
| Endpoint | `POST /api/help-requests/:id/accept` |
| Recurso afectado | tabla `help_requests` |
| Datos del voluntario | `volunteerName`, `volunteerContactMethod`, `volunteerContactValue` |
| Estado inicial requerido | solo `open` |
| Estado tras aceptar | `assigned` |
| Respuesta | mismo envelope `{ data: ... }` |
| Conflicto de estado | `409` si la solicitud ya no esta `open` |
| Si no existe la solicitud | `404` |

## Expected behavior

### Normal flow

Un voluntario llama:

`POST /api/help-requests/:id/accept`

con payload:

```json
{
  "volunteerName": "Luis Perez",
  "volunteerContactMethod": "phone",
  "volunteerContactValue": "+584121112233"
}
```

Si la solicitud existe y esta `open`, el backend:

- guarda los datos del voluntario
- cambia `status` a `assigned`
- devuelve la solicitud actualizada

### Edge cases

- si falta cualquier campo del voluntario, responde `400`
- si el `id` no existe, responde `404`
- si la solicitud ya esta `assigned`, responde `409`
- si la solicitud ya esta `resolved`, responde `409`

### Failure scenarios

- si la actualizacion en base de datos falla, responde `500`

## Expected output

- HTTP `200` cuando la aceptacion se realiza correctamente
- HTTP `400` para payload invalido
- HTTP `404` si la solicitud no existe
- HTTP `409` si la solicitud no esta disponible para aceptar
- respuesta con `{ data: ... }`

## Success criteria

- una solicitud `open` puede pasar a `assigned`
- los datos minimos del voluntario quedan persistidos
- una solicitud ya tomada no puede aceptarse otra vez
- existe al menos una prueba automatizada para validacion o reglas de aceptacion

## Verification

### Automated

- `npm test`

### Manual

- crear una solicitud `open`
- aceptar la solicitud con datos validos
- verificar que el estado cambia a `assigned`
- repetir la aceptacion sobre el mismo `id` y comprobar `409`

## Files expected to change

- `backend/src/routes/helpRequests.js`
- `backend/src/helpRequests.js`
- `backend/sql/schema.sql`
- `backend/test/helpRequests.validation.test.js`
- `backend/README.md` solo si cambia el contrato visible

## Execution report

- Implemented `POST /api/help-requests/:id/accept`
- Added volunteer assignment fields and DB checks in `help_requests`
- Added validation for acceptance payload and UUID route param
- Added automated tests for acceptance validation helpers
- Updated backend README with the visible API contract
- Manual Postgres smoke test pending
