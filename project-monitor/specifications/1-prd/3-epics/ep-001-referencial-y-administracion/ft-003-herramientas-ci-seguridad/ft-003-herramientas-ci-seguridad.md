---
id: FT-003
title: "Herramientas de CI y seguridad"
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

# [FT-003] Herramientas de CI y seguridad

## Descripción

Esta funcionalidad puebla los bloques temáticos relativos a la Industrialización CI (integración continua: gestión de código fuente, compilación, ejecución de pruebas automatizadas) y a la Calidad y Seguridad (análisis estático, control de cobertura, detección de vulnerabilidades, gestión de secretos). Permite al Administrador registrar las herramientas que la DT estandariza o admite en cada uno de estos bloques. Estas entradas alimentan la dimensión de madurez de Industrialización y la de Calidad de código de los aplicativos.

---

## Detalles de la funcionalidad

| Propiedad | Valor |
|-----------|-------|
| **Épico padre** | [EP-001] Gestión del Referencial y Administración del Sistema |
| **Actor principal** | [ACT-H001] Administrador |
| **Actores secundarios** | [ACT-H004] Referente DT (lectura) |
| **Prioridad** | Must |
| **Complejidad estimada** | Baja |
| **Requisitos cubiertos** | [EX-001] |
| **Dependencias** | [FT-001] |
| **Entidades concernidas** | [ENT-004] EntradaCatalogo, [ENT-005] BloqueTematico |

---

## Reglas de negocio asociadas

| ID Regla | Descripción | Tipo |
|----------|-------------|------|
| [BR-VAL-F007] | El bloque temático "Industrialización CI" debe existir como BloqueTematico activo en el sistema | BR-VAL |
| [BR-VAL-F008] | El bloque temático "Calidad y Seguridad" debe existir como BloqueTematico activo en el sistema | BR-VAL |
| [BR-AUT-F004] | Solo el Administrador puede registrar entradas en los bloques "Industrialización CI" y "Calidad y Seguridad" | BR-AUT |

---

## Criterios de aceptación

### FAC-001: Registro de una herramienta de integración continua

- **Dado** que existe el BloqueTematico "Industrialización CI"
- **Cuando** el Administrador registra la entrada "GitLab CI" con descripción "Plataforma integrada de SCM y CI" y tipoPropiedad "corporativo"
- **Entonces** la entrada queda disponible en estado "activo"
- **Y** puede ser asociada a aplicativos en la cartografía de su pipeline CI

### FAC-002: Registro de una herramienta de calidad de código

- **Dado** que existe el BloqueTematico "Calidad y Seguridad"
- **Cuando** el Administrador registra la entrada "SonarQube Enterprise" con tipoPropiedad "corporativo"
- **Entonces** la entrada queda registrada y disponible para los Referentes DT

### FAC-003: Cobertura del pipeline CI típico de la DT

- **Dado** que se han poblado las entradas iniciales de los bloques "Industrialización CI" y "Calidad y Seguridad"
- **Cuando** el Referente DT describe el pipeline CI de un aplicativo
- **Entonces** encuentra en el catálogo entradas que cubren al menos: SCM, runner CI, herramienta de análisis estático, herramienta de detección de vulnerabilidades de dependencias y herramienta de gestión de secretos

---

## Historias de usuario

> Sección rellenada por agent-3.1 (System 3). Listada aquí para trazabilidad.

| ID Historia | Título | Prioridad |
|-------------|--------|-----------|
| [US-xxx] | *(por crear)* | Must |

---

## Límites funcionales

**Dentro del alcance:**
- Registro y mantenimiento de entradas en el bloque "Industrialización CI"
- Registro y mantenimiento de entradas en el bloque "Calidad y Seguridad"
- Aplicación del patrón CRUD genérico definido en [FT-001]

**Fuera del alcance:**
- Las herramientas de CD, IaC y de IA — cubiertas en [FT-004]
- Los entornos de infraestructura — cubiertos en [FT-005]
- La integración técnica con las herramientas registradas (lectura automática de métricas) — fuera del MVP

---

## Puntos de atención

> [PA-001] La lista inicial concreta de entradas debe ser facilitada por el sponsor antes del arranque.
> [PA-002] La frontera entre el bloque "Industrialización CI" (FT-003) y el bloque "Industrialización CD/IaC" (FT-004) se basa en una clasificación funcional acordada con la DT; las herramientas que cubren ambos ámbitos (p. ej., GitLab CI/CD) se registran en el bloque que mejor refleja su uso predominante en la DT.
