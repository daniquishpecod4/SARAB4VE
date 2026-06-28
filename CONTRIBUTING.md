# Guía de Contribución — SARA

¡Gracias por querer ayudar! SARA es un proyecto humanitario de respuesta a
emergencias. Cada contribución, por pequeña que sea, puede ayudar a salvar vidas.

Esta guía te explica cómo colaborar de forma ordenada, **incluso si nunca has
contribuido a un proyecto en GitHub**.

---

## 🟢 ¿Primera vez? Empieza aquí

1. Busca un issue con la etiqueta **`good first issue`** — son tareas pequeñas y
   pensadas para empezar sin miedo.
2. Comenta en el issue: *"Me gustaría trabajar en esto"* para que nadie más lo tome.
3. Sigue los pasos de abajo. Si te trabas, **pregunta en el mismo issue** — aquí
   nadie se burla de las preguntas.

---

## 🔄 Flujo de trabajo (paso a paso)

> **Analogía:** trabajar sobre `main` directamente es como cocinar en el plato del
> cliente. En vez de eso, cocinas en tu propia mesa (una *rama*) y solo cuando el
> plato está listo lo llevas (un *Pull Request*).

### 1. Haz un fork (tu copia personal)
Botón **Fork** arriba a la derecha en GitHub.

### 2. Clona tu fork a tu computadora
```bash
git clone https://github.com/TU_USUARIO/SARAB4VE.git
cd SARAB4VE
```

### 3. Conecta el repo original (para mantenerte actualizado)
```bash
git remote add upstream https://github.com/daniquishpecod4/SARAB4VE.git
```

### 4. Crea una rama para tu cambio
```bash
git checkout -b feat/descripcion-corta
```

**Nombres de ramas:**
- `feat/boton-sos` → funcionalidad nueva
- `fix/error-mapa` → corrección de error
- `docs/mejorar-readme` → documentación

### 5. Haz tus cambios y guárdalos
```bash
git add .
git commit -m "feat: agregar botón SOS con geolocalización"
```

### 6. Sube tu rama
```bash
git push origin feat/descripcion-corta
```

### 7. Abre un Pull Request (PR)
En GitHub aparecerá un botón **"Compare & pull request"**. Llena la plantilla y
envíalo. ¡Listo! Alguien lo revisará.

---

## ✍️ Cómo escribir los mensajes de commit

Usamos **Conventional Commits** (un formato simple y estándar):

```
<tipo>: <qué hiciste en pocas palabras>
```

| Tipo | Cuándo usarlo |
|------|---------------|
| `feat:` | Agregaste algo nuevo |
| `fix:` | Arreglaste un error |
| `docs:` | Cambiaste documentación |
| `style:` | Formato, espacios (sin cambiar lógica) |
| `refactor:` | Reorganizaste código sin cambiar qué hace |
| `test:` | Agregaste o cambiaste pruebas |
| `chore:` | Configuración, dependencias |

**Ejemplos buenos:**
```
feat: agregar formulario de registro de voluntarios
fix: corregir cálculo de distancia en el mapa
docs: traducir guía de instalación al español
```

---

## ✅ Antes de enviar tu PR

- [ ] Mi cambio hace **una sola cosa** (PRs pequeñas se revisan más rápido).
- [ ] Probé que funciona en mi computadora.
- [ ] Actualicé la documentación si hizo falta.
- [ ] El mensaje de commit sigue el formato de arriba.

---

## 🚫 Por favor, NO

- ❌ Subir cambios directo a `main` (siempre vía PR).
- ❌ Subir archivos con secretos (contraseñas, llaves `.env`).
- ❌ PRs gigantes que cambian 50 cosas a la vez.

## 💬 ¿Dudas?

- Abre un issue con la etiqueta `question`.
- O participa en **Discussions** (la sala de conversación del repo).

---

**Recuerda:** aquí valoramos más una contribución pequeña y bien hecha que una
gigante y apurada. Gracias por sumar. 🙌
