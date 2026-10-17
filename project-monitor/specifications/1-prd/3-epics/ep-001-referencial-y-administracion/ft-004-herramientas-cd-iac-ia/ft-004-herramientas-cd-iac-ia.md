---
id: FT-004
title: "Herramientas de CD, IaC e inteligencia artificial"
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

# [FT-004] Herramientas de CD, IaC e inteligencia artificial

## Descripción

Esta funcionalidad puebla los bloques temáticos correspondientes al despliegue continuo (CD), a la infraestructura como código (IaC) y a la inteligencia artificial. Permite al Administrador registrar las herramientas de despliegue automatizado, las herramientas de aprovisionamiento y configuración de infraestructura, y las herramientas de IA que la DT admite o promueve en su porfolio de proyectos. Las entradas del bloque IA son referenciables desde los Casos de Éxito de IA ([ENT-010]).

---

## Detalles de la funcionalidad

| Propiedad | Valor |
|-----------|-------|
| **Épico padre** | [EP-001] Gestión del Referencial y Administración del Sistema |
| **Actor principal** | [ACT-H001] Administrador |
| **Actores secundarios** | [ACT-H003] Manager, [ACT-H004] Referente DT (lectura, especialmente para herramientas IA) |
| **Prioridad** | Must |
| **Complejidad estimada** | Baja |
| **Requisitos cubiertos** | [EX-001] |
| **Dependencias** | [FT-001] |
| **Entidades concernidas** | [ENT-004] EntradaCatalogo, [ENT-005] BloqueTematico, [ENT-010] CasoDeExitoIA (referenciada) |

---

## Reglas de negocio asociadas

| ID Regla | Descripción | Tipo |
|----------|-------------|------|
| [BR-VAL-F009] | El bloque temático "Industrialización CD/IaC" debe existir como BloqueTematico activo en el sistema | BR-VAL |
| [BR-VAL-F010] | El bloque temático "Inteligencia Artificial" debe existir como BloqueTematico activo en el sistema | BR-VAL |
| [BR-COH-F001] | Solo las entradas del bloque "Inteligencia Artificial" pueden ser referenciadas desde un CasoDeExitoIA en su atributo herramientaIAId | BR-COH |
| [BR-AUT-F005] | Solo el Administrador puede registrar entradas en los bloques "Industrialización CD/IaC" e "Inteligencia Artificial" | BR-AUT |

---

## Criterios de aceptación

### FAC-001: Registro de una herramienta de despliegue continuo

- **Dado** que existe el BloqueTematico "Industrialización CD/IaC"
- **Cuando** el Administrador registra la entrada "ArgoCD" con descripción "Despliegue continuo declarativo para Kubernetes" y tipoPropiedad "corporativo"
- **Entonces** la entrada queda disponible en el catálogo en estado "activo"

### FAC-002: Registro y referencia de una herramienta de IA en un caso de éxito

- **Dado** que existe el BloqueTematico "Inteligencia Artificial" y el Administrador registra la entrada "GitHub Copilot" como activa
- **Cuando** el Manager crea un CasoDeExitoIA y selecciona "GitHub Copilot" como herramienta referenciada
- **Entonces** el caso de éxito queda guardado con la referencia válida a la entrada del catálogo
- **Y** la entrada de IA permanece consultable desde el catálogo

### FAC-003: Cobertura del pipeline CD típico

- **Dado** que las entradas iniciales de "Industrialización CD/IaC" están pobladas
- **Cuando** el Referente DT describe la cadena de despliegue de un aplicativo basado en contenedores
- **Entonces** encuentra en el catálogo al menos: una herramienta de orquestación (Kubernetes), una de IaC (Terraform o equivalente), una de empaquetado (Helm o equivalente) y una de despliegue continuo

---

## Historias de usuario

> Sección rellenada por agent-3.1 (System 3). Listada aquí para trazabilidad.

| ID Historia | Título | Prioridad |
|-------------|--------|-----------|
| [US-xxx] | *(por crear)* | Must |

---

## Límites funcionales

**Dentro del alcance:**
- Registro y mantenimiento de entradas en el bloque "Industrialización CD/IaC"
- Registro y mantenimiento de entradas en el bloque "Inteligencia Artificial"
- Aplicación de la regla de coherencia que limita las herramientas IA referenciables desde CasoDeExitoIA

**Fuera del alcance:**
- La gestión del propio CasoDeExitoIA — fuera del épico EP-001
- Los entornos de infraestructura sobre los que se despliega — cubiertos en [FT-005]
- La gobernanza específica de la adopción de IA (políticas, validaciones) — fuera del MVP

---

## Puntos de atención

> [PA-001] La frontera entre el bloque "Industrialización CI" (FT-003) y "Industrialización CD/IaC" (FT-004) puede ser ambigua para herramientas integradas; la clasificación se acuerda en la carga inicial.
> [PA-002] El alcance del bloque "Inteligencia Artificial" en el catálogo se limita a las herramientas que pueden ser referenciadas en Casos de Éxito de IA. Otras herramientas de IA usadas internamente sin caso de éxito asociado no requieren obligatoriamente entrada en el catálogo, pero su registro es recomendado.
