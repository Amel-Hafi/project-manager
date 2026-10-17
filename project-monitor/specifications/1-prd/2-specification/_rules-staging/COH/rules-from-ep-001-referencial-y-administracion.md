---
source: "EP-001"
type: rules-staging
rule_type: "COH"
extracted_by: agent-features
epic: "EP-001"
---

# Reglas de coherencia extraídas — EP-001

## Trazabilidad por funcionalidad

### [FT-004] Herramientas de CD, IaC e inteligencia artificial

| ID temporal | Descripción | Entidades | Funcionalidades |
|-------------|-------------|-----------|-----------------|
| BR-COH-F001 | Solo las entradas del bloque "Inteligencia Artificial" pueden ser referenciadas desde un CasoDeExitoIA en su atributo herramientaIAId | [ENT-004], [ENT-010] | [FT-004] |

### [FT-006] Plantillas de valoración de KPIs

| ID temporal | Descripción | Entidades | Funcionalidades |
|-------------|-------------|-----------|-----------------|
| BR-COH-F002 | Para cada DimensionDeMadurez existe como máximo una PlantillaDeValoracion con activa=true en un momento dado (refuerza INV-005) | [ENT-007] | [FT-006] |

### [FT-007] Ciclo de vida del referencial y árbol de decisión

| ID temporal | Descripción | Entidades | Funcionalidades |
|-------------|-------------|-----------|-----------------|
| BR-COH-F003 | Las asociaciones históricas entre Aplicativos y Entradas dadas de baja se conservan sin modificación (no se eliminan en cascada) | [ENT-003], [ENT-004] | [FT-007] |
