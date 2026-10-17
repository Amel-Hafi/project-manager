---
id: FT-014
title: "Captura de KPIs de madurez"
phase: 2-specification
type: feature
status: draft
version: "1.0"
last_updated: 2026-04-30
author: ba-2.2b
reviewers: []
epic: EP-003
dependencies: ["EP-003", "FT-006", "GLO-001", "DOM-001", "ACT-001"]
requirements: ["EX-007"]
doc_depth: standard
language: es
---

# [FT-014] Captura de KPIs de madurez

## Descripción

Esta funcionalidad permite al Referente DT registrar y actualizar el valor de los siete KPIs de madurez de cada aplicativo de su cartera, asignando a cada dimensión una puntuación entre 1 y 10 acompañada de su justificación textual y de la fecha de evaluación. La plantilla de valoración activa para cada dimensión está disponible como referencia consultable durante la captura. Los valores registrados son la fuente de verdad sobre la que se construyen el radar por aplicativo, las vistas agregadas, el semáforo de estado y la detección automática de riesgos.

---

## Detalles de la funcionalidad

| Propiedad | Valor |
|-----------|-------|
| **Épico padre** | [EP-003] Madurez Técnica, Visualización y Gestión de Riesgos |
| **Actor principal** | [ACT-H004] Referente DT |
| **Actores secundarios** | [ACT-H001] Administrador (gestión y supervisión) |
| **Prioridad** | Must |
| **Complejidad estimada** | Media |
| **Requisitos cubiertos** | [EX-007] |
| **Dependencias** | [FT-006] Plantillas de valoración de KPI, [EP-002] Cartografía de aplicativos |
| **Entidades concernidas** | [ENT-006] KPIDeMadurez, [ENT-003] Aplicativo, [ENT-007] PlantillaDeValoracion |

---

## Reglas de negocio asociadas

| ID | Descripción | Tipo |
|----|-------------|------|
| [BR-VAL-F014-01] | El valor de un KPI debe ser nulo o un entero entre 1 y 10 inclusive. | BR-VAL |
| [BR-VAL-F014-02] | Si el valor de un KPI no es nulo, la fecha de evaluación y la justificación son obligatorias. | BR-VAL |
| [BR-VAL-F014-03] | La combinación (aplicativo, dimensión) es única: existe un único KPI por aplicativo y dimensión. | BR-VAL |
| [BR-TRG-F014-01] | Al crear un Aplicativo el sistema genera automáticamente los siete registros KPIDeMadurez con valor nulo. | BR-TRG |
| [BR-TRG-F014-02] | Al guardar un valor de KPI distinto de nulo el sistema desencadena la reevaluación del árbol de decisión y la posible generación de riesgos automáticos. | BR-TRG |
| [BR-AUT-F014-01] | Solo el Referente DT asignado al proyecto del aplicativo o el Administrador pueden registrar o modificar el valor de un KPI. | BR-AUT |

---

## Criterios de aceptación

### FAC-001: Captura completa de los siete KPIs de un aplicativo con plantilla activa

- **Dado** que el aplicativo "AppZeta" pertenece al proyecto "ProyectoAlpha", el Referente DT "referente01@dt.es" está asignado al proyecto y existe una plantilla activa para cada una de las siete dimensiones de madurez
- **Cuando** "referente01@dt.es" abre la ficha de KPIs de "AppZeta" y registra para las siete dimensiones un valor entre 1 y 10, una justificación textual y la fecha de evaluación 2026-04-30
- **Entonces** el sistema persiste los siete KPIs con sus tres campos obligatorios y referencia la versión de la plantilla activa en cada uno
- **Y** los valores quedan disponibles inmediatamente para el cálculo del radar, del semáforo y de los riesgos automáticos asociados

### FAC-002: Validación de obligatoriedad condicional al guardar un KPI

- **Dado** un KPI de "AppZeta" en la dimensión "Testing" con valor 4
- **Cuando** el Referente DT intenta guardar el KPI sin justificación o sin fecha de evaluación
- **Entonces** el sistema rechaza la operación, conserva el valor previo del KPI y muestra un mensaje indicando los campos obligatorios pendientes

### FAC-003: Restablecimiento de un KPI a valor nulo

- **Dado** un KPI de "AppZeta" en la dimensión "Uso de IA" con valor 7, justificación y fecha registradas
- **Cuando** el Referente DT actualiza el KPI eliminando el valor (estableciéndolo en nulo)
- **Entonces** el sistema permite la operación y vacía los campos justificación y fecha de evaluación
- **Y** la dimensión deja de generar resultados en el radar y los riesgos automáticos vinculados a esa dimensión y aplicativo se cierran si los valores ya no incumplen las reglas activas

### FAC-004: Bloqueo de captura por usuario sin permiso de proyecto

- **Dado** un Referente DT "referente02@dt.es" no asignado al proyecto "ProyectoAlpha"
- **Cuando** intenta acceder a la ficha de KPIs de "AppZeta" para registrar un valor
- **Entonces** el sistema bloquea la operación y devuelve un error de autorización
- **Y** ningún registro KPIDeMadurez de "AppZeta" se crea ni se modifica

---

## Historias de usuario

> Sección poblada por `agent-3.1-user-stories.md`. Listada aquí solo para trazabilidad.

| ID Historia | Título | Prioridad |
|-------------|--------|-----------|
| [US-xxx] | *(pendiente de creación)* | Must |

---

## Fronteras funcionales

**En el alcance:**
- Registro y actualización manual del valor (1-10 o nulo), justificación y fecha de evaluación de cada KPI por aplicativo y dimensión.
- Consulta de la plantilla de valoración activa durante la captura como referencia.
- Generación automática de los siete registros KPIDeMadurez al crear el aplicativo.
- Disparo de la reevaluación del árbol de decisión al guardar un valor.

**Fuera del alcance:**
- Histórico de versiones de KPIs (solo se conserva el valor actual — ver [PAT-EP003-01]).
- Integración automática con herramientas de calidad o CI/CD para alimentar los KPIs (entrada manual confirmada por HYP-003 de [VIS-001]).
- Edición masiva o importación por carga; cada KPI se registra de forma individual.
- Cálculo del radar y del semáforo, cubierto por [FT-017] y [FT-018]/[FT-019].

---

## Puntos de atención

- La ausencia de histórico ([PAT-EP003-01]) impide mostrar tendencias temporales: la fecha de evaluación es la única referencia temporal disponible.
- La captura manual concentra la responsabilidad de la calidad del dato en el Referente DT; el diseño de la pantalla debe maximizar la visibilidad de la plantilla de valoración para reducir la subjetividad.
- El borrado del valor (paso a nulo) debe propagarse correctamente al árbol de decisión: si se elimina un valor que había generado un riesgo automático, el riesgo asociado debe cerrarse o invalidarse según la lógica de [FT-020].
