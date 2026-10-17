---
id: VIS-001
title: "Visión y Alcance del Producto — Project Monitor"
phase: 1-scoping
type: vision
status: validated
version: "1.2"
last_updated: 2026-04-28
author: agent-vision
reviewers: []
dependencies:
  - DCO-001
---

# [VIS-001] Visión y Alcance del Producto

## 1. Contexto

### 1.1 Situación actual

La Dirección Técnica (DT) gestiona un volumen significativo de aplicativos distribuidos en decenas de clientes y cientos de proyectos. En la situación actual no existe ningún sistema centralizado que agregue el estado tecnológico, industrial y de calidad de estos aplicativos. La información se encuentra dispersa y debe recogerse de forma manual y ad hoc, sin una estructura homogénea ni una visión consolidada disponible para la dirección.

Esta dispersión impide detectar riesgos técnicos de forma proactiva, dificulta la toma de decisiones informadas y genera una carga operativa elevada para los responsables de mantener la información actualizada.

### 1.2 Problema a resolver

La Dirección Técnica carece de una plataforma que le permita:

- Conocer en todo momento el estado tecnológico de cada aplicativo (stack tecnológico, entornos, configuración de industrialización).
- Medir de forma estructurada y homogénea la madurez técnica de sus aplicativos mediante indicadores cuantitativos.
- Agregar esa información a nivel de proyecto y cliente para ofrecer una visión ejecutiva coherente.
- Detectar automáticamente riesgos derivados de niveles de madurez por debajo de los umbrales definidos (obsolescencia tecnológica, baja cobertura de pruebas, deficiencias en el proceso de industrialización, etc.).
- Visibilizar el nivel de adopción de herramientas de inteligencia artificial en los equipos y compartir las buenas prácticas documentadas.

### 1.3 Partes interesadas

| Parte interesada | Rol en el proyecto | Nivel de implicación |
|---|---|---|
| Administrador | Gestión del catálogo de referencia y de los usuarios del sistema; mantenimiento de la integridad del catálogo | Alto — usuario operativo con acceso total al sistema |
| Director | Consumo de la visión ejecutiva global; toma de decisiones estratégicas a partir de los cuadros de mando | Alto — destinatario principal de las vistas de agregación y del semáforo global |
| Manager (Jefe de Proyecto) | Gestión y validación de la información de sus proyectos asignados; detección de riesgos en su cartera; validación de casos de uso de inteligencia artificial | Alto — usuario operacional regular |
| Referente DT | Captura y mantenimiento de la información técnica y de los indicadores de madurez de los aplicativos asignados; garantía de la calidad del dato | Alto — principal proveedor de datos del sistema |
| Dirección Técnica (sponsor) | Promotor del proyecto; valida el alcance y las prioridades de cada fase | Medio — implicado en los hitos de validación |

---

## 2. Visión

**Enunciado de visión:**
Project Monitor es la plataforma interna de la Dirección Técnica que centraliza la cartografía, la madurez y los riesgos técnicos de todos sus aplicativos, permitiendo a sus equipos y directivos tomar decisiones informadas, detectar riesgos de forma proactiva y visibilizar el nivel de adopción de la inteligencia artificial en sus proyectos.

### 2.1 Objetivos

| ID | Objetivo | Indicador de éxito | Meta |
|---|---|---|---|
| OBJ-001 | Centralizar la cartografía de todos los aplicativos gestionados por la DT con su stack tecnológico y configuración de industrialización | Porcentaje de aplicativos del porfolio registrados con información completa en el sistema | 100 % de los aplicativos activos registrados al cierre de la Fase 0 |
| OBJ-002 | Medir la madurez técnica de cada aplicativo mediante indicadores estructurados en escala 1-10 | Porcentaje de aplicativos con los indicadores de madurez cumplimentados para todas las dimensiones definidas | 100 % de los aplicativos activos con indicadores actualizados al cierre de la Fase 1 |
| OBJ-003 | Proporcionar al Director una visión ejecutiva agregada por proyecto y por cliente con semáforo de estado | Disponibilidad de cuadro de mando global con semáforo de estado (verde/naranja/rojo) operativo para todos los clientes y proyectos | Cuadro de mando operativo desde el inicio de la Fase 1 |
| OBJ-004 | Reducir el tiempo necesario para identificar aplicativos en situación de riesgo técnico | Tiempo medio desde la aparición de un riesgo hasta su identificación por el equipo responsable | Detección automática en tiempo real en sustitución de la revisión manual periódica |
| OBJ-005 | Visibilizar el nivel de adopción de herramientas de inteligencia artificial en los equipos y compartir casos de uso documentados | Número de casos de uso de inteligencia artificial validados y registrados en el sistema | Al menos 1 caso de uso registrado y validado por proyecto activo al cierre de la Fase 1 |

### 2.2 Beneficios esperados

- **Visibilidad ejecutiva inmediata:** el Director dispone en todo momento de un cuadro de mando que refleja el estado de salud del porfolio completo, sin necesidad de solicitar informes manuales a los equipos.
- **Gestión proactiva del riesgo:** los riesgos derivados de niveles de madurez por debajo de los umbrales definidos se identifican automáticamente, permitiendo actuar antes de que se conviertan en incidencias.
- **Calidad y trazabilidad del dato técnico:** la responsabilidad de mantener la información actualizada está asignada a roles concretos (Referente DT, Manager), lo que mejora la fiabilidad y homogeneidad de los indicadores.
- **Estandarización tecnológica:** un catálogo centralizado de tecnologías y herramientas facilita la homogeneización de los aplicativos y la detección de situaciones de obsolescencia.
- **Valorización de la innovación:** el registro estructurado de casos de uso de inteligencia artificial permite compartir buenas prácticas entre equipos y reconocer los avances conseguidos.

---

## 3. Alcance

### 3.1 En alcance (IN)

| ID | Elemento de alcance | Descripción |
|---|---|---|
| IN-001 | Gestión del catálogo de referencia | Creación, modificación y eliminación de los elementos del catálogo de referencia tecnológico de la DT: lenguajes y herramientas de proyecto, entornos de desarrollo, entornos de infraestructura (cualificación y producción), herramientas de integración y despliegue continuo, herramientas de calidad y seguridad, herramientas de inteligencia artificial. Administrado exclusivamente por el rol Administrador. |
| IN-002 | Gestión de la jerarquía organizativa | Creación y mantenimiento de la estructura Cliente > Proyecto > Aplicativo, incluyendo los metadatos básicos de cada nivel y la asociación de cada aplicativo a los elementos del catálogo de referencia. El Administrador gestiona la estructura completa; el Referente DT es el responsable principal de la información de los aplicativos asignados. |
| IN-003 | Gestión de usuarios y roles | Registro de usuarios con sus roles (Administrador, Director, Manager, Referente DT), autenticación mediante proveedor de identidad basado en OpenID Connect (Keycloak en entorno de desarrollo; Active Directory Corporativo Azure en cualificación y producción) y asignación de proyectos a Managers y Referentes DT. |
| IN-004 | Captura y seguimiento de indicadores de madurez | Registro de los indicadores de madurez por aplicativo (escala 1-10) para las 7 dimensiones definidas: industrialización, calidad de código, cobertura de pruebas, despliegue, madurez tecnológica / obsolescencia, madurez en el uso de inteligencia artificial y performance. Entrada 100 % manual por el Referente DT en el MVP (Fase 0 y Fase 1). Las integraciones automáticas con herramientas externas (SonarQube, GitLab, etc.) se estudiarán a partir de Fase 2. |
| IN-005 | Registro de casos de uso de inteligencia artificial | Creación de registros de experiencias de uso de inteligencia artificial en proyectos: el usuario da de alta el caso de uso, se registran la fecha, el contenido descriptivo y los adjuntos opcionales. No se requiere flujo de validación complejo en el MVP; el registro sirve como repositorio de seguimiento y de buenas prácticas compartidas. |
| IN-006 | Visualización agregada por aplicativo, proyecto, cliente y global | Cuadros de mando con gráfico de radar por aplicativo y tres formatos de agregación a nivel de proyecto, cliente y global: (1) **Vista media** — puntuación promedio de los indicadores de los aplicativos del perímetro; (2) **Vista puntos negros** — destacando los aplicativos o indicadores con las peores puntuaciones; (3) **Vista puntos dorados** — destacando los aplicativos o indicadores con las mejores puntuaciones. Vista global para el Director con semáforo de estado (verde/naranja/rojo) calculado mediante reglas de decisión configuradas por el Administrador. |
| IN-007 | Identificación automática de riesgos y gestión de riesgos manuales | Generación automática de alertas de riesgo cuando los indicadores de madurez superan los umbrales definidos por las reglas de decisión configuradas por el Administrador. Las reglas de decisión permiten expresar condiciones combinadas sobre los indicadores (ej.: si el 30 % de los indicadores está por debajo de 5, el semáforo es rojo). Posibilidad de registrar riesgos manualmente y asociar planes de acción. Las reglas de decisión son administrables y configurables globalmente. |
| IN-008 | Fase 0 — Referencial y cartografía | Primera fase del proyecto: puesta en marcha del catálogo de referencia (IN-001), la jerarquía organizativa (IN-002) y la gestión de usuarios (IN-003), como fundación para las funcionalidades de madurez de la Fase 1. |
| IN-009 | Fase 1 — Indicadores, visualización y riesgos | Segunda fase del proyecto: activación de los indicadores de madurez (IN-004), los casos de uso de inteligencia artificial (IN-005), los cuadros de mando agregados (IN-006) y la gestión de riesgos (IN-007). |

### 3.2 Fuera de alcance (OUT)

| ID | Elemento excluido | Razón de exclusión |
|---|---|---|
| OUT-001 | Integración automática de indicadores de madurez con herramientas externas de calidad o industrialización | No especificada en el documento fuente para la Fase 1; los indicadores se introducen manualmente. Candidata a fases posteriores. |
| OUT-002 | Integración con gestores de incidencias o de tickets | Mencionada únicamente como indicador adicional opcional en una fase posterior (Fase 1+). No forma parte del alcance comprometido. |
| OUT-003 | Notificación activa por canal externo (correo electrónico, mensajería, notificaciones push) | No mencionada en el documento fuente. Sin descripción de ningún mecanismo de notificación activa fuera del sistema. Candidata a fases posteriores. |
| OUT-004 | Exportación de datos e informes periódicos en formatos de oficina | No mencionada en el documento fuente como requisito. Candidata a fases posteriores si se identifica necesidad. |
| OUT-005 | Carga masiva automatizada de datos desde fuentes externas | No existe sistema previo a reemplazar. La carga inicial de los cientos de aplicativos existentes se realizará mediante scripts (SQL, Liquibase o el mecanismo que se determine técnicamente), no mediante interfaz de usuario. Se trata de una decisión técnica a tomar en la fase de diseño e implementación. |
| OUT-006 | Indicadores adicionales opcionales (actividad de repositorio, resolución de incidencias, vulnerabilidades activas, documentación técnica, carga del Referente DT) | Marcados como "a validar" en el documento fuente. Se incluirán únicamente si el sponsor los valida para una fase posterior. |
| OUT-007 | Acceso al sistema desde redes externas a la red corporativa | La aplicación es de acceso exclusivamente corporativo/intranet; el acceso externo queda explícitamente excluido por la restricción de acceso declarada. |

### 3.3 Hipótesis

| ID | Hipótesis | Impacto si es falsa |
|---|---|---|
| HYP-001 | ~~El servicio de identificación corporativo único es técnicamente viable e integrable en el plazo de la Fase 0~~ **[RESUELTA]** La autenticación se implementa con OpenID Connect: Keycloak en desarrollo y Active Directory Corporativo Azure en cualificación y producción. | Hipótesis confirmada — sin impacto bloqueante. |
| HYP-002 | ~~El idioma de la interfaz será español, o el sistema soportará tanto español como francés~~ **[RESUELTA]** El MVP (Fase 0 y Fase 1) será en español. El sistema debe estar preparado para multilenguaje desde el inicio. FR y EN se añadirán en Fase 2 o posterior. | Hipótesis confirmada — el esfuerzo de multilenguaje se planifica desde el arranque pero la entrega de FR/EN queda fuera del MVP. |
| HYP-003 | Los indicadores de madurez se introducen manualmente por el Referente DT en el MVP (Fase 0 y Fase 1), sin integración automática con herramientas externas. Las integraciones se estudiarán a partir de Fase 2. | **[CONFIRMADA]** Sin impacto en el alcance del MVP. |
| HYP-004 | Los umbrales del semáforo de estado y de los riesgos automáticos son configurables por el Administrador mediante reglas de decisión administrables, no valores fijos en el sistema. | **[CONFIRMADA]** Requiere pantalla de administración de reglas de decisión (incluida en IN-007). |
| HYP-005 | La agregación de indicadores de madurez a nivel de proyecto y cliente se presenta en tres formatos: vista media, vista puntos negros (peores notas) y vista puntos dorados (mejores notas). | **[CONFIRMADA]** Los tres formatos están incluidos en IN-006. |
| HYP-006 | El volumen esperado del sistema es de decenas de clientes, cientos de proyectos y cientos de aplicativos | Si el volumen supera significativamente esta estimación, los requisitos de rendimiento de las vistas agregadas deben reforzarse desde el diseño inicial. |
| HYP-007 | Cada proyecto tiene asignado al menos un Manager y uno o varios Referentes DT; no existen proyectos sin Manager asignado | Si existen proyectos sin Manager, deben definirse las reglas de validación y acceso para esos casos. |
| HYP-008 | Los indicadores adicionales opcionales (Fase 1+) requieren validación explícita del sponsor antes de su diseño e implementación | Si se incluyen sin validación, aumenta el alcance de la Fase 1 y se corre el riesgo de entregar funcionalidades no prioritarias. |

### 3.4 Restricciones de negocio

| ID | Restricción | Tipo | Impacto |
|---|---|---|---|
| CTR-001 | Acceso exclusivo desde la red corporativa (intranet) o mediante acceso corporativo | Organizacional / Seguridad | El sistema no es accesible desde el exterior. Simplifica los requisitos de seguridad perimetral pero limita el acceso en movilidad. |
| CTR-002 | Los usuarios del sistema son exclusivamente equipos internos de la Dirección Técnica | Organizacional | El sistema no está previsto para uso por parte de clientes ni de equipos externos a la DT. Delimita los roles y descarta funcionalidades orientadas a usuarios externos. |
| CTR-003 | La autenticación se realiza mediante OpenID Connect: Keycloak en el entorno de desarrollo (facilita la configuración de múltiples usuarios y roles); Active Directory Corporativo Azure en cualificación y producción | Organizacional / Seguridad | El proveedor de identidad varía según el entorno. El diseño de la gestión de usuarios debe soportar ambas configuraciones sin cambios de código. |
| CTR-004 | El volumen esperado es de decenas de clientes, cientos de proyectos y cientos de aplicativos | Volumétrica | Las vistas agregadas y los cálculos de madurez deben diseñarse para soportar este volumen sin degradación del rendimiento. |
| CTR-005 | El MVP (Fase 0 y Fase 1) se entrega en español. El sistema debe estar preparado para multilenguaje (i18n) desde el inicio del diseño. Los idiomas FR e EN se añadirán en Fase 2 o posterior. | Organizacional | El diseño de la interfaz debe contemplar la internacionalización desde el arranque (textos externalizados, sin cadenas embebidas). La entrega de FR/EN está fuera del MVP. |
| CTR-006 | El proyecto se articula en al menos dos fases: Fase 0 (referencial y cartografía) y Fase 1 (indicadores y madurez) | Temporal / Organizacional | Las funcionalidades de la Fase 1 están condicionadas a la entrega y validación de la Fase 0. La priorización del alcance debe respetar esta secuencia. |

---

## 4. Contexto existente

### 4.1 Aplicación(es) existente(s) concernida(s)

No se menciona ninguna aplicación existente a reemplazar en el documento fuente. Project Monitor es una nueva aplicación que cubre una necesidad actualmente no soportada por ningún sistema de la DT. La única integración externa es con el proveedor de identidad corporativo (OpenID Connect — Keycloak en desarrollo, Active Directory Azure en cualificación y producción), cuya configuración es conocida y viable.

Se recomienda realizar una revisión de los procedimientos manuales actuales (hojas de cálculo, documentos compartidos, correos electrónicos) para identificar los datos que deberán trasladarse al nuevo sistema en el momento de la puesta en marcha y estimar el esfuerzo necesario.

### 4.2 Delta funcional objetivo

Al no existir sistema previo, el delta funcional corresponde a la totalidad del alcance descrito en la sección 3.1. La Fase 0 aporta las capacidades de referencial, cartografía y gestión de accesos; la Fase 1 añade la capa de medición de madurez, visualización ejecutiva y gestión proactiva de riesgos.

---

## Puntos de atención

| ID | Punto | Descripción | Estado |
|---|---|---|---|
| ATT-001 | Mecanismo de cálculo de los indicadores de madurez | **[RESUELTO]** Entrada 100 % manual por el Referente DT en el MVP. Las integraciones automáticas con herramientas externas se estudiarán a partir de Fase 2. Ver IN-004 y HYP-003. | ✅ Cerrado |
| ATT-002 | Definición de los umbrales del semáforo de estado | **[RESUELTO]** Los umbrales se definen mediante reglas de decisión configurables por el Administrador (ej.: si el 30 % de indicadores < 5 → rojo; si el 20 % mal o el 50 % < 7 → ámbar). Ver IN-007 y HYP-004. | ✅ Cerrado |
| ATT-003 | Proceso de carga inicial de los aplicativos | **[RESUELTO]** La carga inicial de los cientos de aplicativos existentes se realizará mediante scripts técnicos (SQL, Liquibase o mecanismo equivalente). Es una decisión de implementación técnica, no una funcionalidad de la interfaz. Ver OUT-005. | ✅ Cerrado |
| ATT-004 | Historial y evolución temporal de los indicadores | **[RESUELTO]** Sin histórico en el MVP. El sistema almacena únicamente el valor actual de cada indicador. El histórico para seguimiento de tendencias se añadirá en una fase posterior. | ✅ Cerrado |
| ATT-005 | Idioma de la interfaz | **[RESUELTO]** MVP en español (Fase 0 y Fase 1). Sistema preparado para multilenguaje (i18n) desde el inicio del diseño. FR y EN se añadirán en Fase 2 o posterior. Ver CTR-005 y HYP-002. | ✅ Cerrado |
| ATT-006 | Flujo de validación de los casos de uso de inteligencia artificial | **[RESUELTO]** No se requiere flujo de validación complejo. El usuario da de alta el caso de uso registrando fecha, contenido y adjuntos opcionales. No hay estados de aprobación ni notificaciones en el MVP. Ver IN-005. | ✅ Cerrado |
| ATT-007 | Gestión de tecnologías obsoletas en el catálogo | **[RESUELTO]** Las tecnologías del catálogo no se marcan como "fuera de soporte". Son un hecho del sistema. Si una tecnología implica un riesgo por obsolescencia, el Referente DT lo registra manualmente como riesgo a través del módulo de gestión de riesgos (IN-007). | ✅ Cerrado |
| ATT-008 | Grafía "Qualificación" | **[RESUELTO]** Grafía oficial en español: **cualificación**. Normalizado en todo el documento. | ✅ Cerrado |
| ATT-009 | Rol "Manager (CP)" | **[RESUELTO]** CP = Chef de Projet. Denominación oficial en español: **Jefe de Proyecto** (también aceptado: Manager). Normalizado en todo el documento. | ✅ Cerrado |

---

## Trazabilidad

| Elemento | Detalle |
|---|---|
| **Producido por** | agent-vision |
| **Fecha de producción** | 2026-04-28 |
| **Entradas utilizadas** | [DCO-001] |
| **Validado por** | Pendiente |
| **Fecha de validación** | Pendiente |

---

## Confianza de producción

| Dimensión | Nivel | Brechas identificadas |
|---|---|---|
| Entradas suficientes | CONFIDENT | Todas las decisiones de alcance del MVP han sido confirmadas por el sponsor: mecanismo de indicadores (manual), umbrales configurables por reglas de decisión, idioma (español MVP + i18n desde el inicio), autenticación (OpenID/Keycloak/AD Azure), sin histórico en MVP. |
| Cobertura del alcance | CONFIDENT | El alcance de Fase 0 y Fase 1 está completamente definido. Las funcionalidades de Fase 2+ (integraciones automáticas de indicadores, idiomas FR/EN, histórico) están explícitamente fuera del MVP con justificación. |
| Usabilidad por agent-glossary | CONFIDENT | El vocabulario de negocio es rico, consistente y suficiente para construir el glosario. Los tres formatos de agregación (media, puntos negros, puntos dorados), las reglas de decisión y la jerarquía Cliente > Proyecto > Aplicativo están claramente contextualizados. |

**Puntuación global:** 3/3 CONFIDENT — Todas las decisiones de alcance del MVP han sido tomadas y documentadas. El documento está listo para alimentar al agente de glosario y, a continuación, al agente de actores y requisitos funcionales.

> **Nota:** Existe una discrepancia de volumen entre [DCO-001] ("miles de aplicativos") y este documento ("cientos de aplicativos"). El sponsor ha confirmado que la estimación correcta es cientos. Se recomienda actualizar [DCO-001] para eliminar la inconsistencia.
