---
source: "EP-002"
type: rules-staging
rule_type: "COH"
extracted_by: agent-features
epic: "EP-002"
lang: es
---

# Reglas de coherencia extraídas de EP-002

## FT-008 — Gestión de clientes

### [BR-COH-F001] Bloqueo de eliminación de Cliente con Proyectos
- **IF** se intenta eliminar un Cliente
- **THEN** la operación sólo se permite si el Cliente no tiene Proyectos asociados; en caso contrario, se rechaza (INV-004 de [DOM-001])
- **Entidades concernidas:** [ENT-001], [ENT-002]
- **Funcionalidades relacionadas:** [FT-008]

## FT-009 — Gestión de proyectos

### [BR-COH-F002] Bloqueo de eliminación de Proyecto con Aplicativos
- **IF** se intenta eliminar un Proyecto
- **THEN** la operación sólo se permite si el Proyecto no tiene Aplicativos asociados; en caso contrario, se rechaza (INV-004 de [DOM-001])
- **Entidades concernidas:** [ENT-002], [ENT-003]
- **Funcionalidades relacionadas:** [FT-009]

### [BR-COH-F003] Inmutabilidad del cliente padre del Proyecto
- **IF** se intenta modificar un Proyecto existente
- **THEN** el campo clienteId no puede cambiar tras la creación; el Proyecto pertenece a un único Cliente durante todo su ciclo de vida
- **Entidades concernidas:** [ENT-002], [ENT-001]
- **Funcionalidades relacionadas:** [FT-009]

## FT-010 — Gestión de aplicativos y descripción técnica

### [BR-COH-F004] Inmutabilidad del proyecto padre del Aplicativo
- **IF** se intenta modificar un Aplicativo existente
- **THEN** el campo proyectoId no puede cambiar tras la creación
- **Entidades concernidas:** [ENT-003], [ENT-002]
- **Funcionalidades relacionadas:** [FT-010]

### [BR-COH-F005] Completitud y unicidad de KPIs por Aplicativo
- **IF** existe un Aplicativo
- **THEN** debe haber exactamente un KPIDeMadurez por cada valor de DimensionDeMadurez (REF-001), totalizando 7 registros, con la pareja (aplicativoId, dimension) única (INV-003 e INV-009 de [DOM-001])
- **Entidades concernidas:** [ENT-003], [ENT-006]
- **Funcionalidades relacionadas:** [FT-010]

## FT-012 — Perfiles y roles de usuario

### [BR-COH-F006] Conservación de registros y asignaciones tras desactivar Usuario
- **IF** un Usuario se desactiva (activo=false)
- **THEN** todos sus registros (KPIs creados, casos de éxito, riesgos, planes de acción, asignaciones a proyectos) se conservan intactos; sólo el acceso al sistema se inhabilita
- **Entidades concernidas:** [ENT-012]
- **Funcionalidades relacionadas:** [FT-012]

## FT-013 — Asignación de usuarios a proyectos

### [BR-COH-F007] Unicidad de la pareja Usuario-Proyecto
- **IF** se intenta crear una asignación Usuario-Proyecto
- **THEN** la pareja (usuarioId, proyectoId) debe ser única en el sistema; no pueden existir dos asignaciones idénticas
- **Entidades concernidas:** [ENT-012], [ENT-002]
- **Funcionalidades relacionadas:** [FT-013]
