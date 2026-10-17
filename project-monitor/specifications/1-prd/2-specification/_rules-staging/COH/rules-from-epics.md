# Reglas de Coherencia — Staging desde Épicos

> **Origen:** Extracción realizada por agent-epics (ba-2.2) — 2026-04-29
> **IDs temporales:** BR-COH-Exxx — a consolidar por agent-2.3-rules antes de asignación de IDs definitivos
> **Épicos fuente:** [EP-001], [EP-002], [EP-003]

---

## BR-COH-E001 — Unicidad de la PlantillaDeValoracion activa por dimensión

| Propiedad | Valor |
|-----------|-------|
| **Épico fuente** | [EP-001] [FT-006] |
| **Entidades concernidas** | [ENT-007] PlantillaDeValoracion |
| **Descripción** | Para cada valor de DimensionDeMadurez, el sistema debe garantizar que en un momento dado como máximo una PlantillaDeValoracion tiene el atributo `activa = true`. Cuando el Administrador activa una nueva plantilla para una dimensión, el sistema desactiva automáticamente la que estaba activa para esa misma dimensión. |
| **Condición de violación** | Existencia de dos o más PlantillasDeValoracion con activa = true para la misma dimensión simultáneamente. |
| **Actor responsable** | [ACT-H001] Administrador |

---

## BR-COH-E002 — Unicidad del KPIDeMadurez por Aplicativo y dimensión

| Propiedad | Valor |
|-----------|-------|
| **Épico fuente** | [EP-003] [FT-014] |
| **Entidades concernidas** | [ENT-006] KPIDeMadurez, [ENT-003] Aplicativo |
| **Descripción** | La combinación (aplicativoId, dimension) debe ser única en la tabla de KPIDeMadurez. No pueden existir dos registros KPIDeMadurez para el mismo Aplicativo y la misma DimensionDeMadurez. El sistema rechaza cualquier intento de crear un KPI duplicado para un Aplicativo y dimensión ya registrados. |
| **Condición de violación** | Intento de insertar un KPIDeMadurez con una combinación (aplicativoId, dimension) ya existente. |
| **Actor responsable** | Sistema (invariante técnico garantizado en la capa de persistencia) |

---

## BR-COH-E003 — Integridad referencial de la jerarquía organizativa

| Propiedad | Valor |
|-----------|-------|
| **Épico fuente** | [EP-002] [FT-008], [FT-009], [FT-010] |
| **Entidades concernidas** | [ENT-001] Cliente, [ENT-002] Proyecto, [ENT-003] Aplicativo |
| **Descripción** | No se puede eliminar un Cliente que tenga Proyectos asociados. No se puede eliminar un Proyecto que tenga Aplicativos asociados. La eliminación en cascada no está permitida. El sistema rechaza los intentos de eliminación que violen esta restricción y muestra el recuento de elementos dependientes. |
| **Condición de violación** | Intento de eliminar un Cliente con Proyectos asociados, o un Proyecto con Aplicativos asociados. |
| **Actor responsable** | [ACT-H001] Administrador |

---

## BR-COH-E004 — Unicidad del email de usuario en el sistema

| Propiedad | Valor |
|-----------|-------|
| **Épico fuente** | [EP-002] [FT-012] |
| **Entidades concernidas** | [ENT-012] Usuario |
| **Descripción** | El campo `email` de un Usuario debe ser único en todo el sistema. No pueden existir dos usuarios con el mismo email, ya sean activos o inactivos. El sistema rechaza la creación o modificación de un usuario si el email introducido ya está registrado en otro usuario del sistema. |
| **Condición de violación** | Intento de crear o modificar un usuario con un email ya registrado en el sistema. |
| **Actor responsable** | [ACT-H001] Administrador |

---

## BR-COH-E005 — Inmutabilidad de la vinculación PlanDeAccion–RiesgoTecnico

| Propiedad | Valor |
|-----------|-------|
| **Épico fuente** | [EP-003] [FT-021] |
| **Entidades concernidas** | [ENT-009] PlanDeAccion, [ENT-008] RiesgoTecnico |
| **Descripción** | Una vez creado un PlanDeAccion con su asociación a un RiesgoTecnico, el campo `riesgoTecnicoId` no puede modificarse. La asociación es permanente desde el momento de la creación. El sistema rechaza cualquier intento de cambiar el RiesgoTecnico al que está vinculado un PlanDeAccion. |
| **Condición de violación** | Intento de modificar el campo `riesgoTecnicoId` de un PlanDeAccion ya creado. |
| **Actor responsable** | Sistema (invariante técnico garantizado en la capa de servicio) |

---

## BR-COH-E006 — Tipo AUTOMATICO reservado al sistema

| Propiedad | Valor |
|-----------|-------|
| **Épico fuente** | [EP-003] [FT-020] |
| **Entidades concernidas** | [ENT-008] RiesgoTecnico |
| **Descripción** | Ningún usuario puede crear manualmente un RiesgoTecnico con `tipo = AUTOMATICO`. Los riesgos de tipo AUTOMATICO solo pueden ser creados por el sistema como consecuencia del incumplimiento de una ReglaDecision activa. El sistema rechaza los intentos de creación manual con tipo AUTOMATICO. |
| **Condición de violación** | Intento de un usuario de crear un RiesgoTecnico con tipo = AUTOMATICO. |
| **Actor responsable** | Sistema (control en la capa de servicio) |
