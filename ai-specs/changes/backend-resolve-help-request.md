# Requirement: Backend - Resolver Solicitud

## Story

Como voluntario, quiero marcar una solicitud como resuelta para cerrar el caso una vez atendido y dejar claro que ya no requiere accion.

## Objective

Agregar el cierre minimo del flujo de ayuda sobre solicitudes ya asignadas, sin introducir historial complejo, chat ni estados intermedios innecesarios para el MVP.

## Context

El documento de MVP de SARA incluye la fase de seguimiento hasta resolver el caso. El backend ya cubre creacion, listado geolocalizado y aceptacion. Falta el paso final para que una solicitud deje de estar activa cuando el voluntario termina la atencion. Esto completa el ciclo basico de vida de `help_requests`.

## Scope

### In scope

- exponer un endpoint para marcar una solicitud como resuelta
- permitir resolver solo solicitudes ya asignadas
- cambiar el estado de la solicitud a `resolved`
- guardar la fecha de resolucion
- devolver la solicitud actualizada
- rechazar solicitudes inexistentes, no asignadas o ya resueltas

### Out of scope

- autenticacion
- reasignacion
- cancelacion de cierre
- historial de cambios de estado
- comentarios o notas de cierre
- notificaciones
- chat

## Closed decisions

| Decision | Choice |
|----------|--------|
| Endpoint | `POST /api/help-requests/:id/resolve` |
| Recurso afectado | tabla `help_requests` |
| Estado inicial requerido | `assigned` |
| Estado tras resolver | `resolved` |
| Campo de cierre | `resolved_at` |
| Respuesta | mismo envelope `{ data: ... }` |
| Si no existe la solicitud | `404` |
| Si no esta asignada | `409` |

## Expected behavior

### Normal flow

Un voluntario llama:

`POST /api/help-requests/:id/resolve`

Si la solicitud existe y esta `assigned`, el backend:

- cambia `status` a `resolved`
- guarda la fecha de resolucion
- devuelve la solicitud actualizada

### Edge cases

- si el `id` no existe, responde `404`
- si la solicitud esta `open`, responde `409`
- si la solicitud ya esta `resolved`, responde `409`
- si el `id` no es un UUID valido, responde `400`

### Failure scenarios

- si la actualizacion en base de datos falla, responde `500`

## Expected output

- HTTP `200` cuando la solicitud se resuelve correctamente
- HTTP `400` para `id` invalido
- HTTP `404` si la solicitud no existe
- HTTP `409` si la solicitud no puede cerrarse en su estado actual
- respuesta con `{ data: ... }`

## Success criteria

- una solicitud `assigned` puede pasar a `resolved`
- la solicitud resuelta deja de aparecer como activa para operaciones de voluntariado
- no se puede resolver una solicitud inexistente o ya cerrada
- existe al menos una prueba automatizada para validacion o transiciones de estado

## Verification

### Automated

- `npm test`

### Manual

- crear una solicitud
- aceptar la solicitud
- resolverla
- repetir el cierre y comprobar `409`

## Files expected to change

- `backend/src/routes/helpRequests.js`
- `backend/sql/schema.sql`
- `backend/test/helpRequests.routes.test.js`
- `backend/test/helpRequests.validation.test.js`
- `backend/README.md` solo si cambia el contrato visible

## Execution report

- Implemented `POST /api/help-requests/:id/resolve`
- Added `resolved_at` to schema and request responses
- Added route coverage for success, invalid UUID, and conflict states
- Updated backend README with the visible endpoint contract
- Verified with `npm test`
