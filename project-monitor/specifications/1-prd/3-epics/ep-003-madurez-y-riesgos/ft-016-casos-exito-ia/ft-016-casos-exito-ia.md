---
id: FT-016
title: "Registro y gestión de casos de éxito de IA"
phase: 2-specification
type: feature
status: draft
version: "1.0"
last_updated: 2026-04-30
author: ba-2.2b
reviewers: []
epic: EP-003
dependencies: ["EP-002", "DOM-001", "ACT-001"]
requirements: ["EX-009"]
doc_depth: standard
language: es
---

# [FT-016] Registro y gestión de casos de éxito de IA

## Descripción

Esta funcionalidad permite al Referente DT y al Manager registrar, consultar, modificar y eliminar casos de éxito de inteligencia artificial documentados en sus proyectos asignados. Cada caso describe la herramienta de IA utilizada (referenciada del catálogo cuando aplica), el contexto del proyecto, el beneficio obtenido y la fecha del éxito. Los casos quedan visibles para todos los usuarios del sistema con el objetivo de difundir buenas prácticas internas. En el MVP no existe flujo de validación, por lo que los registros se publican directamente sin estados intermedios.

---

## Detalles de la funcionalidad

| Propiedad | Valor |
|-----------|-------|
| **Épico padre** | [EP-003] Madurez Técnica, Visualización y Gestión de Riesgos |
| **Actor principal** | [ACT-H004] Referente DT |
| **Actores secundarios** | [ACT-H003] Manager, [ACT-H001] Administrador, [ACT-H002] Director (lectura) |
| **Prioridad** | Should |
| **Complejidad estimada** | Media |
| **Requisitos cubiertos** | [EX-009] |
| **Dependencias** | [EP-002] (jerarquía Cliente/Proyecto/Aplicativo, catálogo de herramientas IA) |
| **Entidades concernidas** | [ENT-010] CasoDeExitoIA, [ENT-002] Proyecto, [ENT-004] EntradaCatalogo, [ENT-012] Usuario |

---

## Reglas de negocio asociadas

| ID | Descripción | Tipo |
|----|-------------|------|
| [BR-VAL-F016-01] | El título del caso es obligatorio (máx. 200 caracteres) y la descripción también (máx. 5000). | BR-VAL |
| [BR-VAL-F016-02] | La fecha del caso no puede ser posterior a la fecha actual. | BR-VAL |
| [BR-VAL-F016-03] | Si se referencia una herramienta de IA, debe ser una EntradaCatalogo activa del bloque temático "Inteligencia artificial". | BR-VAL |
| [BR-AUT-F016-01] | Solo el Referente DT o el Manager asignado al proyecto pueden crear o modificar un caso del proyecto; el Administrador puede gestionar todos. | BR-AUT |
| [BR-AUT-F016-02] | Solo el creador del caso o un Administrador pueden eliminar un caso de éxito de IA. | BR-AUT |
| [BR-TRG-F016-01] | Cada modificación actualiza los campos `ultimaModificacionPor` y `fechaModificacion` con el usuario y el instante actuales. | BR-TRG |

---

## Criterios de aceptación

### FAC-001: Publicación directa de un caso de éxito por el Referente DT

- **Dado** que "referente01@dt.es" está asignado al proyecto "ProyectoAlpha" y la herramienta "Copilot Empresa" está activa en el catálogo de IA
- **Cuando** crea un caso de éxito con título "Aceleración de pruebas unitarias", descripción detallada de 1500 caracteres, fecha 2026-04-15 y referencia a "Copilot Empresa"
- **Entonces** el sistema publica el caso inmediatamente sin pasos de validación intermedios
- **Y** el caso queda visible en la ficha del proyecto y en la vista global de difusión para todos los usuarios autenticados

### FAC-002: Bloqueo por fecha futura

- **Dado** un Manager que crea un caso de éxito con fecha 2027-12-31
- **Cuando** intenta guardar el registro
- **Entonces** el sistema rechaza la operación con un error sobre la fecha y no crea ningún registro

### FAC-003: Edición y eliminación restringidas al creador o al Administrador

- **Dado** un caso creado por "referente01@dt.es" en el proyecto "ProyectoAlpha"
- **Cuando** el Manager del proyecto edita la descripción del caso
- **Entonces** el sistema acepta la edición y registra al Manager como `ultimaModificacionPor`
- **Y** cuando otro Referente DT no creador intenta eliminar el caso, el sistema bloquea la operación; solo el creador o un Administrador pueden eliminarlo

### FAC-004: Caso sin herramienta de IA asociada

- **Dado** un Referente DT que documenta una experiencia genérica de IA sin una herramienta concreta del catálogo
- **Cuando** crea el caso dejando vacío el campo de herramienta de IA
- **Entonces** el sistema permite la creación con la herramienta opcional sin asignar
- **Y** el caso aparece en la difusión sin enlace a una EntradaCatalogo

---

## Historias de usuario

> Sección poblada por `agent-3.1-user-stories.md`. Listada aquí solo para trazabilidad.

| ID Historia | Título | Prioridad |
|-------------|--------|-----------|
| [US-xxx] | *(pendiente de creación)* | Should |

---

## Fronteras funcionales

**En el alcance:**
- Crear, consultar, modificar y eliminar casos de éxito de IA en los proyectos donde el usuario tiene autorización.
- Asociación opcional a una EntradaCatalogo del bloque "Inteligencia artificial".
- Visibilidad en lectura para todos los actores autenticados con fines de difusión.
- Trazabilidad mediante `creadoPor`, `ultimaModificacionPor`, `fechaCreacion`, `fechaModificacion`.

**Fuera del alcance:**
- Flujo de validación con estados (borrador / pendiente / validado / rechazado) — [EX-010] queda fuera del MVP por ATT-006 de [VIS-001] y [PAT-EP003-04].
- Notificación interna a los Managers de los casos creados por sus Referentes DT.
- Exportación o publicación externa de los casos.
- Métricas de impacto cuantitativo del caso (ahorro, ROI).

---

## Puntos de atención

- La ausencia del flujo de validación traslada al equipo del proyecto la responsabilidad de la calidad de la información publicada; conviene incluir orientaciones de redacción en la pantalla.
- La eliminación restringida al creador o al Administrador (INV-008 de [DOM-001]) debe quedar reflejada con claridad en el control de acceso de las pantallas de gestión.
