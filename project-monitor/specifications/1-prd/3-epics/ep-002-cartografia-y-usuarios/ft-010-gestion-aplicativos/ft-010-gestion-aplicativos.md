---
id: FT-010
title: "Gestión de aplicativos y descripción técnica"
phase: 2-specification
type: feature
status: draft
version: "1.0"
last_updated: 2026-04-30
author: agent-features
lang: es
reviewers: []
epic: EP-002
dependencies: ["EP-002", "FT-009", "EP-001", "GLO-001", "ACT-001", "DOM-001"]
requirements: ["EX-003", "EX-004"]
doc_depth: standard
---

# [FT-010] Gestión de aplicativos y descripción técnica

## Descripción

Esta funcionalidad permite al [ACT-H001] Administrador, al [ACT-H003] Manager y al [ACT-H004] Referente DT crear, modificar y consultar los aplicativos que conforman la tercera y última capa de la jerarquía organizativa, así como asociarles las entradas del catálogo tecnológico (de [EP-001]) que describen su configuración técnica completa: stack tecnológico, herramientas CI/Calidad/Seguridad, herramientas CD/IaC/IA, entornos de infraestructura y puesto de trabajo del equipo. Esta descripción técnica es la base de la cartografía organizativa y condiciona el cálculo posterior del KPI de madurez tecnológica. Al crear un aplicativo, el sistema genera automáticamente los siete registros KPIDeMadurez en estado nulo.

---

## Detalle de la funcionalidad

| Propiedad | Valor |
|----------|-------|
| **Épico padre** | [EP-002] Cartografía Organizativa y Gestión de Usuarios |
| **Actor principal** | [ACT-H004] Referente DT |
| **Actores secundarios** | [ACT-H001] Administrador, [ACT-H003] Manager, [ACT-H002] Director (lectura) |
| **Prioridad** | Must |
| **Complejidad estimada** | Media |
| **Requisitos cubiertos** | [EX-003], [EX-004] |
| **Dependencias** | [FT-009], [EP-001] |
| **Entidades concernidas** | [ENT-003] Aplicativo, [ENT-002] Proyecto, [ENT-004] EntradaCatalogo, [ENT-006] KPIDeMadurez |

---

## Reglas de negocio asociadas

| ID regla | Descripción | Tipo |
|---------|-------------|------|
| [BR-VAL-F004] | El nombre del aplicativo es obligatorio, máximo 200 caracteres y no puede estar vacío | BR-VAL |
| [BR-VAL-F005] | El campo proyectoId es obligatorio y debe corresponder a un proyecto existente | BR-VAL |
| [BR-VAL-F006] | Sólo se pueden asociar al aplicativo entradas de catálogo en estado ACTIVO | BR-VAL |
| [BR-COH-F004] | Un aplicativo debe pertenecer a exactamente un proyecto; el proyectoId no puede modificarse tras la creación | BR-COH |
| [BR-COH-F005] | Tras la creación de un aplicativo, debe existir exactamente un KPIDeMadurez por cada valor de DimensionDeMadurez (REF-001), totalizando 7 registros | BR-COH |
| [BR-AUT-F003] | El Manager y el Referente DT sólo pueden crear o modificar aplicativos en proyectos a los que están asignados; el Administrador opera sin restricción de ámbito | BR-AUT |
| [BR-AUT-F004] | La eliminación de aplicativos está reservada al rol ROL_ADMIN | BR-AUT |
| [BR-TRG-F003] | Al crear un aplicativo, el sistema genera automáticamente los 7 registros KPIDeMadurez con valor nulo, uno por cada dimensión de REF-001 | BR-TRG |
| [BR-TRG-F004] | Al crear o modificar un aplicativo, el sistema asigna automáticamente las marcas de tiempo fechaCreacion y fechaModificacion | BR-TRG |

---

## Criterios de aceptación

### FAC-001: Alta de aplicativo y generación automática de KPIs

- **Dado** que el Referente DT "referente01@dt.es" está asignado al proyecto "ProyectoAlpha"
- **Cuando** registra el aplicativo "AppAlpha" con descripción "Aplicación de gestión interna" bajo "ProyectoAlpha"
- **Entonces** el aplicativo queda persistido y el sistema genera automáticamente 7 registros KPIDeMadurez con valor nulo, uno por cada dimensión TESTING, INDUSTRIALIZACION, CALIDAD_CODIGO, DESPLIEGUE, MADUREZ_TECNOLOGICA, USO_IA y PERFORMANCE
- **Y** "AppAlpha" está disponible inmediatamente para captura de KPIs y registro de riesgos técnicos en otros épicos

### FAC-002: Descripción técnica completa con catálogo activo

- **Dado** que el catálogo tecnológico de [EP-001] contiene entradas activas en todos los bloques temáticos
- **Cuando** el Referente DT asocia a "AppAlpha" entradas de stack tecnológico (Java 21, PostgreSQL 16), CI/Seguridad (Jenkins, SonarQube), CD/IaC/IA (ArgoCD, Terraform, GitHub Copilot), entornos (Cualificación, Producción) y puesto de trabajo (Estación corporativa Linux)
- **Entonces** las asociaciones quedan persistidas y son consultables en la ficha del aplicativo
- **Y** la modificación posterior del stack se refleja en fechaModificacion

### FAC-003: Restricción de ámbito por proyecto asignado

- **Dado** que el Referente DT "referente01@dt.es" está asignado únicamente al proyecto "ProyectoAlpha"
- **Cuando** intenta crear el aplicativo "AppBeta" en "ProyectoBeta" (no asignado)
- **Entonces** el sistema rechaza la creación con mensaje de acceso denegado conforme a [BR-AUT-F003]
- **Y** la creación de "AppGamma" en "ProyectoAlpha" se ejecuta correctamente

### FAC-004: Rechazo de asociación a entrada de catálogo dada de baja

- **Dado** que la EntradaCatalogo "Java 8" está en estado DADO_DE_BAJA en el catálogo de [EP-001]
- **Cuando** el Referente DT intenta asociar "Java 8" al aplicativo "AppAlpha"
- **Entonces** el sistema rechaza la asociación con un mensaje que indica que la entrada no está activa
- **Y** la asociación a "Java 21" (estado ACTIVO) se acepta sin error

### FAC-005: Eliminación reservada al Administrador

- **Dado** que el aplicativo "AppAlpha" existe sin riesgos técnicos abiertos
- **Cuando** el Manager "manager01@dt.es" intenta eliminarlo
- **Entonces** el sistema rechaza la acción por falta de permisos
- **Y** la eliminación ejecutada por el Administrador "admin01@dt.es" se completa correctamente

---

## Historias de usuario

> Sección poblada por `agent-3.1-user-stories.md`. Listada aquí para trazabilidad.

| ID historia | Título | Prioridad |
|----------|-------|----------|
| [US-xxx] | *(por crear)* | Must |

---

## Fronteras funcionales

**En alcance:**
- Alta, consulta y modificación de aplicativos por Administrador, Manager y Referente DT (con restricción de ámbito)
- Eliminación de aplicativos por el Administrador
- Asociación N:N de aplicativos a entradas activas del catálogo tecnológico de [EP-001]
- Generación automática de los 7 KPIDeMadurez al crear el aplicativo

**Fuera de alcance:**
- Captura de los valores de los KPIs (cubierto en otro épico de la Fase 1, vía [EX-007])
- Gestión del impacto del darDeBaja de una EntradaCatalogo asociada a aplicativos activos (ver ESC-002 de [ACT-001] y PAT-DOM-001 de [DOM-001])
- Carga masiva inicial de aplicativos existentes (ver PAT-EP002-03 de [EP-002])
- Histórico de cambios en la descripción técnica del aplicativo

---

## Puntos de atención

| ID | Punto | Descripción |
|----|-------|-------------|
| PA-001 | Disponibilidad del catálogo tecnológico [EP-001] | La descripción técnica completa requiere que las funcionalidades de [EP-001] estén operativas con entradas en todos los bloques temáticos. El orden de implementación sugerido en [EP-002] sitúa esta funcionalidad en el paso 6, posterior a [EP-001]. |
| PA-002 | Comportamiento al dar de baja una entrada asociada | PAT-DOM-001 de [DOM-001] documenta que el comportamiento esperado cuando una EntradaCatalogo asociada se da de baja (notificación, restricción, impacto) no está plenamente especificado. |
| PA-003 | Volumen de aplicativos | El sistema debe soportar miles de aplicativos según [VIS-001] CTR-004; el diseño de la ficha y de la asociación al catálogo debe respetar el umbral de respuesta < 5 s ([EX-T002]). |
