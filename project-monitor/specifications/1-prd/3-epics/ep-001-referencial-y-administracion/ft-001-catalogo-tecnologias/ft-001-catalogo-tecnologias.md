---
id: FT-001
title: "Catálogo de tecnologías — gestión general"
phase: 2-specification
type: feature
status: draft
version: "1.0"
last_updated: 2026-04-30
author: agent-features
reviewers: []
epic: EP-001
dependencies: ["EP-001", "GLO-001", "ACT-001", "DOM-001"]
requirements: ["EX-001"]
doc_depth: standard
---

# [FT-001] Catálogo de tecnologías — gestión general

## Descripción

Esta funcionalidad permite al Administrador construir y mantener el catálogo tecnológico de referencia de la Dirección Técnica, mediante la gestión genérica de los Bloques Temáticos y de las Entradas del Catálogo. Constituye la capa estructural que sirve de base a las funcionalidades [FT-002] a [FT-005] (bloques temáticos específicos) y a [FT-006] y [FT-007] (plantillas y ciclo de vida). Cubre la creación, modificación, consulta y listado paginado de entradas de cualquier bloque, así como la consulta del catálogo completo en modo lectura por todos los demás roles del sistema.

---

## Detalles de la funcionalidad

| Propiedad | Valor |
|-----------|-------|
| **Épico padre** | [EP-001] Gestión del Referencial y Administración del Sistema |
| **Actor principal** | [ACT-H001] Administrador |
| **Actores secundarios** | [ACT-H002] Director, [ACT-H003] Manager, [ACT-H004] Referente DT (lectura) |
| **Prioridad** | Must |
| **Complejidad estimada** | Media |
| **Requisitos cubiertos** | [EX-001] |
| **Dependencias** | — |
| **Entidades concernidas** | [ENT-004] EntradaCatalogo, [ENT-005] BloqueTematico |

---

## Reglas de negocio asociadas

| ID Regla | Descripción | Tipo |
|----------|-------------|------|
| [BR-VAL-F001] | El nombre de una EntradaCatalogo es obligatorio, con un máximo de 200 caracteres y no vacío | BR-VAL |
| [BR-VAL-F002] | El bloqueTematicoId de una EntradaCatalogo debe corresponder a un BloqueTematico existente | BR-VAL |
| [BR-VAL-F003] | El nombre de un BloqueTematico es único en el sistema, máx. 100 caracteres | BR-VAL |
| [BR-AUT-F001] | Solo el Administrador puede crear, modificar o eliminar Entradas del Catálogo y Bloques Temáticos | BR-AUT |
| [BR-AUT-F002] | El Director, el Manager y el Referente DT solo pueden consultar el catálogo en modo lectura | BR-AUT |
| [BR-TRG-F001] | Al crear una EntradaCatalogo, el sistema asigna automáticamente el estado "activo" por defecto | BR-TRG |

---

## Criterios de aceptación

### FAC-001: Creación de una entrada del catálogo en un bloque temático existente

- **Dado** que el Administrador ha iniciado sesión y existe el bloque temático "Stack Tecnológico"
- **Cuando** registra una nueva EntradaCatalogo con nombre "Java 21", bloque "Stack Tecnológico" y tipo de propiedad "corporativo"
- **Entonces** la entrada queda registrada con estado "activo" y fecha de creación automática
- **Y** aparece en el listado de entradas del bloque "Stack Tecnológico"

### FAC-002: Consulta paginada del catálogo completo con 350 entradas

- **Dado** que el catálogo contiene 350 entradas distribuidas en 7 bloques temáticos
- **Cuando** el Referente DT accede a la vista de catálogo y filtra por el bloque "Herramientas CI"
- **Entonces** obtiene la lista paginada de las entradas activas del bloque, ordenadas alfabéticamente, con tiempo de respuesta inferior a 5 segundos

### FAC-003: Modificación del nombre de una entrada utilizada por aplicativos activos

- **Dado** que existe una entrada "Jenkins 2.4" del bloque "Herramientas CI" asociada a 12 aplicativos
- **Cuando** el Administrador modifica su nombre a "Jenkins 2.5"
- **Entonces** el cambio se aplica con éxito, la fechaModificacion se actualiza automáticamente
- **Y** los 12 aplicativos asociados conservan su asociación con la misma entrada renombrada

### FAC-004: Restricción de acceso por rol no autorizado

- **Dado** que el Manager ha iniciado sesión
- **Cuando** intenta crear una nueva EntradaCatalogo
- **Entonces** el sistema rechaza la operación con error de autorización
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
- Operaciones CRUD genéricas sobre Entradas del Catálogo (crear, leer, modificar)
- Gestión de los Bloques Temáticos (crear, modificar, ordenar)
- Listado paginado y filtrado por bloque temático y estado
- Consulta en modo lectura para todos los roles autenticados

**Fuera del alcance:**
- El ciclo de vida de las entradas (dar de baja / reactivar) — gestionado en [FT-007]
- Las particularidades específicas de cada bloque temático (atributos adicionales como TipoDeEntorno) — cubiertas en [FT-002] a [FT-005]
- La gestión de las plantillas de valoración — cubierta en [FT-006]
- La importación masiva inicial del catálogo — fuera del MVP

---

## Puntos de atención

> [PA-001] El comportamiento de la modificación del bloqueTematicoId de una entrada existente (cambio de bloque) no está definido. Por defecto se asume que el bloque de una entrada es inmutable tras la creación. Pendiente de confirmación.
> [PA-002] La política de eliminación física de Entradas del Catálogo no está especificada. El MVP asume que las entradas no se eliminan físicamente; solo se dan de baja (ver [FT-007]).
> [PA-003] El ordenamiento de los Bloques Temáticos en la interfaz se basa en el atributo `orden` ([ENT-005]); el procedimiento de reordenación por el Administrador queda por especificar en las historias de usuario.
