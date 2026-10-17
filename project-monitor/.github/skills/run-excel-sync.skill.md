---
name: "run-excel-sync"
description: "Parses the local 'referentiel.xlsx' file and performs a secure UPSERT SQL transaction inside the PostgreSQL technology_item table using a local Python engine."
tools: [execute]
---

# Skill: run-excel-sync

## Purpose
Automate the data ingestion from the client's Excel spreadsheet directly into the application's live database schema without manual data entry.

## Execution Trigger
When this skill is invoked, the agent MUST open the local terminal and execute the dedicated synchronization engine:

```bash
python sync_referential.py