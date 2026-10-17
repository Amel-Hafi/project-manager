---
id: FT-012
title: "Perfiles y roles de usuario"
phase: 2-specification
type: feature
status: draft
version: "1.0"
last_updated: 2026-04-30
author: agent-features
lang: es
reviewers: []
epic: EP-002
dependencies: ["EP-002", "FT-011", "GLO-001", "ACT-001", "DOM-001"]
requirements: ["EX-005"]
doc_depth: standard
---

# [FT-012] Perfiles y roles de usuario

## Descripción

Esta funcionalidad permite al [ACT-H001] Administrador gestionar el ciclo de vida completo de los usuarios del sistema: alta, edición, asignación de rol (ROL_ADMIN, ROL_DIRECTOR, ROL_MANAGER, ROL_REFERENTE), desactivación y reactivación. Los usuarios constituyen la entidad transversal sobre la que se aplica la autenticación OIDC ([FT-011]) y el control de acceso por rol y por ámbito de proyecto ([FT-013]). El sistema garantiza la unicidad del email y conserva los registros y asignaciones de los usuarios desactivados para preservar la trazabilidad histórica.

---

## Detalle de la funcionalidad

| Propiedad | Valor |
|----------|-------|
| **Épico padre** | [EP-002] Cartografía Organizativa y Gestión de Usuarios |
| **Actor principal** | [ACT-H001] Administrador |
| **Actores secundarios** | — |
| **Prioridad** | Must |
| **Complejidad estimada** | Media |
| **Requisitos cubiertos** | [EX-005] |
| **Dependencias** | [FT-011] |
| **Entidades concernidas** | [ENT-012] Usuario |

---

## Reglas de negocio asociadas

| ID regla | Descripción | Tipo |
|---------|-------------|------|
| [BR-VAL-F008] | El nombre del usuario es obligatorio (máx. 200 caracteres, no vacío) | BR-VAL |
| [BR-VAL-F009] | El email debe tener formato válido y ser único en el sistema (INV-010 de [DOM-001]) | BR-VAL |
| [BR-VAL-F010] | El campo rol es obligatorio y debe corresponder a uno de los valores del enum REF-007: ROL_ADMIN, ROL_DIRECTOR, ROL_MANAGER, ROL_REFERENTE | BR-VAL |
| [BR-AUT-F007] | Sólo el rol ROL_ADMIN puede crear, modificar, desactivar o reactivar usuarios | BR-AUT |
| [BR-COH-F006] | Al desactivar un usuario, sus registros y asignaciones a proyectos se conservan inalterados; el usuario pierde el acceso al sistema | BR-COH |
| [BR-TRG-F006] | Al crear un usuario, el campo activo se establece automáticamente a true (valor por defecto) | BR-TRG |
| [BR-TRG-F007] | Al crear o modificar un usuario, el sistema asigna automáticamente fechaCreacion y fechaModificacion | BR-TRG |

---

## Criterios de aceptación

### FAC-001: Alta de usuario con rol y acceso inmediato

- **Dado** que el Administrador "admin01@dt.es" está autenticado
- **Cuando** registra al usuario "referente02@dt.es" con nombre "Ana Referente", rol ROL_REFERENTE y activo=true
- **Entonces** el usuario queda persistido con identificador único y fechas asignadas
- **Y** "referente02@dt.es" puede iniciar sesión vía [FT-011] inmediatamente, accediendo en lectura global a los proyectos del sistema según los permisos de su rol

### FAC-002: Unicidad de email

- **Dado** que el usuario "manager01@dt.es" ya existe en el sistema
- **Cuando** el Administrador intenta crear un segundo usuario con el mismo email
- **Entonces** el sistema rechaza la creación con un mensaje de email ya registrado
- **Y** el usuario existente no se ve afectado

### FAC-003: Desactivación y reactivación con preservación de historial

- **Dado** que la usuaria "referente02@dt.es" ha registrado KPIs y casos de éxito de IA en proyectos asignados
- **Cuando** el Administrador desactiva su cuenta (activo=false)
- **Entonces** "referente02@dt.es" pierde el acceso al sistema en su próximo intento de autenticación ([FT-011] FAC-003)
- **Y** todos sus registros, asignaciones a proyectos y casos de éxito quedan intactos
- **Y** si el Administrador la reactiva (activo=true), recupera el acceso con sus asignaciones previas

### FAC-004: Restricción de gestión a ROL_ADMIN

- **Dado** que el Manager "manager01@dt.es" está autenticado
- **Cuando** intenta acceder a la lista de usuarios o crear un nuevo usuario
- **Entonces** el sistema rechaza la acción por falta de permisos (sólo ROL_ADMIN tiene CRUD sobre usuarios según la matriz de [ACT-001] §3.1)

### FAC-005: Cambio de rol del usuario

- **Dado** que la usuaria "referente02@dt.es" tiene rol ROL_REFERENTE
- **Cuando** el Administrador cambia su rol a ROL_MANAGER
- **Entonces** la próxima sesión de la usuaria aplica los permisos del nuevo rol
- **Y** sus asignaciones a proyectos previas se mantienen, ajustándose al alcance operativo del nuevo rol

---

## Historias de usuario

> Sección poblada por `agent-3.1-user-stories.md`. Listada aquí para trazabilidad.

| ID historia | Título | Prioridad |
|----------|-------|----------|
| [US-xxx] | *(por crear)* | Must |

---

## Fronteras funcionales

**En alcance:**
- Alta, consulta, modificación, desactivación y reactivación de usuarios por el Administrador
- Asignación y modificación del rol del usuario
- Validación de unicidad del email y formato
- Conservación de registros y asignaciones tras desactivación

**Fuera de alcance:**
- Asignación de usuarios a proyectos (cubierta en [FT-013])
- Aprovisionamiento automático desde el proveedor OIDC (gestión manual)
- Gestión de contraseñas o credenciales (delegada al proveedor OIDC en [FT-011])
- Eliminación física de usuarios (sólo desactivación lógica, conforme a [DOM-001])
- Histórico de cambios de rol del usuario

---

## Puntos de atención

| ID | Punto | Descripción |
|----|-------|-------------|
| PA-001 | Visibilidad del Director sobre la lista de usuarios | PAT-004 de [ACT-001] indica que la visibilidad de lectura del Director sobre los usuarios del sistema requiere confirmación. La especificación actual mantiene la restricción a ROL_ADMIN. |
| PA-002 | Asignación múltiple de roles | La nota de [ACT-001] §2 admite que un mismo actor humano pueda tener varios roles, pero el modelo actual de [ENT-012] sólo soporta un rol por usuario. La gestión de múltiples roles por usuario queda fuera del MVP. |
