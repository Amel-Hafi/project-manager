---
id: FT-019
title: "Árbol de decisión y semáforo de estado"
phase: 2-specification
type: feature
status: draft
version: "1.0"
last_updated: 2026-04-30
author: ba-2.2b
reviewers: []
epic: EP-003
dependencies: ["FT-014", "DOM-001", "ACT-001"]
requirements: ["EX-008"]
doc_depth: standard
language: es
---

# [FT-019] Árbol de decisión y semáforo de estado

## Descripción

Esta funcionalidad permite al Administrador configurar el conjunto de reglas (árbol de decisión) que determina, a partir de los valores de los KPIs de madurez, el semáforo de estado (verde / naranja / rojo) de un aplicativo, proyecto, cliente o del porfolio global. Cada regla expresa una condición sobre una dimensión (o sobre el agregado), un umbral, un nivel de agregación y el semáforo resultante cuando se cumple. El Director puede proponer modificaciones que el Administrador valida y aplica. El árbol es el motor que alimenta el semáforo de las vistas agregadas y la generación de riesgos automáticos.

---

## Detalles de la funcionalidad

| Propiedad | Valor |
|-----------|-------|
| **Épico padre** | [EP-003] Madurez Técnica, Visualización y Gestión de Riesgos |
| **Actor principal** | [ACT-H001] Administrador |
| **Actores secundarios** | [ACT-H002] Director (propone modificaciones) |
| **Prioridad** | Must |
| **Complejidad estimada** | Alta |
| **Requisitos cubiertos** | [EX-008] |
| **Dependencias** | [FT-014] Captura de KPIs de madurez |
| **Entidades concernidas** | [ENT-011] ReglaDecision, [ENT-006] KPIDeMadurez, [ENT-003] Aplicativo, [ENT-002] Proyecto, [ENT-001] Cliente |

---

## Reglas de negocio asociadas

| ID | Descripción | Tipo |
|----|-------------|------|
| [BR-VAL-F019-01] | Cada ReglaDecision define un nombre, una descripción, una condición, un umbral, un nivel de agregación, un nivel de semáforo y una bandera `activa`. | BR-VAL |
| [BR-VAL-F019-02] | El umbral debe estar entre 0 y 100 cuando expresa porcentaje y entre 1 y 10 cuando expresa valor de KPI. | BR-VAL |
| [BR-CAL-F019-01] | Solo las reglas con `activa = true` participan en la evaluación del semáforo y en la generación de riesgos automáticos. | BR-CAL |
| [BR-CAL-F019-02] | Cuando varias reglas activas se cumplen para una misma entidad, prevalece el nivel de semáforo más severo (ROJO > NARANJA > VERDE). | BR-CAL |
| [BR-TRG-F019-01] | La activación, desactivación o modificación de una regla desencadena la reevaluación inmediata del semáforo y de los riesgos automáticos asociados. | BR-TRG |
| [BR-AUT-F019-01] | Solo el Administrador puede crear, modificar, activar, desactivar o eliminar reglas; el Director solo propone cambios sin efecto directo en el sistema. | BR-AUT |

---

## Criterios de aceptación

### FAC-001: Configuración de una regla simple por umbral

- **Dado** que el Administrador define la regla "Si más del 30 % de los aplicativos de un proyecto tienen al menos un KPI de Testing < 5, semáforo del proyecto = ROJO"
- **Cuando** activa la regla y existe un proyecto "ProyectoAlpha" con 10 aplicativos, de los cuales 4 tienen el KPI de Testing por debajo de 5
- **Entonces** la siguiente evaluación del semáforo de "ProyectoAlpha" devuelve ROJO
- **Y** las vistas agregadas reflejan el cambio sin intervención adicional

### FAC-002: Prevalencia de la regla más severa

- **Dado** dos reglas activas que se cumplen simultáneamente para "ProyectoAlpha", una con resultado NARANJA y otra con resultado ROJO
- **Cuando** el sistema calcula el semáforo del proyecto
- **Entonces** el semáforo final del proyecto es ROJO

### FAC-003: Desactivación de una regla

- **Dado** una regla activa que asigna ROJO a "ProyectoAlpha"
- **Cuando** el Administrador desactiva la regla (`activa = false`)
- **Entonces** el sistema reevalúa el semáforo sin esa regla y, si ninguna otra regla cumplida es severa, "ProyectoAlpha" pasa a NARANJA o VERDE según las reglas restantes
- **Y** los riesgos automáticos generados por la regla desactivada quedan invalidados conforme a la lógica de [FT-020]

### FAC-004: Acceso restringido al Administrador

- **Dado** un Director "director01@dt.es"
- **Cuando** intenta crear o activar directamente una regla del árbol de decisión
- **Entonces** el sistema bloquea la operación y solo le ofrece un mecanismo de propuesta dirigido al Administrador

### FAC-005: Validación de umbral fuera de rango

- **Dado** un Administrador que crea una regla con umbral 150 sobre un porcentaje
- **Cuando** intenta guardarla
- **Entonces** el sistema rechaza la creación con un error de validación y la regla no queda persistida

---

## Historias de usuario

> Sección poblada por `agent-3.1-user-stories.md`. Listada aquí solo para trazabilidad.

| ID Historia | Título | Prioridad |
|-------------|--------|-----------|
| [US-xxx] | *(pendiente de creación)* | Must |

---

## Fronteras funcionales

**En el alcance:**
- Creación, consulta, modificación, activación y desactivación de reglas del árbol de decisión por el Administrador.
- Evaluación del semáforo a niveles aplicativo, proyecto, cliente y global.
- Reevaluación automática tras cambios en reglas o en KPIs.
- Mecanismo de propuesta de cambios por el Director (sin efecto directo).

**Fuera del alcance:**
- Reglas con condiciones combinadas multi-dimensión (p. ej., "KPI_A < 5 Y KPI_B < 7") — limitación documentada en [PAT-EP003-03] y [DOM-001] PAT-DOM-003; el modelo soporta una expresión flexible vía el atributo `condicion` pero su semántica avanzada queda para extensiones posteriores.
- Versionado o histórico de las reglas (no contemplado en MVP).
- Simulador de impacto de una regla antes de su activación.

---

## Puntos de atención

- Sin umbrales configurados ([PAT-EP003-02]), el motor no produce semáforo: debe contemplarse un estado "no configurado" en las vistas agregadas y en los riesgos automáticos.
- La precedencia "más severa gana" debe formalizarse claramente en la pantalla de gestión para evitar interpretaciones; conviene mostrar al Administrador qué reglas se cumplen para una entidad concreta.
- La extensión a condiciones combinadas ([PAT-EP003-03]) requerirá replantear la pantalla de configuración: el diseño actual debe permitir esa evolución sin retrabajos importantes.
