---
source: "EP-002"
type: rules-staging
rule_type: "AUT"
extracted_by: agent-features
epic: "EP-002"
lang: es
---

# Reglas de autorización extraídas de EP-002

## FT-008 — Gestión de clientes

### [BR-AUT-F001] CRUD de Cliente reservado a ROL_ADMIN
- **IF** se intenta crear, modificar o eliminar un Cliente
- **THEN** la acción sólo se permite si el usuario tiene rol ROL_ADMIN; los demás roles disponen únicamente de lectura conforme a la matriz de [ACT-001] §3.1
- **Entidades concernidas:** [ENT-001], [ENT-012]
- **Funcionalidades relacionadas:** [FT-008]

## FT-009 — Gestión de proyectos

### [BR-AUT-F002] CRUD de Proyecto reservado a ROL_ADMIN
- **IF** se intenta crear, modificar o eliminar un Proyecto
- **THEN** la acción sólo se permite si el usuario tiene rol ROL_ADMIN; los demás roles disponen únicamente de lectura según su ámbito (Manager: proyectos asignados; Referente DT: lectura global; Director: lectura total)
- **Entidades concernidas:** [ENT-002], [ENT-012]
- **Funcionalidades relacionadas:** [FT-009]

## FT-010 — Gestión de aplicativos y descripción técnica

### [BR-AUT-F003] Creación y edición de Aplicativo restringida al ámbito asignado
- **IF** un Manager o un Referente DT intenta crear o modificar un Aplicativo
- **THEN** la acción sólo se permite si el Proyecto al que pertenece el Aplicativo está incluido en sus asignaciones ([FT-013]); el Administrador opera sin restricción de ámbito
- **Entidades concernidas:** [ENT-003], [ENT-002], [ENT-012]
- **Funcionalidades relacionadas:** [FT-010], [FT-013]

### [BR-AUT-F004] Eliminación de Aplicativo reservada a ROL_ADMIN
- **IF** se intenta eliminar un Aplicativo
- **THEN** la acción sólo se permite si el usuario tiene rol ROL_ADMIN
- **Entidades concernidas:** [ENT-003], [ENT-012]
- **Funcionalidades relacionadas:** [FT-010]

## FT-011 — Autenticación OIDC

### [BR-AUT-F005] Acceso condicionado a Usuario registrado y activo
- **IF** un usuario autenticado por el proveedor OIDC intenta acceder al sistema
- **THEN** el acceso se concede únicamente si existe un Usuario en [ENT-012] con el email recibido, rol asignado y activo=true; en caso contrario, se rechaza con mensaje de usuario no autorizado o cuenta inactiva
- **Entidades concernidas:** [ENT-012]
- **Funcionalidades relacionadas:** [FT-011]

### [BR-AUT-F006] Delegación obligatoria de la autenticación al proveedor OIDC
- **IF** un usuario inicia sesión en cualquier entorno
- **THEN** la verificación de credenciales se delega al proveedor OIDC configurado (Keycloak en DEV; Azure AD Corporativo en CUAL/PROD); el sistema nunca almacena ni valida contraseñas localmente
- **Entidades concernidas:** [ENT-012]
- **Funcionalidades relacionadas:** [FT-011]

## FT-012 — Perfiles y roles de usuario

### [BR-AUT-F007] Gestión de Usuarios reservada a ROL_ADMIN
- **IF** se intenta crear, modificar, desactivar o reactivar un Usuario
- **THEN** la acción sólo se permite si el usuario tiene rol ROL_ADMIN
- **Entidades concernidas:** [ENT-012]
- **Funcionalidades relacionadas:** [FT-012]

## FT-013 — Asignación de usuarios a proyectos

### [BR-AUT-F008] Gestión de asignaciones reservada a ROL_ADMIN
- **IF** se intenta crear o eliminar una asignación Usuario-Proyecto
- **THEN** la acción sólo se permite si el usuario tiene rol ROL_ADMIN
- **Entidades concernidas:** [ENT-012], [ENT-002]
- **Funcionalidades relacionadas:** [FT-013]
