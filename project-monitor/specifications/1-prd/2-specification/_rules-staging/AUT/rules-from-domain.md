---
source: DOM-001
type: rules-staging
rule_type: AUT
extracted_by: ba-2.1
status: draft
version: "1.0"
last_updated: 2026-04-30
language: es
---

# Reglas de Autorizacion (AUT) extraidas de [DOM-001]

Reglas que delimitan que rol o usuario puede realizar cada operacion sobre las entidades del dominio.

| ID | Operacion / Entidad | Regla | Origen DOM-001 |
|----|---------------------|-------|----------------|
| BR-AUT-D001 | Gestion de Cliente | El ciclo de vida (alta, modificacion, baja) de Cliente es exclusivo del rol ROL_ADMIN. | ENT-001 |
| BR-AUT-D002 | Gestion de Proyecto | El alta y modificacion de Proyecto es responsabilidad del ROL_ADMIN; ROL_MANAGER lo supervisa en su alcance. | ENT-002 |
| BR-AUT-D003 | Gestion de EntradaCatalogo | El alta, modificacion, darDeBaja y reactivar de EntradaCatalogo son acciones exclusivas de ROL_ADMIN. | ENT-004, ciclo de vida |
| BR-AUT-D004 | Gestion de BloqueTematico | La gestion de BloqueTematico es exclusiva de ROL_ADMIN. | ENT-005 |
| BR-AUT-D005 | Captura de KPIDeMadurez | La introduccion y modificacion del valor, fechaEvaluacion, justificacion y datosBrutos de KPIDeMadurez es responsabilidad del ROL_REFERENTE en los proyectos asignados. | ENT-006 |
| BR-AUT-D006 | Gestion de PlantillaDeValoracion | El alta, modificacion y activacion de PlantillaDeValoracion son exclusivas de ROL_ADMIN. | ENT-007 |
| BR-AUT-D007 | Creacion de RiesgoTecnico manual | Un RiesgoTecnico con tipo=MANUAL solo puede ser registrado por usuarios con ROL_MANAGER o ROL_REFERENTE en los proyectos donde estan asignados. | ENT-008 |
| BR-AUT-D008 | Creacion de RiesgoTecnico automatico | Un RiesgoTecnico con tipo=AUTOMATICO solo puede ser creado por el sistema; ningun usuario puede crearlo manualmente. | INV-007 |
| BR-AUT-D009 | Gestion de PlanDeAccion | La creacion y actualizacion de PlanDeAccion corresponde a los usuarios con acceso al RiesgoTecnico asociado segun su rol y alcance (ROL_MANAGER o ROL_REFERENTE en su proyecto). | ENT-009 |
| BR-AUT-D010 | Publicacion de CasoDeExitoIA | La creacion y modificacion de CasoDeExitoIA corresponde a ROL_REFERENTE y ROL_MANAGER en los proyectos asignados. | ENT-010 |
| BR-AUT-D011 | Eliminacion de CasoDeExitoIA | Solo el Usuario creador (creadoPor) o un Usuario con ROL_ADMIN puede eliminar un CasoDeExitoIA. | INV-008 |
| BR-AUT-D012 | Gestion de ReglaDecision | El alta, modificacion y activacion de ReglaDecision son exclusivas de ROL_ADMIN. | ENT-011 |
| BR-AUT-D013 | Gestion de Usuario | El alta, desactivacion y reactivacion de Usuario son exclusivas de ROL_ADMIN. | ENT-012, ciclo de vida |
| BR-AUT-D014 | Vista global de lectura | El ROL_DIRECTOR dispone de visibilidad total en lectura sobre todas las entidades del dominio sin capacidad de modificacion. | REF-007 |
| BR-AUT-D015 | Alcance Manager / Referente | Las operaciones de ROL_MANAGER y ROL_REFERENTE estan limitadas a los Proyectos a los que esten asignados (relacion N:N Usuario-Proyecto). | ENT-012 |
| BR-AUT-D016 | Acceso al sistema | Solo los Usuarios con activo=true pueden iniciar sesion en el sistema. | ENT-012 |

---

## Trazabilidad

- Fuente: [DOM-001] Modelo de Dominio Funcional - Project Monitor
- Producido por: ba-2.1 (RULES-ONLY mode)
- Fecha: 2026-04-30
