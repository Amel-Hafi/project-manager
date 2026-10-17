---
id: FT-013
title: "Asignación de usuarios a proyectos"
phase: 2-specification
type: feature
status: draft
version: "1.0"
last_updated: 2026-04-30
author: agent-features
lang: es
reviewers: []
epic: EP-002
dependencies: ["EP-002", "FT-009", "FT-012", "GLO-001", "ACT-001", "DOM-001"]
requirements: ["EX-005"]
doc_depth: standard
---

# [FT-013] Asignación de usuarios a proyectos

## Descripción

Esta funcionalidad permite al [ACT-H001] Administrador vincular y desvincular Managers ([ACT-H003]) y Referentes DT ([ACT-H004]) a los proyectos sobre los que tendrán responsabilidad operativa. La asignación define el ámbito en el que cada usuario operacional puede crear o modificar aplicativos, registrar riesgos manuales o casos de éxito de IA. Las asignaciones son la pieza que conecta el control de acceso por rol ([FT-012]) con la jerarquía organizativa ([FT-008] / [FT-009]) y constituyen el mecanismo de filtrado fundamental del sistema. Los usuarios con rol ROL_ADMIN o ROL_DIRECTOR no requieren asignación: su alcance es global por definición.

---

## Detalle de la funcionalidad

| Propiedad | Valor |
|----------|-------|
| **Épico padre** | [EP-002] Cartografía Organizativa y Gestión de Usuarios |
| **Actor principal** | [ACT-H001] Administrador |
| **Actores secundarios** | [ACT-H003] Manager, [ACT-H004] Referente DT (consumen el ámbito asignado) |
| **Prioridad** | Must |
| **Complejidad estimada** | Baja |
| **Requisitos cubiertos** | [EX-005] |
| **Dependencias** | [FT-009], [FT-012] |
| **Entidades concernidas** | [ENT-012] Usuario, [ENT-002] Proyecto |

---

## Reglas de negocio asociadas

| ID regla | Descripción | Tipo |
|---------|-------------|------|
| [BR-VAL-F011] | La asignación requiere un usuario activo y un proyecto existente; ambos campos son obligatorios | BR-VAL |
| [BR-VAL-F012] | La asignación de un usuario a un proyecto sólo es admisible si el rol del usuario es ROL_MANAGER o ROL_REFERENTE | BR-VAL |
| [BR-COH-F007] | La pareja (usuarioId, proyectoId) es única: no pueden existir dos asignaciones idénticas para el mismo usuario y proyecto | BR-COH |
| [BR-AUT-F008] | Sólo el rol ROL_ADMIN puede crear o eliminar asignaciones de usuarios a proyectos | BR-AUT |
| [BR-TRG-F008] | Al desactivar un usuario en [FT-012], sus asignaciones se conservan; al reactivarlo, las asignaciones siguen vigentes (BR-COH-F006) | BR-TRG |

---

## Criterios de aceptación

### FAC-001: Asignación que habilita el alcance operativo

- **Dado** que el Administrador ha creado el usuario "referente02@dt.es" con rol ROL_REFERENTE en [FT-012] y los proyectos "ProyectoAlpha" y "ProyectoBeta" en [FT-009]
- **Cuando** asigna a "referente02@dt.es" únicamente al proyecto "ProyectoAlpha"
- **Entonces** "referente02@dt.es" puede crear y editar aplicativos en "ProyectoAlpha" en [FT-010]
- **Y** dispone de lectura sobre todos los proyectos del sistema conforme al ámbito de su rol (nota ³ de [ACT-001])

### FAC-002: Bloqueo de operación fuera del ámbito asignado

- **Dado** que el Manager "manager01@dt.es" está asignado únicamente a "ProyectoAlpha"
- **Cuando** intenta crear un aplicativo en "ProyectoBeta" (no asignado) y modificar uno en "ProyectoAlpha"
- **Entonces** la creación en "ProyectoBeta" es rechazada con mensaje de acceso denegado
- **Y** la modificación en "ProyectoAlpha" se ejecuta correctamente

### FAC-003: Revocación de asignación y pérdida de alcance

- **Dado** que "referente02@dt.es" tiene una asignación activa al proyecto "ProyectoAlpha" y ha creado aplicativos en él
- **Cuando** el Administrador elimina la asignación
- **Entonces** "referente02@dt.es" pierde la capacidad de crear o modificar aplicativos en "ProyectoAlpha" en su próxima sesión
- **Y** los aplicativos previamente creados permanecen intactos y siguen visibles en lectura

### FAC-004: Rechazo de asignación sobre rol no operacional

- **Dado** que el usuario "director01@dt.es" tiene rol ROL_DIRECTOR
- **Cuando** el Administrador intenta asignarlo a "ProyectoAlpha"
- **Entonces** el sistema rechaza la asignación porque el rol del usuario no es ROL_MANAGER ni ROL_REFERENTE
- **Y** "director01@dt.es" mantiene su acceso de lectura global por la naturaleza de su rol

### FAC-005: Unicidad de la pareja usuario-proyecto

- **Dado** que "referente02@dt.es" ya está asignado a "ProyectoAlpha"
- **Cuando** el Administrador intenta crear una segunda asignación idéntica (mismo usuario y proyecto)
- **Entonces** el sistema rechaza la operación con un mensaje de asignación duplicada
- **Y** la asignación previa permanece intacta

---

## Historias de usuario

> Sección poblada por `agent-3.1-user-stories.md`. Listada aquí para trazabilidad.

| ID historia | Título | Prioridad |
|----------|-------|----------|
| [US-xxx] | *(por crear)* | Must |

---

## Fronteras funcionales

**En alcance:**
- Creación y eliminación de asignaciones N:N entre usuarios (Manager / Referente DT) y proyectos
- Validación del rol operacional y de la unicidad de la pareja usuario-proyecto
- Aplicación efectiva del ámbito en las funcionalidades dependientes (especialmente [FT-010])

**Fuera de alcance:**
- Atributos extendidos sobre la asignación (fecha de inicio, fecha de fin, rol específico por proyecto) — ver PAT-DOM-005 de [DOM-001]
- Histórico de asignaciones (sólo se conserva el estado vigente)
- Asignaciones automáticas o sincronización con sistemas HR externos
- Notificaciones automáticas al usuario asignado o desasignado

---

## Puntos de atención

| ID | Punto | Descripción |
|----|-------|-------------|
| PA-001 | Modelo simple sin entidad intermedia | PAT-DOM-005 de [DOM-001] indica que la relación N:N entre Usuario y Proyecto se modela sin entidad intermedia. Si en fases posteriores se necesitan atributos sobre la asignación, deberá crearse [ENT-013] AsignacionProyecto. |
| PA-002 | Proyectos sin Manager asignado | HYP-007 de [VIS-001] y ESC-001 de [ACT-001] tratan el caso de un proyecto sin Manager asignado: la regla actual no impone obligatoriedad. La gestión provisional la asume el Administrador. Pendiente de confirmación del sponsor (PAT-EP002-01 / PAT-003 de [ACT-001]). |
| PA-003 | Asignación múltiple por usuario | El modelo soporta múltiples proyectos por usuario; el sistema debe permitir gestionar la lista completa de asignaciones de forma eficiente cuando un Manager o Referente DT cubre varios proyectos. |
