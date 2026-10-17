---
id: GLO-001
title: "Business Glossary — Project Monitor"
phase: 1-scoping
type: glossaire
status: validated
version: "1.1"
last_updated: 2026-04-29
author: agent-glossary
reviewers: []
dependencies: ["VIS-001", "DCO-001"]
lang: es
---

# [GLO-001] Glosario de Negocio — Project Monitor

## Instrucciones de uso

Este glosario es la **referencia única** del lenguaje de negocio del proyecto. Cada entregable producido por un agente o por un humano DEBE utilizar exclusivamente los términos aquí definidos. En caso de duda entre dos términos, prevalece el término canónico indicado en este glosario; los sinónimos autorizados sólo son aceptables en lenguaje natural (no en identificadores, campos de formulario ni código).

> **Nota de producción:** [DCO-001] y [VIS-001] estaban en `status: draft` en el momento de la producción (2026-04-28). Ambos están ahora `validated` (v1.1 y v1.2 respectivamente). El contenido del glosario no requiere revisión por este motivo.

---

## Términos

### [GLO-T001] Administrador

| Propiedad | Valor |
|-----------|-------|
| **Definición** | Perfil de usuario con acceso total al sistema, encargado de gestionar el catálogo tecnológico, la jerarquía organizativa, los usuarios, los roles y las reglas del árbol de decisión. |
| **Sinónimos autorizados** | Ninguno |
| **Sinónimos prohibidos** | Superusuario, Root, Admin |
| **Ejemplos** | El Administrador da de baja una tecnología del catálogo; crea un nuevo Cliente en la jerarquía; configura los umbrales del árbol de decisión. |
| **Contraejemplos** | Un Referente DT que gestiona los datos de sus proyectos asignados no es un Administrador, aunque ambos operen sobre información técnica del sistema. |
| **Entidad relacionada** | [ACT-H001] |

---

### [GLO-T002] Aplicativo

| Propiedad | Valor |
|-----------|-------|
| **Definición** | Unidad mínima de la jerarquía organizativa de la DT; representa un sistema o componente de software gestionado bajo un proyecto específico y asociado a entradas del catálogo tecnológico. |
| **Sinónimos autorizados** | Ninguno |
| **Sinónimos prohibidos** | Sistema, Aplicación, Módulo, Software, App |
| **Ejemplos** | Una plataforma web de gestión de recursos humanos entregada a un cliente; un microservicio de facturación dentro de un proyecto. |
| **Contraejemplos** | El conjunto de todos los aplicativos de un cliente no es un Aplicativo; es la suma de varios Proyectos. Un proyecto completo tampoco es un Aplicativo; lo contiene. |
| **Entidad relacionada** | Pertenece a [GLO-T022] Proyecto |

---

### [GLO-T003] Árbol de decisión

| Propiedad | Valor |
|-----------|-------|
| **Definición** | Conjunto de reglas configurables por el Administrador que determina, a partir de los valores de los KPIs de madurez, qué estado de semáforo se asigna a un aplicativo, proyecto o cliente, y si se genera un riesgo técnico automático. |
| **Sinónimos autorizados** | Reglas de decisión |
| **Sinónimos prohibidos** | Algoritmo, Lógica de negocio, Motor de reglas |
| **Ejemplos** | Una regla del árbol establece que si más del 30 % de los aplicativos de un proyecto tienen una puntuación media inferior a 5, el semáforo pasa a rojo. |
| **Contraejemplos** | Un umbral individual de un KPI no es el árbol de decisión; es uno de sus parámetros de entrada. |
| **Entidad relacionada** | [GLO-T029] Semáforo de estado, [GLO-T032] Umbral |

---

### [GLO-T004] Bloque temático

| Propiedad | Valor |
|-----------|-------|
| **Definición** | Agrupación de entradas del catálogo tecnológico que pertenecen a una misma categoría funcional, como el stack tecnológico, el entorno de desarrollo o la industrialización CI/CD. |
| **Sinónimos autorizados** | Ninguno |
| **Sinónimos prohibidos** | Categoría, Módulo, Sección, Familia |
| **Ejemplos** | El bloque "Industrialización CI/CD" agrupa las herramientas de integración continua, análisis de seguridad, entrega continua e infraestructura como código. El bloque "Inteligencia Artificial" agrupa las herramientas de IA utilizadas por los equipos. |
| **Contraejemplos** | Una entrada individual del catálogo (por ejemplo, la herramienta "Jenkins") no es un bloque temático; pertenece a uno. |
| **Entidad relacionada** | [GLO-T007] Catálogo tecnológico |

---

### [GLO-T005] Cartografía organizativa

| Propiedad | Valor |
|-----------|-------|
| **Definición** | Proceso y resultado de registrar y mantener actualizada la estructura jerárquica de clientes, proyectos y aplicativos gestionados por la DT, incluyendo la asociación de cada aplicativo a las entradas del catálogo tecnológico que describen su configuración técnica. |
| **Sinónimos autorizados** | Cartografía |
| **Sinónimos prohibidos** | Inventario, Mapa, Catálogo de aplicativos |
| **Ejemplos** | Registrar un nuevo aplicativo con su stack tecnológico, sus entornos de infraestructura y sus herramientas de industrialización es una actividad de cartografía organizativa. |
| **Contraejemplos** | Medir la madurez técnica de un aplicativo no es cartografía organizativa; es una actividad de KPI de madurez que presupone que la cartografía ya existe. |
| **Entidad relacionada** | [GLO-T008] Cliente, [GLO-T022] Proyecto, [GLO-T002] Aplicativo |

---

### [GLO-T006] Caso de éxito de IA

| Propiedad | Valor |
|-----------|-------|
| **Definición** | Registro estructurado de una experiencia documentada en la que el uso de una herramienta de inteligencia artificial ha producido un beneficio notable en un proyecto, publicado por el Referente DT o por el Manager con carácter informativo. |
| **Sinónimos autorizados** | Ninguno |
| **Sinónimos prohibidos** | Buena práctica, Best practice, Caso de uso de IA |
| **Ejemplos** | Documentar que el uso de una herramienta de asistencia al desarrollo redujo el tiempo de implementación de funcionalidades en un proyecto concreto y en un período medible. |
| **Contraejemplos** | Una mención genérica de que el equipo utiliza herramientas de IA sin detallar el impacto o el contexto no es un caso de éxito de IA. Una licencia instalada sin uso documentado tampoco lo es. |
| **Entidad relacionada** | [GLO-T015] Herramienta de IA |

---

### [GLO-T007] Catálogo tecnológico

| Propiedad | Valor |
|-----------|-------|
| **Definición** | Repositorio administrado de entradas de referencia, organizado en bloques temáticos, que recoge las tecnologías, herramientas y configuraciones de infraestructura empleadas en los proyectos de la DT y que sirve de base para describir los aplicativos. |
| **Sinónimos autorizados** | Referencial |
| **Sinónimos prohibidos** | Base de datos tecnológica, Inventario de herramientas, Biblioteca tecnológica |
| **Ejemplos** | El catálogo tecnológico incluye lenguajes de programación, IDEs, herramientas de CI/CD, tipos de puesto de trabajo, entornos de infraestructura y herramientas de IA. |
| **Contraejemplos** | Los aplicativos concretos que utilizan esas tecnologías no son parte del catálogo; son objetos de la jerarquía organizativa que referencian entradas del catálogo. |
| **Entidad relacionada** | [GLO-T004] Bloque temático, gestionado por [GLO-T001] Administrador |

---

### [GLO-T008] Cliente

| Propiedad | Valor |
|-----------|-------|
| **Definición** | Nivel superior de la jerarquía organizativa; representa la organización interna o externa para la que la DT desarrolla o mantiene uno o más proyectos. |
| **Sinónimos autorizados** | Ninguno |
| **Sinónimos prohibidos** | Cuenta, Partner, Contratante |
| **Ejemplos** | Una empresa del grupo para la que la DT gestiona tres proyectos distintos es un Cliente en la jerarquía del sistema. |
| **Contraejemplos** | Un usuario del sistema Project Monitor no es un Cliente; es un actor interno de la DT. Un proyecto individual no es un Cliente; está contenido en uno. |
| **Entidad relacionada** | Nivel superior de [GLO-T005] Cartografía organizativa |

---

### [GLO-T009] Cualificación

| Propiedad | Valor |
|-----------|-------|
| **Definición** | Conjunto de entornos de infraestructura utilizados para validar y probar un aplicativo antes de su paso a producción. |
| **Sinónimos autorizados** | Ninguno |
| **Sinónimos prohibidos** | Pre-producción, Homologación, Staging, Qualificación |
| **Ejemplos** | SSG Azure, SSG Azure Stack Red, Client Azure son entornos de cualificación registrados en el catálogo tecnológico del sistema. |
| **Contraejemplos** | Los entornos de performance, dedicados a pruebas de carga, no son entornos de cualificación; se registran en su propia sub-categoría del catálogo. El entorno de producción tampoco es cualificación. |
| **Entidad relacionada** | [GLO-T012] Entorno |

---

### [GLO-T010] Dimensión de madurez

| Propiedad | Valor |
|-----------|-------|
| **Definición** | Área específica de la práctica técnica de un aplicativo evaluada de forma independiente mediante un KPI de madurez propio; el sistema contempla siete dimensiones: Testing, Industrialización, Calidad de código, Despliegue, Madurez tecnológica, Uso de IA y Performance. |
| **Sinónimos autorizados** | Ninguno |
| **Sinónimos prohibidos** | Eje de evaluación, Criterio, Categoría de madurez |
| **Ejemplos** | Testing es una dimensión de madurez; Industrialización es otra dimensión de madurez. Cada una se puntúa con un KPI independiente en escala 1-10, o sin valor si no ha sido evaluada. |
| **Contraejemplos** | Una puntuación de KPI individual no es una dimensión de madurez; es el resultado numérico de evaluar una dimensión. El semáforo de estado tampoco es una dimensión; es una síntesis de varias de ellas. |
| **Entidad relacionada** | [GLO-T017] KPI de madurez |

---

### [GLO-T011] Director

| Propiedad | Valor |
|-----------|-------|
| **Definición** | Perfil de usuario de la DT con visibilidad total en lectura sobre todos los clientes, proyectos y aplicativos del sistema; es el principal consumidor de las vistas ejecutivas agregadas y el proponente de las reglas del árbol de decisión al Administrador. |
| **Sinónimos autorizados** | Ninguno |
| **Sinónimos prohibidos** | Directivo, Responsable, Supervisor, Gerente |
| **Ejemplos** | El Director consulta el dashboard global para identificar los proyectos con semáforo en rojo y decidir qué acciones estratégicas priorizar. |
| **Contraejemplos** | Un Manager que gestiona su propia cartera de proyectos no es un Director; su visibilidad está limitada a los proyectos que tiene asignados. |
| **Entidad relacionada** | [ACT-H002] |

---

### [GLO-T012] Entorno

| Propiedad | Valor |
|-----------|-------|
| **Definición** | Infraestructura de ejecución categorizada (cualificación, producción o performance) sobre la que se despliega y opera un aplicativo; cada entorno se registra en el catálogo tecnológico con su nombre, tipo y proveedor o plataforma. |
| **Sinónimos autorizados** | Entorno de infraestructura |
| **Sinónimos prohibidos** | Servidor, Clúster, Plataforma, Nodo |
| **Ejemplos** | Un entorno de producción alojado en Client Azure; un entorno de cualificación en SSG VCF. |
| **Contraejemplos** | El puesto de trabajo del desarrollador no es un entorno de infraestructura; pertenece al bloque "Entorno de desarrollo" del catálogo. |
| **Entidad relacionada** | [GLO-T009] Cualificación, [GLO-T007] Catálogo tecnológico |

---

### [GLO-T013] Estado

| Propiedad | Valor |
|-----------|-------|
| **Definición** | Valor que indica la situación actual de una entrada del catálogo tecnológico; los valores posibles son "activo" — la entrada se usa en al menos un proyecto — y "dado de baja" — el Administrador la ha retirado porque ya no se utiliza en ningún proyecto. |
| **Sinónimos autorizados** | Ninguno |
| **Sinónimos prohibidos** | Status, Situación, Condición, Vigencia |
| **Ejemplos** | Una herramienta que sigue siendo utilizada en proyectos activos tiene estado "activo". Una tecnología reemplazada en todos sus proyectos puede ser marcada "dado de baja" por el Administrador. |
| **Contraejemplos** | El semáforo de estado (verde/naranja/rojo) de un proyecto no es el "Estado" de una entrada del catálogo; es un indicador de salud agregado con un nombre diferente. |
| **Entidad relacionada** | [GLO-T007] Catálogo tecnológico |

---

### [GLO-T014] Fase

| Propiedad | Valor |
|-----------|-------|
| **Definición** | Período del plan de desarrollo del producto que agrupa un conjunto coherente de funcionalidades a entregar; las fases se numeran y se ejecutan de forma secuencial, con el alcance de cada una definido explícitamente. |
| **Sinónimos autorizados** | Ninguno |
| **Sinónimos prohibidos** | Sprint, Iteración, Release, Versión |
| **Ejemplos** | La Fase 0 cubre el catálogo tecnológico y la cartografía organizativa. La Fase 1 añade los KPIs de madurez, las vistas agregadas y la gestión de riesgos. La Fase 2 incorpora integraciones automáticas e histórico de KPIs. |
| **Contraejemplos** | Un sprint de desarrollo no es una fase; es una unidad de trabajo dentro de una fase. Una funcionalidad puntual tampoco define una fase. |
| **Entidad relacionada** | Ninguna |

---

### [GLO-T015] Herramienta de IA

| Propiedad | Valor |
|-----------|-------|
| **Definición** | Entrada del catálogo tecnológico que representa una solución de inteligencia artificial utilizada por los equipos de un proyecto para asistir o automatizar tareas dentro del ciclo de desarrollo. |
| **Sinónimos autorizados** | Ninguno |
| **Sinónimos prohibidos** | IA (como término genérico), Copiloto (como término genérico), Bot, Asistente |
| **Ejemplos** | GitHub Copilot y Claude Code son herramientas de IA registrables en el catálogo tecnológico, en el bloque "Inteligencia Artificial". |
| **Contraejemplos** | Un proceso de revisión de código realizado manualmente por un humano, aunque resulte de una sugerencia de IA, no es en sí mismo una herramienta de IA. La dimensión de madurez "Uso de IA" tampoco es una herramienta; es la medida de la adopción de estas herramientas. |
| **Entidad relacionada** | [GLO-T006] Caso de éxito de IA, [GLO-T007] Catálogo tecnológico |

---

### [GLO-T016] Industrialización

| Propiedad | Valor |
|-----------|-------|
| **Definición** | Dimensión de madurez que mide el nivel de automatización de la cadena de integración continua de un aplicativo, desde el registro de un cambio de código hasta la publicación del artefacto versionado en el repositorio corporativo. |
| **Sinónimos autorizados** | Integración continua, CI |
| **Sinónimos prohibidos** | DevOps, Build, Automatización |
| **Ejemplos** | Un aplicativo con pipeline de integración continua activo, Quality Gate verde y publicación automatizada de artefactos firmados tiene una alta madurez en Industrialización. |
| **Contraejemplos** | El despliegue del artefacto en los entornos de destino no forma parte de la Industrialización; pertenece a la dimensión de madurez Despliegue. La calidad de código, aunque medida en el pipeline, tiene su propia dimensión independiente. |
| **Entidad relacionada** | [GLO-T010] Dimensión de madurez |

---

### [GLO-T017] KPI de madurez

| Propiedad | Valor |
|-----------|-------|
| **Definición** | Indicador numérico en escala 1 a 10 que cuantifica el nivel de adopción y excelencia de una práctica técnica concreta en un aplicativo; se registra con puntuación, fecha de evaluación y justificación obligatorias, y con datos brutos opcionales. Si el aplicativo no ha sido evaluado en esa dimensión, el KPI queda sin valor (nulo). |
| **Sinónimos autorizados** | Indicador de madurez, KPI |
| **Sinónimos prohibidos** | Métrica, Nota, Score, Calificación |
| **Ejemplos** | Un KPI de Testing con valor 7 indica que el aplicativo tiene pruebas integradas en CI con una cobertura entre el 25 % y el 50 %. Un KPI de Industrialización con valor 9 indica pipelines con plantillas corporativas y sin vulnerabilidades. |
| **Contraejemplos** | El semáforo de estado (rojo/naranja/verde) no es un KPI de madurez; es el resultado de aplicar el árbol de decisión sobre el conjunto de KPIs. La puntuación de la plantilla de valoración tampoco es el KPI; es la guía que ayuda a determinarlo. |
| **Entidad relacionada** | [GLO-T010] Dimensión de madurez, [GLO-T021] Plantilla de valoración |

---

### [GLO-T018] Manager

| Propiedad | Valor |
|-----------|-------|
| **Definición** | Perfil de usuario de la DT responsable de la gestión operativa y la supervisión de la información de los proyectos que tiene asignados; puede crear y editar aplicativos dentro de su cartera y publicar casos de éxito de IA. |
| **Sinónimos autorizados** | Chef de Projet, CP, Jefe de Proyecto |
| **Sinónimos prohibidos** | Project Manager, Responsable de proyecto |
| **Ejemplos** | El Manager supervisa la información técnica de sus proyectos, detecta riesgos en su cartera y publica un caso de éxito de IA documentado por su equipo. Un proyecto puede tener varios Managers asignados; un aplicativo tiene como máximo uno o dos. |
| **Contraejemplos** | El Referente DT no es un Manager; su responsabilidad se centra en la veracidad del dato técnico, no en la gestión operativa del proyecto. |
| **Entidad relacionada** | [ACT-H003] |

---

### [GLO-T019] Madurez técnica

| Propiedad | Valor |
|-----------|-------|
| **Definición** | Medida del nivel de adopción y excelencia de las prácticas técnicas de un aplicativo, expresada mediante el conjunto de siete KPIs de madurez que cubren Testing, Industrialización, Calidad de código, Despliegue, Madurez tecnológica, Uso de IA y Performance. |
| **Sinónimos autorizados** | Madurez |
| **Sinónimos prohibidos** | Calidad, Rendimiento, Nivel técnico, Excelencia técnica |
| **Ejemplos** | Un aplicativo con todos sus KPIs por encima de 7 tiene una madurez técnica alta. La vista radar muestra de forma visual el perfil de madurez técnica de cada aplicativo. |
| **Contraejemplos** | La madurez organizativa o de gestión del equipo humano no es madurez técnica en el sentido del sistema. La satisfacción del cliente tampoco es una dimensión de madurez técnica. |
| **Entidad relacionada** | [GLO-T017] KPI de madurez, [GLO-T026] Radar |

---

### [GLO-T020] Plan de acción

| Propiedad | Valor |
|-----------|-------|
| **Definición** | Descripción de las medidas correctivas o preventivas asociadas a un riesgo técnico, que especifica qué debe realizarse, por quién y en qué plazo para reducir o eliminar el riesgo identificado. |
| **Sinónimos autorizados** | Ninguno |
| **Sinónimos prohibidos** | Remediación, Corrective action, Medida correctora |
| **Ejemplos** | Ante un riesgo de obsolescencia tecnológica, el plan de acción puede contemplar la actualización de la versión del framework en un plazo determinado, con el Referente DT como responsable. |
| **Contraejemplos** | La generación automática de un riesgo técnico por umbral incumplido no es un plan de acción; es el detonante que motiva su creación. Un umbral tampoco es un plan de acción. |
| **Entidad relacionada** | [GLO-T028] Riesgo técnico |

---

### [GLO-T021] Plantilla de valoración

| Propiedad | Valor |
|-----------|-------|
| **Definición** | Guía de referencia administrable que define los criterios objetivos y ejemplos concretos que justifican cada nivel de puntuación (1-10, o sin valor si la dimensión no ha sido evaluada) para una dimensión de madurez específica; sirve de referencia al Referente DT cuando introduce un KPI. |
| **Sinónimos autorizados** | Guía de puntuación |
| **Sinónimos prohibidos** | Rúbrica, Criterio de evaluación, Baremo |
| **Ejemplos** | La plantilla de valoración del KPI de Testing describe qué características del aplicativo justifican cada puntuación del 1 al 10: pruebas mínimas sin integración en CI (1), tests en CI con cobertura superior al 80 % (10). |
| **Contraejemplos** | Un valor de KPI registrado en el sistema no es una plantilla de valoración; es el resultado de aplicarla. El árbol de decisión tampoco es una plantilla; opera sobre los valores de KPI ya registrados. |
| **Entidad relacionada** | [GLO-T017] KPI de madurez, gestionada por [GLO-T001] Administrador |

---

### [GLO-T022] Proyecto

| Propiedad | Valor |
|-----------|-------|
| **Definición** | Nivel intermedio de la jerarquía organizativa; agrupa uno o más aplicativos desarrollados o mantenidos por la DT bajo un mismo contrato o iniciativa para un cliente determinado. |
| **Sinónimos autorizados** | Ninguno |
| **Sinónimos prohibidos** | Contrato, Iniciativa, Programa, Cuenta |
| **Ejemplos** | El conjunto de aplicativos desarrollados para digitalizar los procesos de recursos humanos de un cliente constituye un Proyecto dentro de la jerarquía. |
| **Contraejemplos** | Un aplicativo individual no es un Proyecto; es uno de sus componentes. El Cliente que encarga el proyecto tampoco es el Proyecto. |
| **Entidad relacionada** | Contenido en [GLO-T008] Cliente; contiene [GLO-T002] Aplicativo |

---

### [GLO-T023] Punto dorado

| Propiedad | Valor |
|-----------|-------|
| **Definición** | Valor de un KPI de madurez que representa la mejor puntuación registrada entre los elementos del nivel inferior en un agregado (aplicativos de un proyecto o proyectos de un cliente), utilizado para identificar y visibilizar las mejores prácticas existentes. |
| **Sinónimos autorizados** | Ninguno |
| **Sinónimos prohibidos** | Máximo, Mejor valor, Valor máximo |
| **Ejemplos** | El punto dorado del KPI de Testing en un proyecto corresponde al aplicativo que tiene la puntuación más alta en esa dimensión; sirve para reconocer buenas prácticas y promover su adopción. |
| **Contraejemplos** | La media de los KPIs de un proyecto no es un punto dorado; es el método de agregación estándar. El semáforo de estado tampoco es un punto dorado. |
| **Entidad relacionada** | [GLO-T033] Vista agregada, [GLO-T024] Punto negro |

---

### [GLO-T024] Punto negro

| Propiedad | Valor |
|-----------|-------|
| **Definición** | Valor de un KPI de madurez que representa la peor puntuación registrada entre los elementos del nivel inferior en un agregado (aplicativos de un proyecto o proyectos de un cliente), utilizado para identificar los mayores riesgos técnicos de la cartera. |
| **Sinónimos autorizados** | Ninguno |
| **Sinónimos prohibidos** | Mínimo, Peor valor, Valor mínimo |
| **Ejemplos** | Si el aplicativo con menor puntuación en Industrialización dentro de un proyecto tiene un valor de 2, ese 2 es el punto negro del KPI de Industrialización para ese proyecto. |
| **Contraejemplos** | Un riesgo técnico automático generado por un umbral incumplido no es un punto negro; puede ser una consecuencia de él, pero son conceptos distintos. |
| **Entidad relacionada** | [GLO-T033] Vista agregada, [GLO-T023] Punto dorado |

---

### [GLO-T025] Puesto de trabajo

| Propiedad | Valor |
|-----------|-------|
| **Definición** | Entrada del catálogo tecnológico que describe la modalidad de entorno físico o virtual de trabajo utilizada por los miembros del equipo de desarrollo de un aplicativo. |
| **Sinónimos autorizados** | Ninguno |
| **Sinónimos prohibidos** | Ordenador, Estación de trabajo, Workstation, Terminal |
| **Ejemplos** | Escritorio virtual (VDI), equipo físico en instalaciones internas, equipo físico en instalaciones del cliente son tipos de puesto de trabajo registrables en el catálogo. |
| **Contraejemplos** | Los entornos de cualificación o producción en los que se despliega el aplicativo no son puestos de trabajo; son entornos de infraestructura. |
| **Entidad relacionada** | [GLO-T007] Catálogo tecnológico |

---

### [GLO-T026] Radar

| Propiedad | Valor |
|-----------|-------|
| **Definición** | Representación visual de la madurez técnica de un aplicativo en forma de diagrama poligonal que muestra simultáneamente los valores de los siete KPIs de madurez, permitiendo una lectura rápida del perfil de fortalezas y debilidades. |
| **Sinónimos autorizados** | Diagrama de radar, Radar chart |
| **Sinónimos prohibidos** | Gráfico de araña, Spider chart, Gráfico radial |
| **Ejemplos** | El radar de un aplicativo con todos los KPIs en 8 o más forma un polígono amplio y regular; uno con desequilibrios pronunciados muestra vértices muy desiguales, señalando las dimensiones más débiles. |
| **Contraejemplos** | El semáforo de estado no es un radar; es un indicador agregado de tres niveles (rojo/naranja/verde). La vista agregada de un proyecto tampoco es un radar; el radar es específico del nivel de aplicativo. |
| **Entidad relacionada** | [GLO-T019] Madurez técnica, [GLO-T033] Vista agregada |

---

### [GLO-T027] Referente DT

| Propiedad | Valor |
|-----------|-------|
| **Definición** | Perfil de usuario de la Dirección Técnica responsable de la veracidad y la actualización de la información técnica de los aplicativos en los proyectos que tiene asignados; es el responsable principal de la cartografía organizativa, del registro de KPIs y de la publicación de casos de éxito de IA. |
| **Sinónimos autorizados** | Ninguno |
| **Sinónimos prohibidos** | Técnico, Desarrollador, Arquitecto, Experto técnico |
| **Ejemplos** | El Referente DT registra el stack tecnológico de un nuevo aplicativo, introduce los valores de KPI cada dos meses y documenta un caso de éxito de IA de su equipo. Los Referentes DT tienen visibilidad de lectura sobre todos los proyectos pero sólo pueden crear y editar aplicativos en los proyectos que tienen asignados. |
| **Contraejemplos** | El Manager no es un Referente DT aunque pueda editar información de sus proyectos; sus responsabilidades principales son la gestión operativa, no la calidad del dato técnico. |
| **Entidad relacionada** | [ACT-H004] |

---

### [GLO-T028] Riesgo técnico

| Propiedad | Valor |
|-----------|-------|
| **Definición** | Situación identificada en un aplicativo, proyecto o cliente que puede comprometer la calidad, la seguridad o la continuidad del servicio; puede generarse de forma automática cuando un KPI cae por debajo de su umbral configurado, o registrarse de forma manual con un plan de acción asociado. |
| **Sinónimos autorizados** | Riesgo |
| **Sinónimos prohibidos** | Incidencia, Alerta, Bug, Defecto |
| **Ejemplos** | Un KPI de Madurez tecnológica con valor 2 activa automáticamente un riesgo técnico de obsolescencia. Un Manager puede registrar manualmente un riesgo vinculado a la rotación del equipo técnico. |
| **Contraejemplos** | Una sugerencia de mejora sin umbral incumplido y sin impacto potencial identificado no es un riesgo técnico. Una incidencia en producción gestionada en el sistema de tickets tampoco es un riesgo técnico en el sentido del sistema. |
| **Entidad relacionada** | [GLO-T032] Umbral, [GLO-T020] Plan de acción |

---

### [GLO-T029] Semáforo de estado

| Propiedad | Valor |
|-----------|-------|
| **Definición** | Indicador visual de tres niveles — verde, naranja y rojo — que representa el estado de salud agregado de un cliente, proyecto o aplicativo, calculado a partir de las reglas del árbol de decisión aplicadas sobre los KPIs de madurez. |
| **Sinónimos autorizados** | Ninguno |
| **Sinónimos prohibidos** | RAG status, Traffic light, Indicador de color, Indicador de salud |
| **Ejemplos** | Un proyecto en el que más del 30 % de sus aplicativos tienen una puntuación media inferior a 5 muestra semáforo rojo. Un proyecto con ≤ 10 % de aplicativos por debajo de ese umbral muestra semáforo verde. |
| **Contraejemplos** | Un KPI de madurez individual no es un semáforo de estado; es un dato de entrada para el árbol de decisión que determina el semáforo. El estado ("activo"/"dado de baja") de una entrada del catálogo tecnológico tampoco es un semáforo. |
| **Entidad relacionada** | [GLO-T003] Árbol de decisión, [GLO-T033] Vista agregada |

---

### [GLO-T030] Stack tecnológico

| Propiedad | Valor |
|-----------|-------|
| **Definición** | Conjunto de tecnologías de proyecto — lenguajes de programación, frameworks, entornos de ejecución y tipos de contenedores u orquestación — utilizadas en el desarrollo y la operación de un aplicativo, registradas a partir de entradas del catálogo tecnológico. |
| **Sinónimos autorizados** | Stack |
| **Sinónimos prohibidos** | Arquitectura técnica, Tecnologías utilizadas, Entorno tecnológico |
| **Ejemplos** | El stack tecnológico de un aplicativo puede incluir un lenguaje de programación, un framework de aplicación y la tecnología de contenedores utilizada para su ejecución. |
| **Contraejemplos** | Las herramientas de CI/CD no forman parte del stack tecnológico; pertenecen al bloque de Industrialización CI/CD del catálogo. Los entornos de infraestructura tampoco son parte del stack; se registran en el bloque de Entornos. |
| **Entidad relacionada** | [GLO-T007] Catálogo tecnológico, [GLO-T002] Aplicativo |

---

### [GLO-T031] Tipo de propiedad

| Propiedad | Valor |
|-----------|-------|
| **Definición** | Atributo de una herramienta registrada en el catálogo tecnológico que indica el nivel organizativo que la gestiona: corporativo (gestionada por la DT para todos sus proyectos), proyecto (configurada para un proyecto concreto) o cliente (gestionada por el cliente). |
| **Sinónimos autorizados** | Ninguno |
| **Sinónimos prohibidos** | Propietario, Licencia, Responsable, Titular |
| **Ejemplos** | Una herramienta de análisis de calidad de código gestionada centralmente por la DT tiene tipo de propiedad "corporativa". Una herramienta de integración continua configurada exclusivamente para un proyecto específico tiene tipo "proyecto". |
| **Contraejemplos** | El nombre del proveedor o fabricante de la herramienta no es su tipo de propiedad. El estado ("activo"/"dado de baja") de la herramienta tampoco es su tipo de propiedad. |
| **Entidad relacionada** | [GLO-T007] Catálogo tecnológico |

---

### [GLO-T032] Umbral

| Propiedad | Valor |
|-----------|-------|
| **Definición** | Valor mínimo configurado para un KPI de madurez a partir del cual, si la puntuación registrada se sitúa por debajo, el árbol de decisión genera automáticamente un riesgo técnico o modifica el semáforo de estado del aplicativo, proyecto o cliente. |
| **Sinónimos autorizados** | Umbral de KPI |
| **Sinónimos prohibidos** | Límite, Mínimo aceptable, Threshold, Valor de corte |
| **Ejemplos** | Si el umbral del KPI de Industrialización está fijado en 5 y un aplicativo registra una puntuación de 3, el árbol de decisión genera automáticamente un riesgo técnico de industrialización insuficiente. |
| **Contraejemplos** | La puntuación de un KPI en sí misma no es un umbral; es el valor que se compara con él. El árbol de decisión tampoco es un umbral; lo utiliza como parámetro. |
| **Entidad relacionada** | [GLO-T017] KPI de madurez, [GLO-T003] Árbol de decisión |

---

### [GLO-T033] Vista agregada

| Propiedad | Valor |
|-----------|-------|
| **Definición** | Representación visual consolidada de los KPIs de madurez de un conjunto de elementos (aplicativos de un proyecto, proyectos de un cliente, o todos los clientes), calculada mediante la media de los indicadores del nivel inferior o mediante la exposición de puntos negros y puntos dorados. |
| **Sinónimos autorizados** | Dashboard, Vista consolidada |
| **Sinónimos prohibidos** | Informe, Reporte, Cuadro de mando |
| **Ejemplos** | La vista agregada de un cliente muestra la media de los KPIs de todos sus proyectos, el semáforo de estado y los puntos negros por dimensión. La vista global del Director agrega todos los clientes en un único panel. |
| **Contraejemplos** | La ficha detallada de un aplicativo individual no es una vista agregada; es la vista de un único elemento. El radar es específico del nivel de aplicativo y no es una vista agregada de nivel superior. |
| **Entidad relacionada** | [GLO-T026] Radar, [GLO-T029] Semáforo de estado, [GLO-T023] Punto dorado, [GLO-T024] Punto negro |

---

## Índice alfabético

| Término | ID | Definición resumida |
|---------|----|---------------------|
| Administrador | [GLO-T001] | Perfil con acceso total que gestiona el catálogo, la jerarquía y las reglas del sistema. |
| Aplicativo | [GLO-T002] | Unidad mínima de la jerarquía; sistema o componente software asociado a un proyecto. |
| Árbol de decisión | [GLO-T003] | Conjunto de reglas configurables que determina el semáforo y los riesgos automáticos. |
| Bloque temático | [GLO-T004] | Agrupación funcional de entradas del catálogo tecnológico. |
| Cartografía organizativa | [GLO-T005] | Proceso de registrar la jerarquía y las asociaciones técnicas de los aplicativos. |
| Caso de éxito de IA | [GLO-T006] | Registro documentado de un beneficio notable derivado del uso de IA en un proyecto. |
| Catálogo tecnológico | [GLO-T007] | Repositorio administrado de tecnologías, herramientas y configuraciones de referencia. |
| Cliente | [GLO-T008] | Nivel superior de la jerarquía; organización para la que la DT gestiona proyectos. |
| Cualificación | [GLO-T009] | Conjunto de entornos de prueba utilizados antes del paso a producción. |
| Dimensión de madurez | [GLO-T010] | Área técnica evaluada de forma independiente mediante un KPI propio. |
| Director | [GLO-T011] | Perfil con visibilidad total en lectura; consumidor principal de las vistas ejecutivas. |
| Entorno | [GLO-T012] | Infraestructura de ejecución (cualificación, producción o performance) de un aplicativo. |
| Estado | [GLO-T013] | Situación de una entrada del catálogo: "activo" o "dado de baja". |
| Fase | [GLO-T014] | Período del plan de desarrollo que agrupa un conjunto coherente de funcionalidades. |
| Herramienta de IA | [GLO-T015] | Solución de inteligencia artificial registrada en el catálogo y usada por los equipos. |
| Industrialización | [GLO-T016] | Dimensión de madurez que mide la automatización de la cadena de integración continua. |
| KPI de madurez | [GLO-T017] | Indicador 1-10 (vacío si no evaluado) que cuantifica la excelencia de una práctica técnica en un aplicativo. |
| Manager | [GLO-T018] | Perfil responsable de la gestión operativa de los proyectos de su cartera. |
| Madurez técnica | [GLO-T019] | Medida global de las prácticas técnicas de un aplicativo a través de siete KPIs. |
| Plan de acción | [GLO-T020] | Medidas correctivas asociadas a un riesgo técnico, con responsable y plazo. |
| Plantilla de valoración | [GLO-T021] | Guía de referencia con criterios objetivos para puntuar una dimensión de madurez. |
| Proyecto | [GLO-T022] | Nivel intermedio de la jerarquía; agrupa aplicativos bajo un mismo contrato o iniciativa. |
| Punto dorado | [GLO-T023] | Mejor puntuación de un KPI en un agregado; identifica buenas prácticas. |
| Punto negro | [GLO-T024] | Peor puntuación de un KPI en un agregado; identifica los mayores riesgos. |
| Puesto de trabajo | [GLO-T025] | Modalidad de entorno de trabajo del equipo de desarrollo registrada en el catálogo. |
| Radar | [GLO-T026] | Diagrama poligonal que muestra los siete KPIs de madurez de un aplicativo. |
| Referente DT | [GLO-T027] | Perfil responsable de la calidad del dato técnico en sus proyectos asignados. |
| Riesgo técnico | [GLO-T028] | Situación que puede comprometer la calidad o continuidad de un aplicativo. |
| Semáforo de estado | [GLO-T029] | Indicador verde/naranja/rojo del estado de salud agregado de un elemento. |
| Stack tecnológico | [GLO-T030] | Conjunto de lenguajes, frameworks y contenedores utilizados en un aplicativo. |
| Tipo de propiedad | [GLO-T031] | Atributo que indica si una herramienta es corporativa, de proyecto o de cliente. |
| Umbral | [GLO-T032] | Valor mínimo de KPI que, si se incumple, activa el árbol de decisión. |
| Vista agregada | [GLO-T033] | Panel consolidado de KPIs calculado por media, puntos negros o puntos dorados. |

---

## Puntos de atención — Ambigüedades identificadas

| ID | Término afectado | Descripción | Recomendación |
|----|-----------------|-------------|---------------|
| AMB-01 | Catálogo tecnológico / Referencial | DCO-001 utiliza "Referencial" como término principal; VIS-001 utiliza "catálogo tecnológico" como título del elemento [IN-01]. Se han alineado como sinónimos, con "catálogo tecnológico" como término canónico por ser más descriptivo. | Confirmar con el sponsor qué término prefieren en la interfaz. |
| AMB-02 | Manager / Chef de Projet / CP | DCO-001 plantea la duda sobre si "CP" es acrónimo de "Chef de Projet". VIS-001 confirma la equivalencia Manager = Chef de Projet = CP. Se ha definido "Manager" como canónico y los demás como sinónimos autorizados. | Sin acción adicional requerida. |
| AMB-03 | Cualificación / Qualificación | DCO-001 usa la grafía "qualificación" (no estándar en español). VIS-001 PA-06 resuelve la normalización a "cualificación". Glosario adopta la grafía normalizada. | Grafía resuelta; verificar que ningún formulario de la interfaz use la grafía anterior. |
| AMB-04 | Estado (catálogo) vs. Semáforo de estado | El término "estado" puede confundirse con "semáforo de estado". Se han definido como conceptos distintos con nombres específicos para evitar colisiones. | Asegurar que en la interfaz los dos conceptos tengan etiquetas claramente diferenciadas. |

---

## Definition of Ready

Un glosario se considera **listo para uso por los agentes consumidores** cuando cumple todos los criterios siguientes:

| # | Criterio | Estado | Evidencia |
|---|----------|--------|-----------|
| DoR-G1 | Todos los conceptos clave del alcance están definidos (mín. 20 términos) | READY | 33 términos; cobertura DOM-01..07, 7 KPIs, 4 roles |
| DoR-G2 | Cada término tiene las 6 propiedades cubiertas (sin celdas vacías) | READY | Verificado en los 33 términos |
| DoR-G3 | No hay definiciones circulares (ningún término se define usando sí mismo) | READY | Verificado |
| DoR-G4 | Sinónimos prohibidos declarados en cada término ("Ninguno" si no aplica) | READY | Declarados explícitamente en los 33 términos |
| DoR-G5 | Índice alfabético completo y consistente con la sección Términos | READY | 33 entradas, orden alfabético, alineadas con el cuerpo |
| DoR-G6 | Trazabilidad: al menos un documento fuente identificado con su estado | READY | [DCO-001] y [VIS-001] con estado declarado |
| DoR-G7 | Ambigüedades documentadas en la sección Puntos de atención | READY | AMB-01..04 con descripción y recomendación |
| DoR-G8 | Sin placeholders residuales en ninguna sección | READY | Verificado |

**Resultado global: READY** — Glosario listo para consumo por agent-actors (ba-1.3) y agentes de especificación y diseño (S2, S3).

---

## Trazabilidad

| Elemento | Detalle |
|---------|--------|
| **Producido por** | agent-glossary |
| **Fecha de producción** | 2026-04-28 |
| **Entradas utilizadas** | [DCO-001] Discovery — Project Monitor (status: draft — WARN); [VIS-001] Visión y Alcance del Producto — Project Monitor (status: review — WARN) |
| **Validado por** | Pendiente |
| **Fecha de validación** | Pendiente |

---

## Production confidence

| Dimensión | Nivel | Brechas identificadas |
|-----------|-------|-----------------------|
| Entradas suficientes | PARTIAL | Ambas entradas están en estado draft/review, sin validación formal del sponsor. El contenido de [VIS-001] es completo y detallado (8 elementos IN, 7 KPIs validados, hipótesis resueltas); [DCO-001] aporta el proto-glosario con 13 términos candidatos. La cobertura conceptual es alta a pesar del estado draft. |
| Cobertura del alcance | CONFIDENT | Los 33 términos cubren todos los dominios funcionales (DOM-01 a DOM-07), todos los roles (ACT-001 a ACT-004), los 7 KPIs de madurez, los mecanismos de visualización y los conceptos de riesgo. Ningún concepto del alcance IN-01 a IN-08 queda sin término definido. |
| Usabilidad por agent-actors | CONFIDENT | Las definiciones son no circulares, con sinónimos prohibidos explícitos y contraejemplos concretos. El glosario es directamente utilizable por los agentes de especificación (S2) y diseño (S3) sin ambigüedades pendientes de resolución crítica. Las cuatro ambigüedades identificadas (AMB-01 a AMB-04) son menores o ya resueltas en los documentos fuente. |

**Puntuación global:** 2,5/3 CONFIDENT — Glosario completo y operativo con 33 términos definidos. La calificación PARTIAL en entradas refleja únicamente el estado draft/review de los documentos fuente, no deficiencias de contenido. Listo para su uso en las fases de especificación y diseño funcional.
