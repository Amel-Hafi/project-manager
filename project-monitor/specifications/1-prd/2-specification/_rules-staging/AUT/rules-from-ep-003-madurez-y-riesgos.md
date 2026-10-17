---
source: EP-003
type: rules-staging
rule_type: AUT
extracted_by: ba-2.2b
epic: EP-003
status: draft
version: "1.0"
last_updated: 2026-04-30
language: es
---

# Reglas de Autorización (AUT) extraídas de [EP-003]

Restricciones de acceso aplicables a las funcionalidades del épico. Identificadores temporales que serán consolidados por `agent-2.3-business-rules`.

## [FT-014] Captura de KPIs de madurez

| ID | Acción / Recurso | Roles autorizados | Condición | Funcionalidades |
|----|------------------|-------------------|-----------|-----------------|
| BR-AUT-F014-01 | Registrar o modificar el valor de un KPI de un Aplicativo | Referente DT, Administrador | El Referente DT debe estar asignado al proyecto del aplicativo; el Administrador no tiene esta restricción. | [FT-014] |

## [FT-015] Consulta del histórico de evaluaciones de KPIs

| ID | Acción / Recurso | Roles autorizados | Condición | Funcionalidades |
|----|------------------|-------------------|-----------|-----------------|
| BR-AUT-F015-01 | Consultar el histórico de KPIs de un Aplicativo | Administrador, Director, Manager, Referente DT | Manager y Referente DT solo en proyectos asignados; Administrador y Director sin restricción. | [FT-015] |

## [FT-016] Registro y gestión de casos de éxito de IA

| ID | Acción / Recurso | Roles autorizados | Condición | Funcionalidades |
|----|------------------|-------------------|-----------|-----------------|
| BR-AUT-F016-01 | Crear o modificar un CasoDeExitoIA | Referente DT, Manager, Administrador | Referente DT y Manager deben estar asignados al proyecto; Administrador sin restricción. | [FT-016] |
| BR-AUT-F016-02 | Eliminar un CasoDeExitoIA | Creador del registro o Administrador | Refleja INV-008 de [DOM-001] y DEL-001 de [ACT-001]. | [FT-016] |

## [FT-017] Vista de madurez por aplicativo (radar)

| ID | Acción / Recurso | Roles autorizados | Condición | Funcionalidades |
|----|------------------|-------------------|-----------|-----------------|
| BR-AUT-F017-01 | Consultar el radar de un Aplicativo | Administrador, Director, Manager, Referente DT | Manager y Referente DT solo en proyectos asignados; Administrador y Director sin restricción. | [FT-017] |

## [FT-018] Vistas agregadas con semáforo por proyecto y cliente

| ID | Acción / Recurso | Roles autorizados | Condición | Funcionalidades |
|----|------------------|-------------------|-----------|-----------------|
| BR-AUT-F018-01 | Consultar las vistas agregadas por proyecto, cliente y global | Administrador, Director, Manager, Referente DT | Manager y Referente DT limitados a proyectos asignados; Director y Administrador sin restricción y con acceso a la vista global. | [FT-018] |
| BR-AUT-F018-02 | Editar elementos desde la vista ejecutiva global | (Ninguno) | El Director accede en modo lectura; ningún rol edita desde esta vista. | [FT-018] |

## [FT-019] Árbol de decisión y semáforo de estado

| ID | Acción / Recurso | Roles autorizados | Condición | Funcionalidades |
|----|------------------|-------------------|-----------|-----------------|
| BR-AUT-F019-01 | Crear, modificar, activar, desactivar o eliminar reglas del árbol de decisión | Administrador | El Director solo puede proponer cambios sin efecto directo en el sistema. | [FT-019] |

## [FT-020] Detección automática de riesgos técnicos por KPI

| ID | Acción / Recurso | Roles autorizados | Condición | Funcionalidades |
|----|------------------|-------------------|-----------|-----------------|
| BR-AUT-F020-01 | Crear un RiesgoTecnico con `tipo = AUTOMATICO` | Solo el sistema | Ningún usuario, incluido el Administrador, puede crear manualmente un riesgo automático (refleja INV-007 de [DOM-001]). | [FT-020] |

## [FT-021] Registro manual de riesgos técnicos y planes de acción

| ID | Acción / Recurso | Roles autorizados | Condición | Funcionalidades |
|----|------------------|-------------------|-----------|-----------------|
| BR-AUT-F021-01 | Registrar, modificar o cerrar un riesgo manual y sus planes de acción sobre un Aplicativo | Manager, Administrador | El Manager debe estar asignado al proyecto del aplicativo; el Administrador no tiene esta restricción. La capacidad del Referente DT queda fuera del MVP (PAT-003 de [ACT-001]). | [FT-021] |
