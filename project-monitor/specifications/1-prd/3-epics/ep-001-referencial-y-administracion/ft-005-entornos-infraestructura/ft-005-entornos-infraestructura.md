---
id: FT-005
title: "Entornos de infraestructura"
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

# [FT-005] Entornos de infraestructura

## Descripción

Esta funcionalidad puebla el bloque temático "Entornos de Infraestructura" del catálogo. Permite al Administrador registrar los entornos sobre los que se despliegan los aplicativos de la DT, clasificándolos según su categoría funcional (cualificación, producción o performance) mediante el atributo complementario TipoDeEntorno definido en [REF-008]. Estas entradas son referenciadas por los Referentes DT al describir la cartografía técnica de cada aplicativo.

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
| [BR-VAL-F011] | El bloque temático "Entornos de Infraestructura" debe existir como BloqueTematico activo en el sistema | BR-VAL |
| [BR-VAL-F012] | El atributo TipoDeEntorno (REF-008) es obligatorio para toda entrada del bloque "Entornos de Infraestructura" y debe tomar uno de los valores: CUALIFICACION, PRODUCCION, PERFORMANCE | BR-VAL |
| [BR-AUT-F006] | Solo el Administrador puede registrar entradas en el bloque "Entornos de Infraestructura" | BR-AUT |

---

## Criterios de aceptación

### FAC-001: Registro de un entorno de producción

- **Dado** que existe el BloqueTematico "Entornos de Infraestructura"
- **Cuando** el Administrador registra la entrada "Azure Producción Europe-West" con tipoPropiedad "corporativo" y TipoDeEntorno "PRODUCCION"
- **Entonces** la entrada queda disponible en el catálogo en estado "activo"
- **Y** aparece en el listado filtrable por TipoDeEntorno

### FAC-002: Validación del TipoDeEntorno obligatorio

- **Dado** que el Administrador intenta registrar una entrada en el bloque "Entornos de Infraestructura"
- **Cuando** envía el formulario sin especificar el TipoDeEntorno
- **Entonces** el sistema rechaza el registro y muestra un error indicando que TipoDeEntorno es obligatorio para este bloque

### FAC-003: Cobertura mínima de los tres tipos de entorno

- **Dado** que la fase 0 está cargada
- **Cuando** un Referente DT describe la cartografía de despliegue de un aplicativo
- **Entonces** encuentra en el catálogo al menos un entorno de tipo CUALIFICACION, uno de tipo PRODUCCION y uno de tipo PERFORMANCE disponibles para asociar

---

## Historias de usuario

> Sección rellenada por agent-3.1 (System 3). Listada aquí para trazabilidad.

| ID Historia | Título | Prioridad |
|-------------|--------|-----------|
| [US-xxx] | *(por crear)* | Must |

---

## Límites funcionales

**Dentro del alcance:**
- Registro y mantenimiento de entradas en el bloque "Entornos de Infraestructura" con TipoDeEntorno obligatorio
- Filtrado del listado por TipoDeEntorno
- Aplicación del patrón CRUD genérico de [FT-001]

**Fuera del alcance:**
- El entorno de desarrollo local del puesto de trabajo — cubierto por [FT-002]
- La gestión técnica de los entornos (provisión, monitorización) — fuera del producto
- La asociación de entornos a aplicativos concretos — cubierta en el épico de cartografía organizativa (no EP-001)

---

## Puntos de atención

> [PA-001] El modelo actual no contempla un entorno de "desarrollo compartido" como tipo separado. Si la DT lo requiere, deberá ampliarse el enum REF-008.
> [PA-002] La nomenclatura concreta de los entornos iniciales (regiones, denominación cliente) depende de la organización actual de la DT y debe acordarse en la carga inicial.
