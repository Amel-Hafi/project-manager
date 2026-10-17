---
id: FT-017
title: "Vista de madurez por aplicativo (radar)"
phase: 2-specification
type: feature
status: draft
version: "1.0"
last_updated: 2026-04-30
author: ba-2.2b
reviewers: []
epic: EP-003
dependencies: ["FT-014", "DOM-001", "ACT-001"]
requirements: ["EX-011"]
doc_depth: standard
language: es
---

# [FT-017] Vista de madurez por aplicativo (radar)

## Descripción

Esta funcionalidad proporciona a cualquier usuario autorizado un diagrama de radar (gráfico polar de siete vértices) que representa simultáneamente los valores de las siete dimensiones de madurez de un aplicativo. Para cada dimensión se muestra el valor numérico (escala 1-10), la fecha de la última evaluación y la justificación textual. El radar es el punto de entrada visual para el análisis detallado del perfil técnico del aplicativo y sirve como base para las vistas agregadas y para la priorización de acciones de mejora.

---

## Detalles de la funcionalidad

| Propiedad | Valor |
|-----------|-------|
| **Épico padre** | [EP-003] Madurez Técnica, Visualización y Gestión de Riesgos |
| **Actor principal** | [ACT-H003] Manager |
| **Actores secundarios** | [ACT-H001] Administrador, [ACT-H002] Director, [ACT-H004] Referente DT |
| **Prioridad** | Must |
| **Complejidad estimada** | Media |
| **Requisitos cubiertos** | [EX-011] |
| **Dependencias** | [FT-014] Captura de KPIs de madurez |
| **Entidades concernidas** | [ENT-003] Aplicativo, [ENT-006] KPIDeMadurez |

---

## Reglas de negocio asociadas

| ID | Descripción | Tipo |
|----|-------------|------|
| [BR-COH-F017-01] | El radar siempre muestra los siete vértices correspondientes a las dimensiones de [REF-001], aunque alguna dimensión tenga valor nulo. | BR-COH |
| [BR-CAL-F017-01] | La posición de cada vértice es proporcional al valor del KPI sobre la escala 1-10; los valores nulos se representan en el origen del eje y se etiquetan como "sin evaluar". | BR-CAL |
| [BR-AUT-F017-01] | El Manager y el Referente DT solo pueden consultar el radar de aplicativos de proyectos que tienen asignados; el Director y el Administrador pueden consultar todos. | BR-AUT |

---

## Criterios de aceptación

### FAC-001: Radar completo con los siete KPIs evaluados

- **Dado** que "AppZeta" tiene los siete KPIs evaluados con valores entre 3 y 9
- **Cuando** un usuario autorizado abre la ficha del aplicativo
- **Entonces** el sistema muestra un radar de siete vértices con cada vértice posicionado proporcionalmente a su valor en la escala 1-10
- **Y** acompaña al diagrama con una leyenda que detalla por dimensión el valor numérico, la fecha de última evaluación y la justificación

### FAC-002: Radar parcial con dimensiones sin evaluar

- **Dado** que "AppDelta" tiene tres dimensiones con valor nulo y cuatro con valor entre 4 y 8
- **Cuando** un usuario abre su radar
- **Entonces** el sistema dibuja los siete vértices con las tres dimensiones nulas representadas en el origen y etiquetadas como "sin evaluar"
- **Y** la lectura permite identificar visualmente las dimensiones que requieren captura

### FAC-003: Tiempo de respuesta del radar bajo carga

- **Dado** un porfolio con 2.000 aplicativos cargados en el sistema
- **Cuando** un usuario abre el radar de uno de ellos
- **Entonces** el sistema entrega el diagrama en menos de 5 segundos conforme a [EX-T002]

### FAC-004: Bloqueo del radar por ámbito de proyecto

- **Dado** un Manager no asignado al proyecto al que pertenece "AppZeta"
- **Cuando** intenta acceder al radar de "AppZeta"
- **Entonces** el sistema impide el acceso y devuelve un error de autorización

---

## Historias de usuario

> Sección poblada por `agent-3.1-user-stories.md`. Listada aquí solo para trazabilidad.

| ID Historia | Título | Prioridad |
|-------------|--------|-----------|
| [US-xxx] | *(pendiente de creación)* | Must |

---

## Fronteras funcionales

**En el alcance:**
- Visualización gráfica polar (radar) de los siete KPIs de un aplicativo.
- Detalle textual por dimensión: valor, fecha de evaluación y justificación.
- Distinción visual entre dimensiones evaluadas y no evaluadas.
- Restricciones de acceso por rol y proyecto.

**Fuera del alcance:**
- Comparación entre dos aplicativos en un mismo radar (no contemplado en MVP).
- Edición de los KPIs desde la vista radar (la edición pertenece a [FT-014]).
- Exportación gráfica del radar (PDF, imagen).
- Tendencias temporales sobre el radar (depende del histórico de Fase 2).

---

## Puntos de atención

- La representación del valor nulo en el origen puede dificultar la lectura cuando varias dimensiones están sin evaluar; conviene reforzar el código visual y la leyenda en el diseño de pantalla.
- La densidad de información del radar (siete vértices, fechas, justificaciones) requiere una solución de interacción que evite la sobrecarga: pasar el cursor o seleccionar el vértice puede mostrar el detalle en lugar de saturar el gráfico.
