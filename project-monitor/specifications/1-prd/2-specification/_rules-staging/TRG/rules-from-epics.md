# Reglas de Disparador — Staging desde Épicos

> **Origen:** Extracción realizada por agent-epics (ba-2.2) — 2026-04-29
> **IDs temporales:** BR-TRG-Exxx — a consolidar por agent-2.3-rules antes de asignación de IDs definitivos
> **Épicos fuente:** [EP-001], [EP-002], [EP-003]

---

## BR-TRG-E001 — Creación automática de los 7 KPIs al crear un Aplicativo

| Propiedad | Valor |
|-----------|-------|
| **Épico fuente** | [EP-002] [FT-010] |
| **Entidades concernidas** | [ENT-003] Aplicativo, [ENT-006] KPIDeMadurez |
| **Descripción** | Inmediatamente después de crear un Aplicativo, el sistema genera automáticamente exactamente 7 registros KPIDeMadurez con valor nulo, uno por cada valor del enum DimensionDeMadurez (REF-001: TESTING, INDUSTRIALIZACION, CALIDAD_CODIGO, DESPLIEGUE, MADUREZ_TECNOLOGICA, USO_IA, PERFORMANCE). Esta acción no requiere ninguna interacción del usuario. |
| **Condición de activación** | Creación exitosa de un Aplicativo |
| **Resultado esperado** | 7 registros KPIDeMadurez con valor = nulo, fechaEvaluacion = nulo, justificacion = nulo, asociados al nuevo Aplicativo. |
| **Actor que activa** | Sistema (disparado por acción del Administrador, Manager o Referente DT que crea el Aplicativo) |

---

## BR-TRG-E002 — Generación automática de un RiesgoTecnico al incumplir un umbral de KPI

| Propiedad | Valor |
|-----------|-------|
| **Épico fuente** | [EP-003] [FT-020] |
| **Entidades concernidas** | [ENT-006] KPIDeMadurez, [ENT-011] ReglaDecision, [ENT-008] RiesgoTecnico |
| **Descripción** | Cada vez que se registra o actualiza el valor de un KPIDeMadurez, el sistema evalúa todas las ReglaDecision activas cuya condición involucra ese KPI. Por cada regla activa cuya condición se cumple y que no tiene ya un RiesgoTecnico abierto o en progreso asociado al mismo Aplicativo y regla, el sistema crea automáticamente un nuevo RiesgoTecnico con tipo = AUTOMATICO, estado = ABIERTO y referencia a la ReglaDecision activada. |
| **Condición de activación** | Guardado de un KPIDeMadurez con valor no nulo que provoca el incumplimiento de una ReglaDecision activa |
| **Resultado esperado** | Nuevo RiesgoTecnico con tipo AUTOMATICO, estado ABIERTO, aplicativoId y reglaDecisionId correctamente vinculados. |
| **Actor que activa** | Sistema (disparado por acción del Referente DT o Administrador que guarda el KPI) |

---

## BR-TRG-E003 — Actualización automática de fechaModificacion en toda entidad modificada

| Propiedad | Valor |
|-----------|-------|
| **Épico fuente** | [EP-001], [EP-002], [EP-003] — transversal |
| **Entidades concernidas** | Todas las entidades con atributo `fechaModificacion` |
| **Descripción** | En toda operación de actualización sobre cualquier entidad que disponga del atributo `fechaModificacion`, el sistema actualiza automáticamente ese atributo con la fecha y hora del momento de la operación. Esta actualización es transparente al usuario y no requiere ninguna acción explícita. |
| **Condición de activación** | Cualquier operación de actualización (U) sobre una entidad con atributo `fechaModificacion` |
| **Resultado esperado** | fechaModificacion = timestamp del sistema en el momento de la operación. |
| **Actor que activa** | Sistema (disparado por cualquier actor que ejecute una operación de actualización) |

---

## BR-TRG-E004 — Evaluación del semáforo al modificar una ReglaDecision activa

| Propiedad | Valor |
|-----------|-------|
| **Épico fuente** | [EP-003] [FT-019] |
| **Entidades concernidas** | [ENT-011] ReglaDecision, [ENT-006] KPIDeMadurez, [ENT-008] RiesgoTecnico |
| **Descripción** | Cuando el Administrador activa, modifica o desactiva una ReglaDecision, el sistema reevalúa inmediatamente todos los KPIs de los Aplicativos afectados por el nivel de agregación de la regla modificada y actualiza los semáforos de estado correspondientes. Si la reevaluación genera nuevos incumplimientos, se crean los RiesgoTecnico automáticos correspondientes. |
| **Condición de activación** | Creación, modificación o cambio de estado (activa/inactiva) de una ReglaDecision |
| **Resultado esperado** | Semáforos y riesgos técnicos automáticos actualizados de forma coherente con las nuevas reglas. |
| **Actor que activa** | Sistema (disparado por acción del Administrador sobre el árbol de decisión) |
