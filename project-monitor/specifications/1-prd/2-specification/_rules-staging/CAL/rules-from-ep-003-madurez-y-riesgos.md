---
source: EP-003
type: rules-staging
rule_type: CAL
extracted_by: ba-2.2b
epic: EP-003
status: draft
version: "1.0"
last_updated: 2026-04-30
language: es
---

# Reglas de Cálculo (CAL) extraídas de [EP-003]

Reglas que definen fórmulas o algoritmos que generan resultados a partir de datos del sistema. Identificadores temporales que serán consolidados por `agent-2.3-business-rules`.

## [FT-017] Vista de madurez por aplicativo (radar)

| ID | Entidad / Alcance | Fórmula o algoritmo | Funcionalidades |
|----|-------------------|---------------------|-----------------|
| BR-CAL-F017-01 | KPIDeMadurez sobre Aplicativo | La posición de cada vértice del radar es proporcional al valor del KPI sobre la escala 1-10; los KPIs nulos se representan en el origen del eje y se etiquetan como "sin evaluar". | [FT-017] |

## [FT-018] Vistas agregadas con semáforo por proyecto y cliente

| ID | Entidad / Alcance | Fórmula o algoritmo | Funcionalidades |
|----|-------------------|---------------------|-----------------|
| BR-CAL-F018-01 | Proyecto | Media por dimensión = media aritmética de los KPIs no nulos de la dimensión sobre los aplicativos del proyecto. | [FT-018] |
| BR-CAL-F018-02 | Proyecto / Cliente / Global | Punto negro por dimensión = mínimo de los valores no nulos en el nivel agregado; punto dorado por dimensión = máximo de los valores no nulos. | [FT-018] |
| BR-CAL-F018-03 | Cliente / Global | La media a nivel de cliente agrega los proyectos del cliente; la vista global agrega todos los clientes del porfolio. La fórmula de agregación es configurable. | [FT-018] |

## [FT-019] Árbol de decisión y semáforo de estado

| ID | Entidad / Alcance | Fórmula o algoritmo | Funcionalidades |
|----|-------------------|---------------------|-----------------|
| BR-CAL-F019-01 | ReglaDecision | Solo las reglas con `activa = true` participan en la evaluación del semáforo y en la generación de riesgos automáticos. | [FT-019], [FT-020] |
| BR-CAL-F019-02 | Semáforo de la entidad | Cuando varias reglas activas se cumplen para una misma entidad, prevalece el nivel de semáforo más severo (ROJO > NARANJA > VERDE). | [FT-019] |
