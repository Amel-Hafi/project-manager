# Reglas de Validación — Staging desde Épicos

> **Origen:** Extracción realizada por agent-epics (ba-2.2) — 2026-04-29
> **IDs temporales:** BR-VAL-Exxx — a consolidar por agent-2.3-rules antes de asignación de IDs definitivos
> **Épicos fuente:** [EP-001], [EP-002], [EP-003]

---

## BR-VAL-E001 — Campos obligatorios de una EntradaCatalogo

| Propiedad | Valor |
|-----------|-------|
| **Épico fuente** | [EP-001] [FT-001] |
| **Entidades concernidas** | [ENT-004] EntradaCatalogo, [ENT-005] BloqueTematico |
| **Descripción** | Al crear o modificar una EntradaCatalogo, el sistema debe validar que los campos `nombre` (máx. 200 caracteres, no vacío), `bloqueTematicoId` (FK a BloqueTematico existente), `tipoPropiedad` y `estado` están presentes y cumplen sus restricciones antes de persistir el registro. |
| **Condición de rechazo** | nombre vacío, o bloqueTematicoId referencia a un BloqueTematico inexistente, o tipoPropiedad fuera de los valores de REF-003, o estado fuera de los valores de REF-002. |
| **Actor responsable** | [ACT-H001] Administrador |

---

## BR-VAL-E002 — Rango y obligatoriedad condicional del valor de un KPIDeMadurez

| Propiedad | Valor |
|-----------|-------|
| **Épico fuente** | [EP-003] [FT-014] |
| **Entidades concernidas** | [ENT-006] KPIDeMadurez |
| **Descripción** | Al registrar o actualizar un KPIDeMadurez, si el campo `valor` no es nulo debe ser un entero entre 1 y 10 inclusive. Si `valor` no es nulo, los campos `fechaEvaluacion` y `justificacion` son obligatorios. Si `valor` es nulo, `fechaEvaluacion` y `justificacion` deben estar ausentes o nulos. |
| **Condición de rechazo** | valor fuera del rango 1-10 (y no nulo); o valor no nulo con fechaEvaluacion o justificacion ausentes; o valor nulo con fechaEvaluacion o justificacion presentes. |
| **Actor responsable** | [ACT-H004] Referente DT |

---

## BR-VAL-E003 — Campos obligatorios de un Usuario

| Propiedad | Valor |
|-----------|-------|
| **Épico fuente** | [EP-002] [FT-012] |
| **Entidades concernidas** | [ENT-012] Usuario |
| **Descripción** | Al crear un Usuario, el sistema debe validar que `nombre` (máx. 200 caracteres, no vacío), `email` (formato e-mail válido, único en el sistema) y `rol` (valor de REF-007) están presentes y son válidos. |
| **Condición de rechazo** | nombre vacío o supera 200 caracteres; email con formato inválido; email ya registrado en el sistema; rol fuera de los valores de REF-007. |
| **Actor responsable** | [ACT-H001] Administrador |

---

## BR-VAL-E004 — Campos obligatorios de un RiesgoTecnico manual

| Propiedad | Valor |
|-----------|-------|
| **Épico fuente** | [EP-003] [FT-021] |
| **Entidades concernidas** | [ENT-008] RiesgoTecnico |
| **Descripción** | Al registrar manualmente un RiesgoTecnico, el sistema debe validar que `titulo` (máx. 200 caracteres, no vacío), `descripcion` (máx. 2000 caracteres, no vacío) y `aplicativoId` (FK a Aplicativo existente accesible en el ámbito del usuario) están presentes y son válidos. El campo `tipo` debe ser forzado a MANUAL. |
| **Condición de rechazo** | titulo vacío; descripcion vacía; aplicativoId inexistente o fuera del ámbito del Manager; tipo distinto de MANUAL. |
| **Actor responsable** | [ACT-H003] Manager, [ACT-H001] Administrador |

---

## BR-VAL-E005 — Campos obligatorios de un PlanDeAccion

| Propiedad | Valor |
|-----------|-------|
| **Épico fuente** | [EP-003] [FT-021] |
| **Entidades concernidas** | [ENT-009] PlanDeAccion, [ENT-008] RiesgoTecnico |
| **Descripción** | Al crear un PlanDeAccion, el sistema debe validar que `descripcion` (máx. 2000 caracteres, no vacío), `responsable` (máx. 200 caracteres, no vacío), `plazo` (fecha posterior a la fecha de creación) y `riesgoTecnicoId` (FK a RiesgoTecnico existente) están presentes y son válidos. |
| **Condición de rechazo** | descripcion vacía; responsable vacío; plazo anterior o igual a la fecha actual; riesgoTecnicoId inexistente. |
| **Actor responsable** | [ACT-H003] Manager, [ACT-H001] Administrador |

---

## BR-VAL-E006 — Campos obligatorios de un CasoDeExitoIA

| Propiedad | Valor |
|-----------|-------|
| **Épico fuente** | [EP-003] [FT-016] |
| **Entidades concernidas** | [ENT-010] CasoDeExitoIA, [ENT-002] Proyecto |
| **Descripción** | Al crear un CasoDeExitoIA, el sistema debe validar que `titulo` (máx. 200 caracteres, no vacío), `descripcion` (máx. 5000 caracteres, no vacío), `fecha` (no posterior a la fecha actual) y `proyectoId` (FK a Proyecto accesible en el ámbito del usuario) están presentes y son válidos. |
| **Condición de rechazo** | titulo vacío; descripcion vacía; fecha posterior a la fecha actual; proyectoId inexistente o fuera del ámbito del usuario. |
| **Actor responsable** | [ACT-H003] Manager, [ACT-H004] Referente DT |
