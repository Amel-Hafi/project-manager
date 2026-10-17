---
id: FT-009
title: "Gestión de proyectos"
phase: 2-specification
type: feature
status: draft
version: "1.0"
last_updated: 2026-04-30
author: agent-features
lang: es
reviewers: []
epic: EP-002
dependencies: ["EP-002", "FT-008", "GLO-001", "ACT-001", "DOM-001"]
requirements: ["EX-003"]
doc_depth: standard
---

# [FT-009] Gestión de proyectos

## Descripción

Esta funcionalidad permite al [ACT-H001] Administrador crear, modificar, consultar y eliminar los proyectos asociados a un cliente, constituyendo la segunda capa de la jerarquía organizativa Cliente > Proyecto > Aplicativo. Cada proyecto agrupa uno o varios aplicativos desarrollados o mantenidos bajo un mismo contrato o iniciativa. La existencia de proyectos válidos es prerrequisito para registrar aplicativos y para asignar a Managers y Referentes DT a su ámbito operativo.

---

## Detalle de la funcionalidad

| Propiedad | Valor |
|----------|-------|
| **Épico padre** | [EP-002] Cartografía Organizativa y Gestión de Usuarios |
| **Actor principal** | [ACT-H001] Administrador |
| **Actores secundarios** | [ACT-H002] Director (lectura), [ACT-H003] Manager (lectura sobre proyectos asignados), [ACT-H004] Referente DT (lectura global) |
| **Prioridad** | Must |
| **Complejidad estimada** | Baja |
| **Requisitos cubiertos** | [EX-003] |
| **Dependencias** | [FT-008] |
| **Entidades concernidas** | [ENT-002] Proyecto, [ENT-001] Cliente, [ENT-003] Aplicativo |

---

## Reglas de negocio asociadas

| ID regla | Descripción | Tipo |
|---------|-------------|------|
| [BR-VAL-F002] | El nombre del proyecto es obligatorio, máximo 200 caracteres y no puede estar vacío | BR-VAL |
| [BR-VAL-F003] | El campo clienteId es obligatorio y debe corresponder a un cliente existente | BR-VAL |
| [BR-COH-F002] | No se puede eliminar un proyecto que tenga aplicativos asociados | BR-COH |
| [BR-COH-F003] | Un proyecto debe pertenecer a exactamente un cliente; el clienteId no puede modificarse tras la creación | BR-COH |
| [BR-AUT-F002] | Sólo el rol ROL_ADMIN puede crear, modificar o eliminar proyectos | BR-AUT |
| [BR-TRG-F002] | Al crear o modificar un proyecto, el sistema asigna automáticamente las marcas de tiempo fechaCreacion y fechaModificacion | BR-TRG |

---

## Criterios de aceptación

### FAC-001: Alta del proyecto bajo un cliente existente

- **Dado** que el Administrador "admin01@dt.es" ha creado el cliente "ClienteAlpha" en [FT-008]
- **Cuando** registra el proyecto "ProyectoAlpha" con descripción "Plataforma de banca digital" bajo "ClienteAlpha"
- **Entonces** el proyecto queda persistido con un identificador único, asociado a "ClienteAlpha", con fechaCreacion y fechaModificacion asignadas
- **Y** "ProyectoAlpha" está disponible inmediatamente para registrar aplicativos en [FT-010] y para asignar usuarios en [FT-013]

### FAC-002: Rechazo del alta sin cliente válido

- **Dado** que el Administrador intenta crear el proyecto "ProyectoHuerfano"
- **Cuando** envía el formulario sin clienteId o con un clienteId inexistente
- **Entonces** el sistema rechaza la operación con un mensaje de validación
- **Y** ningún proyecto huérfano queda persistido

### FAC-003: Eliminación bloqueada cuando el proyecto tiene aplicativos

- **Dado** que el proyecto "ProyectoAlpha" tiene asociado el aplicativo "AppAlpha" creado en [FT-010]
- **Cuando** el Administrador intenta eliminar "ProyectoAlpha"
- **Entonces** el sistema rechaza la operación indicando que existen aplicativos asociados
- **Y** "ProyectoAlpha" y "AppAlpha" permanecen intactos

### FAC-004: Visibilidad por rol y ámbito

- **Dado** que existen los proyectos "ProyectoAlpha" (cliente A), "ProyectoBeta" (cliente A) y "ProyectoGamma" (cliente B)
- **Cuando** el Manager "manager01@dt.es" (asignado solo a "ProyectoAlpha") consulta la lista de proyectos
- **Entonces** sólo visualiza "ProyectoAlpha" en lectura
- **Y** el Referente DT "referente01@dt.es" (asignado a "ProyectoAlpha") visualiza los tres proyectos en lectura global, conforme a la nota ³ de [ACT-001] §3.1

---

## Historias de usuario

> Sección poblada por `agent-3.1-user-stories.md`. Listada aquí para trazabilidad.

| ID historia | Título | Prioridad |
|----------|-------|----------|
| [US-xxx] | *(por crear)* | Must |

---

## Fronteras funcionales

**En alcance:**
- Alta, consulta, modificación y eliminación de proyectos bajo un cliente
- Validación de existencia del cliente padre y del nombre obligatorio
- Bloqueo de eliminación cuando existen aplicativos asociados
- Lectura por roles según ámbito (Manager: proyectos asignados; Referente DT: lectura global; Director: lectura total)

**Fuera de alcance:**
- Edición de metadatos del proyecto por el Manager (ver PAT-EP002-02 de [EP-002] — pendiente de validación del sponsor)
- Cambio de cliente padre tras la creación del proyecto
- Histórico de modificaciones del proyecto
- Atributos contractuales del proyecto (presupuesto, fechas de contrato, etc.) no contemplados en [DOM-001]
- Carga masiva inicial (ver PAT-EP002-03 de [EP-002])

---

## Puntos de atención

| ID | Punto | Descripción |
|----|-------|-------------|
| PA-001 | Edición de metadatos por el Manager | PAT-002 de [ACT-001] y PAT-EP002-02 de [EP-002] indican que la decisión sobre si el Manager puede editar nombre/descripción del proyecto está pendiente de validación. La especificación actual asume sólo lectura. |
| PA-002 | Reasignación de cliente padre | El modelo actual no permite cambiar el clienteId tras la creación. Si la operación es necesaria en producción, deberá especificarse en una funcionalidad posterior. |
