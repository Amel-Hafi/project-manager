---
id: FT-015
title: "Consulta del histórico de evaluaciones de KPIs"
phase: 2-specification
type: feature
status: draft
version: "1.0"
last_updated: 2026-04-30
author: ba-2.2b
reviewers: []
epic: EP-003
dependencies: ["FT-014", "DOM-001", "ACT-001"]
requirements: ["EX-007"]
doc_depth: standard
language: es
---

# [FT-015] Consulta del histórico de evaluaciones de KPIs

## Descripción

Esta funcionalidad ofrece a los usuarios autorizados el acceso a la trazabilidad de la evaluación de cada KPI de madurez de un aplicativo: muestra la fecha de la última evaluación y la justificación textual asociada al valor actual de cada dimensión. En el alcance del MVP el sistema no almacena versiones anteriores de los KPIs, por lo que la consulta histórica se limita al estado actual con su huella temporal y argumental. La extensión a un historial de versiones queda prevista para una fase posterior.

---

## Detalles de la funcionalidad

| Propiedad | Valor |
|-----------|-------|
| **Épico padre** | [EP-003] Madurez Técnica, Visualización y Gestión de Riesgos |
| **Actor principal** | [ACT-H004] Referente DT |
| **Actores secundarios** | [ACT-H003] Manager, [ACT-H002] Director, [ACT-H001] Administrador |
| **Prioridad** | Should |
| **Complejidad estimada** | Baja |
| **Requisitos cubiertos** | [EX-007] |
| **Dependencias** | [FT-014] Captura de KPIs de madurez |
| **Entidades concernidas** | [ENT-006] KPIDeMadurez, [ENT-003] Aplicativo |

---

## Reglas de negocio asociadas

| ID | Descripción | Tipo |
|----|-------------|------|
| [BR-AUT-F015-01] | La consulta del histórico de KPIs respeta el ámbito del rol: el Manager y el Referente DT solo ven los aplicativos de los proyectos que tienen asignados; el Director y el Administrador ven todo. | BR-AUT |
| [BR-COH-F015-01] | El histórico mostrado debe coincidir exactamente con el valor, fecha y justificación persistidos para el KPI actual; no se generan datos calculados ni interpolados. | BR-COH |

---

## Criterios de aceptación

### FAC-001: Visualización de la huella temporal de los KPIs de un aplicativo

- **Dado** que "AppZeta" tiene los siete KPIs registrados con valor, fecha de evaluación y justificación
- **Cuando** un usuario autorizado consulta la sección histórica de "AppZeta"
- **Entonces** el sistema muestra para cada dimensión el valor actual, la fecha de la última evaluación y la justificación textual
- **Y** indica explícitamente que no se conservan versiones anteriores de los KPIs en el alcance actual

### FAC-002: KPIs sin valor evaluado en el histórico

- **Dado** que "AppBeta" tiene tres dimensiones con valor nulo y cuatro evaluadas
- **Cuando** un usuario consulta su histórico de KPIs
- **Entonces** el sistema lista las siete dimensiones identificando las no evaluadas como "sin evaluar" y mostrando los datos completos solo para las evaluadas

### FAC-003: Bloqueo de visualización por ámbito de proyecto

- **Dado** un Referente DT no asignado al proyecto al que pertenece "AppZeta"
- **Cuando** intenta abrir la consulta histórica de KPIs de "AppZeta"
- **Entonces** el sistema impide el acceso y devuelve un error de autorización

---

## Historias de usuario

> Sección poblada por `agent-3.1-user-stories.md`. Listada aquí solo para trazabilidad.

| ID Historia | Título | Prioridad |
|-------------|--------|-----------|
| [US-xxx] | *(pendiente de creación)* | Should |

---

## Fronteras funcionales

**En el alcance:**
- Consulta de la fecha de evaluación, justificación y valor actual de cada KPI por dimensión.
- Distinción visual entre dimensiones evaluadas y no evaluadas.
- Aplicación de las restricciones de visibilidad por rol y proyecto asignado.

**Fuera del alcance:**
- Historial de versiones anteriores de los KPIs (Fase 2 — [PAT-EP003-01], ATT-004 de [VIS-001]).
- Visualización de tendencias temporales o gráficos de evolución.
- Comparación entre diferentes evaluaciones de un mismo KPI.

---

## Puntos de atención

- El alcance del MVP limita esta funcionalidad a la consulta del estado actual; el nombre "histórico" puede generar expectativas sobre tendencias que el sistema no satisface — debe documentarse claramente en la pantalla.
- Cuando se incorpore el historial de versiones en Fase 2 ([DOM-001] PAT-DOM-004) deberá extenderse el modelo con una entidad HistoricoKPI; el diseño de esta funcionalidad debe permitir esa evolución sin retrabajos importantes.
