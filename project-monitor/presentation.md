# Cartografía y Seguimiento de Proyectos — Rapport de fin de Hackathon

**Date :** 5 juin 2026  
**Statut :** Phase 1 terminée — 21 features implémentées, 100% mergé sur `master`

---

## 1. Stack Technique

| Couche | Technologie | Version |
|--------|-------------|---------|
| Backend | Spring Boot + Java | 3.3.0 / Java 21 |
| Frontend | Angular + Angular Material | 17 |
| Base de données | PostgreSQL | 16 |
| Authentification | JWT (Spring Security) | — |
| Migrations BDD | Liquibase | — |
| i18n | ngx-translate | ES / EN / FR |
| Build | Maven (back) / Angular CLI (front) | — |
| CI/CD | GitLab CI/CD | — |
| Conteneurisation | Docker (multi-stage) | — |

---

## 2. Architecture & Écosystème d'Agents

L'application **Project Monitor** s'appuie sur un réseau de **10 agents spécialisés**, orchestrés de manière centralisée.

```
                        ┌─────────────────────────────────┐
                        │           👤 UTILISATEUR        │  
                        └────────────────┬────────────────┘
                                         │
                                         ▼
                        ┌─────────────────────────────────┐
                        │      monitor-orchestrator       │ ◄─── (Chef d'orchestre)
                        └────────────────┬────────────────┘
                                         │
       ┌────────────────┬────────────────┼────────────────┬────────────────┐
       ▼ (Développement) ▼ (DevOps)      ▼ (Sécurité)     ▼ (Qualité)      │
 ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
 │   monitor-   │ │   monitor-   │ │   monitor-   │ │  qa-backend- │       │
 │backend.agent │ │ devops.agent │ │   backend-   │ │reviewer.agent│       │
 └──────┬───────┘ └──────────────┘ │   security-  │ └──────┬───────┘       │
        │                          │  compliance  │        │               │
 ┌──────────────┐                  └──────┬───────┘ ┌──────────────┐       │
 │   monitor-   │                         │         │  qa-frontend-│       │
 │frontend.agent│                  ┌──────────────┐ │reviewer.agent│       │
 └──────────────┘                  │   monitor-   │ └──────┬───────┘       │
                                   │  frontend-   │        │               │
                                   │   security-  │ ┌──────────────┐       │
                                   │  compliance  │ │   monitor-   │       │
                                   └──────┬───────┘ │ tester.agent │       │
                                          │         └──────────────┘       │
                                   ┌──────────────┐                        │
                                   │monitor-excel-│                        │
                                   │migrator.agent│                        │
                                   └──────────────┘                        │
```

### Rôles et Responsabilités

| Agent | Rôle |
|-------|------|
| **monitor-orchestrator** | Point d'entrée unique. Analyse les specs, conçoit l'architecture, fige les contrats d'API, crée les branches Git, distribue les tâches et valide les jalons. |
| **monitor-backend** | Produit la logique Spring Boot (entities, services, controllers) avec tests unitaires obligatoires. |
| **monitor-frontend** | Produit l'interface Angular (components standalone, services, routing) avec tests unitaires obligatoires. |
| **monitor-devops** | Crée les pipelines CI/CD (GitLab CI/CD), Dockerfiles, scripts de build et scanning de sécurité. |
| **qa-backend-reviewer** | Audit de code backend. Doit émettre un `REVIEW PASSED` indépendant pour autoriser le merge. |
| **qa-frontend-reviewer** | Audit de code frontend. Vérifie l'i18n, la sécurité des vues, les standards Angular. |
| **monitor-backend-security-compliance** | Scanne les controllers, la config Spring Security, les dépendances pour détecter les vulnérabilités. |
| **monitor-frontend-security-compliance** | Analyse les configurations Angular, les guards, l'exposition de données côté client. |
| **monitor-excel-migrator** | Parse et insère les référentiels en BDD depuis des fichiers Excel via un script Python. |
| **monitor-tester** | Exécute les tests d'API end-to-end après vérification de l'activité du port 8080. |

---

## 3. Workflow Principal : `run update specification`

Le cycle de développement est entièrement automatisé à partir d'une spécification fonctionnelle.

```
[ 👤 Utilisateur ] ──( run update specification )──► [ 🤖 Orchestrator ]
                                                               │
                                         (Analyse d'impact parallèle & simultanée)
                                         ├── ⚙️ @monitor-backend (Java, DTOs...)
                                         ├── 🎨 @monitor-frontend (Angular, i18n...)
                                         └── 🔐 @security-agents (Conformité RBAC)
                                                               │
                                                               ▼
                                              [ 📝 Plan d'action & API Contract ]
                                                               │
                                                       (Validation 🟢)
                                                               │
                                                               ▼
                                               [ 📂 Branche feature/ créée ]
                                                               │
                                           ┌───────────────────┴───────────────────┐
                                           ▼ (Délégation de code)                  ▼
                                     [ Layer BACKEND ]                       [ Layer FRONTEND ]
                                     - @monitor-backend                      - @monitor-frontend
                                     - @qa-backend-reviewer                  - @qa-frontend-reviewer
                                           │ (REVIEW PASSED)                       │ (REVIEW PASSED)
                                           └───────────────────┬───────────────────┘
                                                               │
                                                               ▼
                                                     [ 🧪 @monitor-tester ]
                                               (Vérification Port 8080 & Tests API)
                                                               │
                                                       (Tests au vert ✔️)
                                                               │
                                                               ▼
                                                 [ 🚀 Merge sur la branche master ]
```

**Contraintes du workflow :**

- Le frontend n'est jamais délégué tant que le contrat d'API (DTOs, endpoints) n'est pas figé
- Les deux reviews doivent passer (`BACKEND REVIEW PASSED` + `FRONTEND REVIEW PASSED`) avant tout merge
- Tout texte affiché doit utiliser le pipe `translate` — vérifié par le reviewer frontend
- Les sous-agents lisent le code existant avant d'implémenter pour ne jamais écraser de fonctionnalités

---

## 4. Workflow de Résolution d'Anomalie

Lorsqu'un défaut est détecté pendant les tests, les agents le corrigent de manière autonome :

```
[Orchestrator] ──► [@monitor-excel-migrator] (Insertion BDD via Script Python)
                               │
                               ▼
[Orchestrator] ──► [@monitor-tester] (Exécution des tests d'API)
                               │
                               ▼ ❌ [DÉTECTION D'UN DEFECT]
                               │
[Orchestrator] ──► (Analyse & Plan d'action proposé à l'utilisateur)
                               │
                               ▼  (Validation utilisateur)
[Orchestrator] ──► [Création branche fix] ──► [@monitor-backend] (Correction)
                               │
                               ▼
                  [@qa-backend-reviewer] ──► 🟢 PASSED ──► [Merge master]
                               │
                               ▼
                  [@monitor-tester] ──► 🏆 Tests OK !
```

---

## 5. Mode Audit de Sécurité Instantané

L'orchestrateur dispose d'un raccourci pour bypasser le flux de développement et dresser un bilan de sécurité immédiat.

```
[ Utilisateur ] ──( run audit process )──► [ Orchestrator ]
                                                    │
                                ┌───────────────────┴───────────────────┐
                                ▼           (Analyse en parallèle)      ▼
                         [ @monitor-backend-security ]           [ @monitor-frontend-security ]
                         Scanne Controllers, Spring Security     Analyse Guards, Config Angular
                                │                                       │
                                └───────────────────┬───────────────────┘
                                                    │
                                                    ▼
                                          [ 📊 Rapport d'Audit ]
```

Ce mode scanne en parallèle :

- **Backend :** Controllers, configuration Spring Security, dépendances Maven (CVEs)
- **Frontend :** Configuration Angular, guards, dépendances npm, exposition de données
---

## 6. Pipeline CI/CD (`run setup ci-cd pipeline` → @monitor-devops)

Pipeline GitLab CI/CD (`.gitlab-ci.yml`) déclenché sur chaque push vers `master` et sur les merge requests ciblant `master`. Produit par l'agent `@monitor-devops`.

```
┌────────────────────────────────────────────────────────────────────────┐
│           PUSH sur master / MERGE REQUEST vers master                  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼ (stage: build, parallèle)     ▼
┌───────────────────────────────────┐  ┌─────────────────────────────────┐
│ JOB 1 : BACKEND BUILD & TEST      │  │ JOB 2 : FRONTEND BUILD & TEST   │
│  • Image: maven:3.9-temurin-21    │  │  • Image: node:20               │
│  • Cache Maven .m2                │  │  • Cache node_modules           │
│  • mvn verify (~232 tests)        │  │  • npm ci                       │
│  • Artifacts: JAR + surefire      │  │  • ng test (~240 tests)         │
│                                   │  │  • ng build --production        │
│                                   │  │  • Artifacts: dist/             │
└───────────────────┬───────────────┘  └───────────────────┬─────────────┘
                    │                                      │
                    └───────────────┬──────────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ STAGE: SECURITY (needs: backend + frontend)                            │
│  • security:frontend → npm audit --audit-level=high                    │
│  • security:backend → OWASP Dependency-Check (failBuildOnCVSS=7)       │
│  • Artifacts: rapport OWASP HTML                                       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ STAGE: DOCKER (needs: security jobs)                                   │
│  • docker:backend → Build image (multi-stage → JRE 21 Alpine)          │
│  • docker:frontend → Build image (multi-stage → nginx Alpine)          │
│  • Docker-in-Docker (dind service)                                     │
│  • Validation uniquement (pas de push)                                 │
└────────────────────────────────────────────────────────────────────────┘
```

## 7. Features Implémentées (Phase 1)

| # | Feature | Description |
|---|---------|-------------|
| FT-001 | Catálogo de tecnologías | CRUD du référentiel technologique par catégories |
| FT-002→005 | Référentiel étendu | Outils CI/CD, exécution locale, environnements, IA |
| FT-006 | Plantillas de valoración KPI | Templates de notation 1-10 par dimension avec auto-désactivation |
| FT-007 | Ciclo de vida referencial | Désactivation/réactivation d'éléments (soft-deprecation) |
| FT-009→010 | Gestión proyectos/aplicativos | CRUD Clients → Projets → Applicatifs |
| FT-011→012 | Authentification & rôles | JWT + 4 rôles (Admin, Director, Manager, Referente DT) |
| FT-013 | Asignación usuarios | Affectation Manager/Referente DT aux projets |
| FT-014 | Captura de KPIs | Saisie des 6 dimensions de maturité (1-10) |
| FT-015 | Histórico de KPIs | Justifications textuelles + date d'évaluation par dimension |
| FT-016 | Casos de éxito IA | Registre des success stories IA par applicatif |
| FT-017 | Vista radar | Radar chart de maturité par applicatif |
| FT-018 | Vistas agregadas | Dashboard avec semaphores (Client → Projet → App) |
| FT-019 | Árbol de decisión semáforo | Moteur de règles configurable remplaçant les seuils hardcodés |
| FT-020→021 | Riesgos automáticos/manuales | Détection auto par seuils KPI + saisie manuelle |

**Métriques globales :** ~100 fichiers créés/modifiés, ~5000 lignes de code, 9 migrations Liquibase

---

## 8. Prochaines étapes (hors scope Phase 1)

- **FT-011 complet :** Intégration OIDC réelle (Keycloak / Azure AD)
- **Tests E2E :** Playwright ou Cypress
- **Export :** PDF/CSV des rapports de maturité
