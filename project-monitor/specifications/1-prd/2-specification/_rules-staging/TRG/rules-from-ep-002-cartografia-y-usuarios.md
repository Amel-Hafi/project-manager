---
source: "EP-002"
type: rules-staging
rule_type: "TRG"
extracted_by: agent-features
epic: "EP-002"
lang: es
---

# Reglas de trigger extraídas de EP-002

## FT-008 — Gestión de clientes

### [BR-TRG-F001] Marcas de tiempo automáticas en Cliente
- **IF** un Cliente se crea o modifica
- **THEN** el sistema asigna automáticamente fechaCreacion (al crear) y actualiza fechaModificacion (en cada cambio)
- **Entidades concernidas:** [ENT-001]
- **Funcionalidades relacionadas:** [FT-008]

## FT-009 — Gestión de proyectos

### [BR-TRG-F002] Marcas de tiempo automáticas en Proyecto
- **IF** un Proyecto se crea o modifica
- **THEN** el sistema asigna automáticamente fechaCreacion (al crear) y actualiza fechaModificacion (en cada cambio)
- **Entidades concernidas:** [ENT-002]
- **Funcionalidades relacionadas:** [FT-009]

## FT-010 — Gestión de aplicativos y descripción técnica

### [BR-TRG-F003] Generación automática de los 7 KPIDeMadurez al crear Aplicativo
- **IF** un Aplicativo se crea correctamente
- **THEN** el sistema crea automáticamente exactamente 7 registros KPIDeMadurez (uno por cada valor del enum REF-001 DimensionDeMadurez), con valor=null
- **Entidades concernidas:** [ENT-003], [ENT-006]
- **Funcionalidades relacionadas:** [FT-010]

### [BR-TRG-F004] Marcas de tiempo automáticas en Aplicativo
- **IF** un Aplicativo se crea o modifica (incluida la asociación a EntradaCatalogo)
- **THEN** el sistema asigna automáticamente fechaCreacion (al crear) y actualiza fechaModificacion (en cada cambio)
- **Entidades concernidas:** [ENT-003]
- **Funcionalidades relacionadas:** [FT-010]

## FT-011 — Autenticación OIDC

### [BR-TRG-F005] Redirección automática al proveedor OIDC del entorno
- **IF** un usuario accede al sistema sin sesión válida
- **THEN** el sistema lo redirige automáticamente al proveedor OIDC configurado para el entorno activo (Keycloak en DEV; Azure AD Corporativo en CUAL/PROD)
- **Entidades concernidas:** [ENT-012]
- **Funcionalidades relacionadas:** [FT-011]

## FT-012 — Perfiles y roles de usuario

### [BR-TRG-F006] Valor por defecto activo=true al crear Usuario
- **IF** un Usuario se crea
- **THEN** el campo activo se establece automáticamente a true salvo indicación contraria explícita
- **Entidades concernidas:** [ENT-012]
- **Funcionalidades relacionadas:** [FT-012]

### [BR-TRG-F007] Marcas de tiempo automáticas en Usuario
- **IF** un Usuario se crea o modifica
- **THEN** el sistema asigna automáticamente fechaCreacion (al crear) y actualiza fechaModificacion (en cada cambio)
- **Entidades concernidas:** [ENT-012]
- **Funcionalidades relacionadas:** [FT-012]

## FT-013 — Asignación de usuarios a proyectos

### [BR-TRG-F008] Conservación de asignaciones tras desactivación de Usuario
- **IF** un Usuario se desactiva (activo=false) en [FT-012]
- **THEN** sus asignaciones a proyectos se conservan intactas y vuelven a ser efectivas si el Usuario es reactivado
- **Entidades concernidas:** [ENT-012], [ENT-002]
- **Funcionalidades relacionadas:** [FT-012], [FT-013]
