---
source: DOM-001
type: rules-staging
rule_type: COH
extracted_by: ba-2.1
status: draft
version: "1.0"
last_updated: 2026-04-30
language: es
---

# Reglas de Coherencia (COH) extraidas de [DOM-001]

Invariantes y restricciones de integridad referencial y de coherencia entre entidades.

| ID | Alcance | Regla | Origen DOM-001 |
|----|---------|-------|----------------|
| BR-COH-D001 | Cliente / Proyecto / Aplicativo | Un Aplicativo no puede existir sin un Proyecto valido; un Proyecto no puede existir sin un Cliente valido. | INV-004 |
| BR-COH-D002 | Cliente / Proyecto | No se permite eliminar un Cliente que tenga Proyectos asociados. La eliminacion en cascada no esta permitida. | INV-004 |
| BR-COH-D003 | Proyecto / Aplicativo | No se permite eliminar un Proyecto que tenga Aplicativos asociados. La eliminacion en cascada no esta permitida. | INV-004 |
| BR-COH-D004 | Aplicativo / KPIDeMadurez | Cada Aplicativo debe tener exactamente 7 KPIDeMadurez, uno por cada valor de REF-001 DimensionDeMadurez. Este conjunto no puede quedar incompleto. | INV-003 |
| BR-COH-D005 | KPIDeMadurez | La combinacion (aplicativoId, dimension) es unica: no pueden existir dos KPIDeMadurez para el mismo Aplicativo y dimension. | INV-009 |
| BR-COH-D006 | KPIDeMadurez | El valor de un KPIDeMadurez es nulo o un entero entre 1 y 10 inclusive; no se admiten valores fuera de este rango. | INV-001 |
| BR-COH-D007 | KPIDeMadurez | Si valor no es nulo, fechaEvaluacion y justificacion son obligatorios. | INV-002 |
| BR-COH-D008 | PlantillaDeValoracion | Para cada DimensionDeMadurez existe como maximo una PlantillaDeValoracion con activa=true en un momento dado. | INV-005 |
| BR-COH-D009 | PlanDeAccion / RiesgoTecnico | Un PlanDeAccion esta asociado a exactamente un RiesgoTecnico; la asociacion es inmutable tras la creacion. | INV-006 |
| BR-COH-D010 | RiesgoTecnico / ReglaDecision | Un RiesgoTecnico con tipo=AUTOMATICO debe tener reglaDecisionId informado y referenciar una ReglaDecision activa; un RiesgoTecnico con tipo=MANUAL no tiene reglaDecisionId. | ENT-008, INV-007 |
| BR-COH-D011 | Usuario | El email de un Usuario es unico en el sistema; no pueden existir dos usuarios con el mismo email. | INV-010 |
| BR-COH-D012 | EntradaCatalogo / BloqueTematico | Toda EntradaCatalogo pertenece a exactamente un BloqueTematico existente. | ENT-004, ENT-005 |
| BR-COH-D013 | CasoDeExitoIA / EntradaCatalogo | Si herramientaIAId esta informado, debe referenciar una EntradaCatalogo perteneciente al bloque tematico de inteligencia artificial. | ENT-010 |
| BR-COH-D014 | Usuario / Proyecto | La asignacion N:N Usuario-Proyecto solo aplica a Usuarios con rol ROL_MANAGER o ROL_REFERENTE; ROL_ADMIN y ROL_DIRECTOR no se asignan a proyectos. | ENT-012 |
| BR-COH-D015 | RiesgoTecnico | Si estado=CERRADO, fechaCierre debe estar informada; si estado != CERRADO, fechaCierre debe estar nula. | ENT-008 |
| BR-COH-D016 | PlanDeAccion | El plazo de un PlanDeAccion debe ser una fecha posterior a su fechaCreacion. | ENT-009 |
| BR-COH-D017 | CasoDeExitoIA | El atributo fecha de un CasoDeExitoIA no puede ser posterior a la fecha actual. | ENT-010 |
| BR-COH-D018 | BloqueTematico | El atributo nombre es unico y el atributo orden es unico por posicion. | ENT-005 |
| BR-COH-D019 | ReglaDecision | Solo las ReglaDecision con activa=true participan en la evaluacion del arbol de decision. | ENT-011 |

---

## Trazabilidad

- Fuente: [DOM-001] Modelo de Dominio Funcional - Project Monitor
- Producido por: ba-2.1 (RULES-ONLY mode)
- Fecha: 2026-04-30
