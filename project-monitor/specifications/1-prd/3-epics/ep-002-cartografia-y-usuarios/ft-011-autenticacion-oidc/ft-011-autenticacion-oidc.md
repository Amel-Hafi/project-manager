---
id: FT-011
title: "Autenticación OIDC"
phase: 2-specification
type: feature
status: draft
version: "1.0"
last_updated: 2026-04-30
author: agent-features
lang: es
reviewers: []
epic: EP-002
dependencies: ["EP-002", "GLO-001", "ACT-001", "DOM-001"]
requirements: ["EX-006"]
doc_depth: standard
---

# [FT-011] Autenticación OIDC

## Descripción

Esta funcionalidad implementa la autenticación de los usuarios de Project Monitor mediante el protocolo OpenID Connect (OIDC), delegando la verificación de identidad en el proveedor configurado para cada entorno: Keycloak en desarrollo, y Active Directory Corporativo Azure (vía OIDC) en cualificación y producción. El sistema no gestiona credenciales propias: toda autenticación pasa por el proveedor de identidad correspondiente al entorno activo, sin cambios de código entre entornos. Únicamente los usuarios registrados en el sistema con rol activo pueden acceder a las funcionalidades. Es prerrequisito absoluto del épico: ningún otro caso de uso puede ejecutarse sin esta funcionalidad operativa.

---

## Detalle de la funcionalidad

| Propiedad | Valor |
|----------|-------|
| **Épico padre** | [EP-002] Cartografía Organizativa y Gestión de Usuarios |
| **Actor principal** | [ACT-S001] Servicio SSO Corporativo |
| **Actores secundarios** | [ACT-H001] Administrador, [ACT-H002] Director, [ACT-H003] Manager, [ACT-H004] Referente DT |
| **Prioridad** | Must |
| **Complejidad estimada** | Alta |
| **Requisitos cubiertos** | [EX-006] |
| **Dependencias** | — |
| **Entidades concernidas** | [ENT-012] Usuario |

---

## Reglas de negocio asociadas

| ID regla | Descripción | Tipo |
|---------|-------------|------|
| [BR-AUT-F005] | El acceso al sistema se concede únicamente si el usuario está registrado en [ENT-012] con activo=true y rol asignado | BR-AUT |
| [BR-AUT-F006] | Toda autenticación se delega al proveedor OIDC del entorno activo (Keycloak en DEV, Azure AD Corporativo en CUAL/PROD); el sistema no almacena contraseñas | BR-AUT |
| [BR-VAL-F007] | El email recibido del proveedor OIDC debe corresponder a un Usuario existente y activo en el sistema; en caso contrario, el acceso se rechaza con mensaje de usuario no autorizado | BR-VAL |
| [BR-TRG-F005] | El sistema redirige automáticamente al proveedor OIDC correspondiente al entorno cuando el usuario no dispone de sesión válida | BR-TRG |

---

## Criterios de aceptación

### FAC-001: Autenticación operativa por entorno sin cambios de código

- **Dado** que el sistema está configurado con Keycloak en el entorno de desarrollo y con Azure AD Corporativo en cualificación y producción
- **Cuando** el usuario "manager01@dt.es" (registrado con rol ROL_MANAGER y activo=true) accede al sistema en cualquier entorno
- **Entonces** el sistema redirige al proveedor OIDC del entorno activo, recibe el token de identidad y concede acceso
- **Y** el cambio de entorno se realiza únicamente por configuración, sin modificación del código de la aplicación

### FAC-002: Rechazo de usuario no registrado

- **Dado** que el usuario "externo01@otraempresa.es" autentica correctamente contra el proveedor OIDC corporativo
- **Cuando** intenta acceder a Project Monitor
- **Entonces** el sistema rechaza el acceso con un mensaje de usuario no autorizado
- **Y** ninguna sesión queda creada, registrando el intento en el log de auditoría ([EX-T001])

### FAC-003: Rechazo de usuario desactivado

- **Dado** que el usuario "referente02@dt.es" existe en el sistema con activo=false
- **Cuando** se autentica correctamente contra el proveedor OIDC
- **Entonces** el sistema rechaza el acceso con un mensaje que indica cuenta inactiva
- **Y** la cuenta puede recuperar el acceso si el Administrador la reactiva en [FT-012]

### FAC-004: Sesión persistente y cierre de sesión

- **Dado** que el usuario "admin01@dt.es" ha iniciado sesión correctamente
- **Cuando** cierra explícitamente su sesión desde el sistema
- **Entonces** la sesión local queda invalidada y se invoca el endpoint de logout del proveedor OIDC
- **Y** el siguiente acceso requiere autenticación completa nuevamente

---

## Historias de usuario

> Sección poblada por `agent-3.1-user-stories.md`. Listada aquí para trazabilidad.

| ID historia | Título | Prioridad |
|----------|-------|----------|
| [US-xxx] | *(por crear)* | Must |

---

## Fronteras funcionales

**En alcance:**
- Integración OIDC con Keycloak (DEV) y Azure AD Corporativo (CUAL/PROD)
- Validación de la existencia y del estado activo del usuario en [ENT-012] antes de conceder acceso
- Mecanismo de logout sincronizado con el proveedor de identidad
- Configuración del proveedor por entorno sin cambios de código

**Fuera de alcance:**
- Gestión propia de contraseñas o reset de credenciales (delegado al proveedor OIDC)
- Federación de identidades multi-tenant
- MFA específico de la aplicación (gestionado por el proveedor corporativo)
- Modos de autenticación alternativos (sólo se contempla un fallback si HYP-001 de [VIS-001] resulta inviable; ver PAT-EP002-01)
- Aprovisionamiento automático (JIT) de usuarios desde el proveedor OIDC: el alta de usuarios se realiza explícitamente en [FT-012]

---

## Puntos de atención

| ID | Punto | Descripción |
|----|-------|-------------|
| PA-001 | Viabilidad técnica de la integración Azure AD Corporativo | PAT-EP002-01 de [EP-002] y PAT-001 de [ACT-001] indican que la viabilidad de la integración con AD Corporativo Azure en el plazo de Fase 0 requiere confirmación del equipo técnico antes del diseño detallado. |
| PA-002 | Restricción de acceso a la red corporativa | CTR-001 y CTR-002 de [VIS-001] establecen que el acceso al sistema está restringido a la red corporativa o al acceso corporativo (intranet). Debe contemplarse en la arquitectura de despliegue, fuera del alcance funcional de esta funcionalidad. |
| PA-003 | Trazabilidad de intentos de acceso | El log de auditoría [EX-T001] debe registrar los intentos de autenticación rechazados. La especificación detallada del log se cubre en una funcionalidad transversal posterior. |
