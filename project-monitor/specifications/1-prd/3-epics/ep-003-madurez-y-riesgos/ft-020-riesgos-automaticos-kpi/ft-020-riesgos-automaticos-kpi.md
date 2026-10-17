---
id: FT-020
title: "Detección automática de riesgos técnicos por KPI"
phase: 2-specification
type: feature
status: draft
version: "1.0"
last_updated: 2026-04-30
author: ba-2.2b
reviewers: []
epic: EP-003
dependencies: ["FT-014", "FT-019", "DOM-001", "ACT-001"]
requirements: ["EX-014"]
doc_depth: standard
language: es
---

# [FT-020] Detección automática de riesgos técnicos por KPI

## Descripción

Esta funcionalidad genera de forma automática y en tiempo real un riesgo técnico cuando los KPIs de madurez de un aplicativo incumplen una regla activa del árbol de decisión configurado por el Administrador. Cada riesgo automático queda asociado al aplicativo afectado y a la regla que lo originó, es visible en la ficha del aplicativo, en las vistas agregadas y en la vista ejecutiva global, y se cierra automáticamente cuando los valores del KPI vuelven a cumplir el umbral o cuando la regla se desactiva. El mecanismo distingue claramente los riesgos automáticos de los manuales y reduce el tiempo de reacción del equipo responsable.

---

## Detalles de la funcionalidad

| Propiedad | Valor |
|-----------|-------|
| **Épico padre** | [EP-003] Madurez Técnica, Visualización y Gestión de Riesgos |
| **Actor principal** | Sistema (generación automática) |
| **Actores secundarios** | [ACT-H001] Administrador, [ACT-H002] Director, [ACT-H003] Manager, [ACT-H004] Referente DT (consulta) |
| **Prioridad** | Must |
| **Complejidad estimada** | Alta |
| **Requisitos cubiertos** | [EX-014] |
| **Dependencias** | [FT-014] Captura de KPIs, [FT-019] Árbol de decisión y semáforo |
| **Entidades concernidas** | [ENT-008] RiesgoTecnico, [ENT-011] ReglaDecision, [ENT-006] KPIDeMadurez, [ENT-003] Aplicativo |

---

## Reglas de negocio asociadas

| ID | Descripción | Tipo |
|----|-------------|------|
| [BR-TRG-F020-01] | Al guardar un valor de KPI, el sistema evalúa todas las reglas activas que aplican al aplicativo, al proyecto y al cliente correspondientes y crea un RiesgoTecnico con `tipo = AUTOMATICO` por cada regla incumplida que no tuviera ya un riesgo abierto vigente. | BR-TRG |
| [BR-TRG-F020-02] | Al guardar un valor de KPI o desactivar una regla, los riesgos automáticos cuya condición ya no se cumple se cierran automáticamente y registran la fecha de cierre. | BR-TRG |
| [BR-VAL-F020-01] | Un RiesgoTecnico con `tipo = AUTOMATICO` debe referenciar obligatoriamente la ReglaDecision que lo generó. | BR-VAL |
| [BR-AUT-F020-01] | Ningún usuario, incluido el Administrador, puede crear manualmente un riesgo con `tipo = AUTOMATICO`; este tipo solo lo asigna el sistema (INV-007 de [DOM-001]). | BR-AUT |
| [BR-COH-F020-01] | Para un aplicativo y una regla, no puede existir más de un riesgo automático abierto simultáneamente. | BR-COH |

---

## Criterios de aceptación

### FAC-001: Generación automática de un riesgo al cruzar un umbral

- **Dado** una regla activa "Si KPI de Testing < 5 a nivel aplicativo, riesgo automático con semáforo NARANJA"
- **Cuando** el Referente DT actualiza el KPI de "Testing" de "AppZeta" de 6 a 3
- **Entonces** el sistema crea un RiesgoTecnico con `tipo = AUTOMATICO`, `estado = ABIERTO`, asociado a "AppZeta" y referenciando la regla
- **Y** el riesgo aparece inmediatamente en la ficha del aplicativo, en la vista agregada de su proyecto y en la vista ejecutiva global

### FAC-002: Cierre automático al recuperar el umbral

- **Dado** un riesgo automático abierto sobre "AppZeta" generado por una regla de Testing
- **Cuando** el Referente DT actualiza el KPI de "Testing" a 7 (cumple el umbral)
- **Entonces** el sistema cierra automáticamente el riesgo registrando la fecha de cierre actual
- **Y** el riesgo deja de aparecer entre los riesgos activos del aplicativo y de las vistas agregadas

### FAC-003: Distinción visual entre riesgos automáticos y manuales

- **Dado** un aplicativo con un riesgo automático y un riesgo manual abiertos
- **Cuando** un usuario consulta la lista de riesgos del aplicativo
- **Entonces** ambos se listan con un indicador del tipo (automático / manual) que permite distinguirlos sin ambigüedad

### FAC-004: Bloqueo de creación manual de un riesgo automático

- **Dado** un Administrador o cualquier usuario
- **Cuando** intenta crear un RiesgoTecnico forzando `tipo = AUTOMATICO` por la API o por la interfaz
- **Entonces** el sistema rechaza la operación y no se persiste ningún registro

### FAC-005: Volumen de riesgos generados al activar una regla

- **Dado** un porfolio con 500 aplicativos cuyos KPIs ya están registrados
- **Cuando** el Administrador activa una nueva regla que se cumple en 80 aplicativos
- **Entonces** el sistema crea 80 RiesgosTecnicos automáticos correspondientes en menos de 5 segundos ([EX-T002]) sin duplicar riesgos abiertos preexistentes

---

## Historias de usuario

> Sección poblada por `agent-3.1-user-stories.md`. Listada aquí solo para trazabilidad.

| ID Historia | Título | Prioridad |
|-------------|--------|-----------|
| [US-xxx] | *(pendiente de creación)* | Must |

---

## Fronteras funcionales

**En el alcance:**
- Creación automática de riesgos cuando una regla activa se incumple a raíz de un cambio en los KPIs o en las propias reglas.
- Cierre automático cuando la condición ya no se cumple (recuperación del KPI o desactivación de la regla).
- Trazabilidad obligatoria del riesgo automático a la regla que lo generó.
- Distinción del tipo (automático / manual) en todas las vistas de riesgos.

**Fuera del alcance:**
- Notificaciones por correo electrónico u otros canales externos (OUT-003 de [VIS-001]).
- Tratamiento (planes de acción) del riesgo automático: la creación de planes está cubierta en [FT-021].
- Reglas combinadas multi-dimensión, mientras [PAT-EP003-03] no se resuelva.

---

## Puntos de atención

- El paso a valor nulo de un KPI debe gestionarse explícitamente: si la regla aplicaba sobre un valor concreto y el valor pasa a nulo, debe definirse si el riesgo se cierra o se mantiene abierto. La política recomendada (cerrar el riesgo automático cuando ya no hay valor evaluable) debe confirmarse en el diseño detallado.
- El volumen potencial de riesgos automáticos al activar una regla en un porfolio extenso impacta el rendimiento ([EX-T002]); el diseño técnico debe contemplar evaluación por lotes o asíncrona si fuera necesario.
- La trazabilidad regla → riesgo es esencial para entender por qué un aplicativo está marcado como riesgoso: la pantalla de detalle del riesgo debe mostrar la regla y el KPI implicados.
