---
source: DOM-001
type: rules-staging
rule_type: VAL
extracted_by: ba-2.1
status: draft
version: "1.0"
last_updated: 2026-04-30
language: es
---

# Reglas de Validacion (VAL) extraidas de [DOM-001]

Reglas que imponen formato, rangos, obligatoriedad, formato o restricciones estructurales sobre los datos.

| ID | Entidad | Atributo / Alcance | Regla | Origen DOM-001 |
|----|---------|--------------------|-------|----------------|
| BR-VAL-D001 | Cliente | nombre | Obligatorio, no vacio, maximo 200 caracteres. | ENT-001 |
| BR-VAL-D002 | Cliente | descripcion | Opcional, maximo 2000 caracteres. | ENT-001 |
| BR-VAL-D003 | Proyecto | nombre | Obligatorio, no vacio, maximo 200 caracteres. | ENT-002 |
| BR-VAL-D004 | Proyecto | descripcion | Opcional, maximo 2000 caracteres. | ENT-002 |
| BR-VAL-D005 | Proyecto | clienteId | Obligatorio; debe referenciar un Cliente existente. | ENT-002 |
| BR-VAL-D006 | Aplicativo | nombre | Obligatorio, no vacio, maximo 200 caracteres. | ENT-003 |
| BR-VAL-D007 | Aplicativo | descripcion | Opcional, maximo 2000 caracteres. | ENT-003 |
| BR-VAL-D008 | Aplicativo | proyectoId | Obligatorio; debe referenciar un Proyecto existente. | ENT-003 |
| BR-VAL-D009 | EntradaCatalogo | nombre | Obligatorio, no vacio, maximo 200 caracteres. | ENT-004 |
| BR-VAL-D010 | EntradaCatalogo | descripcion | Opcional, maximo 500 caracteres. | ENT-004 |
| BR-VAL-D011 | EntradaCatalogo | bloqueTematicoId | Obligatorio; debe referenciar un BloqueTematico existente. | ENT-004 |
| BR-VAL-D012 | EntradaCatalogo | tipoPropiedad | Obligatorio; valor permitido segun REF-003 (CORPORATIVO, PROYECTO, CLIENTE). | ENT-004 |
| BR-VAL-D013 | EntradaCatalogo | estado | Obligatorio; valor segun REF-002 (ACTIVO, DADO_DE_BAJA); por defecto ACTIVO. | ENT-004 |
| BR-VAL-D014 | BloqueTematico | nombre | Obligatorio, maximo 100 caracteres, unico en el sistema. | ENT-005 |
| BR-VAL-D015 | BloqueTematico | descripcion | Opcional, maximo 500 caracteres. | ENT-005 |
| BR-VAL-D016 | BloqueTematico | orden | Obligatorio, entero >= 1, unico por posicion. | ENT-005 |
| BR-VAL-D017 | KPIDeMadurez | aplicativoId | Obligatorio; debe referenciar un Aplicativo existente. | ENT-006 |
| BR-VAL-D018 | KPIDeMadurez | dimension | Obligatorio; valor segun REF-001 (las 7 dimensiones). | ENT-006 |
| BR-VAL-D019 | KPIDeMadurez | valor | Si no es nulo, entero entre 1 y 10 inclusive. | ENT-006, INV-001 |
| BR-VAL-D020 | KPIDeMadurez | fechaEvaluacion | Obligatoria si valor no es nulo. | ENT-006, INV-002 |
| BR-VAL-D021 | KPIDeMadurez | justificacion | Obligatoria si valor no es nulo; maximo 2000 caracteres. | ENT-006, INV-002 |
| BR-VAL-D022 | KPIDeMadurez | datosBrutos | Opcional, maximo 2000 caracteres. | ENT-006 |
| BR-VAL-D023 | KPIDeMadurez | (aplicativoId, dimension) | Combinacion unica en el sistema. | ENT-006, INV-009 |
| BR-VAL-D024 | PlantillaDeValoracion | dimension | Obligatoria; valor segun REF-001. | ENT-007 |
| BR-VAL-D025 | PlantillaDeValoracion | version | Obligatoria, maximo 20 caracteres. | ENT-007 |
| BR-VAL-D026 | PlantillaDeValoracion | contenido | Obligatorio; debe contener criterios para cada nivel del 1 al 10. | ENT-007 |
| BR-VAL-D027 | PlantillaDeValoracion | activa | Obligatorio; maximo una plantilla activa por dimension. | ENT-007, INV-005 |
| BR-VAL-D028 | RiesgoTecnico | titulo | Obligatorio, no vacio, maximo 200 caracteres. | ENT-008 |
| BR-VAL-D029 | RiesgoTecnico | descripcion | Obligatoria, maximo 2000 caracteres. | ENT-008 |
| BR-VAL-D030 | RiesgoTecnico | tipo | Obligatorio; valor segun REF-004 (AUTOMATICO, MANUAL). | ENT-008 |
| BR-VAL-D031 | RiesgoTecnico | estado | Obligatorio; valor segun REF-005; por defecto ABIERTO. | ENT-008 |
| BR-VAL-D032 | RiesgoTecnico | aplicativoId | Obligatorio; debe referenciar un Aplicativo existente. | ENT-008 |
| BR-VAL-D033 | RiesgoTecnico | reglaDecisionId | Obligatorio si tipo=AUTOMATICO; nulo si tipo=MANUAL. | ENT-008 |
| BR-VAL-D034 | RiesgoTecnico | fechaCierre | Obligatoria si estado=CERRADO. | ENT-008 |
| BR-VAL-D035 | PlanDeAccion | descripcion | Obligatoria, maximo 2000 caracteres. | ENT-009 |
| BR-VAL-D036 | PlanDeAccion | responsable | Obligatorio, maximo 200 caracteres. | ENT-009 |
| BR-VAL-D037 | PlanDeAccion | plazo | Obligatorio; fecha posterior a la de creacion. | ENT-009 |
| BR-VAL-D038 | PlanDeAccion | estado | Obligatorio; valor segun REF-009; por defecto PENDIENTE. | ENT-009 |
| BR-VAL-D039 | PlanDeAccion | riesgoTecnicoId | Obligatorio; referencia un RiesgoTecnico existente; inmutable tras creacion. | ENT-009, INV-006 |
| BR-VAL-D040 | CasoDeExitoIA | titulo | Obligatorio, no vacio, maximo 200 caracteres. | ENT-010 |
| BR-VAL-D041 | CasoDeExitoIA | descripcion | Obligatoria, maximo 5000 caracteres. | ENT-010 |
| BR-VAL-D042 | CasoDeExitoIA | fecha | Obligatoria; no posterior a la fecha actual. | ENT-010 |
| BR-VAL-D043 | CasoDeExitoIA | proyectoId | Obligatorio; debe referenciar un Proyecto existente. | ENT-010 |
| BR-VAL-D044 | CasoDeExitoIA | herramientaIAId | Opcional; si presente, debe ser EntradaCatalogo del bloque tematico de IA. | ENT-010 |
| BR-VAL-D045 | ReglaDecision | nombre | Obligatorio, no vacio, maximo 200 caracteres. | ENT-011 |
| BR-VAL-D046 | ReglaDecision | descripcion | Obligatoria, maximo 2000 caracteres. | ENT-011 |
| BR-VAL-D047 | ReglaDecision | condicion | Obligatoria; expresion formal evaluable. | ENT-011 |
| BR-VAL-D048 | ReglaDecision | umbral | Obligatorio; entre 0 y 100 si porcentaje, o entre 1 y 10 si valor de KPI. | ENT-011 |
| BR-VAL-D049 | ReglaDecision | dimension | Opcional; si presente, valor segun REF-001. | ENT-011 |
| BR-VAL-D050 | ReglaDecision | nivelAgregacion | Obligatorio; valor segun REF-010. | ENT-011 |
| BR-VAL-D051 | ReglaDecision | nivelSemaforo | Obligatorio; valor segun REF-006. | ENT-011 |
| BR-VAL-D052 | Usuario | nombre | Obligatorio, no vacio, maximo 200 caracteres. | ENT-012 |
| BR-VAL-D053 | Usuario | email | Obligatorio; formato e-mail valido; unico en el sistema. | ENT-012, INV-010 |
| BR-VAL-D054 | Usuario | rol | Obligatorio; valor segun REF-007. | ENT-012 |
| BR-VAL-D055 | Usuario | activo | Obligatorio, por defecto true. | ENT-012 |

---

## Trazabilidad

- Fuente: [DOM-001] Modelo de Dominio Funcional - Project Monitor
- Producido por: ba-2.1 (RULES-ONLY mode)
- Fecha: 2026-04-30
