---
source: DOM-001
type: rules-staging
rule_type: TRG
extracted_by: ba-2.1
status: draft
version: "1.0"
last_updated: 2026-04-30
language: es
---

# Reglas de Disparador (TRG) extraidas de [DOM-001]

Reglas que disparan acciones automaticas del sistema en respuesta a eventos.

| ID | Evento desencadenante | Accion automatica | Origen DOM-001 |
|----|----------------------|-------------------|----------------|
| BR-TRG-D001 | Creacion de un Aplicativo | El sistema genera automaticamente exactamente 7 registros KPIDeMadurez (uno por cada DimensionDeMadurez de REF-001) con valor nulo. | ENT-003, INV-003 |
| BR-TRG-D002 | Cumplimiento de la condicion de una ReglaDecision activa | El sistema genera automaticamente un RiesgoTecnico con tipo=AUTOMATICO, estado=ABIERTO y reglaDecisionId apuntando a la regla que disparo el evento. | ENT-008, ENT-011, INV-007 |
| BR-TRG-D003 | DarDeBaja de una EntradaCatalogo (estado: ACTIVO -> DADO_DE_BAJA) | Se desencadena una notificacion interna a los Referentes DT y Managers de los Aplicativos asociados (especificacion pendiente segun ESC-002 de ACT-001). | ENT-004, ciclo de vida |
| BR-TRG-D004 | Asociacion de un PlanDeAccion activo a un RiesgoTecnico en estado ABIERTO | El RiesgoTecnico transita automaticamente al estado EN_PROGRESO. | ENT-008, ciclo de vida |
| BR-TRG-D005 | Cierre de un RiesgoTecnico (transicion -> CERRADO) | El sistema exige y registra la fechaCierre con la fecha del evento. | ENT-008 |
| BR-TRG-D006 | Creacion o modificacion de una entidad con fechaCreacion / fechaModificacion | El sistema asigna o actualiza automaticamente los timestamps correspondientes (ver tambien BR-CAL-D009, BR-CAL-D010). | ENT-001..012 |
| BR-TRG-D007 | Activacion de una nueva PlantillaDeValoracion para una dimension | El sistema garantiza que la(s) plantilla(s) anteriormente activa(s) de la misma dimension queden con activa=false (al solo poder existir una activa por dimension). | ENT-007, INV-005 |
| BR-TRG-D008 | Modificacion de un CasoDeExitoIA | El sistema actualiza automaticamente el atributo ultimaModificacionPor con el usuario autenticado. | ENT-010 |
| BR-TRG-D009 | Desactivacion de un Usuario | El usuario pierde acceso al sistema; sus registros y asignaciones existentes se conservan sin modificacion. | ENT-012, ciclo de vida |

---

## Trazabilidad

- Fuente: [DOM-001] Modelo de Dominio Funcional - Project Monitor
- Producido por: ba-2.1 (RULES-ONLY mode)
- Fecha: 2026-04-30
