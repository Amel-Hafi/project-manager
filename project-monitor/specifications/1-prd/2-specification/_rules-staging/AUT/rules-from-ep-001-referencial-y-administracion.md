---
source: "EP-001"
type: rules-staging
rule_type: "AUT"
extracted_by: agent-features
epic: "EP-001"
---

# Reglas de autorización extraídas — EP-001

## Trazabilidad por funcionalidad

### [FT-001] Catálogo de tecnologías — gestión general

| ID temporal | Descripción | Entidades | Funcionalidades |
|-------------|-------------|-----------|-----------------|
| BR-AUT-F001 | Solo el [ACT-H001] Administrador puede crear, modificar o eliminar Entradas del Catálogo y Bloques Temáticos | [ENT-004], [ENT-005], [ENT-012] | [FT-001] |
| BR-AUT-F002 | El Director, el Manager y el Referente DT solo pueden consultar el catálogo en modo lectura | [ENT-004], [ENT-005], [ENT-012] | [FT-001] |

### [FT-002] Herramientas de ejecución local y stack tecnológico

| ID temporal | Descripción | Entidades | Funcionalidades |
|-------------|-------------|-----------|-----------------|
| BR-AUT-F003 | Solo el Administrador puede registrar entradas en los bloques "Puesto de trabajo" y "Stack Tecnológico" | [ENT-004], [ENT-012] | [FT-002] |

### [FT-003] Herramientas de CI y seguridad

| ID temporal | Descripción | Entidades | Funcionalidades |
|-------------|-------------|-----------|-----------------|
| BR-AUT-F004 | Solo el Administrador puede registrar entradas en los bloques "Industrialización CI" y "Calidad y Seguridad" | [ENT-004], [ENT-012] | [FT-003] |

### [FT-004] Herramientas de CD, IaC e inteligencia artificial

| ID temporal | Descripción | Entidades | Funcionalidades |
|-------------|-------------|-----------|-----------------|
| BR-AUT-F005 | Solo el Administrador puede registrar entradas en los bloques "Industrialización CD/IaC" e "Inteligencia Artificial" | [ENT-004], [ENT-012] | [FT-004] |

### [FT-005] Entornos de infraestructura

| ID temporal | Descripción | Entidades | Funcionalidades |
|-------------|-------------|-----------|-----------------|
| BR-AUT-F006 | Solo el Administrador puede registrar entradas en el bloque "Entornos de Infraestructura" | [ENT-004], [ENT-012] | [FT-005] |

### [FT-006] Plantillas de valoración de KPIs

| ID temporal | Descripción | Entidades | Funcionalidades |
|-------------|-------------|-----------|-----------------|
| BR-AUT-F007 | Solo el Administrador puede crear, modificar o activar una PlantillaDeValoracion | [ENT-007], [ENT-012] | [FT-006] |

### [FT-007] Ciclo de vida del referencial y árbol de decisión

| ID temporal | Descripción | Entidades | Funcionalidades |
|-------------|-------------|-----------|-----------------|
| BR-AUT-F008 | Solo el Administrador puede crear, modificar, activar o desactivar Reglas de Decisión y dar de baja o reactivar Entradas del Catálogo | [ENT-004], [ENT-011], [ENT-012] | [FT-007] |
| BR-AUT-F009 | Ningún usuario puede crear manualmente un RiesgoTecnico con tipo=AUTOMATICO (refuerza INV-007); este tipo está reservado al sistema | [ENT-008], [ENT-012] | [FT-007] |
