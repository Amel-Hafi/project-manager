---
id: FT-008
title: "Gestión de clientes"
phase: 2-specification
type: feature
status: draft
version: "1.0"
last_updated: 2026-04-30
author: agent-features
lang: es
reviewers: []
epic: EP-002
dependencies: ["EP-002", "GLO-001", "ACT-001", "DOM-001"]
requirements: ["EX-003"]
doc_depth: standard
---

# [FT-008] Gestión de clientes

## Descripción

Esta funcionalidad permite al [ACT-H001] Administrador crear, modificar, consultar y eliminar los clientes que constituyen la primera capa de la jerarquía organizativa Cliente > Proyecto > Aplicativo. Cada cliente representa una organización interna o externa para la que la Dirección Técnica desarrolla o mantiene proyectos. El mantenimiento del catálogo de clientes es prerrequisito para poder registrar proyectos y, en cascada, aplicativos en el sistema. Los demás roles disponen de acceso de lectura sobre los clientes según su ámbito.

---

## Detalle de la funcionalidad

| Propiedad | Valor |
|----------|-------|
| **Épico padre** | [EP-002] Cartografía Organizativa y Gestión de Usuarios |
| **Actor principal** | [ACT-H001] Administrador |
| **Actores secundarios** | [ACT-H002] Director, [ACT-H003] Manager, [ACT-H004] Referente DT (lectura) |
| **Prioridad** | Must |
| **Complejidad estimada** | Baja |
| **Requisitos cubiertos** | [EX-003] |
| **Dependencias** | — |
| **Entidades concernidas** | [ENT-001] Cliente, [ENT-002] Proyecto |

---

## Reglas de negocio asociadas

| ID regla | Descripción | Tipo |
|---------|-------------|------|
| [BR-VAL-F001] | El nombre del cliente es obligatorio, máximo 200 caracteres y no puede estar vacío | BR-VAL |
| [BR-COH-F001] | No se puede eliminar un cliente que tenga proyectos asociados | BR-COH |
| [BR-AUT-F001] | Sólo el rol ROL_ADMIN puede crear, modificar o eliminar clientes; los demás roles tienen acceso de lectura | BR-AUT |
| [BR-TRG-F001] | Al crear o modificar un cliente, el sistema asigna automáticamente las marcas de tiempo fechaCreacion y fechaModificacion | BR-TRG |

---

## Criterios de aceptación

### FAC-001: Alta y consulta del cliente por el Administrador

- **Dado** que el Administrador "admin01@dt.es" está autenticado en el sistema
- **Cuando** registra el cliente "ClienteAlpha" con descripción "Cliente del sector banca" y guarda el formulario
- **Entonces** el cliente queda persistido con un identificador único y aparece en la lista de clientes con la fecha de creación correspondiente
- **Y** el cliente está disponible inmediatamente como destino para registrar nuevos proyectos en [FT-009]

### FAC-002: Eliminación bloqueada cuando el cliente tiene proyectos

- **Dado** que el cliente "ClienteAlpha" tiene asociado el proyecto "ProyectoAlpha" creado en [FT-009]
- **Cuando** el Administrador intenta eliminar "ClienteAlpha"
- **Entonces** el sistema rechaza la operación con un mensaje que indica que el cliente contiene proyectos asociados
- **Y** "ClienteAlpha" permanece intacto, así como su jerarquía descendente

### FAC-003: Acceso de lectura por roles no administradores

- **Dado** que existen los clientes "ClienteAlpha" y "ClienteBeta" con sus respectivos proyectos
- **Cuando** el Manager "manager01@dt.es" (asignado únicamente a un proyecto de "ClienteAlpha") consulta la lista de clientes
- **Entonces** sólo visualiza "ClienteAlpha" en lectura (visibilidad por proyecto asignado)
- **Y** no dispone de las acciones de creación, modificación ni eliminación

### FAC-004: Modificación con trazabilidad temporal

- **Dado** el cliente "ClienteAlpha" creado el 2026-04-01
- **Cuando** el Administrador modifica su descripción el 2026-04-30
- **Entonces** el campo fechaModificacion se actualiza automáticamente al instante de la operación
- **Y** la fechaCreacion permanece inalterada

---

## Historias de usuario

> Sección poblada por `agent-3.1-user-stories.md`. Listada aquí para trazabilidad.

| ID historia | Título | Prioridad |
|----------|-------|----------|
| [US-xxx] | *(por crear)* | Must |

---

## Fronteras funcionales

**En alcance:**
- Alta, consulta, modificación y eliminación de clientes por el Administrador
- Lectura de clientes por los demás roles según su ámbito de visibilidad
- Validación del nombre obligatorio y de la integridad jerárquica al eliminar
- Registro automático de marcas de tiempo de creación y modificación

**Fuera de alcance:**
- Carga masiva inicial de clientes desde scripts externos (ver PAT-EP002-03 de [EP-002])
- Atributos extendidos del cliente (sector, contacto comercial, etc.) no contemplados en [DOM-001]
- Histórico de modificaciones de los datos del cliente
- Notificaciones automáticas sobre cambios en clientes

---

## Puntos de atención

| ID | Punto | Descripción |
|----|-------|-------------|
| PA-001 | Visibilidad implícita de clientes por proyectos asignados | La nota ¹ de [ACT-001] §3.1 establece que ROL-MANAGER ve sólo los clientes de sus proyectos asignados, mientras que ROL-REFERENTE ve todos los clientes (lectura global). Debe quedar claro en las historias de usuario para no producir ambigüedad de visibilidad. |
| PA-002 | Carga inicial de clientes existentes | El proceso de migración de los clientes ya gestionados por la DT no está definido (ver PAT-EP002-03 de [EP-002] y OUT-005 de [VIS-001]). |
