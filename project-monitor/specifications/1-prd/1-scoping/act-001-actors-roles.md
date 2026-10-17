---
id: ACT-001
title: "Actores, Roles y Permisos — Project Monitor"
phase: 1-scoping
type: acteurs
status: validated
version: "1.1"
last_updated: 2026-04-29
author: agent-actors
reviewers: []
dependencies: ["VIS-001", "GLO-001"]
---

# [ACT-001] Actores, Roles y Permisos

> **Nota de producción:** Todos los documentos fuente utilizados están `validated` (VIS-001 v1.2, GLO-001 v1.1, DCO-001 v1.1). Esta nota refleja el estado en el momento de la producción inicial (2026-04-28); el contenido del documento no requiere revisión por este motivo.

---

## 1. Actores

### 1.1 Actores humanos

#### [ACT-H001] Administrador

| Propiedad | Valor |
|-----------|-------|
| **Descripción** | Miembro interno de la Dirección Técnica con acceso total al sistema, responsable de la integridad del catálogo tecnológico, la jerarquía organizativa, los usuarios, los roles y las reglas del árbol de decisión. |
| **Objetivo principal** | Mantener la coherencia y la fiabilidad del referencial y de la estructura del sistema; garantizar que los datos de configuración reflejen en todo momento la realidad de la DT. |
| **Frecuencia de uso** | Semanal / Ocasional (según actividad de mantenimiento del catálogo y onboarding de usuarios) |
| **Nivel técnico** | Experto |
| **Fuente** | [VIS-001] §1.3, [GLO-T001], [DCO-001] STK-01 |

---

#### [ACT-H002] Director

| Propiedad | Valor |
|-----------|-------|
| **Descripción** | Perfil de la Dirección con visibilidad total en lectura sobre todos los clientes, proyectos y aplicativos; principal consumidor de las vistas ejecutivas agregadas y del semáforo de estado global. |
| **Objetivo principal** | Disponer en todo momento de una visión ejecutiva consolidada del porfolio completo para tomar decisiones estratégicas e identificar rápidamente los proyectos en situación de riesgo técnico. |
| **Frecuencia de uso** | Diaria / Semanal (consulta de dashboards y semáforos) |
| **Nivel técnico** | Básico / Intermedio |
| **Fuente** | [VIS-001] §1.3, [GLO-T011], [DCO-001] STK-02 |

---

#### [ACT-H003] Manager

| Propiedad | Valor |
|-----------|-------|
| **Descripción** | Perfil de Gestión (Chef de Projet / CP) responsable de la gestión operativa y la supervisión de la información de los proyectos que tiene asignados; puede crear y editar aplicativos dentro de su cartera, registrar riesgos manuales y publicar o validar casos de éxito de IA. |
| **Objetivo principal** | Supervisar el estado técnico de los proyectos asignados, detectar riesgos en su cartera y validar los casos de éxito de IA producidos por el equipo. |
| **Frecuencia de uso** | Diaria / Semanal |
| **Nivel técnico** | Intermedio |
| **Fuente** | [VIS-001] §1.3, [GLO-T018], [DCO-001] STK-03 |

---

#### [ACT-H004] Referente DT

| Propiedad | Valor |
|-----------|-------|
| **Descripción** | Miembro de la Dirección Técnica designado responsable de la veracidad y la actualización de la información técnica de los aplicativos en los proyectos que tiene asignados; principal proveedor de datos del sistema. |
| **Objetivo principal** | Mantener actualizada la cartografía organizativa de sus aplicativos asignados, registrar los KPIs de madurez y documentar los casos de éxito de IA de su equipo, garantizando la calidad del dato técnico. |
| **Frecuencia de uso** | Diaria / Semanal (captura continua de datos técnicos) |
| **Nivel técnico** | Experto |
| **Fuente** | [VIS-001] §1.3, [GLO-T027], [DCO-001] STK-04 |

---

### 1.2 Actores sistema (sistemas externos)

#### [ACT-S001] Servicio SSO Corporativo

| Propiedad | Valor |
|-----------|-------|
| **Descripción** | Servicio de identificación corporativo único que centraliza la autenticación de los usuarios internos de la DT; su integración con Project Monitor está pendiente de confirmación técnica (HYP-001 de [VIS-001]). |
| **Tipo de interacción** | Bidireccional — Project Monitor envía solicitudes de autenticación y recibe tokens o aserciones de identidad del servicio corporativo. |
| **Frecuencia** | Por eventos — en cada inicio de sesión de un usuario. |
| **Fuente** | [VIS-001] IN-003, CTR-003, HYP-001; [DCO-001] §A.4 |

---

## 2. Roles

| ID | Rol | Descripción | Actores asociados |
|----|-----|-------------|-------------------|
| [ROL-001] | ROL-ADMIN | Acceso total al sistema: CRUD sobre el catálogo tecnológico, la jerarquía organizativa (Cliente, Proyecto, Aplicativo), los usuarios, las plantillas de valoración y el árbol de decisión. | [ACT-H001] Administrador |
| [ROL-002] | ROL-DIRECTOR | Visibilidad en lectura sobre todos los elementos del sistema; acceso a la vista global y a todos los dashboards agregados; propone reglas del árbol de decisión al Administrador. | [ACT-H002] Director |
| [ROL-003] | ROL-MANAGER | Acceso de lectura y edición sobre los proyectos asignados; creación y edición de aplicativos en su cartera; registro manual de riesgos técnicos y planes de acción; publicación y validación de casos de éxito de IA en sus proyectos. | [ACT-H003] Manager |
| [ROL-004] | ROL-REFERENTE | Acceso de lectura sobre todos los proyectos; creación y edición de aplicativos y KPIs de madurez en los proyectos asignados; publicación de casos de éxito de IA. | [ACT-H004] Referente DT |

### Jerarquía de roles

```
ROL-ADMIN  (acceso total — sin restricción de alcance)
  ├── ROL-DIRECTOR  (lectura total — sin restricción de alcance)
  └── (roles operacionales — alcance restringido a proyectos/aplicativos asignados)
        ├── ROL-MANAGER  (gestión operativa de proyectos asignados)
        └── ROL-REFERENTE  (calidad del dato técnico en proyectos asignados)
```

> **Nota:** La jerarquía no implica herencia estricta de permisos. ROL-DIRECTOR y los roles operacionales son perfiles paralelos con ámbitos distintos. ROL-MANAGER y ROL-REFERENTE actúan sobre el mismo alcance (proyectos y aplicativos asignados), pero con responsabilidades diferentes: gestión operativa versus calidad del dato técnico. Un mismo actor humano puede tener asignados varios roles si su función lo justifica.

---

## 3. Matrices de permisos

### 3.1 Matriz Rol × Entidad (CRUD)

| Entidad | [ROL-001] ROL-ADMIN | [ROL-002] ROL-DIRECTOR | [ROL-003] ROL-MANAGER | [ROL-004] ROL-REFERENTE |
|---------|---------------------|------------------------|-----------------------|--------------------------|
| [GLO-T007] Entrada del catálogo tecnológico | CRUD | R | R | R |
| [GLO-T008] Cliente | CRUD | R | R ¹ | R ¹ |
| [GLO-T022] Proyecto | CRUD | R | R ² | R ² |
| [GLO-T002] Aplicativo | CRUD | R | CRU ² | CRU ³ |
| Usuario del sistema | CRUD | R | - | - |
| [GLO-T017] KPI de madurez | CRUD | R | R ² | CRU ³ |
| [GLO-T021] Plantilla de valoración | CRUD | R | R | R |
| [GLO-T003]/[GLO-T032] Árbol de decisión / Umbral | CRUD | R ⁴ | R | R |
| [GLO-T006] Caso de éxito de IA | CRUD | R | CRU ²⁶ | CRU ³⁶ |
| [GLO-T028] Riesgo técnico | CRUD | R | CRU ² | CRU ³ |
| [GLO-T020] Plan de acción | CRUD | R | CRUD ² | CRU ³ |

**Leyenda:** C = Crear, R = Leer, U = Actualizar, D = Eliminar, - = Sin acceso

**Notas de restricción de alcance:**

| Nota | Descripción |
|------|-------------|
| ¹ | Lectura implícita a través de los proyectos visibles en el sistema. ROL-MANAGER solo ve los clientes de sus proyectos asignados; ROL-REFERENTE ve todos los clientes (lectura global). |
| ² | Restringido a los proyectos y aplicativos asignados al Manager. Sin acceso a proyectos de otros Managers. |
| ³ | Creación y edición de aplicativos restringida a los proyectos asignados. Lectura disponible sobre todos los proyectos del sistema ([GLO-T027]). |
| ⁴ | ROL-DIRECTOR puede proponer modificaciones al árbol de decisión, pero la creación y actualización efectiva es exclusiva de ROL-ADMIN ([GLO-T011]). |
| ⁵ | *(eliminada — ver nota ⁶)* |
| ⁶ | La eliminación de un registro de caso de éxito de IA está restringida al usuario que lo creó o a ROL-ADMIN. Cualquier usuario con acceso al proyecto puede crear o editar un caso; solo el creador o el Administrador puede eliminarlo. |

---

### 3.2 Matriz Rol × Funcionalidad

| Funcionalidad | [ROL-001] ROL-ADMIN | [ROL-002] ROL-DIRECTOR | [ROL-003] ROL-MANAGER | [ROL-004] ROL-REFERENTE |
|---------------|---------------------|------------------------|-----------------------|--------------------------|
| Gestión del catálogo tecnológico (IN-001) | ✅ | ❌ | ❌ | ❌ |
| Gestión de la jerarquía Cliente / Proyecto (IN-002) | ✅ | ❌ | ❌ | ❌ |
| Creación y edición de aplicativos (IN-002) | ✅ | ❌ | ✅ ² | ✅ ³ |
| Gestión de usuarios y asignación de roles (IN-003) | ✅ | ❌ | ❌ | ❌ |
| Asignación de proyectos a Manager / Referente DT (IN-003) | ✅ | ❌ | ❌ | ❌ |
| Captura y actualización de KPIs de madurez (IN-004) | ✅ | ❌ | ❌ | ✅ ³ |
| Consulta de KPIs y vista radar por aplicativo (IN-004 / IN-006) | ✅ | ✅ | ✅ ² | ✅ |
| Configuración de plantillas de valoración (IN-004) | ✅ | ❌ | ❌ | ❌ |
| Registro de casos de éxito de IA (IN-005) | ✅ | ❌ | ✅ ² | ✅ ³ |
| Edición de casos de éxito de IA (IN-005) | ✅ | ❌ | ✅ ²⁶ | ✅ ³⁶ |
| Vista agregada por proyecto y por cliente (IN-006) | ✅ | ✅ | ✅ ² | ✅ |
| Vista global del porfolio completo (IN-006) | ✅ | ✅ | ❌ | ❌ |
| Registro manual de riesgos técnicos (IN-007) | ✅ | ❌ | ✅ ² | ✅ ³ |
| Gestión de planes de acción (IN-007) | ✅ | ❌ | ✅ ² | ✅ ³ |
| Configuración del árbol de decisión y umbrales (IN-007) | ✅ | ❌ ⁴ | ❌ | ❌ |
| Consulta de riesgos técnicos identificados | ✅ | ✅ | ✅ ² | ✅ ³ |

**Leyenda:** ✅ = acceso permitido, ❌ = sin acceso. Las notas de restricción de alcance ², ³, ⁴, ⁶ aplican igual que en la sección 3.1.

---

## 4. Reglas de delegación y escalación

| ID | Regla | Descripción | Roles implicados |
|----|-------|-------------|-----------------|
| DEL-001 | Caso de éxito de IA — propiedad del registro | El Referente DT o el Manager puede crear un caso de éxito de IA en los proyectos de su alcance. Cualquier usuario con acceso al proyecto puede editarlo. La eliminación está restringida al creador del registro o al ROL-ADMIN. El sistema registra automáticamente el creador y el responsable del último cambio (usuario y fecha) para trazabilidad. No hay flujo de aprobación ni estados de publicación. | ROL-REFERENTE, ROL-MANAGER |
| DEL-002 | Propuesta de reglas del árbol de decisión | El Director identifica necesidades de ajuste en las reglas del árbol de decisión o en los umbrales de KPI y las propone formalmente al Administrador, quien realiza la modificación efectiva en el sistema. | ROL-DIRECTOR → ROL-ADMIN |
| ESC-001 | Proyecto sin Manager asignado | Si un proyecto no tiene Manager asignado (condición no esperada según HYP-007 de [VIS-001]), las reglas de gestión de riesgos manuales y planes de acción quedan sin responsable de gestión operativa definido. El Administrador debe gestionar estas situaciones hasta que se asigne un Manager. Requiere definición formal antes de la Fase 0. | ROL-ADMIN (gestión provisional) |
| ESC-002 | Desactivación de una tecnología del catálogo con aplicativos asociados | Cuando el Administrador da de baja una entrada del catálogo tecnológico utilizada por aplicativos activos, el impacto sobre los KPIs de madurez y la necesidad de notificación a los Referentes DT o Managers afectados no están definidos ([ATT-007] de [VIS-001]). Pendiente de especificación. | ROL-ADMIN → ROL-REFERENTE / ROL-MANAGER |

---

## Puntos de atención

| ID | Punto | Descripción | Impacto estimado |
|----|-------|-------------|-----------------|
| PAT-001 | Integración del Servicio SSO Corporativo [ACT-S001] | La viabilidad técnica de la integración del SSO corporativo está pendiente de confirmación (HYP-001 de [VIS-001]). Si no es integrable en el plazo de la Fase 0, deberá diseñarse un mecanismo de autenticación alternativo con impacto en el rol Administrador y en la gestión de usuarios. | Alto |
| PAT-002 | Capacidad de edición de proyectos por el Manager | [VIS-001] §1.3 menciona que el Manager realiza la "gestión de la información de sus proyectos asignados", pero no se especifica si puede actualizar los metadatos del proyecto (nombre, descripción) o si solo gestiona los aplicativos. Se ha asignado solo lectura sobre proyectos de forma conservadora. Pendiente de validación. | Medio |
| PAT-003 | Proyectos sin Manager asignado | HYP-007 de [VIS-001] asume que todo proyecto tiene al menos un Manager. Si esta hipótesis es falsa, los permisos de gestión de riesgos manuales quedan sin responsable operativo definido. La regla ESC-001 cubre temporalmente este caso, pero se requiere una decisión de diseño formal. | Medio |
| PAT-004 | Visibilidad del Director sobre usuarios | No está especificado en los documentos fuente si el Director tiene acceso de lectura sobre la lista de usuarios del sistema. Se ha asignado R de forma provisional, coherente con su perfil de visibilidad total en lectura. Requiere confirmación. | Bajo |
| PAT-005 | Ausencia de sistemas externos adicionales en alcance | Los documentos [VIS-001] y [DCO-001] excluyen explícitamente los sistemas de notificación externa (OUT-003), los gestores de incidencias (OUT-002) y otras integraciones. El único sistema externo en alcance es [ACT-S001]. Esta situación puede evolucionar en fases posteriores. | Informativo |

---

## Trazabilidad

| Elemento | Detalle |
|----------|---------|
| **Producido por** | agent-actors |
| **Fecha de producción** | 2026-04-28 |
| **Entradas utilizadas** | [VIS-001] Visión y Alcance del Producto (status: validated); [GLO-001] Glosario de Negocio (status: validated); [DCO-001] Documento de Descubrimiento (status: validated) |
| **Validado por** | Pendiente |
| **Fecha de validación** | Pendiente |

---

## Confianza de producción

| Dimensión | Nivel | Brechas identificadas |
|-----------|-------|-----------------------|
| Entradas suficientes | PARTIAL | [VIS-001] sigue en estado draft sin validación formal. [GLO-001] está validado. Los puntos PAT-001 a PAT-002 representan brechas reales de especificación que no pueden resolverse con los documentos disponibles. |
| Cobertura del alcance | CONFIDENT | Los cuatro actores humanos y el actor sistema están correctamente identificados y cubiertos en la matriz de permisos. Todas las funcionalidades IN-001 a IN-007 tienen cobertura en la matriz de roles. Ningún elemento del alcance queda sin actor responsable identificado (salvo los puntos de atención declarados). |
| Usabilidad por agent-requirements | CONFIDENT | La matriz CRUD y la matriz de funcionalidades son directamente utilizables para la especificación de requisitos de acceso. Los permisos del Referente DT sobre riesgos y planes de acción están confirmados. El flujo de casos de éxito de IA está simplificado y especificado. PAT-002 (edición de metadatos de proyecto por Manager) es el único punto menor pendiente. |

**Puntuación global:** 2,5/3 CONFIDENT — Los actores, roles y la estructura de permisos están bien definidos, coherentes con [VIS-001] y [GLO-001], y directamente utilizables por agent-requirements. El único punto abierto relevante es PAT-001 (integración SSO, decisión técnica) y PAT-002 (metadatos de proyecto, menor).
