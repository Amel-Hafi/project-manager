---
id: FT-021
title: "Registro manual de riesgos técnicos y planes de acción"
phase: 2-specification
type: feature
status: draft
version: "1.0"
last_updated: 2026-04-30
author: ba-2.2b
reviewers: []
epic: EP-003
dependencies: ["EP-002", "DOM-001", "ACT-001"]
requirements: ["EX-015"]
doc_depth: standard
language: es
---

# [FT-021] Registro manual de riesgos técnicos y planes de acción

## Descripción

Esta funcionalidad permite al Manager (y al Administrador) registrar de forma manual riesgos técnicos sobre un aplicativo cuando identifica situaciones que no están capturadas por los umbrales automáticos del árbol de decisión (riesgos organizativos, de equipo, contractuales, etc.). Cada riesgo manual puede llevar asociados uno o varios planes de acción que especifican las medidas a adoptar, el responsable y el plazo. El Manager gestiona el ciclo de vida del riesgo (abierto → en progreso → cerrado) y de cada plan (pendiente → en progreso → completado), asegurando la trazabilidad de las decisiones y complementando la detección automática.

---

## Detalles de la funcionalidad

| Propiedad | Valor |
|-----------|-------|
| **Épico padre** | [EP-003] Madurez Técnica, Visualización y Gestión de Riesgos |
| **Actor principal** | [ACT-H003] Manager |
| **Actores secundarios** | [ACT-H001] Administrador, [ACT-H002] Director (lectura) |
| **Prioridad** | Should |
| **Complejidad estimada** | Media |
| **Requisitos cubiertos** | [EX-015] |
| **Dependencias** | [EP-002] (jerarquía Cliente/Proyecto/Aplicativo) |
| **Entidades concernidas** | [ENT-008] RiesgoTecnico, [ENT-009] PlanDeAccion, [ENT-003] Aplicativo, [ENT-012] Usuario |

---

## Reglas de negocio asociadas

| ID | Descripción | Tipo |
|----|-------------|------|
| [BR-VAL-F021-01] | Un riesgo manual requiere título (máx. 200 caracteres, no vacío), descripción (máx. 2000) y referencia a un Aplicativo. | BR-VAL |
| [BR-VAL-F021-02] | Un riesgo con `tipo = MANUAL` no puede tener `reglaDecisionId` asignado. | BR-VAL |
| [BR-VAL-F021-03] | Cada plan de acción requiere descripción, responsable, plazo (posterior a la fecha de creación) y estado. | BR-VAL |
| [BR-VAL-F021-04] | El cierre de un riesgo exige indicar la fecha de cierre. | BR-VAL |
| [BR-COH-F021-01] | El riesgo pasa al estado "En progreso" cuando al menos un plan de acción asociado está en estado "En progreso". | BR-COH |
| [BR-COH-F021-02] | La asociación entre un plan de acción y su riesgo es inmutable tras la creación (INV-006 de [DOM-001]). | BR-COH |
| [BR-AUT-F021-01] | Solo el Manager asignado al proyecto del aplicativo o el Administrador pueden registrar, modificar o cerrar un riesgo manual y sus planes de acción. | BR-AUT |

---

## Criterios de aceptación

### FAC-001: Registro de un riesgo manual con plan de acción asociado

- **Dado** un Manager "manager01@dt.es" asignado al proyecto "ProyectoBeta" que contiene el aplicativo "AppOmega"
- **Cuando** registra un riesgo con título "Riesgo de pérdida de conocimiento técnico", descripción detallada y plan de acción "Documentar la arquitectura en Confluence" con responsable "manager01@dt.es" y plazo 2026-06-30
- **Entonces** el sistema crea el riesgo con `tipo = MANUAL`, `estado = ABIERTO` y crea el plan asociado en estado "Pendiente"
- **Y** el riesgo y el plan son visibles en la ficha del aplicativo, en la vista agregada del proyecto y en la vista ejecutiva del Director

### FAC-002: Transición del riesgo al estado "En progreso"

- **Dado** un riesgo manual abierto con un plan de acción asociado en estado "Pendiente"
- **Cuando** el Manager actualiza el plan a estado "En progreso"
- **Entonces** el sistema actualiza el estado del riesgo a "En progreso"

### FAC-003: Cierre del riesgo con fecha registrada

- **Dado** un riesgo manual con un plan de acción completado
- **Cuando** el Manager cierra el riesgo indicando fecha de cierre 2026-07-15
- **Entonces** el sistema persiste `estado = CERRADO` y `fechaCierre = 2026-07-15`
- **Y** el riesgo deja de aparecer entre los riesgos activos del proyecto y de la vista global

### FAC-004: Bloqueo por falta de asignación al proyecto

- **Dado** un Manager no asignado al proyecto "ProyectoBeta"
- **Cuando** intenta crear un riesgo sobre "AppOmega"
- **Entonces** el sistema rechaza la operación con un error de autorización

### FAC-005: Validación de plazo del plan de acción

- **Dado** un Manager creando un plan de acción para un riesgo
- **Cuando** introduce un plazo anterior a la fecha actual
- **Entonces** el sistema rechaza la creación del plan con un error de validación y mantiene el riesgo sin el plan inválido

---

## Historias de usuario

> Sección poblada por `agent-3.1-user-stories.md`. Listada aquí solo para trazabilidad.

| ID Historia | Título | Prioridad |
|-------------|--------|-----------|
| [US-xxx] | *(pendiente de creación)* | Should |

---

## Fronteras funcionales

**En el alcance:**
- Creación, consulta, modificación y cierre de riesgos técnicos manuales sobre aplicativos.
- Gestión de planes de acción asociados (descripción, responsable, plazo, estado).
- Transiciones de estado del riesgo (Abierto → En progreso → Cerrado) sincronizadas con el estado de los planes.
- Visibilidad en las vistas de aplicativo, proyecto y vista ejecutiva del Director.

**Fuera del alcance:**
- Capacidad del Referente DT para registrar riesgos manuales (sujeto al PAT-003 de [ACT-001]; conservadoramente excluido en el MVP).
- Notificaciones externas por correo u otros canales (OUT-003 de [VIS-001]).
- Riesgos a nivel de proyecto o cliente sin asociar a un aplicativo concreto (el modelo actual asocia un riesgo a exactamente un Aplicativo).
- Generación automática de planes a partir de plantillas predefinidas.

---

## Puntos de atención

- La asignación inmutable entre un plan y su riesgo (INV-006) implica que un plan creado por error sobre el riesgo equivocado no puede reasignarse: debe contemplarse la posibilidad de eliminarlo y volver a crearlo en otro riesgo.
- Si el sponsor confirma que el Referente DT puede registrar riesgos manuales (PAT-003 de [ACT-001]), esta funcionalidad deberá ampliarse en una iteración posterior para incluir ese rol.
- La sincronización de estados entre riesgo y planes (BR-COH-F021-01) debe formalizarse de forma exhaustiva en el diseño, especialmente para los casos de cierre con planes pendientes o múltiples planes en distintos estados.
