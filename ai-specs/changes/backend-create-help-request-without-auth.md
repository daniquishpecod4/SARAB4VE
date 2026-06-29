# Requirement: Backend - Crear Solicitud Sin Auth

## Story

Como persona afectada, sin iniciar sesion, quiero enviar una solicitud de ayuda con geolocalizacion para pedir asistencia de forma rapida.

## Objective

Exponer una creacion publica de solicitudes de ayuda en el backend del MVP, sin autenticacion, manteniendo validacion, normalizacion y persistencia en PostgreSQL.

## Context

La card de Trello dice: "Como persona afectada (sin login), puedo enviar una solicitud de ayuda con geolocalización." El backend de SARA ya modela `help_requests` como recurso central y el flujo debe seguir siendo simple: cualquier persona puede crear una solicitud con sus datos de contacto, el tipo de necesidad, una descripcion y sus coordenadas. No se debe introducir login, sesiones, cuentas de usuario ni otra capa de auth para este caso.

## Scope

### In scope

- exponer `POST /api/help-requests` como endpoint publico
- aceptar `requesterName`, `contactMethod`, `contactValue`, `needType`, `description`, `latitude`, `longitude` y `urgency`
- validar campos requeridos y coordenadas antes de tocar la base de datos
- normalizar strings recortando espacios
- persistir la solicitud con estado inicial `open`
- devolver la solicitud creada en el envelope `{ data: ... }`
- mantener el flujo util sin autenticacion

### Out of scope

- login
- registro de usuarios
- tokens, sesiones o middleware de auth
- verificacion de identidad
- geocodigos o geocercas
- notificaciones
- frontend

## Closed decisions

| Decision | Choice |
|----------|--------|
| Endpoint | `POST /api/help-requests` |
| Acceso | publico, sin auth |
| Recurso afectado | tabla `help_requests` |
| Estado inicial | `open` |
| Urgency por defecto | `medium` |
| Respuesta correcta | HTTP `201` |
| Envelope de respuesta | `{ data: ... }` |
| Validacion | servidor rechaza payloads invalidos con `400` |
| Persistencia | SQL parametrizado en PostgreSQL |

## Expected behavior

### Normal flow

Una persona afectada hace un `POST /api/help-requests` con un payload como este:

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

Si el payload es valido, el backend:

- recorta los campos de texto
- guarda la solicitud en `help_requests`
- deja `status = open`
- devuelve el registro creado

### Edge cases

- si falta `requesterName`, `contactMethod`, `contactValue`, `needType`, `description`, `latitude` o `longitude`, responde `400`
- si `needType` es invalido, responde `400`
- si `latitude` o `longitude` no son coordenadas validas, responde `400`
- si `urgency` viene informado y no es valido, responde `400`
- si no se envia `urgency`, usa `medium`
- si el cliente no esta autenticado, la creacion sigue permitida

### Failure scenarios

- si falla la insercion SQL, responde `500`

## Expected output

- HTTP `201` cuando la solicitud se crea correctamente
- HTTP `400` para payload invalido
- HTTP `500` para error inesperado de base de datos
- respuesta JSON con `{ data: ... }`
- el recurso creado incluye `status` y `created_at`

## Success criteria

- una persona sin login puede crear una solicitud de ayuda
- la API rechaza payloads invalidos antes de escribir en la base de datos
- la solicitud persistida queda en estado `open`
- la respuesta devuelve el registro creado
- existe al menos una prueba automatizada de validacion o contrato

## Verification

### Automated

- `npm test` dentro de `backend/`

### Manual

- enviar un `POST /api/help-requests` con payload valido
- comprobar que responde `201`
- verificar que la solicitud queda persistida con `status = open`
- probar un payload invalido y comprobar `400`

## Files expected to change

- `backend/src/routes/helpRequests.js`
- `backend/src/validation/helpRequests.js`
- `backend/sql/schema.sql`
- `backend/test/helpRequests.validation.test.js`
- `backend/test/helpRequests.routes.test.js`
- `backend/README.md` solo si cambia el contrato visible

## Execution report

- Verified `npm test` in `backend/`
- Public `POST /api/help-requests` stays enabled without auth
- No code changes were needed because the backend already matches the brief
