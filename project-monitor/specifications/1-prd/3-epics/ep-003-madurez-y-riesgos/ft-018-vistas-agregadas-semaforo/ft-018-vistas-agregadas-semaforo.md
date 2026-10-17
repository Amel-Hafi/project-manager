---
id: FT-018
title: "Vistas agregadas con semáforo por proyecto y cliente"
phase: 2-specification
type: feature
status: draft
version: "1.0"
last_updated: 2026-04-30
author: ba-2.2b
reviewers: []
epic: EP-003
dependencies: ["FT-017", "FT-019", "DOM-001", "ACT-001"]
requirements: ["EX-012", "EX-013"]
doc_depth: standard
language: es
---

# [FT-018] Vistas agregadas con semáforo por proyecto y cliente

## Descripción

Esta funcionalidad consolida los KPIs de madurez de los aplicativos a nivel de proyecto, cliente y porfolio global y los presenta a los usuarios autorizados con métricas de agregación (media por dimensión, "punto negro" como peor puntuación, "punto dorado" como mejor puntuación) y un semáforo de estado calculado por el árbol de decisión. La vista ejecutiva global ofrece al Director una panorámica del porfolio completo con los semáforos, los riesgos técnicos activos y los indicadores de adopción de IA. Estas vistas son el principal instrumento de toma de decisiones operativas (Manager) y estratégicas (Director).

---

## Detalles de la funcionalidad

| Propiedad | Valor |
|-----------|-------|
| **Épico padre** | [EP-003] Madurez Técnica, Visualización y Gestión de Riesgos |
| **Actor principal** | [ACT-H002] Director |
| **Actores secundarios** | [ACT-H001] Administrador, [ACT-H003] Manager, [ACT-H004] Referente DT |
| **Prioridad** | Must |
| **Complejidad estimada** | Alta |
| **Requisitos cubiertos** | [EX-012], [EX-013] |
| **Dependencias** | [FT-017] Vista radar, [FT-019] Árbol de decisión y semáforo, [FT-020] Riesgos automáticos |
| **Entidades concernidas** | [ENT-001] Cliente, [ENT-002] Proyecto, [ENT-003] Aplicativo, [ENT-006] KPIDeMadurez, [ENT-008] RiesgoTecnico, [ENT-010] CasoDeExitoIA, [ENT-011] ReglaDecision |

---

## Reglas de negocio asociadas

| ID | Descripción | Tipo |
|----|-------------|------|
| [BR-CAL-F018-01] | La media por dimensión a nivel de proyecto es la media aritmética de los KPIs no nulos de la dimensión sobre los aplicativos del proyecto. | BR-CAL |
| [BR-CAL-F018-02] | El "punto negro" por dimensión es el valor mínimo no nulo entre los aplicativos del nivel agregado; el "punto dorado" es el valor máximo no nulo. | BR-CAL |
| [BR-CAL-F018-03] | La media a nivel de cliente agrega los proyectos del cliente; la vista global agrega todos los clientes del porfolio. | BR-CAL |
| [BR-TRG-F018-01] | Cada vez que se modifica un KPI o el árbol de decisión, las vistas agregadas reflejan el nuevo cálculo en el siguiente refresco. | BR-TRG |
| [BR-AUT-F018-01] | El Manager solo accede a las vistas agregadas de los proyectos que tiene asignados; el Director y el Administrador acceden a todas las vistas, incluida la global. | BR-AUT |
| [BR-AUT-F018-02] | El Director no puede editar ningún elemento desde la vista global; su acceso es exclusivamente de lectura. | BR-AUT |

---

## Criterios de aceptación

### FAC-001: Vista agregada de un proyecto con media, punto negro y punto dorado

- **Dado** que el proyecto "ProyectoAlpha" contiene 10 aplicativos con KPIs evaluados en las siete dimensiones
- **Cuando** un Manager asignado al proyecto consulta la vista agregada
- **Entonces** el sistema muestra para cada una de las siete dimensiones la media aritmética de los KPIs no nulos, el valor mínimo (punto negro) y el valor máximo (punto dorado)
- **Y** muestra el semáforo de estado del proyecto calculado por las reglas activas del árbol de decisión

### FAC-002: Vista ejecutiva global del Director con semáforos y riesgos activos

- **Dado** un porfolio con al menos 3 clientes, 12 proyectos y 200 aplicativos con KPIs registrados, y con riesgos técnicos automáticos y manuales activos
- **Cuando** el Director "director01@dt.es" accede a la vista ejecutiva global
- **Entonces** el sistema muestra todos los clientes con su semáforo de estado, la lista de proyectos con riesgos activos y los indicadores de adopción de herramientas de IA por proyecto
- **Y** el tiempo de carga de la vista global no supera 5 segundos con el volumen máximo previsto ([EX-T002])

### FAC-003: Acceso del Manager restringido a sus proyectos

- **Dado** un Manager asignado únicamente al proyecto "ProyectoAlpha"
- **Cuando** consulta la vista agregada por proyecto
- **Entonces** el sistema solo lista "ProyectoAlpha" y oculta cualquier otro proyecto del porfolio

### FAC-004: Recálculo tras modificación de un KPI

- **Dado** que el proyecto "ProyectoAlpha" muestra semáforo VERDE
- **Cuando** un Referente DT actualiza el KPI de "Testing" de "AppZeta" a 2 y el árbol de decisión activo determina que ese cambio cruza un umbral del nivel proyecto
- **Entonces** la siguiente consulta a la vista agregada de "ProyectoAlpha" muestra el semáforo recalculado (NARANJA o ROJO según las reglas activas)
- **Y** la media de la dimensión "Testing" del proyecto refleja el nuevo valor

### FAC-005: Lectura no editable desde la vista global del Director

- **Dado** un Director consultando la vista global
- **Cuando** intenta acceder a opciones de edición sobre un cliente o un riesgo desde esta vista
- **Entonces** el sistema no expone controles de edición; el Director puede navegar a las fichas detalle solo en modo lectura

---

## Historias de usuario

> Sección poblada por `agent-3.1-user-stories.md`. Listada aquí solo para trazabilidad.

| ID Historia | Título | Prioridad |
|-------------|--------|-----------|
| [US-xxx] | *(pendiente de creación)* | Must |

---

## Fronteras funcionales

**En el alcance:**
- Vista agregada por proyecto y por cliente con media, punto negro, punto dorado por dimensión y semáforo.
- Vista ejecutiva global con todos los clientes, sus semáforos, riesgos activos e indicadores de adopción de IA.
- Acceso de lectura adaptado al rol y al alcance de proyectos asignados.
- Refresco de los cálculos tras cambios en KPIs o reglas del árbol de decisión.

**Fuera del alcance:**
- Edición de KPIs, riesgos o reglas desde estas vistas (cubiertas por [FT-014], [FT-019], [FT-020], [FT-021]).
- Exportación a documentos externos (Excel, PDF) — fuera de OUT-004 de [VIS-001].
- Comparativas históricas o tendencias (depende del histórico de Fase 2).
- Personalización de las fórmulas por usuario; la fórmula es configurable a nivel de sistema en [FT-019].

---

## Puntos de atención

- El cumplimiento del umbral de 5 segundos de [EX-T002] sobre la vista global con miles de aplicativos exige diseñar mecanismos de cálculo o cacheado eficaces, lo que se trasladará al diseño técnico.
- La dependencia de las reglas del árbol de decisión ([PAT-EP003-02]) implica que sin umbrales configurados las vistas no pueden generar el semáforo: debe contemplarse un mensaje de "configuración pendiente" en el diseño.
- La fórmula de agregación es configurable según [EX-012]; debe definirse con el sponsor antes del diseño detallado de las pantallas.
