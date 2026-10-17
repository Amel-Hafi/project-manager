---
id: FT-007
title: "Ciclo de vida del referencial y árbol de decisión"
phase: 2-specification
type: feature
status: draft
version: "1.0"
last_updated: 2026-04-30
author: agent-features
reviewers: []
epic: EP-001
dependencies: ["EP-001", "FT-001", "FT-002", "FT-003", "FT-004", "FT-005", "FT-006", "GLO-001", "ACT-001", "DOM-001"]
requirements: ["EX-001", "EX-008"]
doc_depth: standard
---

# [FT-007] Ciclo de vida del referencial y árbol de decisión

## Descripción

Esta funcionalidad consolida el ciclo de vida del referencial y permite al Administrador (1) dar de baja y reactivar Entradas del Catálogo conservando las asociaciones históricas con los Aplicativos, y (2) configurar el árbol de decisión que rige la generación automática de Riesgos Técnicos y la asignación del Nivel de Semáforo a Aplicativos, Proyectos, Clientes o al Porfolio Global. Las Reglas de Decisión configuradas por el Administrador son las que el motor de evaluación aplicará en tiempo real cuando los Referentes DT capturen KPIs en la Fase 1.

---

## Detalles de la funcionalidad

| Propiedad | Valor |
|-----------|-------|
| **Épico padre** | [EP-001] Gestión del Referencial y Administración del Sistema |
| **Actor principal** | [ACT-H001] Administrador |
| **Actores secundarios** | [ACT-H002] Director (propone modificaciones a las reglas), [ACT-H004] Referente DT (consume el efecto de las reglas) |
| **Prioridad** | Must |
| **Complejidad estimada** | Alta |
| **Requisitos cubiertos** | [EX-001], [EX-008] |
| **Dependencias** | [FT-001], [FT-002], [FT-003], [FT-004], [FT-005], [FT-006] |
| **Entidades concernidas** | [ENT-004] EntradaCatalogo, [ENT-011] ReglaDecision, [ENT-008] RiesgoTecnico, [ENT-006] KPIDeMadurez |

---

## Reglas de negocio asociadas

| ID Regla | Descripción | Tipo |
|----------|-------------|------|
| [BR-TRG-F003] | Cuando el Administrador da de baja una EntradaCatalogo, su estado pasa a "DADO_DE_BAJA" y deja de estar disponible para nuevas asociaciones con Aplicativos | BR-TRG |
| [BR-COH-F003] | Las asociaciones históricas entre Aplicativos y Entradas dadas de baja se conservan sin modificación (no se eliminan en cascada) | BR-COH |
| [BR-VAL-F016] | El umbral de una ReglaDecision debe estar comprendido entre 0 y 100 si la condición expresa un porcentaje, o entre 1 y 10 si expresa un valor de KPI | BR-VAL |
| [BR-VAL-F017] | El nivelAgregacion de una ReglaDecision es obligatorio y debe ser uno de: APLICATIVO, PROYECTO, CLIENTE, GLOBAL ([REF-010]) | BR-VAL |
| [BR-VAL-F018] | El nivelSemaforo resultante de una ReglaDecision es obligatorio y debe ser uno de: VERDE, NARANJA, ROJO ([REF-006]) | BR-VAL |
| [BR-TRG-F004] | Cuando un KPIDeMadurez registrado por un Referente DT incumple una ReglaDecision activa, el sistema genera automáticamente un RiesgoTecnico con tipo=AUTOMATICO sobre el Aplicativo afectado | BR-TRG |
| [BR-AUT-F008] | Solo el Administrador puede crear, modificar, activar o desactivar Reglas de Decisión y dar de baja o reactivar Entradas del Catálogo | BR-AUT |
| [BR-AUT-F009] | Ningún usuario puede crear manualmente un RiesgoTecnico con tipo=AUTOMATICO (INV-007); este tipo está reservado al sistema | BR-AUT |

---

## Criterios de aceptación

### FAC-001: Dar de baja una entrada conservando asociaciones históricas

- **Dado** que existe una EntradaCatalogo "Maven 3.6" en estado "activo" asociada a 8 aplicativos del proyecto "ProyectoAlpha"
- **Cuando** el Administrador ejecuta la acción "dar de baja" sobre la entrada
- **Entonces** la entrada pasa al estado "DADO_DE_BAJA"
- **Y** los 8 aplicativos conservan la asociación histórica sin modificación
- **Y** la entrada deja de aparecer en los selectores de creación de nuevas asociaciones

### FAC-002: Reactivar una entrada previamente dada de baja

- **Dado** que existe una EntradaCatalogo "Docker 20.10" en estado "DADO_DE_BAJA"
- **Cuando** el Administrador ejecuta la acción "reactivar"
- **Entonces** la entrada vuelve al estado "activo"
- **Y** queda nuevamente disponible para asociar a aplicativos

### FAC-003: Configuración de una regla de decisión y generación automática de riesgo

- **Dado** que el Administrador configura una ReglaDecision activa con: dimensión=INDUSTRIALIZACION, nivelAgregacion=APLICATIVO, condición "valor < umbral", umbral=5, nivelSemaforo=ROJO
- **Cuando** un Referente DT registra un KPIDeMadurez para el aplicativo "AppBeta" con dimensión=INDUSTRIALIZACION y valor=3
- **Entonces** el sistema genera automáticamente un RiesgoTecnico con tipo=AUTOMATICO asociado a "AppBeta" y a la regla configurada
- **Y** el semáforo de estado del aplicativo "AppBeta" pasa a ROJO conforme a la regla

### FAC-004: Resolución del riesgo automático cuando el KPI vuelve por encima del umbral

- **Dado** que existe un RiesgoTecnico automático abierto sobre "AppBeta" generado por la regla anterior
- **Cuando** el Referente DT actualiza el KPI de INDUSTRIALIZACION del mismo aplicativo a valor=7
- **Entonces** el riesgo automático se marca como resuelto/cerrado por el sistema
- **Y** el semáforo del aplicativo se recalcula según las reglas activas restantes

### FAC-005: Restricción del tipo AUTOMATICO al motor del sistema

- **Dado** que un Manager con privilegios de registro manual de riesgos está autenticado
- **Cuando** intenta crear un RiesgoTecnico forzando el atributo tipo=AUTOMATICO
- **Entonces** el sistema rechaza la operación
- **Y** registra el intento en el log de auditoría

---

## Historias de usuario

> Sección rellenada por agent-3.1 (System 3). Listada aquí para trazabilidad.

| ID Historia | Título | Prioridad |
|-------------|--------|-----------|
| [US-xxx] | *(por crear)* | Must |

---

## Límites funcionales

**Dentro del alcance:**
- Acciones "dar de baja" y "reactivar" sobre Entradas del Catálogo en cualquier bloque temático
- Conservación íntegra de las asociaciones históricas Aplicativo-Entrada al dar de baja
- Configuración CRUD de Reglas de Decisión con activación/desactivación
- Selección de nivelAgregacion (APLICATIVO, PROYECTO, CLIENTE, GLOBAL), dimensión opcional, umbral y nivelSemaforo
- Generación automática de RiesgoTecnico de tipo AUTOMATICO al evaluar las reglas

**Fuera del alcance:**
- La captura de KPIs por el Referente DT — cubierta en otro épico de la Fase 1
- La gestión manual de RiesgoTecnico (tipo=MANUAL) y de PlanDeAccion — cubierta en otro épico
- El motor avanzado de expresiones combinadas multi-dimensión (ver PAT-DOM-003); el MVP soporta condiciones simples por dimensión y umbral
- La definición de umbrales iniciales concretos por la DT — depende de decisión del Director (PAT-EP001-02)
- La notificación interna a Referentes/Managers cuando se da de baja una entrada utilizada — pendiente de decisión (PAT-EP001-01)

---

## Puntos de atención

> [PA-001] El comportamiento esperado al dar de baja una entrada utilizada por aplicativos activos (notificación, restricción de edición de cartografía, impacto en KPIs de Madurez Tecnológica) está marcado como pendiente en PAT-EP001-01 y PAT-DOM-001. Las historias de usuario derivadas deberán incorporar la decisión que tome el sponsor.
> [PA-002] Los valores numéricos iniciales de los umbrales del árbol de decisión no están predefinidos (PAT-EP001-02 / HYP-004). El Director debe proponerlos antes de la puesta en marcha de la Fase 1.
> [PA-003] La condición de las reglas se almacena como expresión en texto ([ENT-011] atributo `condicion`) (PAT-DOM-003). El MVP cubre condiciones simples del tipo "valor < umbral" o "% aplicativos con KPI medio < umbral"; expresiones combinadas requieren ampliación posterior.
> [PA-004] La política de gestión de riesgos automáticos cuando el Referente DT corrige un valor de KPI (cierre automático vs. cierre manual) requiere confirmación. Por defecto se asume cierre automático en cuanto la condición deja de cumplirse.
> [PA-005] La activación de una regla con efecto retroactivo sobre KPIs ya registrados (re-evaluación masiva) está fuera del alcance del MVP; las reglas se aplican únicamente a evaluaciones de KPIs posteriores a la activación.
