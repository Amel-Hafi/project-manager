---
id: FT-006
title: "Plantillas de valoración de KPIs"
phase: 2-specification
type: feature
status: draft
version: "1.0"
last_updated: 2026-04-30
author: agent-features
reviewers: []
epic: EP-001
dependencies: ["EP-001", "FT-001", "GLO-001", "ACT-001", "DOM-001"]
requirements: ["EX-002"]
doc_depth: standard
---

# [FT-006] Plantillas de valoración de KPIs

## Descripción

Esta funcionalidad permite al Administrador crear y mantener las Plantillas de Valoración asociadas a cada una de las siete dimensiones de madurez técnica. Cada plantilla define los criterios objetivos y los ejemplos concretos que justifican cada nivel de puntuación (1 a 10) en su dimensión y sirve de referencia al Referente DT cuando captura un KPI. Una sola plantilla puede estar activa simultáneamente por dimensión; las versiones anteriores se conservan como referencia histórica pero dejan de orientar nuevas valoraciones.

---

## Detalles de la funcionalidad

| Propiedad | Valor |
|-----------|-------|
| **Épico padre** | [EP-001] Gestión del Referencial y Administración del Sistema |
| **Actor principal** | [ACT-H001] Administrador |
| **Actores secundarios** | [ACT-H004] Referente DT (lectura), [ACT-H003] Manager (lectura) |
| **Prioridad** | Should |
| **Complejidad estimada** | Media |
| **Requisitos cubiertos** | [EX-002] |
| **Dependencias** | [FT-001] |
| **Entidades concernidas** | [ENT-007] PlantillaDeValoracion, [ENT-006] KPIDeMadurez |

---

## Reglas de negocio asociadas

| ID Regla | Descripción | Tipo |
|----------|-------------|------|
| [BR-VAL-F013] | La dimensión de una PlantillaDeValoracion es obligatoria y debe corresponder a uno de los siete valores de [REF-001] DimensionDeMadurez | BR-VAL |
| [BR-VAL-F014] | La versión de una PlantillaDeValoracion es obligatoria, formato libre, máx. 20 caracteres | BR-VAL |
| [BR-VAL-F015] | El contenido de una PlantillaDeValoracion debe describir criterios para cada uno de los 10 niveles de puntuación (1 a 10) | BR-VAL |
| [BR-COH-F002] | Para cada DimensionDeMadurez existe como máximo una PlantillaDeValoracion con activa=true en un momento dado (INV-005) | BR-COH |
| [BR-TRG-F002] | Cuando se activa una nueva PlantillaDeValoracion para una dimensión, la plantilla previamente activa de esa dimensión se desactiva automáticamente (activa=false) | BR-TRG |
| [BR-AUT-F007] | Solo el Administrador puede crear, modificar o activar una PlantillaDeValoracion | BR-AUT |

---

## Criterios de aceptación

### FAC-001: Activación de una plantilla con desactivación automática de la previa

- **Dado** que existe una plantilla activa "Industrialización v1.0" para la dimensión INDUSTRIALIZACION
- **Cuando** el Administrador crea una nueva plantilla "Industrialización v2.0" para la misma dimensión y la marca como activa
- **Entonces** "Industrialización v2.0" queda como única plantilla activa de la dimensión INDUSTRIALIZACION
- **Y** "Industrialización v1.0" se desactiva automáticamente y permanece como referencia histórica

### FAC-002: Disponibilidad de las 7 plantillas para los Referentes DT

- **Dado** que el Administrador ha activado una plantilla por cada una de las 7 dimensiones de madurez
- **Cuando** el Referente DT accede a la ficha de captura de KPIs del aplicativo "AppGamma"
- **Entonces** consulta la plantilla activa correspondiente a cada dimensión como guía de puntuación
- **Y** ninguna dimensión queda sin plantilla activa de referencia

### FAC-003: Coherencia de unicidad bajo concurrencia

- **Dado** que dos administradores intentan activar simultáneamente dos plantillas distintas para la dimensión TESTING
- **Cuando** ambas operaciones se procesan
- **Entonces** el sistema garantiza que solo una de las dos plantillas queda con activa=true (la última operación validada) y la otra queda con activa=false sin error visible al usuario que la creó previamente como activa

### FAC-004: Validación del contenido cubriendo los 10 niveles

- **Dado** que el Administrador crea una plantilla con contenido que solo describe los niveles 1 a 8
- **Cuando** intenta guardarla
- **Entonces** el sistema rechaza la operación e informa de los niveles ausentes

---

## Historias de usuario

> Sección rellenada por agent-3.1 (System 3). Listada aquí para trazabilidad.

| ID Historia | Título | Prioridad |
|-------------|--------|-----------|
| [US-xxx] | *(por crear)* | Should |

---

## Límites funcionales

**Dentro del alcance:**
- Creación, modificación y consulta de Plantillas de Valoración por dimensión
- Gestión de la activación/desactivación con garantía de unicidad por dimensión
- Conservación de versiones anteriores como referencia histórica
- Consulta en lectura por todos los roles

**Fuera del alcance:**
- La captura de KPIs propiamente dicha — cubierta por la funcionalidad de KPIs (épico distinto)
- La aplicación automática de las plantillas para validar el valor de un KPI introducido (sigue siendo manual)
- La traducción multilingüe de las plantillas en el MVP

---

## Puntos de atención

> [PA-001] La estructura concreta del campo `contenido` (texto libre estructurado vs. modelo más rico con sub-campos por nivel) no está formalizada. El MVP asume texto estructurado con marcadores convencionales por nivel; a refinar con el sponsor.
> [PA-002] El comportamiento cuando se intenta desactivar la única plantilla activa de una dimensión sin tener una sustituta no está definido. Se asume que la operación queda permitida pero genera un aviso al Administrador.
> [PA-003] El plantillaVersion almacenado en KPIDeMadurez es informativo y no establece dependencia formal entre KPIs históricos y plantillas desactivadas.
