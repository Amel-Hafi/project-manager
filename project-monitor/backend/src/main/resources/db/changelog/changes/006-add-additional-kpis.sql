--liquibase formatted sql

--changeset additional-kpis:1
ALTER TABLE application ADD COLUMN last_production_deployment_date DATE;
ALTER TABLE application ADD COLUMN active_critical_cves INTEGER DEFAULT 0;
ALTER TABLE application ADD COLUMN technical_doc_up_to_date BOOLEAN DEFAULT FALSE;
