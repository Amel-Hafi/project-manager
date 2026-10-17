---
source: EP-003
type: rules-staging
rule_type: VAL
extracted_by: ba-2.2b
epic: EP-003
status: draft
version: "1.0"
last_updated: 2026-04-30
language: es
---

# Reglas de Validación (VAL) extraídas de [EP-003]

Reglas de validación identificadas durante la especificación funcional de las funcionalidades [FT-014] a [FT-021]. Los identificadores son temporales (prefijo `F` por extracción a partir de funcionalidades) y serán consolidados por `agent-2.3-business-rules`.

## [FT-014] Captura de KPIs de madurez

| ID | Entidad | Atributo / Alcance | Regla | Funcionalidades |
|----|---------|--------------------|-------|-----------------|
| BR-VAL-F014-01 | KPIDeMadurez | valor | Nulo o entero entre 1 y 10 inclusive. | [FT-014] |
| BR-VAL-F014-02 | KPIDeMadurez | fechaEvaluacion, justificacion | Obligatorios si el valor del KPI no es nulo. | [FT-014] |
| BR-VAL-F014-03 | KPIDeMadurez | (aplicativoId, dimension) | Combinación única: un único KPI por aplicativo y dimensión. | [FT-014] |

## [FT-016] Registro y gestión de casos de éxito de IA

| ID | Entidad | Atributo / Alcance | Regla | Funcionalidades |
|----|---------|--------------------|-------|-----------------|
| BR-VAL-F016-01 | CasoDeExitoIA | titulo, descripcion | Título obligatorio (máx. 200 caracteres); descripción obligatoria (máx. 5000 caracteres). | [FT-016] |
| BR-VAL-F016-02 | CasoDeExitoIA | fecha | No posterior a la fecha actual. | [FT-016] |
| BR-VAL-F016-03 | CasoDeExitoIA | herramientaIAId | Si se referencia, debe ser una EntradaCatalogo activa del bloque temático "Inteligencia artificial". | [FT-016] |

## [FT-019] Árbol de decisión y semáforo de estado

| ID | Entidad | Atributo / Alcance | Regla | Funcionalidades |
|----|---------|--------------------|-------|-----------------|
| BR-VAL-F019-01 | ReglaDecision | nombre, descripcion, condicion, umbral, nivelAgregacion, nivelSemaforo, activa | Conjunto mínimo obligatorio en cada regla. | [FT-019] |
| BR-VAL-F019-02 | ReglaDecision | umbral | Entre 0 y 100 si expresa porcentaje; entre 1 y 10 si expresa valor de KPI. | [FT-019] |

## [FT-020] Detección automática de riesgos técnicos por KPI

| ID | Entidad | Atributo / Alcance | Regla | Funcionalidades |
|----|---------|--------------------|-------|-----------------|
| BR-VAL-F020-01 | RiesgoTecnico | reglaDecisionId | Obligatorio cuando `tipo = AUTOMATICO`; debe referenciar la regla activa que generó el riesgo. | [FT-020] |

## [FT-021] Registro manual de riesgos técnicos y planes de acción

| ID | Entidad | Atributo / Alcance | Regla | Funcionalidades |
|----|---------|--------------------|-------|-----------------|
| BR-VAL-F021-01 | RiesgoTecnico | titulo, descripcion, aplicativoId | Título no vacío (máx. 200); descripción obligatoria (máx. 2000); aplicativo obligatorio. | [FT-021] |
| BR-VAL-F021-02 | RiesgoTecnico | reglaDecisionId | Debe ser nulo cuando `tipo = MANUAL`. | [FT-021] |
| BR-VAL-F021-03 | PlanDeAccion | descripcion, responsable, plazo, estado | Descripción y responsable obligatorios; plazo posterior a la fecha de creación; estado obligatorio. | [FT-021] |
| BR-VAL-F021-04 | RiesgoTecnico | fechaCierre | Obligatoria al cerrar el riesgo. | [FT-021] |
