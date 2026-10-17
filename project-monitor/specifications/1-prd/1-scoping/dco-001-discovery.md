---
id: DCO-001
title: "Discovery — Project Monitor"
status: validated
version: "1.1"
date: 2026-04-27
last_updated: 2026-04-29
author: BA-Agent (sk-discovery)
source: docs/0-inputs/ba/_source/requirements-v1.md
lang: es
doc_depth: essential
dependencies: []
---

# [DCO-001] Documento de Descubrimiento — Project Monitor

---

## Mapa temático (3 niveles)

```
Project Monitor
├── Cartografía y referencial
│   ├── Catálogo de tecnologías
│   │   ├── Lenguajes y frameworks
│   │   ├── IDEs
│   │   ├── Entornos de ejecución local
│   │   ├── Contenedores y orquestación
│   │   └── Herramientas de IA
│   ├── Infraestructura
│   │   ├── Entornos de cualificación
│   │   └── Entornos de producción
│   └── CI/CD e industrialización
│       ├── Herramientas CI
│       ├── Herramientas CD
│       └── Herramientas de calidad y seguridad
├── Organización jerárquica
│   ├── Cliente
│   ├── Proyecto
│   └── Aplicativo
│       ├── Metadatos básicos
│       └── Asociaciones al referencial
├── Gestión de usuarios y roles
│   ├── Administrador
│   ├── Director
│   ├── Manager (Jefe de Proyecto)
│   └── Referente DT
├── Madurez y KPIs
│   ├── Industrialización
│   ├── Calidad de código
│   ├── Testing
│   ├── Despliegue
│   ├── Madurez tecnológica / obsolescencia
│   ├── Madurez en uso de IA
│   │   └── Casos de éxito IA
│   └── Performance
├── Agregación y visualización
│   ├── Vista Aplicativo (radar chart)
│   ├── Vista Proyecto
│   ├── Vista Cliente
│   └── Vista Global (Director)
└── Gestión de riesgos
    ├── Riesgos automáticos por KPI
    └── Riesgos manuales
```

---

## Sección A — Contexto del proyecto

### A.1 Identificación

| Campo | Valor |
|---|---|
| Nombre del proyecto | Project Monitor |
| Promotor / sponsor | Dirección Técnica (DT) |
| Fecha del documento fuente | 2026-04-27 |
| Tipo de aplicación | Web interna (intranet / acceso corporativo) |

### A.2 Problema a resolver

La Dirección Técnica carece de una visión centralizada del estado tecnológico, industrial y de calidad de los aplicativos que gestiona. Actualmente no existe un sistema que agregue, por proyecto y por cliente, los datos de madurez técnica, lo que impide detectar riesgos de forma proactiva y dificultar la toma de decisiones informadas.

### A.3 Objetivos declarados

1. Cartografiar todos los aplicativos gestionados por la DT, con su stack tecnológico y configuración de industrialización.
2. Medir la madurez técnica de cada aplicativo mediante KPIs estructurados (escala 1-10).
3. Agregar la información a nivel de proyecto y cliente para una visión ejecutiva.
4. Identificar automáticamente riesgos a partir de umbrales de KPI.
5. Visibilizar el nivel de adopción de herramientas de IA en los equipos.

### A.4 Restricciones anunciadas

| Restricción | Detalle |
|---|---|
| Tipo de acceso | Intranet / acceso corporativo exclusivo |
| Usuarios objetivo | Equipos internos de la Dirección Técnica |
| Volumen estimado | Decenas de clientes, cientos de proyectos, cientos de aplicativos |
| Autenticación | OpenID Connect: Keycloak en desarrollo, Active Directory Corporativo Azure en cualificación y producción |
| Idioma de la interfaz | Español en el MVP (Fase 0 y Fase 1); sistema preparado para multilenguaje (i18n) desde el inicio; FR y EN en Fase 2+ |
| Fases | Fase 0 (referencial + cartografía) y Fase 1 (KPIs + madurez) identificadas |

### A.5 Contexto existente

No se menciona ningún sistema a reemplazar. Se trata de una nueva aplicación. No hay restricciones de integración declaradas salvo el SSO corporativo y la posible integración futura con gestores de tickets (mencionada como KPI adicional opcional).

---

## Sección B — Partes interesadas y expectativas

| ID | Rol | Responsabilidad declarada | Visibilidad en el sistema | Expectativas / Stakes | Tipo de entrevista sugerida |
|---|---|---|---|---|---|
| STK-01 | Administrador | CRUD del referencial; gestión de usuarios y asignaciones | Total | Mantener la integridad del catálogo de referencia; gestionar permisos | Sesión técnica + flujos de administración |
| STK-02 | Director | Visión ejecutiva global de todos los clientes, proyectos y aplicativos | Total (lectura) | Dashboard global con semáforo de estado; identificación rápida de riesgos; visión de adopción IA | Entrevista ejecutiva: necesidades de reporting, indicadores clave |
| STK-03 | Manager (Jefe de Proyecto) | Gestión y validación de la información de sus proyectos asignados | Sus proyectos asignados | Vista consolidada por proyecto; alerta de riesgos; validar casos de éxito IA | Sesión operacional: flujos de revisión y validación |
| STK-04 | Referente DT | Cartografía y mantenimiento de la información técnica; garantiza la calidad del dato | Sus proyectos asignados | Formularios de captura eficientes; claridad en el referencial; feedback sobre KPIs | Sesión técnica: captura de datos, usabilidad, carga de trabajo |

### Guías de entrevista condensadas

**STK-02 — Director**
- ¿Qué información necesita ver en el dashboard global para tomar decisiones?
- ¿Con qué frecuencia consultaría el sistema?
- ¿Qué umbrales de KPI considera críticos para activar una alerta?
- ¿Cómo espera que se presenten los casos de éxito IA para compartir buenas prácticas?

**STK-03 — Manager (Jefe de Proyecto)**
- ¿Cómo valida hoy la información técnica de sus proyectos?
- ¿Qué riesgos le resultan más difíciles de detectar a tiempo?
- ¿Qué información necesita para validar un caso de éxito IA?
- ¿Con qué frecuencia actualiza la información de sus proyectos?

**STK-04 — Referente DT**
- ¿Cuánto tiempo dedica actualmente a cartografiar los aplicativos?
- ¿Cuántos aplicativos gestiona en paralelo?
- ¿Qué información técnica le resulta más difícil de recopilar o mantener actualizada?
- ¿Cómo determina hoy el nivel de madurez de un aplicativo?

**STK-01 — Administrador**
- ¿Cómo se gestionan actualmente los catálogos de tecnologías?
- ¿Qué procesos de onboarding/offboarding de usuarios deben soportarse?
- ¿Existen restricciones de seguridad adicionales para el acceso corporativo?

---

## Sección C — Terminología emergente (proto-glosario)

| Término | Contexto de uso en el documento fuente | Propuesta de definición provisional | Flag |
|---|---|---|---|
| Aplicativo | Unidad mínima de la jerarquía organizativa. Asociado a un proyecto y a entradas del referencial. | Sistema o componente software gestionado por la DT, asociado a un proyecto y un cliente. | — |
| Proyecto | Nivel intermedio entre Cliente y Aplicativo. Puede contener varios aplicativos. | Agrupación de aplicativos bajo un mismo contrato o iniciativa para un cliente. | — |
| Cliente | Nivel superior de la jerarquía. Puede tener varios proyectos. | Organización externa o interna para la que la DT desarrolla o mantiene proyectos. | — |
| Referencial | Catálogo de tecnologías, herramientas y configuraciones válidas y clasificadas. | Catálogo de referencia gestionado por el Administrador que lista las opciones admitidas para cada dimensión tecnológica. | — |
| Madurez | Medición del nivel de calidad o avance en una dimensión técnica (escala 1-10). | Indicador numérico (1-10) que representa el grado de adopción y excelencia de una práctica técnica en un aplicativo. Sin valor (nulo) si la dimensión no ha sido evaluada. Formalizado como [GLO-T016] en [GLO-001]. | — |
| KPI (de madurez) | Indicador calculado o introducido manualmente para cada aplicativo. | Indicador clave de rendimiento que mide la madurez en una dimensión específica (industrialización, testing, etc.) en escala 1-10; nulo si no evaluado. Formalizado como [GLO-T017] en [GLO-001]. | — |
| Referente DT | Rol responsable de la calidad del dato técnico. | Miembro de la Dirección Técnica designado como responsable de la veracidad de la información técnica de un conjunto de proyectos. | — |
| Manager (Jefe de Proyecto) | Rol que valida la información y gestiona proyectos asignados. | Jefe de Proyecto de la DT responsable de la gestión operativa y validación de la información de sus proyectos. | CP = Chef de Projet (francés). Término oficial en español: Jefe de Proyecto. También aceptado: Manager. |
| Cualificación | Entornos de pruebas / pre-producción. | Conjunto de entornos de prueba y pre-producción utilizados antes del despliegue en producción. | Grafía oficial en español: cualificación (no "qualificación"). |
| Caso de éxito IA | Registro documentado de uso de IA con impacto medible. | Registro estructurado de una experiencia exitosa de uso de herramientas de IA en un proyecto, validado por el Manager. | — |
| Semáforo de estado | Indicador visual (colores) para la vista global del Director. | Indicador visual de tres estados (verde/naranja/rojo) que representa el estado agregado de salud de un cliente o proyecto. | Umbrales configurables por el Administrador mediante reglas de decisión (ej.: 30 % de indicadores < 5 → rojo). Ver BLD-04 [RESUELTO]. |
| Puesto de trabajo | Tipo de entorno de desarrollo del equipo (VDI, físico interno, etc.). | Modalidad de entorno de trabajo utilizada por los miembros del equipo de desarrollo. | — |

---

## Sección D — Dominios funcionales anticipados

| ID | Dominio | Descripción | Fase |
|---|---|---|---|
| DOM-01 | Gestión del referencial | CRUD del catálogo de tecnologías, herramientas, entornos e IA. | Fase 0 |
| DOM-02 | Cartografía organizativa | Gestión de la jerarquía Cliente > Proyecto > Aplicativo y sus asociaciones al referencial. | Fase 0 |
| DOM-03 | Gestión de usuarios y roles | Autenticación (SSO), perfiles, asignación de proyectos a Managers y Referentes DT. | Fase 0 |
| DOM-04 | KPIs de madurez | Captura (manual o calculada), almacenamiento y evolución histórica de los 7 KPIs por aplicativo. | Fase 1 |
| DOM-05 | Casos de éxito IA | Registro, validación y visualización de casos de uso de IA por proyecto/aplicativo. | Fase 1 |
| DOM-06 | Agregación y visualización | Vistas agregadas (aplicativo, proyecto, cliente, global), radar chart, semáforo. | Fase 1 |
| DOM-07 | Gestión de riesgos | Identificación automática por umbral de KPI y registro manual de riesgos con plan de acción. | Fase 1 |
| DOM-08 | KPIs adicionales (a validar) | Actividad de repositorio, resolución de incidencias, CVEs activos, documentación técnica, carga de Referente DT. | Fase 1+ |

---

## Sección E — Hipótesis a validar

| ID | Hipótesis | Origen | Prioridad |
|---|---|---|---|
| HYP-01 | ~~El SSO corporativo es técnicamente viable e integrable en el plazo de la Fase 0.~~ **[RESUELTA]** Autenticación con OpenID Connect: Keycloak en desarrollo, Active Directory Corporativo Azure en cualificación y producción. | Confirmado por el sponsor. | Alta |
| HYP-02 | ~~El idioma de la interfaz será español (o se soportarán ambos idiomas).~~ **[RESUELTA]** MVP en español; sistema preparado para i18n desde el inicio; FR y EN en Fase 2+. | Confirmado por el sponsor. | Alta |
| HYP-03 | ~~Los KPIs de madurez se introducen manualmente por el Referente DT~~ **[CONFIRMADA]** Entrada 100 % manual en el MVP (Fase 0 y Fase 1). Las integraciones automáticas con herramientas externas se estudiarán a partir de Fase 2. | Confirmado por el sponsor. | Alta |
| HYP-04 | ~~Los umbrales de semáforo y de riesgo automático son configurables por el Administrador, no estáticos.~~ **[CONFIRMADA]** Los umbrales se definen mediante reglas de decisión administrables (ej.: 30 % de indicadores < 5 → rojo). | Confirmado por el sponsor. | Media |
| HYP-05 | ~~La agregación de KPIs a nivel proyecto/cliente es configurable.~~ **[CONFIRMADA]** Tres formatos de agregación: vista media, vista puntos negros (peores notas) y vista puntos dorados (mejores notas). | Confirmado por el sponsor. | Media |
| HYP-06 | ~~El volumen de cientos de aplicativos implica requisitos de rendimiento a considerar en el diseño de las vistas agregadas.~~ **[CONFIRMADA]** El volumen es de decenas de clientes, cientos de proyectos y **cientos** de aplicativos (confirmado por el sponsor — la estimación inicial «miles» era incorrecta). Las vistas agregadas deben soportar este volumen con tiempo de respuesta < 5 s ([EXF-001] EX-T002, [VIS-001] CTR-004). | Confirmado por el sponsor. Ver [VIS-001] HYP-006, CTR-004; [EXF-001] EX-T002. | Media |
| HYP-07 | ~~Los KPIs adicionales (Sección 7 del documento fuente) son opcionales en Fase 1 y requieren validación del sponsor.~~ **[CONFIRMADA — FUERA DE ALCANCE MVP]** Los KPIs adicionales (actividad de repositorio, resolución de incidencias, CVEs activos, documentación técnica, carga del Referente DT) están explícitamente excluidos del alcance del MVP. Solo se incorporarán si el sponsor los valida para una fase posterior. Ver [VIS-001] OUT-006. | [VIS-001] OUT-006. | Baja |
| HYP-08 | ~~Un proyecto tiene exactamente un Manager y uno o varios Referentes DT.~~ **[CONFIRMADA]** Cada proyecto tiene asignado exactamente un Manager y uno o varios Referentes DT. No existen proyectos sin Manager asignado; si los hubiera, las reglas de validación y acceso deberían redefinirse. | Confirmado. Ver [VIS-001] HYP-007; [ACT-001] §2. | Media |

---

## Sección F — Puntos ciegos y preguntas abiertas

| ID | Tema | Descripción | Impacto potencial |
|---|---|---|---|
| BLD-01 | Mecanismo de cálculo de KPIs | **[RESUELTO]** Entrada 100 % manual por el Referente DT en el MVP. Las integraciones automáticas se estudiarán a partir de Fase 2. | Muy alto |
| BLD-02 | Historial y evolución de KPIs | **[RESUELTO]** Sin histórico en el MVP. El sistema almacena el valor actual. Histórico previsto para fases posteriores. | Alto |
| BLD-03 | Proceso de onboarding de aplicativos | **[RESUELTO]** La carga inicial de los cientos de aplicativos existentes se realizará mediante scripts técnicos (SQL, Liquibase o equivalente). No se requiere funcionalidad de importación en la interfaz de usuario. Decisión de implementación técnica a confirmar en la fase de diseño. | Alto |
| BLD-04 | Definición de umbrales de semáforo | **[RESUELTO]** Umbrales definidos mediante reglas de decisión configurables por el Administrador (ej.: 30 % de indicadores < 5 → rojo; 20 % malo o 50 % < 7 → naranja; en caso contrario → verde). | Alto |
| BLD-05 | Gestión de tecnologías obsoletas en el catálogo | **[RESUELTO]** Las tecnologías no se marcan como "fuera de soporte" activamente. Si una tecnología representa un riesgo por obsolescencia, el Referente DT lo registra manualmente como riesgo en el módulo de gestión de riesgos. | Medio |
| BLD-06 | Notificaciones y alertas | Sin notificaciones activas externas (email, push) en el MVP. Las alertas son visibles dentro del sistema. Candidato a fases posteriores. | Medio |
| BLD-07 | Integración con gestor de tickets | Fuera de alcance del MVP. Mencionada como KPI adicional opcional en Fase 1+; requiere validación del sponsor. | Medio |
| BLD-08 | Validación de casos de éxito IA | **[EVOLUCIONADO]** La hipótesis inicial ([VIS-001] ATT-006) era «sin flujo de validación complejo». Durante el análisis de requisitos, [EXF-001] EX-010 ha introducido un flujo de validación estructurado con 4 estados (borrador → pendiente de validación → validado → rechazado), gestionado por el Manager. Este requisito está clasificado como **Should** y sus detalles (mecanismo de notificación interna, motivo de rechazo, condiciones de transición) requieren confirmación del sponsor antes del diseño funcional detallado. Ver [EXF-001] punto de atención n.º 3; [ACT-001] DEL-001, PAT-002. | Medio |
| BLD-09 | Exportación / reporting | No se menciona necesidad de exportar datos (PDF, Excel) ni de generar informes periódicos. | Bajo |
| BLD-10 | Frecuencia de actualización esperada | No se especifica con qué periodicidad se espera que los Referentes DT actualicen la información (semanal, mensual, por sprint). | Bajo |

---

## Canvas de taller de descubrimiento (formato ligero)

> **Estado: COMPLETADO** — Las hipótesis críticas HYP-01 a HYP-05 han sido validadas por el sponsor y documentadas en [VIS-001]. Los puntos ciegos BLD-01 a BLD-07 han sido resueltos. El canvas queda como referencia del proceso de descubrimiento ejecutado.

### Objetivo del taller
Validar las hipótesis críticas (HYP-01 a HYP-03) y resolver los puntos ciegos de alto impacto (BLD-01 a BLD-04).

### Participantes sugeridos
- Sponsor / representante de la Dirección Técnica
- 1 Director (STK-02)
- 1-2 Managers CP (STK-03)
- 1-2 Referentes DT (STK-04)
- BA facilitador + 1 técnico de arquitectura

### Agenda propuesta (3 horas)

| Bloque | Duración | Actividad |
|---|---|---|
| 1. Contexto y objetivos | 20 min | Presentación del entendimiento actual, validación del problema |
| 2. Jerarquía y roles | 30 min | Validar jerarquía Cliente > Proyecto > Aplicativo; aclarar reglas de asignación |
| 3. KPIs de madurez | 45 min | Validar las 6 dimensiones; aclarar mecanismo de cálculo (manual vs automático) |
| 4. Visualización y riesgos | 30 min | Validar vistas, definir umbrales de semáforo y riesgos automáticos |
| 5. Restricciones técnicas | 20 min | SSO, idioma, volumen, rendimiento |
| 6. Priorización de fases | 20 min | Confirmar alcance de Fase 0 y Fase 1; decidir sobre KPIs adicionales |
| 7. Próximos pasos | 15 min | Definir acciones y responsables |

---

## Confianza de producción

| Criterio | Estado | Observación |
|---|---|---|
| YAML front matter presente y completo | OK | id, status, version, date, last_updated presentes |
| Sección A presente | OK | Restricciones y volumen alineados con [VIS-001] CTR-004 |
| Sección B presente | OK | — |
| Sección C presente | OK | Escala 1-10 (nulo = no evaluado) alineada con [GLO-001] canónico; términos Madurez y KPI referenciados a [GLO-001] |
| Sección D presente | OK | DOM-08 marcado Fase 1+ consistente con [VIS-001] OUT-006 |
| Sección E presente | OK | HYP-01 a HYP-07: RESUELTAS/CONFIRMADAS; HYP-08 CONFIRMADA vía [ACT-001] |
| Sección F presente | OK | BLD-01 a BLD-07 RESUELTOS; BLD-08 EVOLUCIONADO (ver [EXF-001] EX-010) |
| Decisiones post-discovery incorporadas | OK | VIS-001, GLO-001, ACT-001 y EXF-001 validados — cambios reflejados en v1.1 |
| Sin marcadores de posición residuales | OK | — |
| Nivel de confianza global | Alto | Documento de descubrimiento completado y alineado con la documentación de Scoping validada |

---

## Trazabilidad

| Elemento | Detalle |
|---|---|
| **Producido por** | BA-Agent (sk-discovery) |
| **Fecha de producción** | 2026-04-27 |
| **Entradas utilizadas** | docs/0-inputs/ba/_source/requirements-v1.md |
| **Actualizado por** | Revisión post-Scoping — alineación con [VIS-001], [GLO-001], [ACT-001], [EXF-001] |
| **Fecha de actualización** | 2026-04-29 |
| **Validado por** | pendiente |
| **Fecha de validación** | pendiente |

---

## Historial de versiones

| Versión | Fecha | Autor | Cambios |
|---|---|---|---|
| 1.1 | 2026-04-29 | Revisión post-Scoping | Escala KPIs 1-10 (alineada con [GLO-001] canónico; nulo = no evaluado); HYP-06/07/08 CONFIRMADAS; BLD-08 EVOLUCIONADO (EXF-001 EX-010); grafía «cualificación» corregida; Canvas COMPLETADO; secciones Trazabilidad e Historial añadidas |
| 1.0 | 2026-04-27 | BA-Agent (sk-discovery) | Versión inicial — documento de descubrimiento |
