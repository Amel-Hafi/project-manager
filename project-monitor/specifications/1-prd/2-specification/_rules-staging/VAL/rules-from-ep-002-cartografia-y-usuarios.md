---
source: "EP-002"
type: rules-staging
rule_type: "VAL"
extracted_by: agent-features
epic: "EP-002"
lang: es
---

# Reglas de validación extraídas de EP-002

## FT-008 — Gestión de clientes

### [BR-VAL-F001] Nombre de cliente obligatorio
- **IF** se intenta crear o modificar un Cliente
- **THEN** el campo nombre debe estar presente, no vacío y de longitud ≤ 200 caracteres
- **Mensaje de error:** "El nombre del cliente es obligatorio y no puede superar 200 caracteres"
- **Entidades concernidas:** [ENT-001]
- **Funcionalidades relacionadas:** [FT-008]

## FT-009 — Gestión de proyectos

### [BR-VAL-F002] Nombre de proyecto obligatorio
- **IF** se intenta crear o modificar un Proyecto
- **THEN** el nombre debe estar presente, no vacío y de longitud ≤ 200 caracteres
- **Mensaje de error:** "El nombre del proyecto es obligatorio y no puede superar 200 caracteres"
- **Entidades concernidas:** [ENT-002]
- **Funcionalidades relacionadas:** [FT-009]

### [BR-VAL-F003] Cliente padre obligatorio y existente
- **IF** se intenta crear un Proyecto
- **THEN** el campo clienteId debe estar presente y corresponder a un Cliente existente en el sistema
- **Mensaje de error:** "Debe seleccionarse un cliente válido para el proyecto"
- **Entidades concernidas:** [ENT-002], [ENT-001]
- **Funcionalidades relacionadas:** [FT-009]

## FT-010 — Gestión de aplicativos y descripción técnica

### [BR-VAL-F004] Nombre de aplicativo obligatorio
- **IF** se intenta crear o modificar un Aplicativo
- **THEN** el nombre debe estar presente, no vacío y de longitud ≤ 200 caracteres
- **Mensaje de error:** "El nombre del aplicativo es obligatorio y no puede superar 200 caracteres"
- **Entidades concernidas:** [ENT-003]
- **Funcionalidades relacionadas:** [FT-010]

### [BR-VAL-F005] Proyecto padre obligatorio y existente
- **IF** se intenta crear un Aplicativo
- **THEN** el campo proyectoId debe estar presente y corresponder a un Proyecto existente
- **Mensaje de error:** "Debe seleccionarse un proyecto válido para el aplicativo"
- **Entidades concernidas:** [ENT-003], [ENT-002]
- **Funcionalidades relacionadas:** [FT-010]

### [BR-VAL-F006] Asociación sólo a entradas de catálogo activas
- **IF** se intenta asociar una EntradaCatalogo a un Aplicativo
- **THEN** la EntradaCatalogo debe estar en estado ACTIVO (REF-002)
- **Mensaje de error:** "No se puede asociar al aplicativo una entrada de catálogo dada de baja"
- **Entidades concernidas:** [ENT-003], [ENT-004]
- **Funcionalidades relacionadas:** [FT-010]

## FT-011 — Autenticación OIDC

### [BR-VAL-F007] Email autenticado debe corresponder a usuario activo
- **IF** un proveedor OIDC devuelve un token con un email
- **THEN** debe existir un Usuario con ese email y activo=true en el sistema; en caso contrario, se rechaza el acceso
- **Mensaje de error:** "Usuario no autorizado o cuenta inactiva"
- **Entidades concernidas:** [ENT-012]
- **Funcionalidades relacionadas:** [FT-011]

## FT-012 — Perfiles y roles de usuario

### [BR-VAL-F008] Nombre de usuario obligatorio
- **IF** se intenta crear o modificar un Usuario
- **THEN** el nombre debe estar presente, no vacío y de longitud ≤ 200 caracteres
- **Mensaje de error:** "El nombre del usuario es obligatorio"
- **Entidades concernidas:** [ENT-012]
- **Funcionalidades relacionadas:** [FT-012]

### [BR-VAL-F009] Email único y de formato válido
- **IF** se intenta crear o modificar un Usuario
- **THEN** el campo email debe tener formato de correo electrónico válido y ser único en el sistema (INV-010 de [DOM-001])
- **Mensaje de error:** "El email es obligatorio, debe tener formato válido y no puede coincidir con otro usuario existente"
- **Entidades concernidas:** [ENT-012]
- **Funcionalidades relacionadas:** [FT-012]

### [BR-VAL-F010] Rol obligatorio y conforme a REF-007
- **IF** se intenta crear o modificar un Usuario
- **THEN** el campo rol debe estar presente y corresponder a uno de los valores: ROL_ADMIN, ROL_DIRECTOR, ROL_MANAGER, ROL_REFERENTE (REF-007)
- **Mensaje de error:** "Debe asignarse un rol válido al usuario"
- **Entidades concernidas:** [ENT-012]
- **Funcionalidades relacionadas:** [FT-012]

## FT-013 — Asignación de usuarios a proyectos

### [BR-VAL-F011] Usuario y proyecto obligatorios y existentes
- **IF** se intenta crear una asignación Usuario-Proyecto
- **THEN** ambos campos (usuarioId, proyectoId) deben estar presentes; el usuario debe existir y estar activo, y el proyecto debe existir
- **Mensaje de error:** "Debe seleccionarse un usuario activo y un proyecto válido"
- **Entidades concernidas:** [ENT-012], [ENT-002]
- **Funcionalidades relacionadas:** [FT-013]

### [BR-VAL-F012] Asignación restringida a roles operacionales
- **IF** se intenta crear una asignación Usuario-Proyecto
- **THEN** el rol del usuario debe ser ROL_MANAGER o ROL_REFERENTE
- **Mensaje de error:** "Sólo los Managers y Referentes DT pueden asignarse a un proyecto"
- **Entidades concernidas:** [ENT-012], [ENT-002]
- **Funcionalidades relacionadas:** [FT-013]
