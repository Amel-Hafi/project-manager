---
source: "EP-001"
type: rules-staging
rule_type: "TRG"
extracted_by: agent-features
epic: "EP-001"
---

# Reglas de disparo (trigger) extraídas — EP-001

## Trazabilidad por funcionalidad

### [FT-001] Catálogo de tecnologías — gestión general

| ID temporal | Descripción | Entidades | Funcionalidades |
|-------------|-------------|-----------|-----------------|
| BR-TRG-F001 | Al crear una EntradaCatalogo, el sistema asigna automáticamente el estado "activo" por defecto | [ENT-004] | [FT-001] |

### [FT-006] Plantillas de valoración de KPIs

| ID temporal | Descripción | Entidades | Funcionalidades |
|-------------|-------------|-----------|-----------------|
| BR-TRG-F002 | Cuando se activa una nueva PlantillaDeValoracion para una dimensión, la plantilla previamente activa de esa dimensión se desactiva automáticamente (activa=false) | [ENT-007] | [FT-006] |

### [FT-007] Ciclo de vida del referencial y árbol de decisión

| ID temporal | Descripción | Entidades | Funcionalidades |
|-------------|-------------|-----------|-----------------|
| BR-TRG-F003 | Cuando el Administrador da de baja una EntradaCatalogo, su estado pasa a "DADO_DE_BAJA" y deja de estar disponible para nuevas asociaciones con Aplicativos | [ENT-004] | [FT-007] |
| BR-TRG-F004 | Cuando un KPIDeMadurez registrado por un Referente DT incumple una ReglaDecision activa, el sistema genera automáticamente un RiesgoTecnico con tipo=AUTOMATICO sobre el Aplicativo afectado | [ENT-006], [ENT-008], [ENT-011] | [FT-007] |
