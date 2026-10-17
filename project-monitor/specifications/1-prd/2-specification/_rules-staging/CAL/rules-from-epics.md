# Reglas de Cálculo — Staging desde Épicos

> **Origen:** Extracción realizada por agent-epics (ba-2.2) — 2026-04-29
> **IDs temporales:** BR-CAL-Exxx — a consolidar por agent-2.3-rules antes de asignación de IDs definitivos
> **Épicos fuente:** [EP-001], [EP-002], [EP-003]

---

## BR-CAL-E001 — Cálculo de la media de KPIs de un agregado

| Propiedad | Valor |
|-----------|-------|
| **Épico fuente** | [EP-003] [FT-018] |
| **Entidades concernidas** | [ENT-006] KPIDeMadurez, [ENT-003] Aplicativo, [ENT-002] Proyecto, [ENT-001] Cliente |
| **Descripción** | El valor medio de un KPI para un Proyecto se calcula como la media aritmética de los valores no nulos del mismo KPI entre todos los Aplicativos del Proyecto. Si todos los valores del KPI en el Proyecto son nulos, la media es nula. El mismo cálculo se aplica de forma recursiva al nivel Cliente (media de las medias de sus Proyectos) y al nivel global. |
| **Fórmula** | Media(KPI_x, nivel) = Suma(valores no nulos de KPI_x del nivel inferior) / Cuenta(valores no nulos de KPI_x del nivel inferior). Si Cuenta = 0, resultado = nulo. |
| **Actor que activa** | Sistema — en tiempo real al guardar un KPI o al consultar una vista agregada |

---

## BR-CAL-E002 — Cálculo del punto negro de un agregado

| Propiedad | Valor |
|-----------|-------|
| **Épico fuente** | [EP-003] [FT-018] |
| **Entidades concernidas** | [ENT-006] KPIDeMadurez, [ENT-003] Aplicativo, [ENT-002] Proyecto |
| **Descripción** | El punto negro de un KPI para un Proyecto es el valor mínimo no nulo entre todos los Aplicativos del Proyecto para esa dimensión. Si todos los valores son nulos, el punto negro es nulo. El sistema identifica también el Aplicativo portador del punto negro para facilitar la navegación. |
| **Fórmula** | PuntoNegro(KPI_x, Proyecto) = MIN(valores no nulos de KPI_x de los Aplicativos del Proyecto). |
| **Actor que activa** | Sistema — en tiempo real al consultar la vista agregada por proyecto |

---

## BR-CAL-E003 — Cálculo del punto dorado de un agregado

| Propiedad | Valor |
|-----------|-------|
| **Épico fuente** | [EP-003] [FT-018] |
| **Entidades concernidas** | [ENT-006] KPIDeMadurez, [ENT-003] Aplicativo, [ENT-002] Proyecto |
| **Descripción** | El punto dorado de un KPI para un Proyecto es el valor máximo no nulo entre todos los Aplicativos del Proyecto para esa dimensión. Si todos los valores son nulos, el punto dorado es nulo. El sistema identifica también el Aplicativo portador del punto dorado para facilitar la compartición de buenas prácticas. |
| **Fórmula** | PuntoDorado(KPI_x, Proyecto) = MAX(valores no nulos de KPI_x de los Aplicativos del Proyecto). |
| **Actor que activa** | Sistema — en tiempo real al consultar la vista agregada por proyecto |

---

## BR-CAL-E004 — Evaluación del semáforo de estado por el árbol de decisión

| Propiedad | Valor |
|-----------|-------|
| **Épico fuente** | [EP-003] [FT-019] |
| **Entidades concernidas** | [ENT-011] ReglaDecision, [ENT-006] KPIDeMadurez, [ENT-003] Aplicativo, [ENT-002] Proyecto, [ENT-001] Cliente |
| **Descripción** | El semáforo de estado de un elemento (Aplicativo, Proyecto o Cliente) se calcula evaluando todas las ReglaDecision activas cuyo `nivelAgregacion` corresponde al nivel del elemento. La regla con el nivel de semáforo más severo (ROJO > NARANJA > VERDE) cuya condición se cumple determina el semáforo resultante. Si ninguna regla activa aplica, el semáforo por defecto es VERDE. |
| **Fórmula** | Semáforo(elemento) = MAX_severidad({ nivelSemaforo de regla | regla.activa = true AND regla.nivelAgregacion = nivel(elemento) AND evaluar(regla.condicion, KPIs del elemento) = true }). Si conjunto vacío → VERDE. |
| **Actor que activa** | Sistema — automáticamente al registrar o actualizar un KPI; también al modificar una ReglaDecision activa |
