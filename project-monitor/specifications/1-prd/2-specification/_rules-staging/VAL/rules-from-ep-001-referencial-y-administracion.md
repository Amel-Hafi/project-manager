---
source: "EP-001"
type: rules-staging
rule_type: "VAL"
extracted_by: agent-features
epic: "EP-001"
---

# Reglas de validación extraídas — EP-001

## Trazabilidad por funcionalidad

### [FT-001] Catálogo de tecnologías — gestión general

| ID temporal | Descripción | Entidades | Funcionalidades |
|-------------|-------------|-----------|-----------------|
| BR-VAL-F001 | El nombre de una EntradaCatalogo es obligatorio, máx. 200 caracteres y no vacío | [ENT-004] | [FT-001] |
| BR-VAL-F002 | El bloqueTematicoId de una EntradaCatalogo debe corresponder a un BloqueTematico existente | [ENT-004], [ENT-005] | [FT-001] |
| BR-VAL-F003 | El nombre de un BloqueTematico es único en el sistema, máx. 100 caracteres | [ENT-005] | [FT-001] |

### [FT-002] Herramientas de ejecución local y stack tecnológico

| ID temporal | Descripción | Entidades | Funcionalidades |
|-------------|-------------|-----------|-----------------|
| BR-VAL-F004 | El bloque temático "Puesto de trabajo" debe existir como BloqueTematico activo en el sistema | [ENT-005] | [FT-002] |
| BR-VAL-F005 | El bloque temático "Stack Tecnológico" debe existir como BloqueTematico activo en el sistema | [ENT-005] | [FT-002] |
| BR-VAL-F006 | El tipoPropiedad de una entrada del bloque "Puesto de trabajo" debe ser "corporativo" | [ENT-004] | [FT-002] |

### [FT-003] Herramientas de CI y seguridad

| ID temporal | Descripción | Entidades | Funcionalidades |
|-------------|-------------|-----------|-----------------|
| BR-VAL-F007 | El bloque temático "Industrialización CI" debe existir como BloqueTematico activo en el sistema | [ENT-005] | [FT-003] |
| BR-VAL-F008 | El bloque temático "Calidad y Seguridad" debe existir como BloqueTematico activo en el sistema | [ENT-005] | [FT-003] |

### [FT-004] Herramientas de CD, IaC e inteligencia artificial

| ID temporal | Descripción | Entidades | Funcionalidades |
|-------------|-------------|-----------|-----------------|
| BR-VAL-F009 | El bloque temático "Industrialización CD/IaC" debe existir como BloqueTematico activo en el sistema | [ENT-005] | [FT-004] |
| BR-VAL-F010 | El bloque temático "Inteligencia Artificial" debe existir como BloqueTematico activo en el sistema | [ENT-005] | [FT-004] |

### [FT-005] Entornos de infraestructura

| ID temporal | Descripción | Entidades | Funcionalidades |
|-------------|-------------|-----------|-----------------|
| BR-VAL-F011 | El bloque temático "Entornos de Infraestructura" debe existir como BloqueTematico activo en el sistema | [ENT-005] | [FT-005] |
| BR-VAL-F012 | El atributo TipoDeEntorno es obligatorio para toda entrada del bloque "Entornos de Infraestructura" y debe tomar uno de los valores [REF-008]: CUALIFICACION, PRODUCCION, PERFORMANCE | [ENT-004] | [FT-005] |

### [FT-006] Plantillas de valoración de KPIs

| ID temporal | Descripción | Entidades | Funcionalidades |
|-------------|-------------|-----------|-----------------|
| BR-VAL-F013 | La dimensión de una PlantillaDeValoracion es obligatoria y debe corresponder a uno de los siete valores de [REF-001] DimensionDeMadurez | [ENT-007] | [FT-006] |
| BR-VAL-F014 | La versión de una PlantillaDeValoracion es obligatoria, formato libre, máx. 20 caracteres | [ENT-007] | [FT-006] |
| BR-VAL-F015 | El contenido de una PlantillaDeValoracion debe describir criterios para cada uno de los 10 niveles de puntuación (1 a 10) | [ENT-007] | [FT-006] |

### [FT-007] Ciclo de vida del referencial y árbol de decisión

| ID temporal | Descripción | Entidades | Funcionalidades |
|-------------|-------------|-----------|-----------------|
| BR-VAL-F016 | El umbral de una ReglaDecision debe estar comprendido entre 0 y 100 si la condición expresa un porcentaje, o entre 1 y 10 si expresa un valor de KPI | [ENT-011] | [FT-007] |
| BR-VAL-F017 | El nivelAgregacion de una ReglaDecision es obligatorio y debe ser uno de [REF-010]: APLICATIVO, PROYECTO, CLIENTE, GLOBAL | [ENT-011] | [FT-007] |
| BR-VAL-F018 | El nivelSemaforo resultante de una ReglaDecision es obligatorio y debe ser uno de [REF-006]: VERDE, NARANJA, ROJO | [ENT-011] | [FT-007] |
