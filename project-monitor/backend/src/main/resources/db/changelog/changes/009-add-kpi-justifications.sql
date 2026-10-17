--liquibase formatted sql

--changeset projectmonitor:009-add-kpi-justifications
ALTER TABLE maturity_kpi ADD COLUMN justification_industrialization TEXT;
ALTER TABLE maturity_kpi ADD COLUMN justification_code_quality TEXT;
ALTER TABLE maturity_kpi ADD COLUMN justification_testing TEXT;
ALTER TABLE maturity_kpi ADD COLUMN justification_deployment TEXT;
ALTER TABLE maturity_kpi ADD COLUMN justification_obsolescence TEXT;
ALTER TABLE maturity_kpi ADD COLUMN justification_ai_adoption TEXT;
ALTER TABLE maturity_kpi ADD COLUMN evaluated_at TIMESTAMP;
