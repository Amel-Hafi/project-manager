---
id: FT-002
title: "Herramientas de ejecución local y stack tecnológico"
phase: 2-specification
type: feature
status: draft
version: "1.0"
last_updated: 2026-04-30
author: agent-features
reviewers: []
epic: EP-001
dependencies: ["EP-001", "FT-001", "GLO-001", "ACT-001", "DOM-001"]
requirements: ["EX-001"]
doc_depth: standard
---

# [FT-002] Herramientas de ejecución local y stack tecnológico

## Descripción

Esta funcionalidad puebla los bloques temáticos relativos al puesto de trabajo del desarrollador y al stack tecnológico de los aplicativos. Permite al Administrador registrar las herramientas de ejecución local (IDEs, sistemas operativos, gestores de paquetes, terminales y utilidades de desarrollo) así como los lenguajes de programación, frameworks y librerías que componen el stack técnico de los aplicativos. Es la primera funcionalidad de bloque temático poblado y valida el patrón establecido en [FT-001] para los bloques siguientes.

---

## Detalles de la funcionalidad

| Propiedad | Valor |
|-----------|-------|
| **Épico padre** | [EP-001] Gestión del Referencial y Administración del Sistema |
| **Actor principal** | [ACT-H001] Administrador |
| **Actores secundarios** | [ACT-H004] Referente DT (lectura para descripción técnica de aplicativos) |
| **Prioridad** | Must |
| **Complejidad estimada** | Baja |
| **Requisitos cubiertos** | [EX-001] |
| **Dependencias** | [FT-001] |
| **Entidades concernidas** | [ENT-004] EntradaCatalogo, [ENT-005] BloqueTematico |

---

## Reglas de negocio asociadas

| ID Regla | Descripción | Tipo |
|----------|-------------|------|
| [BR-VAL-F004] | El bloque temático "Puesto de trabajo" debe existir como BloqueTematico activo en el sistema | BR-VAL |
| [BR-VAL-F005] | El bloque temático "Stack Tecnológico" debe existir como BloqueTematico activo en el sistema | BR-VAL |
| [BR-VAL-F006] | El tipoPropiedad de una entrada del bloque "Puesto de trabajo" debe ser "corporativo" | BR-VAL |
| [BR-AUT-F003] | Solo el Administrador puede registrar entradas en los bloques "Puesto de trabajo" y "Stack Tecnológico" | BR-AUT |

---

## Criterios de aceptación

### FAC-001: Registro de un lenguaje de programación en el bloque Stack Tecnológico

- **Dado** que el Administrador ha iniciado sesión y existe el BloqueTematico "Stack Tecnológico"
- **Cuando** registra una entrada con nombre "Python 3.12", descripción "Lenguaje interpretado de propósito general" y tipoPropiedad "corporativo"
- **Entonces** la entrada queda disponible en el catálogo en estado "activo"
- **Y** puede ser asociada a aplicativos en la cartografía técnica

### FAC-002: Registro de una herramienta de ejecución local

- **Dado** que existe el BloqueTematico "Puesto de trabajo"
- **Cuando** el Administrador registra la entrada "IntelliJ IDEA Ultimate" con tipoPropiedad "corporativo"
- **Entonces** la entrada queda registrada y aparece en el listado del bloque "Puesto de trabajo"
- **Y** los Referentes DT pueden seleccionarla al describir el puesto de trabajo de sus aplicativos

### FAC-003: Cobertura completa del stack típico de la DT

- **Dado** que el Administrador ha cargado las entradas iniciales del bloque "Stack Tecnológico"
- **Cuando** el Referente DT describe el stack de un aplicativo Java/Spring sobre PostgreSQL
- **Entonces** encuentra en el catálogo entradas correspondientes al lenguaje, framework, librerías principales y motor de base de datos sin necesidad de solicitar la creación de entradas adicionales

---

## Historias de usuario

> Sección rellenada por agent-3.1 (System 3). Listada aquí para trazabilidad.

| ID Historia | Título | Prioridad |
|-------------|--------|-----------|
| [US-xxx] | *(por crear)* | Must |

---

## Límites funcionales

**Dentro del alcance:**
- Registro y mantenimiento de entradas en el bloque "Stack Tecnológico" (lenguajes, frameworks, librerías, motores BD)
- Registro y mantenimiento de entradas en el bloque "Puesto de trabajo" (IDEs, OS, gestores de paquetes, terminales, utilidades)
- Aplicación de las restricciones de tipoPropiedad pertinentes a cada bloque

**Fuera del alcance:**
- Las herramientas de CI y seguridad — cubiertas en [FT-003]
- Las herramientas de CD, IaC y de IA — cubiertas en [FT-004]
- Los entornos de infraestructura — cubiertos en [FT-005]
- La detección automática del stack desde el código fuente del aplicativo (fuera del MVP)

---

## Puntos de atención

> [PA-001] La lista inicial concreta de entradas a poblar en cada bloque depende del inventario actual de la DT y debe ser facilitada por el sponsor antes del arranque (ver ATT-003 de [VIS-001]).
> [PA-002] La distinción entre "lenguaje", "framework" y "librería" dentro del bloque Stack Tecnológico no se modela como atributo separado; queda implícita en el nombre y la descripción de la entrada. A reevaluar si el volumen lo justifica.
