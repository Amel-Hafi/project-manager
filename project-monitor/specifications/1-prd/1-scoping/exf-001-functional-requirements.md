---
id: EXF-001
title: "Catálogo de Requisitos Funcionales — Project Monitor"
phase: 1-scoping
type: functional-requirements
status: validated
version: "1.1"
last_updated: 2026-04-29
author: agent-requirements
reviewers: []
dependencies: ["VIS-001", "GLO-001", "ACT-001"]
r4j_synced: false
r4j_mapping_file: r4j-mapping.json
---

# [EXF-001] Catálogo de Requisitos Funcionales

> **WARN — Entradas en estado draft:** [VIS-001], [GLO-001], [DCO-001] y [ACT-001] tienen `status: draft`. El contenido de todos ellos es suficiente y coherente para producir este catálogo; ninguna condición de bloqueo activada. La confianza se reduce a PARTIAL en las dimensiones de entradas suficientes y usabilidad (ver sección de confianza al final).

---

## Resumen

| Indicador | Valor |
|-----------|-------|
| **Número total de requisitos** | 18 |
| **Must Have** | 14 |
| **Should Have** | 4 |
| **Could Have** | 0 |
| **Won't Have** | 0 |
| **Requisitos críticos** | 10 |
| **Dominios funcionales identificados** | 7 |

---

## Categorías de requisitos

| Categoría | Descripción |
|-----------|-------------|
| **Funcional** | Capacidad de negocio directa expuesta a un actor |
| **Datos** | Gestión, calidad y ciclo de vida de datos |
| **Derechos de acceso** | Control de permisos y ámbito de acciones |
| **Interoperabilidad** | Intercambios funcionales con sistemas de terceros |
| **Transversal** | Restricciones aplicables a todo el sistema |

---

## Dominio funcional: Gestión del catálogo tecnológico

> _Corresponde al dominio DOM-01 del alcance. Cubre el elemento IN-001 de [VIS-001]. Prefigura el Épico de administración del referencial (a crear en el Sistema 2). Exclusivo de la Fase 0._

### [EX-001] Administración del catálogo tecnológico

| Propiedad | Valor |
|-----------|-------|
| **Categoría** | Funcional |
| **Prioridad MoSCoW** | Must |
| **Criticidad** | Crítica |
| **Actor(es) concernido(s)** | [ACT-H001] Administrador |
| **Fuente** | [VIS-001] §3.1 IN-001, OBJ-001 |
| **Depende de** | — |
| **Jira R4J** | _(a completar tras sincronización: PROJ-xxx)_ |

**Descripción:**
El sistema debe permitir al [ACT-H001] Administrador crear, modificar, consultar y dar de baja las entradas del catálogo tecnológico, organizadas en bloques temáticos: stack tecnológico, industrialización CI/CD, entornos de infraestructura (cualificación y producción), herramientas de inteligencia artificial y puesto de trabajo. El catálogo tecnológico es el referencial de base que describe las opciones admitidas para cada dimensión técnica de los aplicativos de la DT. Cada entrada dispone de un estado ("activo" / "dado de baja") que permite retirarla del uso activo sin eliminar el historial asociado.

**Contexto de uso:**
> El Administrador opera sobre el catálogo de forma periódica o puntual cuando se incorporan o retiran tecnologías del porfolio de la DT. Todos los demás roles tienen acceso de lectura sobre el catálogo para poder describir sus aplicativos.

**Trazabilidad descendente:** _(a completar conforme avancen las fases)_

| Componente | Identificadores |
|------------|----------------|
| Épicos / Funcionalidades | ← _a completar en Sistema 2_ |
| Historias de usuario | ← _a completar en Sistema 3_ |
| Escenarios de prueba | ← _a completar en Sistema 3_ |

---

### [EX-002] Gestión de las plantillas de valoración de KPIs de madurez

| Propiedad | Valor |
|-----------|-------|
| **Categoría** | Funcional |
| **Prioridad MoSCoW** | Should |
| **Criticidad** | Alta |
| **Actor(es) concernido(s)** | [ACT-H001] Administrador |
| **Fuente** | [VIS-001] §3.1 IN-004; [ACT-001] §3.2 |
| **Depende de** | — |
| **Jira R4J** | _(a completar)_ |

**Descripción:**
El sistema debe permitir al [ACT-H001] Administrador crear y actualizar las plantillas de valoración asociadas a cada dimensión de madurez, definiendo los criterios objetivos que justifican cada nivel de puntuación en escala 0-10. Las plantillas sirven de referencia para que el [ACT-H004] Referente DT pueda asignar KPIs de forma homogénea y comparable entre aplicativos. Su disponibilidad en el sistema reduce la subjetividad en la captura de indicadores y mejora la trazabilidad de las puntuaciones registradas.

**Contexto de uso:**
> El Administrador configura o actualiza las plantillas de valoración antes del inicio de la fase de captura de KPIs. Todos los roles pueden consultarlas durante la introducción de datos.

**Trazabilidad descendente:**

| Componente | Identificadores |
|------------|----------------|
| Épicos / Funcionalidades | ← _a completar en Sistema 2_ |
| Historias de usuario | ← _a completar en Sistema 3_ |
| Escenarios de prueba | ← _a completar en Sistema 3_ |

---

## Dominio funcional: Cartografía organizativa

> _Corresponde al dominio DOM-02 del alcance. Cubre el elemento IN-002 de [VIS-001]. Prefigura el Épico de cartografía y jerarquía (a crear en el Sistema 2). Exclusivo de la Fase 0._

### [EX-003] Gestión de la jerarquía organizativa

| Propiedad | Valor |
|-----------|-------|
| **Categoría** | Funcional |
| **Prioridad MoSCoW** | Must |
| **Criticidad** | Crítica |
| **Actor(es) concernido(s)** | [ACT-H001] Administrador; [ACT-H003] Manager; [ACT-H004] Referente DT |
| **Fuente** | [VIS-001] §3.1 IN-002, OBJ-001 |
| **Depende de** | — |
| **Jira R4J** | _(a completar)_ |

**Descripción:**
El sistema debe permitir crear y mantener la estructura jerárquica Cliente > Proyecto > Aplicativo, incluyendo los metadatos básicos de cada nivel. El [ACT-H001] Administrador gestiona la estructura completa (creación, modificación, eliminación de clientes, proyectos y aplicativos). El [ACT-H003] Manager y el [ACT-H004] Referente DT pueden crear y editar aplicativos dentro del ámbito de sus proyectos asignados. Esta jerarquía es el eje organizativo de toda la información del sistema y es prerrequisito para la captura de indicadores de madurez y la visualización agregada.

**Contexto de uso:**
> La creación de la jerarquía se produce en el momento de incorporar nuevos clientes, proyectos o aplicativos al porfolio de la DT. La modificación es continua conforme evolucionan los proyectos gestionados.

**Trazabilidad descendente:**

| Componente | Identificadores |
|------------|----------------|
| Épicos / Funcionalidades | ← _a completar en Sistema 2_ |
| Historias de usuario | ← _a completar en Sistema 3_ |
| Escenarios de prueba | ← _a completar en Sistema 3_ |

---

### [EX-004] Descripción técnica de los aplicativos

| Propiedad | Valor |
|-----------|-------|
| **Categoría** | Datos |
| **Prioridad MoSCoW** | Must |
| **Criticidad** | Crítica |
| **Actor(es) concernido(s)** | [ACT-H001] Administrador; [ACT-H003] Manager; [ACT-H004] Referente DT |
| **Fuente** | [VIS-001] §3.1 IN-002, OBJ-001 |
| **Depende de** | EX-001, EX-003 |
| **Jira R4J** | _(a completar)_ |

**Descripción:**
El sistema debe permitir asociar cada aplicativo a las entradas pertinentes del catálogo tecnológico para describir su configuración técnica completa: stack tecnológico, entornos de cualificación y producción, herramientas de industrialización CI/CD, herramientas de calidad y seguridad, herramientas de inteligencia artificial y puesto de trabajo del equipo. El [ACT-H004] Referente DT es el responsable principal de mantener esta descripción actualizada en los proyectos que tiene asignados. Esta información es la base de la cartografía organizativa y condiciona el cálculo del KPI de madurez tecnológica.

**Contexto de uso:**
> La descripción técnica se completa en el momento del alta de un aplicativo y se actualiza cada vez que el stack o los entornos cambian. La información debe estar actualizada para que los KPIs de madurez reflejen la realidad técnica del aplicativo.

**Trazabilidad descendente:**

| Componente | Identificadores |
|------------|----------------|
| Épicos / Funcionalidades | ← _a completar en Sistema 2_ |
| Historias de usuario | ← _a completar en Sistema 3_ |
| Escenarios de prueba | ← _a completar en Sistema 3_ |

---

## Dominio funcional: Gestión de usuarios y roles

> _Corresponde al dominio DOM-03 del alcance. Cubre el elemento IN-003 de [VIS-001]. Prefigura el Épico de control de acceso y onboarding (a crear en el Sistema 2). Exclusivo de la Fase 0._

### [EX-005] Gestión de usuarios, roles y asignaciones de proyectos

| Propiedad | Valor |
|-----------|-------|
| **Categoría** | Derechos de acceso |
| **Prioridad MoSCoW** | Must |
| **Criticidad** | Crítica |
| **Actor(es) concernido(s)** | [ACT-H001] Administrador |
| **Fuente** | [VIS-001] §3.1 IN-003; [ACT-001] §2, §3 |
| **Depende de** | EX-006 |
| **Jira R4J** | _(a completar)_ |

**Descripción:**
El sistema debe permitir al [ACT-H001] Administrador registrar usuarios, asignarles un rol (Administrador, Director, Manager o Referente DT) y vincular a los Managers y a los Referentes DT con los proyectos de los que son responsables. La asignación de proyectos determina el ámbito de acción de cada usuario sobre la jerarquía organizativa y condiciona la visibilidad de sus vistas. El Administrador puede modificar o revocar estas asignaciones cuando cambian las responsabilidades de los equipos.

**Contexto de uso:**
> La gestión de usuarios se activa en el momento del onboarding de nuevos miembros de la DT y cuando se producen cambios de responsabilidad o de proyecto asignado. Es prerrequisito para que cualquier otro rol pueda operar en el sistema.

**Trazabilidad descendente:**

| Componente | Identificadores |
|------------|----------------|
| Épicos / Funcionalidades | ← _a completar en Sistema 2_ |
| Historias de usuario | ← _a completar en Sistema 3_ |
| Escenarios de prueba | ← _a completar en Sistema 3_ |

---

### [EX-006] Autenticación mediante el servicio de identificación corporativo

| Propiedad | Valor |
|-----------|-------|
| **Categoría** | Interoperabilidad |
| **Prioridad MoSCoW** | Must |
| **Criticidad** | Crítica |
| **Actor(es) concernido(s)** | Todos ([ACT-H001], [ACT-H002], [ACT-H003], [ACT-H004]) vía [ACT-S001] |
| **Fuente** | [VIS-001] §3.1 IN-003, CTR-003, HYP-001 |
| **Depende de** | — |
| **Jira R4J** | _(a completar)_ |

**Descripción:**
El sistema debe autenticar a todos sus usuarios a través del servicio de identificación corporativo único ([ACT-S001]) antes de conceder acceso a cualquier funcionalidad. El sistema no gestionará credenciales propias: toda identidad es delegada al servicio corporativo, garantizando la coherencia con la política de acceso de la Dirección Técnica. En caso de que la integración con el servicio corporativo no sea técnicamente viable en el plazo de la Fase 0 (HYP-001), deberá preverse un mecanismo de autenticación alternativo que mantenga el mismo nivel de control de acceso.

**Contexto de uso:**
> Cada inicio de sesión de un usuario genera una solicitud al servicio corporativo. El acceso al sistema está restringido a la red corporativa o al acceso corporativo (intranet), tal como establece la restricción CTR-001.

**Trazabilidad descendente:**

| Componente | Identificadores |
|------------|----------------|
| Épicos / Funcionalidades | ← _a completar en Sistema 2_ |
| Historias de usuario | ← _a completar en Sistema 3_ |
| Escenarios de prueba | ← _a completar en Sistema 3_ |

---

## Dominio funcional: KPIs de madurez

> _Corresponde al dominio DOM-04 del alcance. Cubre el elemento IN-004 de [VIS-001]. Prefigura el Épico de indicadores de madurez (a crear en el Sistema 2). Activado en la Fase 1._

### [EX-007] Captura y seguimiento de los KPIs de madurez por aplicativo

| Propiedad | Valor |
|-----------|-------|
| **Categoría** | Datos |
| **Prioridad MoSCoW** | Must |
| **Criticidad** | Crítica |
| **Actor(es) concernido(s)** | [ACT-H004] Referente DT (captura); [ACT-H001] Administrador (gestión) |
| **Fuente** | [VIS-001] §3.1 IN-004, OBJ-002; [DCO-001] §D DOM-04 |
| **Depende de** | EX-003, EX-004 |
| **Jira R4J** | _(a completar)_ |

**Descripción:**
El sistema debe permitir al [ACT-H004] Referente DT registrar y actualizar los KPIs de madurez de cada aplicativo que tiene asignado, para las siete dimensiones definidas: Industrialización, Calidad de código, Testing, Despliegue, Madurez tecnológica, Uso de IA y Performance. Cada KPI se puntúa en escala 0-10 con una justificación y una fecha de evaluación obligatorias. La entrada es manual por parte del Referente DT. Los indicadores registrados constituyen la fuente de verdad para los cuadros de mando agregados, la detección automática de riesgos y el semáforo de estado.

**Contexto de uso:**
> El Referente DT introduce o actualiza los KPIs de los aplicativos de su cartera de forma periódica. La plantilla de valoración ([EX-002]) le sirve de referencia para asignar cada puntuación de forma homogénea y justificada.

**Trazabilidad descendente:**

| Componente | Identificadores |
|------------|----------------|
| Épicos / Funcionalidades | ← _a completar en Sistema 2_ |
| Historias de usuario | ← _a completar en Sistema 3_ |
| Escenarios de prueba | ← _a completar en Sistema 3_ |

---

### [EX-008] Configuración del árbol de decisión y de los umbrales de KPI

| Propiedad | Valor |
|-----------|-------|
| **Categoría** | Funcional |
| **Prioridad MoSCoW** | Must |
| **Criticidad** | Alta |
| **Actor(es) concernido(s)** | [ACT-H001] Administrador (configuración efectiva); [ACT-H002] Director (propone modificaciones) |
| **Fuente** | [VIS-001] §3.1 IN-007, HYP-004; [ACT-001] §3.1, DEL-002 |
| **Depende de** | EX-007 |
| **Jira R4J** | _(a completar)_ |

**Descripción:**
El sistema debe permitir al [ACT-H001] Administrador configurar las reglas del árbol de decisión y los umbrales de KPI que determinan cuándo se genera automáticamente un riesgo técnico y qué estado de semáforo se asigna a un aplicativo, proyecto o cliente. Los umbrales son configurables y no están fijados de forma estática en el sistema, lo que permite adaptar las reglas de decisión a las necesidades cambiantes de la DT. El [ACT-H002] Director puede proponer modificaciones a las reglas, que el Administrador valida y aplica efectivamente.

**Contexto de uso:**
> El Administrador configura el árbol de decisión antes del inicio de la Fase 1. Las modificaciones posteriores requieren coordinación con el Director. Una vez configuradas, las reglas se aplican automáticamente sobre todos los KPIs registrados.

**Trazabilidad descendente:**

| Componente | Identificadores |
|------------|----------------|
| Épicos / Funcionalidades | ← _a completar en Sistema 2_ |
| Historias de usuario | ← _a completar en Sistema 3_ |
| Escenarios de prueba | ← _a completar en Sistema 3_ |

---

## Dominio funcional: Casos de éxito de IA

> _Corresponde al dominio DOM-05 del alcance. Cubre el elemento IN-005 de [VIS-001]. Prefigura el Épico de gestión de la adopción de IA (a crear en el Sistema 2). Activado en la Fase 1._

### [EX-009] Registro y publicación de casos de éxito de IA

| Propiedad | Valor |
|-----------|-------|
| **Categoría** | Funcional |
| **Prioridad MoSCoW** | Should |
| **Criticidad** | Alta |
| **Actor(es) concernido(s)** | [ACT-H004] Referente DT (crea); [ACT-H003] Manager (crea y publica) |
| **Fuente** | [VIS-001] §3.1 IN-005, OBJ-005 |
| **Depende de** | EX-003 |
| **Jira R4J** | _(a completar)_ |

**Descripción:**
El sistema debe permitir al [ACT-H004] Referente DT y al [ACT-H003] Manager crear registros estructurados de casos de éxito de IA que documenten experiencias en las que el uso de una herramienta de inteligencia artificial ha producido un beneficio notable en un proyecto. Cada registro debe contener al menos la descripción de la herramienta utilizada, el contexto del proyecto, el beneficio obtenido y el período de referencia. Los casos de éxito validados son visibles por todos los usuarios del sistema para facilitar la compartición de buenas prácticas entre equipos.

**Contexto de uso:**
> Un Referente DT documenta una experiencia relevante de IA en su proyecto y la somete a validación por su Manager antes de su publicación definitiva (ver EX-010). El objetivo es visibilizar la adopción de IA y reconocer los avances conseguidos.

**Trazabilidad descendente:**

| Componente | Identificadores |
|------------|----------------|
| Épicos / Funcionalidades | ← _a completar en Sistema 2_ |
| Historias de usuario | ← _a completar en Sistema 3_ |
| Escenarios de prueba | ← _a completar en Sistema 3_ |

---

### [EX-010] Flujo de validación de casos de éxito de IA

| Propiedad | Valor |
|-----------|-------|
| **Categoría** | Funcional |
| **Prioridad MoSCoW** | Should |
| **Criticidad** | Alta |
| **Actor(es) concernido(s)** | [ACT-H003] Manager (valida); [ACT-H004] Referente DT (crea); [ACT-H001] Administrador (gestión) |
| **Fuente** | [VIS-001] §3.1 IN-005, ATT-006; [ACT-001] DEL-001, PAT-002 |
| **Depende de** | EX-009 |
| **Jira R4J** | _(a completar)_ |

**Descripción:**
El sistema debe gestionar un flujo de validación estructurado para los casos de éxito de IA, con al menos los estados "borrador", "pendiente de validación", "validado" y "rechazado". El [ACT-H003] Manager responsable del proyecto valida o rechaza cada registro creado por el Referente DT antes de su publicación definitiva. Solo los casos con estado "validado" son visibles en las vistas de difusión de buenas prácticas. El flujo garantiza la calidad y la veracidad de la información publicada antes de su divulgación interna.

**Contexto de uso:**
> El flujo de validación se activa cada vez que un Referente DT o un Manager somete un nuevo caso de éxito de IA. El Manager del proyecto recibe la solicitud de validación y decide aprobarlo o rechazarlo, con la posibilidad de indicar el motivo del rechazo.

**Trazabilidad descendente:**

| Componente | Identificadores |
|------------|----------------|
| Épicos / Funcionalidades | ← _a completar en Sistema 2_ |
| Historias de usuario | ← _a completar en Sistema 3_ |
| Escenarios de prueba | ← _a completar en Sistema 3_ |

---

## Dominio funcional: Agregación y visualización

> _Corresponde al dominio DOM-06 del alcance. Cubre el elemento IN-006 de [VIS-001]. Prefigura el Épico de cuadros de mando y vistas ejecutivas (a crear en el Sistema 2). Activado en la Fase 1._

### [EX-011] Vista de madurez técnica por aplicativo (radar)

| Propiedad | Valor |
|-----------|-------|
| **Categoría** | Funcional |
| **Prioridad MoSCoW** | Must |
| **Criticidad** | Crítica |
| **Actor(es) concernido(s)** | [ACT-H001] Administrador; [ACT-H002] Director; [ACT-H003] Manager; [ACT-H004] Referente DT |
| **Fuente** | [VIS-001] §3.1 IN-006, OBJ-002, OBJ-003 |
| **Depende de** | EX-007 |
| **Jira R4J** | _(a completar)_ |

**Descripción:**
El sistema debe mostrar para cada aplicativo un diagrama de radar que represente simultáneamente los valores de los siete KPIs de madurez, permitiendo una lectura visual inmediata del perfil de fortalezas y debilidades técnicas del aplicativo. La vista debe incluir los valores numéricos de cada KPI, la fecha de la última evaluación y la justificación asociada. Este nivel de visualización es el punto de entrada para el análisis detallado de la madurez de un aplicativo concreto y sirve de base para la toma de decisiones de mejora técnica.

**Contexto de uso:**
> Cualquier usuario con acceso al sistema puede consultar el radar de los aplicativos visibles según su rol. El Referente DT lo utiliza para identificar las dimensiones que requieren actualización; el Manager para supervisar el estado de sus proyectos; el Director para profundizar en un aplicativo concreto desde la vista global.

**Trazabilidad descendente:**

| Componente | Identificadores |
|------------|----------------|
| Épicos / Funcionalidades | ← _a completar en Sistema 2_ |
| Historias de usuario | ← _a completar en Sistema 3_ |
| Escenarios de prueba | ← _a completar en Sistema 3_ |

---

### [EX-012] Vistas agregadas por proyecto y por cliente

| Propiedad | Valor |
|-----------|-------|
| **Categoría** | Funcional |
| **Prioridad MoSCoW** | Must |
| **Criticidad** | Crítica |
| **Actor(es) concernido(s)** | [ACT-H001] Administrador; [ACT-H002] Director; [ACT-H003] Manager; [ACT-H004] Referente DT |
| **Fuente** | [VIS-001] §3.1 IN-006, OBJ-003; [GLO-001] GLO-T023, GLO-T024, GLO-T033 |
| **Depende de** | EX-011 |
| **Jira R4J** | _(a completar)_ |

**Descripción:**
El sistema debe proporcionar vistas agregadas que consoliden los KPIs de madurez de los aplicativos al nivel de proyecto y al nivel de cliente, mostrando: la media de cada KPI entre todos los aplicativos del nivel, el punto negro (peor puntuación por dimensión), el punto dorado (mejor puntuación por dimensión) y el semáforo de estado calculado según las reglas del árbol de decisión. La fórmula de agregación debe ser configurable para permitir adaptar el método de cálculo a las necesidades de la DT. El [ACT-H003] Manager accede a las vistas de sus proyectos asignados; el [ACT-H002] Director y el [ACT-H001] Administrador tienen acceso a todas las vistas.

**Contexto de uso:**
> El Manager consulta la vista agregada de sus proyectos para supervisar el estado global y detectar riesgos antes de que se conviertan en incidencias. El Director la utiliza para comparar el estado de diferentes clientes y proyectos de forma rápida.

**Trazabilidad descendente:**

| Componente | Identificadores |
|------------|----------------|
| Épicos / Funcionalidades | ← _a completar en Sistema 2_ |
| Historias de usuario | ← _a completar en Sistema 3_ |
| Escenarios de prueba | ← _a completar en Sistema 3_ |

---

### [EX-013] Vista ejecutiva global del porfolio

| Propiedad | Valor |
|-----------|-------|
| **Categoría** | Funcional |
| **Prioridad MoSCoW** | Must |
| **Criticidad** | Crítica |
| **Actor(es) concernido(s)** | [ACT-H002] Director; [ACT-H001] Administrador |
| **Fuente** | [VIS-001] §3.1 IN-006, OBJ-003, §2.2; [DCO-001] §B STK-02 |
| **Depende de** | EX-012 |
| **Jira R4J** | _(a completar)_ |

**Descripción:**
El sistema debe proporcionar al [ACT-H002] Director una vista ejecutiva global que agregue todos los clientes del porfolio en un único panel, con el semáforo de estado de cada cliente y proyecto, la relación de proyectos y aplicativos en situación de riesgo técnico activo, y los indicadores de adopción de herramientas de inteligencia artificial. Esta vista debe permitir identificar en pocos segundos los clientes o proyectos que requieren atención inmediata, sin necesidad de navegar por las vistas individuales. El Director no puede editar ningún elemento desde esta vista; su función es exclusivamente de consulta y toma de decisiones estratégicas.

**Contexto de uso:**
> El Director consulta esta vista de forma habitual (diaria o semanal) para hacer el seguimiento del estado de salud del porfolio completo y priorizar las intervenciones estratégicas. Es el principal instrumento de toma de decisiones ejecutivas del sistema.

**Trazabilidad descendente:**

| Componente | Identificadores |
|------------|----------------|
| Épicos / Funcionalidades | ← _a completar en Sistema 2_ |
| Historias de usuario | ← _a completar en Sistema 3_ |
| Escenarios de prueba | ← _a completar en Sistema 3_ |

---

## Dominio funcional: Gestión de riesgos técnicos

> _Corresponde al dominio DOM-07 del alcance. Cubre el elemento IN-007 de [VIS-001]. Prefigura el Épico de gestión de riesgos (a crear en el Sistema 2). Activado en la Fase 1._

### [EX-014] Detección automática de riesgos técnicos por umbral de KPI

| Propiedad | Valor |
|-----------|-------|
| **Categoría** | Funcional |
| **Prioridad MoSCoW** | Must |
| **Criticidad** | Crítica |
| **Actor(es) concernido(s)** | Todos ([ACT-H001], [ACT-H002], [ACT-H003], [ACT-H004]) — generación automática por el sistema |
| **Fuente** | [VIS-001] §3.1 IN-007, OBJ-004, §1.2 |
| **Depende de** | EX-007, EX-008 |
| **Jira R4J** | _(a completar)_ |

**Descripción:**
El sistema debe generar automáticamente un riesgo técnico en tiempo real cuando el valor de un KPI de madurez registrado para un aplicativo se sitúa por debajo del umbral configurado para esa dimensión en el árbol de decisión. El riesgo técnico generado debe quedar visible en la ficha del aplicativo afectado, en las vistas agregadas del proyecto y del cliente correspondientes, y en la vista global del Director. Los riesgos automáticos deben poder distinguirse de los riesgos registrados manualmente. Su resolución debe quedar reflejada en el sistema cuando el KPI correspondiente supera de nuevo el umbral configurado.

**Contexto de uso:**
> La detección automática sustituye la identificación manual y periódica de aplicativos en riesgo, reduciendo el tiempo de reacción del equipo responsable. Cada vez que el Referente DT actualiza un KPI, el sistema evalúa automáticamente si se activa o se resuelve algún riesgo técnico.

**Trazabilidad descendente:**

| Componente | Identificadores |
|------------|----------------|
| Épicos / Funcionalidades | ← _a completar en Sistema 2_ |
| Historias de usuario | ← _a completar en Sistema 3_ |
| Escenarios de prueba | ← _a completar en Sistema 3_ |

---

### [EX-015] Registro manual de riesgos técnicos y planes de acción

| Propiedad | Valor |
|-----------|-------|
| **Categoría** | Funcional |
| **Prioridad MoSCoW** | Should |
| **Criticidad** | Alta |
| **Actor(es) concernido(s)** | [ACT-H003] Manager; [ACT-H001] Administrador |
| **Fuente** | [VIS-001] §3.1 IN-007; [ACT-001] §3.2 |
| **Depende de** | EX-003 |
| **Jira R4J** | _(a completar)_ |

**Descripción:**
El sistema debe permitir al [ACT-H003] Manager registrar manualmente riesgos técnicos sobre un aplicativo, proyecto o cliente cuando identifica situaciones de riesgo que no están capturadas por los umbrales automáticos de KPI. Cada riesgo manual debe poder llevar asociado un plan de acción que especifique las medidas a adoptar, el responsable y el plazo. Los riesgos manuales y sus planes de acción son visibles para los actores con acceso al ámbito correspondiente, lo que facilita la gestión proactiva y la trazabilidad de las decisiones de mejora.

**Contexto de uso:**
> El Manager registra un riesgo manual cuando detecta una situación de riesgo de naturaleza organizativa, de equipo o contextual que no está reflejada en los KPIs. Este mecanismo complementa la detección automática y garantiza que ningún riesgo conocido quede sin registrar en el sistema.

**Trazabilidad descendente:**

| Componente | Identificadores |
|------------|----------------|
| Épicos / Funcionalidades | ← _a completar en Sistema 2_ |
| Historias de usuario | ← _a completar en Sistema 3_ |
| Escenarios de prueba | ← _a completar en Sistema 3_ |

---

## Requisitos transversales

> _Estos requisitos aplican a todos los dominios y a todas las funcionalidades del sistema._

### [EX-T001] Seguridad funcional y trazabilidad de acciones

| Propiedad | Valor |
|-----------|-------|
| **Categoría** | Transversal |
| **Prioridad MoSCoW** | Must |
| **Criticidad** | Crítica |
| **Actor(es) concernido(s)** | Todos |
| **Fuente** | [VIS-001] CTR-001, CTR-002, CTR-003 |
| **Depende de** | EX-006 |
| **Jira R4J** | _(a completar)_ |

**Descripción:**
El sistema debe autenticar a cada usuario antes de cualquier acceso y aplicar los permisos correspondientes a su rol en todo momento, garantizando que ningún usuario pueda realizar acciones fuera del ámbito y los derechos definidos en la matriz de permisos ([ACT-001] §3). El sistema debe registrar un log de auditoría de las acciones sensibles: creaciones, modificaciones, eliminaciones y validaciones. Cada entrada del log debe llevar marca de tiempo y estar atribuida al usuario autenticado que realizó la acción. El acceso al sistema está restringido a la red corporativa o al acceso corporativo, en cumplimiento de las restricciones CTR-001 y CTR-002.

**Trazabilidad descendente:**

| Componente | Identificadores |
|------------|----------------|
| Épicos / Funcionalidades | ← _a completar en Sistema 2_ |
| Historias de usuario | ← _a completar en Sistema 3_ |
| Escenarios de prueba | ← _a completar en Sistema 3_ |

---

### [EX-T002] Rendimiento del sistema con volúmenes de producción

| Propiedad | Valor |
|-----------|-------|
| **Categoría** | Transversal |
| **Prioridad MoSCoW** | Must |
| **Criticidad** | Alta |
| **Actor(es) concernido(s)** | Todos |
| **Fuente** | [VIS-001] CTR-004, HYP-006 |
| **Depende de** | — |
| **Jira R4J** | _(a completar)_ |

**Descripción:**
El sistema debe mantener tiempos de respuesta inferiores a 5 segundos para todas sus vistas y funcionalidades cuando opera con el volumen máximo previsto: decenas de clientes, cientos de proyectos y miles de aplicativos. Las vistas agregadas por proyecto, cliente y global — que son las más costosas computacionalmente — deben respetar este umbral sin degradación perceptible para el usuario. Esta restricción impacta en el diseño de los mecanismos de cálculo de los KPIs agregados, la evaluación del árbol de decisión y la presentación del semáforo de estado.

**Trazabilidad descendente:**

| Componente | Identificadores |
|------------|----------------|
| Épicos / Funcionalidades | ← _a completar en Sistema 2_ |
| Historias de usuario | ← _a completar en Sistema 3_ |
| Escenarios de prueba | ← _a completar en Sistema 3_ |

---

### [EX-T003] Soporte del idioma de la interfaz

| Propiedad | Valor |
|-----------|-------|
| **Categoría** | Transversal |
| **Prioridad MoSCoW** | Must |
| **Criticidad** | Alta |
| **Actor(es) concernido(s)** | Todos |
| **Fuente** | [VIS-001] CTR-005, HYP-002 |
| **Depende de** | — |
| **Jira R4J** | _(a completar)_ |

**Descripción:**
El sistema debe presentar su interfaz en el idioma o los idiomas definidos formalmente por el sponsor antes del inicio del diseño de la Fase 0. Según la hipótesis HYP-002 de [VIS-001], el idioma previsto es español, con posibilidad de soportar también el francés. Si se decide soportar ambos idiomas, el sistema debe permitir al usuario seleccionar su idioma de preferencia y mantener esa preferencia entre sesiones. La decisión de idioma impacta directamente en el diseño de todas las pantallas del sistema y debe tomarse antes del arranque del diseño de la Fase 0.

**Trazabilidad descendente:**

| Componente | Identificadores |
|------------|----------------|
| Épicos / Funcionalidades | ← _a completar en Sistema 2_ |
| Historias de usuario | ← _a completar en Sistema 3_ |
| Escenarios de prueba | ← _a completar en Sistema 3_ |

---

## Matriz de cobertura: dominios × actores

| Dominio funcional | [ACT-H001] Administrador | [ACT-H002] Director | [ACT-H003] Manager | [ACT-H004] Referente DT |
|-------------------|--------------------------|---------------------|--------------------|--------------------------|
| Gestión del catálogo tecnológico | EX-001, EX-002 | — | — | — |
| Cartografía organizativa | EX-003, EX-004 | — | EX-003, EX-004 | EX-003, EX-004 |
| Gestión de usuarios y roles | EX-005, EX-006 | — | — | — |
| KPIs de madurez | EX-007, EX-008 | EX-008 (propone) | — | EX-007 |
| Casos de éxito de IA | EX-009, EX-010 | — | EX-009, EX-010 | EX-009 |
| Agregación y visualización | EX-011, EX-012, EX-013 | EX-011, EX-012, EX-013 | EX-011, EX-012 | EX-011, EX-012 |
| Gestión de riesgos técnicos | EX-014, EX-015 | EX-014 | EX-014, EX-015 | EX-014 |
| Transversales | EX-T001, EX-T002, EX-T003 | EX-T001, EX-T002, EX-T003 | EX-T001, EX-T002, EX-T003 | EX-T001, EX-T002, EX-T003 |

---

## Matriz de cobertura: requisitos × visión IN scope

| Elemento IN del alcance ([VIS-001]) | Requisitos que lo cubren | ¿Cubierto? |
|-------------------------------------|--------------------------|------------|
| IN-001 — Gestión del catálogo de referencia | EX-001 | ✅ |
| IN-002 — Gestión de la jerarquía organizativa | EX-003, EX-004 | ✅ |
| IN-003 — Gestión de usuarios y roles | EX-005, EX-006 | ✅ |
| IN-004 — Captura y seguimiento de indicadores de madurez | EX-007, EX-002, EX-008 | ✅ |
| IN-005 — Registro y gestión de casos de uso de IA | EX-009, EX-010 | ✅ |
| IN-006 — Visualización agregada por aplicativo, proyecto, cliente y global | EX-011, EX-012, EX-013 | ✅ |
| IN-007 — Identificación automática de riesgos y gestión de riesgos manuales | EX-014, EX-015, EX-008 | ✅ |
| IN-008 — Fase 0 (Referencial y cartografía) | EX-001, EX-002, EX-003, EX-004, EX-005, EX-006 | ✅ |
| IN-009 — Fase 1 (Indicadores, visualización y riesgos) | EX-007, EX-008, EX-009, EX-010, EX-011, EX-012, EX-013, EX-014, EX-015 | ✅ |

---

## Puntos de atención

| # | Requisito | Naturaleza del punto de atención | Decisión esperada de |
|---|-----------|----------------------------------|----------------------|
| 1 | EX-007 | El mecanismo de captura de KPIs es manual en HYP-003 ([VIS-001] ATT-001). Si se requiere integración automática con herramientas de calidad o CI/CD en la Fase 1, el alcance y la complejidad del requisito aumentan significativamente. Debe confirmarse con el sponsor antes del diseño de la Fase 1. | Sponsor / Dirección Técnica |
| 2 | EX-008 | Los umbrales del semáforo de estado y del árbol de decisión no están definidos con valores concretos ([VIS-001] ATT-002). Sin esta definición no puede implementarse correctamente la generación automática de riesgos ni el semáforo global. Requiere especificación antes del inicio de la Fase 1. | Sponsor / Director |
| 3 | EX-010 | El flujo de validación de casos de éxito de IA (estados, mecanismo de notificación interna, motivo de rechazo) no está completamente especificado ([VIS-001] ATT-006, [ACT-001] PAT-002). El requisito se ha definido con los estados mínimos necesarios; los detalles del flujo deben confirmarse antes del diseño funcional detallado. | Manager / Referente DT |
| 4 | EX-003, EX-004 | El proceso de carga inicial de los miles de aplicativos ya gestionados por la DT no está especificado ([VIS-001] ATT-003). La decisión entre importación masiva, entrada manual progresiva u otro mecanismo puede afectar al plazo de puesta en marcha operativa de la Fase 0. | Sponsor / Administrador |
| 5 | EX-007 | El documento fuente no especifica si el sistema debe conservar el historial de KPIs para mostrar tendencias temporales ([VIS-001] ATT-004). Si se requiere historial, impacta en el diseño del modelo de datos y en las vistas de visualización. Debe decidirse antes del diseño de la Fase 1. | Sponsor / Director |
| 6 | EX-015 | La capacidad del [ACT-H004] Referente DT para registrar riesgos manuales no está confirmada ([ACT-001] PAT-003). El requisito asigna esta capacidad solo al Manager, de forma conservadora. Requiere confirmación con el sponsor antes del diseño detallado. | Sponsor / Administrador |
| 7 | EX-006 | La viabilidad técnica de la integración del SSO corporativo en el plazo de la Fase 0 está pendiente de confirmación ([VIS-001] HYP-001, [ACT-001] PAT-001). Si no es integrable, deberá especificarse un mecanismo de autenticación alternativo antes del diseño de la Fase 0. | Sponsor / Equipo técnico |

---

## Historial de versiones

| Versión | Fecha | Autor | Cambios |
|---------|-------|-------|---------|
| 1.1 | 2026-04-29 | agent-requirements | Umbral de rendimiento EX-T002 precisado (< 5 s); sección Traceability añadida |
| 1.0 | 2026-04-28 | agent-requirements | Versión inicial — 18 requisitos, 7 dominios funcionales |

---

## Traceability

| Elemento | Detalle |
|----------|---------|
| **Producido por** | agent-requirements (ba-1.4) |
| **Fecha de producción** | 2026-04-28 |
| **Entradas utilizadas** | VIS-001, GLO-001, ACT-001, DCO-001 |
| **Validado por** | pendiente |
| **Fecha de validación** | pendiente |

---

## Confianza de producción

| Dimensión | Nivel | Brechas identificadas |
|-----------|-------|-----------------------|
| Entradas suficientes | PARTIAL | Los cuatro documentos fuente ([VIS-001], [GLO-001], [DCO-001], [ACT-001]) están en estado draft sin validación formal del sponsor. El contenido es coherente y suficientemente detallado para producir el catálogo de requisitos con alta cobertura. Las brechas de contenido reales (mecanismo de KPIs, umbrales, flujo de validación IA, historial, carga inicial) están documentadas como puntos de atención y no bloquean la producción del catálogo de nivel de alcance. |
| Cobertura del alcance | CONFIDENT | Los nueve elementos IN del alcance ([VIS-001] §3.1) están cubiertos por al menos un requisito. No existe ningún elemento IN sin requisito asociado. Los elementos OUT están respetados: no se han incluido requisitos para notificaciones externas (OUT-003), exportación (OUT-004), integraciones automáticas (OUT-001) ni indicadores adicionales opcionales (OUT-006). |
| Usabilidad por agent-domain-model | PARTIAL | La estructura de dominios, la clasificación MoSCoW, las dependencias y las matrices de cobertura son directamente utilizables para la elaboración del modelo de dominio y los épicos del Sistema 2. Los puntos de atención 1 a 7 representan decisiones pendientes que el agent-domain-model deberá tratar como hipótesis o marcar como a confirmar antes del diseño detallado de la Fase 1. |

**Puntuación global:** 1/3 CONFIDENT — El catálogo de requisitos es completo y coherente con el alcance definido en [VIS-001] y operativo para avanzar hacia el Sistema 2. La puntuación refleja el estado draft de todos los documentos fuente y la existencia de siete puntos de atención abiertos. Se recomienda resolver los puntos 1, 2 y 7 (mecanismo de KPIs, umbrales del árbol de decisión, viabilidad SSO) en un taller de descubrimiento con el sponsor antes del diseño de la Fase 1.
