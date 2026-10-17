# Project Monitor — Requisitos iniciales

**Fecha:** 2026-04-27
**Fuente:** Descripción verbal del sponsor

---

## Contexto y objetivo

Project Monitor es una aplicación web interna de la Dirección Técnica (DT) para cartografiar, monitorizar y medir la madurez de los proyectos y aplicativos gestionados por la organización. El objetivo es tener una visión centralizada del estado tecnológico, industrial y de calidad de cada aplicativo, agregada por proyecto y cliente.

---

## Fase 0 — Base referencial y cartografía

### 1. Referencial de Tecnologías y Configuraciones

Gestión de un catálogo de referencia clasificado en las siguientes dimensiones. Cada entrada del referencial tiene nombre, versión(es) soportadas, descripción y estado (activo/obsoleto).

#### 1.1 Tecnologías de proyecto
Lenguajes, frameworks y librerías utilizadas en los aplicativos.
Ejemplos: Java, Angular, Spring Boot, React, .NET, Python, Node.js...

#### 1.2 Puesto de trabajo
Tipo de entorno de desarrollo utilizado por el equipo.
Ejemplos: VDI, físico interno, físico cliente, mixto...

#### 1.3 IDE de proyecto
Entorno de desarrollo integrado utilizado.
Ejemplos: IntelliJ IDEA, VS Code, Visual Studio, Vi/Vim, Eclipse...

#### 1.4 Modo de ejecución en local
Cómo se ejecuta el aplicativo en el entorno de desarrollo local.
Ejemplos: Docker, Docker Compose, múltiples proyectos, ejecución directa JVM, ejecución nativa...

#### 1.5 Entornos de qualificación
Infraestructura utilizada para los entornos de pruebas / pre-producción.
Ejemplos: Cloud privado, Cloud público (AWS/Azure/GCP), Kubernetes, InnerShift, Cloud cliente, VMs, Máquinas físicas...

#### 1.6 Entornos de producción
Infraestructura de producción. Mismas categorías que qualificación + detalles específicos de prod.

#### 1.7 Tipos de contenedores
Tecnologías de contenedores y orquestación usadas.
Ejemplos: Docker, Podman, Kubernetes, OpenShift, Rancher...

#### 1.8 Industrialización — CI/CD
Cadenas de integración y despliegue continuo.
- Herramientas CI: Jenkins, GitLab CI, GitHub Actions, Azure DevOps...
- Herramientas CD: ArgoCD, Helm, Flux, scripts manuales...
- Uso de templates corporativos: sí/no + referencia al template
- Uso de templates cliente: sí/no + referencia al template
- Herramientas de calidad de código: SonarQube, Checkstyle, ESLint...
- Herramientas de testing: JUnit, Cypress, Playwright, Postman/Newman...
- Herramientas de seguridad: OWASP ZAP, Trivy, Snyk...

#### 1.9 Herramientas de IA
Herramientas de inteligencia artificial utilizadas en el proyecto (desarrollo, BA, gestión).
- Asistencia al desarrollo: GitHub Copilot, Claude Code, Tabnine, Cursor...
- Apoyo al BA: Claude, ChatGPT, herramientas de generación de specs...
- Apoyo al jefe de proyecto: herramientas de planificación IA, estimación...
- Nivel de adopción: instalado / usado ocasionalmente / integrado en el flujo de trabajo / optimizado

---

### 2. Organización jerárquica de proyectos

Estructura de tres niveles:

```
Cliente
  └── Proyecto (puede tener varios proyectos por cliente)
        └── Aplicativo (puede tener varios aplicativos por proyecto)
```

Cada **Aplicativo** se asocia a entradas del referencial anterior:
- Tecnologías de proyecto utilizadas (multi-selección)
- Tipo de puesto de trabajo
- IDE utilizado
- Modo de ejecución en local
- Entorno(s) de qualificación
- Entorno(s) de producción
- Tipos de contenedores
- Herramientas de CI/CD y industrialización
- Herramientas de IA utilizadas

Un aplicativo tiene también metadatos básicos: nombre, descripción, repositorio(s) de código, fecha de inicio, estado (activo, mantenimiento, obsoleto, en construcción).

---

### 3. Gestión de usuarios y roles

Cuatro roles con permisos y visibilidad diferenciados:

| Rol | Responsabilidad | Visibilidad |
|-----|----------------|-------------|
| **Administrador** | Gestión del referencial (CRUD completo), gestión de usuarios y asignaciones de roles | Total |
| **Director** | Visión ejecutiva global de todos los clientes, proyectos y aplicativos | Total (lectura) |
| **Manager (CP)** | Gestión y revisión de los proyectos que tiene asignados. Valida la información. | Sus proyectos asignados |
| **Referente DT** | Cartografía y mantenimiento de la información técnica. Es quien garantiza la calidad del dato. | Sus proyectos asignados |

Reglas de asignación:
- Un Manager puede tener varios proyectos asignados
- Un Referente DT puede tener varios proyectos asignados
- Un proyecto puede tener un Manager y uno o varios Referentes DT

---

## Fase 1 — KPIs de madurez y seguimiento

### 4. Indicadores de madurez por aplicativo (valoración 1-10)

Cada aplicativo tiene los siguientes KPIs calculados o introducidos manualmente:

#### 4.1 Madurez en industrialización
Mide el nivel de automatización del ciclo de desarrollo.
Factores: uso de CI/CD, cobertura de pipelines, uso de templates corporativos, gestión de artefactos, automatización de releases.
Escala: 1 (todo manual) → 10 (pipeline completo automatizado con templates y trazabilidad).

#### 4.2 Madurez en calidad de código
Mide la calidad técnica del código.
Factores: integración con SonarQube u otras herramientas, resultado del Quality Gate, tasa de deuda técnica, cobertura de análisis estático.
Escala: 1 (sin herramientas) → 10 (Quality Gate verde + deuda técnica < umbral + análisis de seguridad integrado).

#### 4.3 Madurez en testing
Mide la solidez del proceso de pruebas.
Factores: cobertura de tests unitarios, tests de integración, tests E2E, ejecución automatizada en CI, resultados estables.
Escala: 1 (sin tests) → 10 (cobertura > 80%, todos los niveles cubiertos, ejecución automática en cada commit).

#### 4.4 Madurez en despliegue
Mide el nivel de automatización y fiabilidad de los despliegues.
Factores: despliegue manual vs automatizado, rollback disponible, tiempo medio de despliegue, despliegues en producción sin intervención humana.
Escala: 1 (despliegue manual) → 10 (CD completo con rollback automático y zero-downtime).

#### 4.5 Madurez tecnológica / obsolescencia
Mide la actualidad del stack tecnológico.
Factores: versiones de frameworks y librerías vs versiones LTS actuales, presencia de dependencias con CVEs conocidos, tiempo desde la última actualización mayor.
Escala: 1 (stack obsoleto, EOL) → 10 (stack completamente actualizado, sin CVEs críticos).

#### 4.6 Madurez en uso de IA
Mide el nivel de adopción y aprovechamiento de herramientas de IA en el proyecto.
Factores: herramientas instaladas y utilizadas, integración en el flujo de trabajo diario, casos de éxito documentados, ahorro de tiempo estimado, uso por perfiles (dev, BA, PM).
Escala: 1 (sin IA) → 10 (IA integrada en todo el ciclo, casos de éxito documentados, métricas de impacto medidas).

#### 4.7 Casos de éxito IA (funcionalidad específica)
Para el KPI de madurez IA, cada aplicativo/proyecto puede registrar casos de éxito:
- Título del caso
- Herramienta utilizada
- Perfil que lo utilizó (dev, BA, PM, otro)
- Descripción del caso
- Impacto estimado (tiempo ahorrado, calidad mejorada...)
- Fecha
- Estado (validado por Manager / pendiente)

Estos casos son visibles por el Director y sirven para compartir buenas prácticas en la organización.

---

### 5. Agregación y visión de estado

- **Vista Aplicativo:** todos los KPIs individuales + radar chart de madurez
- **Vista Proyecto:** agregación de KPIs de todos sus aplicativos (media ponderada o peor caso, configurable)
- **Vista Cliente:** agregación de todos sus proyectos
- **Vista Global (Director):** todos los clientes con semáforo de estado y KPIs agregados

### 6. Identificación de riesgos

A partir de los KPIs, identificar automáticamente riesgos:
- Aplicativo con KPI de obsolescencia < 4: riesgo de seguridad
- Aplicativo sin CI/CD (industrialización < 3): riesgo operacional
- Aplicativo sin tests (testing < 3): riesgo de calidad
- Aplicativo con despliegue manual en producción: riesgo de disponibilidad
- Posibilidad de que el Referente DT o Manager añada riesgos manuales con descripción, severidad y plan de acción

### 7. KPIs adicionales sugeridos (a validar)
- Frecuencia de commits / actividad del repositorio
- Tiempo medio de resolución de incidencias (si integración con gestor de tickets)
- Número de CVEs críticos activos en dependencias
- Fecha del último despliegue en producción (indicador de actividad)
- Ratio de aplicativos con documentación técnica actualizada
- Número de aplicativos por Referente DT (indicador de carga de trabajo)

---

## Restricciones y contexto técnico

- Aplicación web interna (intranet / acceso corporativo)
- Usuarios: equipos internos de la Dirección Técnica
- Volumen estimado: decenas de clientes, centenares de proyectos, miles de aplicativos
- Autenticación: SSO corporativo (a confirmar)
- Idioma de la interfaz: francés o español (a definir)
