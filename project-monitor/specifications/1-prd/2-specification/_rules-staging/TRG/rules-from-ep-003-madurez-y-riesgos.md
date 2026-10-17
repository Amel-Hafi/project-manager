---
source: EP-003
type: rules-staging
rule_type: TRG
extracted_by: ba-2.2b
epic: EP-003
status: draft
version: "1.0"
last_updated: 2026-04-30
language: es
---

# Reglas de Disparo (TRG) extraídas de [EP-003]

Reglas que describen acciones automáticas desencadenadas por un evento del sistema. Identificadores temporales que serán consolidados por `agent-2.3-business-rules`.

## [FT-014] Captura de KPIs de madurez

| ID | Evento | Acción desencadenada | Funcionalidades |
|----|--------|----------------------|-----------------|
| BR-TRG-F014-01 | Creación de un Aplicativo | Generar automáticamente los siete registros KPIDeMadurez del aplicativo (uno por dimensión) con valor nulo. | [FT-014] |
| BR-TRG-F014-02 | Persistencia de un valor de KPI distinto de nulo | Disparar la reevaluación del árbol de decisión y la posible creación o cierre de riesgos automáticos asociados. | [FT-014], [FT-019], [FT-020] |

## [FT-016] Registro y gestión de casos de éxito de IA

| ID | Evento | Acción desencadenada | Funcionalidades |
|----|--------|----------------------|-----------------|
| BR-TRG-F016-01 | Modificación de un CasoDeExitoIA | Actualizar `ultimaModificacionPor` con el usuario actual y `fechaModificacion` con el instante actual. | [FT-016] |

## [FT-018] Vistas agregadas con semáforo

| ID | Evento | Acción desencadenada | Funcionalidades |
|----|--------|----------------------|-----------------|
| BR-TRG-F018-01 | Modificación de un KPI o de una regla del árbol de decisión | Las vistas agregadas reflejan el nuevo cálculo en el siguiente refresco. | [FT-018], [FT-019] |

## [FT-019] Árbol de decisión y semáforo de estado

| ID | Evento | Acción desencadenada | Funcionalidades |
|----|--------|----------------------|-----------------|
| BR-TRG-F019-01 | Activación, desactivación o modificación de una ReglaDecision | Reevaluar inmediatamente el semáforo y los riesgos automáticos asociados a las entidades alcanzadas por la regla. | [FT-019], [FT-020] |

## [FT-020] Detección automática de riesgos técnicos por KPI

| ID | Evento | Acción desencadenada | Funcionalidades |
|----|--------|----------------------|-----------------|
| BR-TRG-F020-01 | Persistencia de un KPI o evaluación periódica | Crear un RiesgoTecnico con `tipo = AUTOMATICO` por cada regla incumplida que no tenga ya un riesgo abierto vigente para la misma entidad. | [FT-020] |
| BR-TRG-F020-02 | Persistencia de un KPI o desactivación de una regla | Cerrar automáticamente los riesgos automáticos cuya condición ha dejado de cumplirse, registrando la fecha de cierre. | [FT-020] |
