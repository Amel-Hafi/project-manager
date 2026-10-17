---
source: EP-003
type: rules-staging
rule_type: COH
extracted_by: ba-2.2b
epic: EP-003
status: draft
version: "1.0"
last_updated: 2026-04-30
language: es
---

# Reglas de Coherencia (COH) extraídas de [EP-003]

Restricciones cruzadas entre entidades o estados que deben mantenerse en todo momento. Identificadores temporales que serán consolidados por `agent-2.3-business-rules`.

## [FT-015] Consulta del histórico de evaluaciones de KPIs

| ID | Entidades implicadas | Regla | Funcionalidades |
|----|----------------------|-------|-----------------|
| BR-COH-F015-01 | KPIDeMadurez | El histórico mostrado debe coincidir exactamente con el valor, fecha y justificación persistidos para el KPI actual; no se generan datos calculados ni interpolados. | [FT-015] |

## [FT-017] Vista de madurez por aplicativo (radar)

| ID | Entidades implicadas | Regla | Funcionalidades |
|----|----------------------|-------|-----------------|
| BR-COH-F017-01 | Aplicativo, KPIDeMadurez | El radar siempre muestra los siete vértices correspondientes a las dimensiones de [REF-001], aunque alguna dimensión tenga valor nulo. | [FT-017] |

## [FT-020] Detección automática de riesgos técnicos por KPI

| ID | Entidades implicadas | Regla | Funcionalidades |
|----|----------------------|-------|-----------------|
| BR-COH-F020-01 | RiesgoTecnico, ReglaDecision, Aplicativo | Para un mismo aplicativo y una misma regla no puede existir más de un RiesgoTecnico automático abierto simultáneamente. | [FT-020] |

## [FT-021] Registro manual de riesgos técnicos y planes de acción

| ID | Entidades implicadas | Regla | Funcionalidades |
|----|----------------------|-------|-----------------|
| BR-COH-F021-01 | RiesgoTecnico, PlanDeAccion | El RiesgoTecnico pasa al estado "En progreso" cuando al menos un PlanDeAccion asociado está en estado "En progreso". | [FT-021] |
| BR-COH-F021-02 | RiesgoTecnico, PlanDeAccion | La asociación entre un PlanDeAccion y su RiesgoTecnico es inmutable tras la creación (refleja INV-006 de [DOM-001]). | [FT-021] |
