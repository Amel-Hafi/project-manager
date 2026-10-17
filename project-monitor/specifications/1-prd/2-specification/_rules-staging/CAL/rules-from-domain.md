---
source: DOM-001
type: rules-staging
rule_type: CAL
extracted_by: ba-2.1
status: draft
version: "1.0"
last_updated: 2026-04-30
language: es
---

# Reglas de Calculo (CAL) extraidas de [DOM-001]

Reglas que derivan valores agregados a partir de los datos del modelo (semaforos, agregaciones de KPI, etc.).

| ID | Entidad / Alcance | Calculo | Origen DOM-001 |
|----|-------------------|---------|----------------|
| BR-CAL-D001 | Aplicativo | El nivel de semaforo de un Aplicativo se calcula evaluando todas las ReglaDecision activas con nivelAgregacion=APLICATIVO sobre sus 7 KPIDeMadurez. El semaforo final corresponde al nivel mas critico (ROJO > NARANJA > VERDE) entre las reglas cuya condicion se cumple. | ENT-011, REF-006, REF-010 |
| BR-CAL-D002 | Proyecto | El nivel de semaforo de un Proyecto se calcula evaluando las ReglaDecision activas con nivelAgregacion=PROYECTO sobre el agregado de KPIs de todos sus Aplicativos. El semaforo final corresponde al nivel mas critico cuyo umbral se incumpla. | ENT-011, REF-006, REF-010 |
| BR-CAL-D003 | Cliente | El nivel de semaforo de un Cliente se calcula evaluando las ReglaDecision activas con nivelAgregacion=CLIENTE sobre el agregado de KPIs de todos los Proyectos del cliente. | ENT-011, REF-006, REF-010 |
| BR-CAL-D004 | Global / Porfolio | El semaforo global del porfolio se calcula evaluando las ReglaDecision activas con nivelAgregacion=GLOBAL sobre el agregado de todos los KPIs del sistema. | ENT-011, REF-010 |
| BR-CAL-D005 | ReglaDecision | La evaluacion de una ReglaDecision compara el valor calculado (porcentaje de aplicativos con KPI medio bajo umbral, o valor agregado de KPI) con el atributo umbral; si la condicion se cumple, la regla aporta el nivelSemaforo configurado. | ENT-011 |
| BR-CAL-D006 | KPI agregado por dimension | Para una ReglaDecision con dimension informada, el valor agregado se calcula unicamente sobre los KPIDeMadurez de esa DimensionDeMadurez en el alcance correspondiente; los KPIs con valor nulo se excluyen del calculo. | ENT-006, ENT-011 |
| BR-CAL-D007 | KPI agregado global | Para una ReglaDecision con dimension nula, el valor agregado se calcula sobre el conjunto completo de KPIDeMadurez evaluados (valor no nulo) en el alcance correspondiente. | ENT-011 |
| BR-CAL-D008 | Cobertura de evaluacion | El porcentaje de cobertura de evaluacion de un Aplicativo se calcula como el numero de KPIDeMadurez con valor no nulo dividido por 7 (total de dimensiones). | ENT-003, ENT-006, REF-001 |
| BR-CAL-D009 | Auto-asignacion fechaCreacion | El atributo fechaCreacion de las entidades Cliente, Proyecto, Aplicativo, EntradaCatalogo, RiesgoTecnico, PlanDeAccion, CasoDeExitoIA y Usuario se asigna automaticamente al instante de creacion del registro. | ENT-001..012 |
| BR-CAL-D010 | Auto-actualizacion fechaModificacion | El atributo fechaModificacion se actualiza automaticamente en cada cambio del registro para todas las entidades que lo declaran. | ENT-001, 002, 003, 004, 007, 009, 010, 011, 012 |
| BR-CAL-D011 | CasoDeExitoIA - ultimaModificacionPor | El atributo ultimaModificacionPor de CasoDeExitoIA se actualiza automaticamente al usuario autenticado que realiza la modificacion. | ENT-010 |

---

## Trazabilidad

- Fuente: [DOM-001] Modelo de Dominio Funcional - Project Monitor
- Producido por: ba-2.1 (RULES-ONLY mode)
- Fecha: 2026-04-30
