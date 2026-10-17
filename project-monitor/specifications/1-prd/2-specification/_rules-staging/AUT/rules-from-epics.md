# Reglas de Autorización — Staging desde Épicos

> **Origen:** Extracción realizada por agent-epics (ba-2.2) — 2026-04-29
> **IDs temporales:** BR-AUT-Exxx — a consolidar por agent-2.3-rules antes de asignación de IDs definitivos
> **Épicos fuente:** [EP-001], [EP-002], [EP-003]

---

## BR-AUT-E001 — Gestión del catálogo tecnológico reservada al Administrador

| Propiedad | Valor |
|-----------|-------|
| **Épico fuente** | [EP-001] [FT-001] a [FT-007] |
| **Entidades concernidas** | [ENT-004] EntradaCatalogo, [ENT-005] BloqueTematico, [ENT-007] PlantillaDeValoracion, [ENT-011] ReglaDecision |
| **Descripción** | Las operaciones de creación, modificación y eliminación sobre EntradaCatalogo, BloqueTematico, PlantillaDeValoracion y ReglaDecision están reservadas exclusivamente al rol ROL_ADMIN. Los demás roles (Director, Manager, Referente DT) tienen acceso de lectura sobre estas entidades. El sistema rechaza cualquier operación de escritura realizada por un usuario sin ROL_ADMIN. |
| **Condición de violación** | Intento de crear, modificar o eliminar una EntradaCatalogo, BloqueTematico, PlantillaDeValoracion o ReglaDecision por un usuario con rol distinto a ROL_ADMIN. |
| **Referencia** | [ACT-001] §3.1 ROL-001; [EX-001], [EX-002], [EX-008] |

---

## BR-AUT-E002 — Captura de KPIs restringida al Referente DT en sus proyectos asignados

| Propiedad | Valor |
|-----------|-------|
| **Épico fuente** | [EP-003] [FT-014] |
| **Entidades concernidas** | [ENT-006] KPIDeMadurez, [ENT-003] Aplicativo, [ENT-002] Proyecto |
| **Descripción** | La creación y actualización de KPIDeMadurez está permitida únicamente a los usuarios con rol ROL_REFERENTE o ROL_ADMIN, y para ROL_REFERENTE solo en los Aplicativos pertenecientes a los Proyectos que tiene asignados. El sistema verifica la asignación de proyecto antes de permitir cualquier operación de escritura sobre un KPI. |
| **Condición de violación** | Intento de un Referente DT de crear o modificar un KPI de un Aplicativo de un Proyecto no asignado; o intento de un Director o Manager de crear/modificar un KPI. |
| **Referencia** | [ACT-001] §3.1 nota ³; [EX-007] |

---

## BR-AUT-E003 — Eliminación de CasoDeExitoIA restringida al creador o al Administrador

| Propiedad | Valor |
|-----------|-------|
| **Épico fuente** | [EP-003] [FT-016] |
| **Entidades concernidas** | [ENT-010] CasoDeExitoIA, [ENT-012] Usuario |
| **Descripción** | Un CasoDeExitoIA solo puede ser eliminado por el usuario que lo creó (identificado por el campo `creadoPor`) o por un usuario con rol ROL_ADMIN. Cualquier usuario con acceso al proyecto puede crear o editar un caso; la eliminación es la única operación restringida al propietario o al Administrador. |
| **Condición de violación** | Intento de eliminar un CasoDeExitoIA por un usuario que no es ni su creador ni un ROL_ADMIN. |
| **Referencia** | [ACT-001] DEL-001, §3.1 nota ⁶; [EX-009] |

---

## BR-AUT-E004 — Registro de riesgos manuales restringido al Manager en su ámbito

| Propiedad | Valor |
|-----------|-------|
| **Épico fuente** | [EP-003] [FT-021] |
| **Entidades concernidas** | [ENT-008] RiesgoTecnico, [ENT-002] Proyecto |
| **Descripción** | El registro manual de un RiesgoTecnico está permitido a los usuarios con rol ROL_MANAGER (restringido a sus proyectos asignados) y ROL_ADMIN (sin restricción de ámbito). El sistema verifica la asignación de proyecto antes de permitir la creación de un riesgo manual. Los roles ROL_DIRECTOR y ROL_REFERENTE solo tienen acceso de lectura sobre los riesgos técnicos. |
| **Condición de violación** | Intento de un Manager de registrar un riesgo sobre un Aplicativo de un Proyecto no asignado; o intento de un Director o Referente DT de crear un riesgo manual. |
| **Referencia** | [ACT-001] §3.2; [EX-015] |

---

## BR-AUT-E005 — Configuración del árbol de decisión reservada al Administrador

| Propiedad | Valor |
|-----------|-------|
| **Épico fuente** | [EP-003] [FT-019] |
| **Entidades concernidas** | [ENT-011] ReglaDecision |
| **Descripción** | La creación, modificación y eliminación de ReglaDecision está reservada exclusivamente al rol ROL_ADMIN. El rol ROL_DIRECTOR puede proponer modificaciones al Administrador de forma informal, pero no puede ejecutarlas directamente en el sistema. Los demás roles tienen acceso de lectura sobre las reglas configuradas. |
| **Condición de violación** | Intento de crear, modificar o eliminar una ReglaDecision por un usuario con rol distinto a ROL_ADMIN. |
| **Referencia** | [ACT-001] DEL-002, §3.1 nota ⁴; [EX-008] |

---

## BR-AUT-E006 — Gestión de usuarios y asignaciones reservada al Administrador

| Propiedad | Valor |
|-----------|-------|
| **Épico fuente** | [EP-002] [FT-012], [FT-013] |
| **Entidades concernidas** | [ENT-012] Usuario, [ENT-002] Proyecto |
| **Descripción** | El registro de nuevos usuarios, la asignación de roles, la activación/desactivación de cuentas y la vinculación de usuarios a proyectos son operaciones reservadas exclusivamente al rol ROL_ADMIN. Ningún otro rol puede modificar los atributos de un usuario ni sus asignaciones de proyecto. |
| **Condición de violación** | Intento de crear, modificar, desactivar o reasignar a proyectos un usuario por un rol distinto a ROL_ADMIN. |
| **Referencia** | [ACT-001] §3.1 ROL-001; [EX-005] |
