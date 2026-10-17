# =============================================================================
# Project Monitor — Comprehensive Dataset Injection
# =============================================================================
# Injects a realistic dataset via REST API for E2E testing.
# Prerequisite: Backend running on http://localhost:8080 with H2 profile.
# =============================================================================

$baseUrl = "http://localhost:8080/api/v1"

# --- Authentication ---
Write-Host "=== AUTHENTICATION ===" -ForegroundColor Cyan
$token = (Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body '{"username":"admin","password":"admin123"}').token
$h = @{Authorization="Bearer $token"; "Content-Type"="application/json"}
Write-Host "Login OK - Token obtained"

# --- Users ---
Write-Host "`n=== CREATING USERS ===" -ForegroundColor Cyan
$users = @(
  '{"username":"jmartin","email":"j.martin@corp.com","firstName":"Julie","lastName":"Martin","role":"DIRECTOR"}',
  '{"username":"pdurand","email":"p.durand@corp.com","firstName":"Pierre","lastName":"Durand","role":"MANAGER"}',
  '{"username":"slopez","email":"s.lopez@corp.com","firstName":"Sofia","lastName":"Lopez","role":"MANAGER"}',
  '{"username":"mgarcia","email":"m.garcia@corp.com","firstName":"Marc","lastName":"Garcia","role":"DT_REFERENT"}',
  '{"username":"lchen","email":"l.chen@corp.com","firstName":"Lina","lastName":"Chen","role":"DT_REFERENT"}',
  '{"username":"amoreau","email":"a.moreau@corp.com","firstName":"Antoine","lastName":"Moreau","role":"DT_REFERENT"}'
)

$userIds = @{}
foreach($u in $users) {
  $parsed = $u | ConvertFrom-Json
  try {
    $r = Invoke-RestMethod -Uri "$baseUrl/users" -Method POST -Headers $h -Body $u
    $userIds[$r.username] = $r.id
    Write-Host "  USER OK: $($r.username) -> id=$($r.id)"
  } catch {
    Write-Host "  USER EXISTS: $($parsed.username) (already created)" -ForegroundColor Yellow
  }
}

# Fetch all user IDs (in case some already existed)
$allUsers = (Invoke-RestMethod -Uri "$baseUrl/users?size=100" -Headers $h).content
foreach($u in $allUsers) {
  $userIds[$u.username] = $u.id
}
Write-Host "  Resolved $($userIds.Count) user IDs total"

# --- Clients ---
Write-Host "`n=== CREATING CLIENTS ===" -ForegroundColor Cyan
$clients = @(
  '{"name":"BNP Paribas","description":"Banque internationale - Division CIB (Corporate & Institutional Banking)"}',
  '{"name":"AXA Assurances","description":"Groupe assurance - Transformation digitale des portails clients"}',
  '{"name":"SNCF Voyageurs","description":"Transport ferroviaire - Systemes de reservation et tracking temps reel"}',
  '{"name":"Engie Energie","description":"Energie - IoT et smart metering pour la transition energetique"}',
  '{"name":"Carrefour Digital","description":"Grande distribution - E-commerce et supply chain digitale"}'
)

$clientIds = @{}
$clientNames = @("BNP Paribas","AXA Assurances","SNCF Voyageurs","Engie Energie","Carrefour Digital")
for($i=0; $i -lt $clients.Count; $i++) {
  try {
    $r = Invoke-RestMethod -Uri "$baseUrl/clients" -Method POST -Headers $h -Body $clients[$i]
    $clientIds[$clientNames[$i]] = $r.id
    Write-Host "  CLIENT OK: $($r.name) -> id=$($r.id)"
  } catch {
    Write-Host "  CLIENT FAIL: $($clientNames[$i]) - $($_.Exception.Message)" -ForegroundColor Red
  }
}

# --- Projects ---
Write-Host "`n=== CREATING PROJECTS ===" -ForegroundColor Cyan
$projects = @(
  @{name="Trading Platform"; clientKey="BNP Paribas"; desc="Plateforme de trading electronique multi-asset"},
  @{name="Risk Management Suite"; clientKey="BNP Paribas"; desc="Suite de gestion des risques de marche et credit"},
  @{name="Portail Client AXA"; clientKey="AXA Assurances"; desc="Portail web et mobile de gestion des contrats assurance"},
  @{name="Claims Processing"; clientKey="AXA Assurances"; desc="Traitement automatise des sinistres et indemnisations"},
  @{name="Reservation & Tracking"; clientKey="SNCF Voyageurs"; desc="Systeme de reservation et suivi temps reel des trains"},
  @{name="Route Optimizer"; clientKey="SNCF Voyageurs"; desc="Optimisation dynamique des itineraires et correspondances"},
  @{name="Smart Metering IoT"; clientKey="Engie Energie"; desc="Collecte et analyse des donnees de compteurs connectes"},
  @{name="Green Energy Portal"; clientKey="Engie Energie"; desc="Portail client transition energetique et autoconsommation"},
  @{name="E-Commerce Platform"; clientKey="Carrefour Digital"; desc="Plateforme e-commerce omnicanal avec gestion stocks"}
)

$projectIds = @{}
foreach($p in $projects) {
  $cId = $clientIds[$p.clientKey]
  $body = @{name=$p.name; description=$p.desc; clientId=$cId} | ConvertTo-Json
  try {
    $r = Invoke-RestMethod -Uri "$baseUrl/projects" -Method POST -Headers $h -Body $body
    $projectIds[$p.name] = $r.id
    Write-Host "  PROJECT OK: $($r.name) -> id=$($r.id)"
  } catch {
    Write-Host "  PROJECT FAIL: $($p.name) - $($_.Exception.Message)" -ForegroundColor Red
  }
}

# --- Project Assignments ---
Write-Host "`n=== CREATING ASSIGNMENTS ===" -ForegroundColor Cyan
$assignments = @(
  @{project="Trading Platform"; user="pdurand"; role="MANAGER"},
  @{project="Trading Platform"; user="mgarcia"; role="DT_REFERENT"},
  @{project="Risk Management Suite"; user="pdurand"; role="MANAGER"},
  @{project="Risk Management Suite"; user="mgarcia"; role="DT_REFERENT"},
  @{project="Portail Client AXA"; user="slopez"; role="MANAGER"},
  @{project="Portail Client AXA"; user="lchen"; role="DT_REFERENT"},
  @{project="Claims Processing"; user="slopez"; role="MANAGER"},
  @{project="Claims Processing"; user="lchen"; role="DT_REFERENT"},
  @{project="Reservation & Tracking"; user="pdurand"; role="MANAGER"},
  @{project="Reservation & Tracking"; user="amoreau"; role="DT_REFERENT"},
  @{project="Route Optimizer"; user="pdurand"; role="MANAGER"},
  @{project="Route Optimizer"; user="amoreau"; role="DT_REFERENT"},
  @{project="Smart Metering IoT"; user="slopez"; role="MANAGER"},
  @{project="Smart Metering IoT"; user="mgarcia"; role="DT_REFERENT"},
  @{project="Green Energy Portal"; user="slopez"; role="MANAGER"},
  @{project="Green Energy Portal"; user="lchen"; role="DT_REFERENT"},
  @{project="E-Commerce Platform"; user="pdurand"; role="MANAGER"},
  @{project="E-Commerce Platform"; user="amoreau"; role="DT_REFERENT"}
)

foreach($a in $assignments) {
  $projId = $projectIds[$a.project]
  $uId = $userIds[$a.user]
  $body = @{userId=$uId; projectId=$projId; role=$a.role} | ConvertTo-Json
  try {
    Invoke-RestMethod -Uri "$baseUrl/project-assignments" -Method POST -Headers $h -Body $body | Out-Null
    Write-Host "  ASSIGN OK: $($a.user) -> $($a.project) ($($a.role))"
  } catch {
    Write-Host "  ASSIGN FAIL: $($a.user)/$($a.project) - $($_.Exception.Message)" -ForegroundColor Red
  }
}

# --- Applications ---
Write-Host "`n=== CREATING APPLICATIONS ===" -ForegroundColor Cyan
$applications = @(
  @{name="trading-api"; project="Trading Platform"; status="ACTIVE"; deploy="2026-05-28"; cves=0; doc=$true},
  @{name="trading-ui"; project="Trading Platform"; status="ACTIVE"; deploy="2026-05-28"; cves=1; doc=$true},
  @{name="risk-calculator"; project="Risk Management Suite"; status="ACTIVE"; deploy="2026-04-15"; cves=2; doc=$true},
  @{name="risk-dashboard"; project="Risk Management Suite"; status="ACTIVE"; deploy="2026-05-01"; cves=0; doc=$false},
  @{name="portal-backend"; project="Portail Client AXA"; status="ACTIVE"; deploy="2026-05-20"; cves=0; doc=$true},
  @{name="portal-frontend"; project="Portail Client AXA"; status="ACTIVE"; deploy="2026-05-20"; cves=0; doc=$true},
  @{name="claims-api"; project="Claims Processing"; status="MAINTENANCE"; deploy="2025-11-10"; cves=5; doc=$false},
  @{name="claims-ui"; project="Claims Processing"; status="MAINTENANCE"; deploy="2025-12-01"; cves=3; doc=$false},
  @{name="tracker-service"; project="Reservation & Tracking"; status="ACTIVE"; deploy="2026-05-25"; cves=0; doc=$true},
  @{name="tracker-mobile"; project="Reservation & Tracking"; status="ACTIVE"; deploy="2026-05-25"; cves=1; doc=$true},
  @{name="optimizer-engine"; project="Route Optimizer"; status="ACTIVE"; deploy="2026-04-01"; cves=0; doc=$false},
  @{name="optimizer-api"; project="Route Optimizer"; status="ACTIVE"; deploy="2026-03-15"; cves=2; doc=$false},
  @{name="scada-collector"; project="Smart Metering IoT"; status="ACTIVE"; deploy="2026-05-30"; cves=0; doc=$true},
  @{name="scada-dashboard"; project="Smart Metering IoT"; status="ACTIVE"; deploy="2026-05-30"; cves=0; doc=$true},
  @{name="energy-portal-api"; project="Green Energy Portal"; status="ACTIVE"; deploy="2026-05-15"; cves=1; doc=$true},
  @{name="energy-portal-ui"; project="Green Energy Portal"; status="BUILDING"; deploy=$null; cves=0; doc=$false},
  @{name="ecommerce-api"; project="E-Commerce Platform"; status="ACTIVE"; deploy="2026-05-22"; cves=0; doc=$true},
  @{name="ecommerce-frontend"; project="E-Commerce Platform"; status="ACTIVE"; deploy="2026-05-22"; cves=0; doc=$true},
  @{name="ecommerce-backoffice"; project="E-Commerce Platform"; status="BUILDING"; deploy=$null; cves=0; doc=$false}
)

$appIds = @{}
foreach($app in $applications) {
  $projId = $projectIds[$app.project]
  $body = @{
    name = $app.name
    projectId = $projId
    status = $app.status
    activeCriticalCves = $app.cves
    technicalDocUpToDate = $app.doc
  }
  if($app.deploy) { $body["lastProductionDeploymentDate"] = $app.deploy }
  $json = $body | ConvertTo-Json
  try {
    $r = Invoke-RestMethod -Uri "$baseUrl/applications" -Method POST -Headers $h -Body $json
    $appIds[$app.name] = $r.id
    Write-Host "  APP OK: $($r.name) -> id=$($r.id)"
  } catch {
    Write-Host "  APP FAIL: $($app.name) - $($_.Exception.Message)" -ForegroundColor Red
  }
}

# --- Maturity KPIs ---
Write-Host "`n=== SETTING MATURITY KPIs ===" -ForegroundColor Cyan
# KPI values follow the risk auto-detection rules:
# - obsolescence < 4 -> SECURITY risk
# - industrialization < 3 -> OPERATIONAL risk
# - testing < 3 -> QUALITY risk
# - deployment < 3 -> AVAILABILITY risk
$kpis = @{
  "trading-api"        = @{industrialization=9; codeQuality=9; testing=9; deployment=9; obsolescence=9; aiAdoption=8}
  "trading-ui"         = @{industrialization=8; codeQuality=8; testing=8; deployment=8; obsolescence=8; aiAdoption=7}
  "risk-calculator"    = @{industrialization=8; codeQuality=8; testing=7; deployment=7; obsolescence=7; aiAdoption=6}
  "risk-dashboard"     = @{industrialization=6; codeQuality=7; testing=5; deployment=6; obsolescence=6; aiAdoption=5}
  "portal-backend"     = @{industrialization=8; codeQuality=9; testing=8; deployment=8; obsolescence=8; aiAdoption=7}
  "portal-frontend"    = @{industrialization=7; codeQuality=8; testing=7; deployment=7; obsolescence=8; aiAdoption=6}
  "claims-api"         = @{industrialization=2; codeQuality=4; testing=2; deployment=2; obsolescence=3; aiAdoption=1}
  "claims-ui"          = @{industrialization=3; codeQuality=5; testing=3; deployment=4; obsolescence=3; aiAdoption=2}
  "tracker-service"    = @{industrialization=7; codeQuality=7; testing=7; deployment=8; obsolescence=8; aiAdoption=6}
  "tracker-mobile"     = @{industrialization=6; codeQuality=7; testing=6; deployment=7; obsolescence=7; aiAdoption=5}
  "optimizer-engine"   = @{industrialization=5; codeQuality=6; testing=4; deployment=5; obsolescence=7; aiAdoption=4}
  "optimizer-api"      = @{industrialization=6; codeQuality=6; testing=5; deployment=5; obsolescence=6; aiAdoption=3}
  "scada-collector"    = @{industrialization=8; codeQuality=8; testing=8; deployment=9; obsolescence=9; aiAdoption=7}
  "scada-dashboard"    = @{industrialization=7; codeQuality=8; testing=7; deployment=8; obsolescence=8; aiAdoption=6}
  "energy-portal-api"  = @{industrialization=7; codeQuality=7; testing=6; deployment=7; obsolescence=7; aiAdoption=5}
  "energy-portal-ui"   = @{industrialization=4; codeQuality=5; testing=3; deployment=3; obsolescence=8; aiAdoption=3}
  "ecommerce-api"      = @{industrialization=8; codeQuality=8; testing=8; deployment=8; obsolescence=8; aiAdoption=7}
  "ecommerce-frontend" = @{industrialization=7; codeQuality=7; testing=7; deployment=7; obsolescence=7; aiAdoption=6}
  "ecommerce-backoffice" = @{industrialization=3; codeQuality=4; testing=2; deployment=3; obsolescence=8; aiAdoption=2}
}

foreach($entry in $kpis.GetEnumerator()) {
  $appId = $appIds[$entry.Key]
  if(-not $appId) { Write-Host "  KPI SKIP: $($entry.Key) - no app ID" -ForegroundColor Yellow; continue }
  $json = $entry.Value | ConvertTo-Json
  try {
    Invoke-RestMethod -Uri "$baseUrl/applications/$appId/kpis" -Method PUT -Headers $h -Body $json | Out-Null
    Write-Host "  KPI OK: $($entry.Key)"
  } catch {
    Write-Host "  KPI FAIL: $($entry.Key) - $($_.Exception.Message)" -ForegroundColor Red
  }
}

# --- Auto-Compute Risks ---
Write-Host "`n=== COMPUTING AUTO-RISKS ===" -ForegroundColor Cyan
foreach($entry in $appIds.GetEnumerator()) {
  try {
    Invoke-RestMethod -Uri "$baseUrl/applications/$($entry.Value)/risks/compute" -Method POST -Headers $h | Out-Null
    Write-Host "  RISK COMPUTE OK: $($entry.Key)"
  } catch {
    Write-Host "  RISK COMPUTE FAIL: $($entry.Key) - $($_.Exception.Message)" -ForegroundColor Red
  }
}

# --- Manual Risks ---
Write-Host "`n=== CREATING MANUAL RISKS ===" -ForegroundColor Cyan
$manualRisks = @(
  @{app="claims-api"; body='{"type":"SECURITY","severity":"CRITICAL","description":"Java 8 EOL - aucun patch de securite disponible. Stack Spring 4 obsolete.","actionPlan":"Migration vers Java 21 + Spring Boot 3 planifiee Q3 2026"}'},
  @{app="claims-ui"; body='{"type":"SECURITY","severity":"HIGH","description":"Angular 8 EOL - vulnerabilites XSS connues non corrigees","actionPlan":"Migration Angular 17 couplee au projet claims-api"}'},
  @{app="optimizer-api"; body='{"type":"OPERATIONAL","severity":"MEDIUM","description":"Pipeline CI/CD instable - echecs intermittents sur le stage deploy","actionPlan":"Upgrade plugins Jenkins et evaluation migration GitLab CI"}'},
  @{app="risk-dashboard"; body='{"type":"QUALITY","severity":"LOW","description":"Couverture de tests unitaires inferieure a 40%","actionPlan":"Sprint dedie amelioration testing prevu Q3 2026"}'},
  @{app="energy-portal-ui"; body='{"type":"AVAILABILITY","severity":"MEDIUM","description":"Pas de strategie de rollback automatique pour les deploiements","actionPlan":"Implementer blue-green deployment avant mise en production"}'},
  @{app="ecommerce-backoffice"; body='{"type":"QUALITY","severity":"HIGH","description":"Aucun test automatise - validation 100% manuelle","actionPlan":"Mise en place framework Cypress + couverture tests critiques avant go-live"}'}
)

foreach($risk in $manualRisks) {
  $appId = $appIds[$risk.app]
  if(-not $appId) { Write-Host "  RISK SKIP: $($risk.app)" -ForegroundColor Yellow; continue }
  try {
    Invoke-RestMethod -Uri "$baseUrl/applications/$appId/risks" -Method POST -Headers $h -Body $risk.body | Out-Null
    Write-Host "  RISK OK: $($risk.app) - $(($risk.body | ConvertFrom-Json).type)"
  } catch {
    Write-Host "  RISK FAIL: $($risk.app) - $($_.Exception.Message)" -ForegroundColor Red
  }
}

# --- AI Success Cases ---
Write-Host "`n=== CREATING AI SUCCESS CASES ===" -ForegroundColor Cyan
$aiCases = @(
  @{app="trading-api"; body='{"title":"Refactoring automatise du module ordres","tool":"GitHub Copilot","profile":"DEV","description":"Refactoring complet du module orders processing avec assistance Copilot. Code legacy Java 11 migre vers Java 21 avec records et pattern matching.","estimatedImpact":"3 jours economises sur refactoring de 2000 lignes de code legacy","caseDate":"2026-04-15"}'},
  @{app="trading-api"; body='{"title":"Generation de tests de non-regression","tool":"GitHub Copilot","profile":"DEV","description":"Generation automatique de tests unitaires pour 45 classes du domaine trading couvrant les cas limites.","estimatedImpact":"+35% couverture de tests en 1 sprint - de 62% a 97%","caseDate":"2026-05-01"}'},
  @{app="portal-backend"; body='{"title":"Generation tests unitaires Service layer","tool":"GitHub Copilot","profile":"DEV","description":"Generation automatique de tests pour toute la couche service avec mocks Mockito.","estimatedImpact":"+40% couverture de tests en 2 sprints","caseDate":"2026-03-20"}'},
  @{app="portal-frontend"; body='{"title":"Migration Angular 14 vers 17 assistee par IA","tool":"Claude","profile":"DEV","description":"Utilisation de Claude pour analyser les breaking changes et generer les migrations de 120 composants.","estimatedImpact":"Migration realisee en 3 semaines au lieu de 6 estimees","caseDate":"2026-02-10"}'},
  @{app="scada-collector"; body='{"title":"Documentation API automatique OpenAPI","tool":"ChatGPT","profile":"DEV","description":"Generation complete de la documentation Swagger/OpenAPI a partir du code source Java.","estimatedImpact":"Documentation Swagger generee en 1 jour vs 1 semaine manuelle","caseDate":"2026-04-22"}'},
  @{app="tracker-service"; body='{"title":"Analyse de logs incidents par IA","tool":"Claude","profile":"OPS","description":"Utilisation de Claude pour analyser les patterns erreurs dans 3 mois de logs applicatifs.","estimatedImpact":"Reduction MTTR de 45 min a 12 min grace a la detection de patterns","caseDate":"2026-05-10"}'},
  @{app="optimizer-engine"; body='{"title":"Optimisation algorithme de routing","tool":"ChatGPT","profile":"DATA_SCIENTIST","description":"Assistance IA pour optimiser algorithme de calcul itineraires avec approche graph neural network.","estimatedImpact":"Amelioration de 15% du temps de calcul - gain 200ms par requete","caseDate":"2026-03-05"}'},
  @{app="ecommerce-api"; body='{"title":"Generation code boilerplate Spring Boot","tool":"GitHub Copilot","profile":"DEV","description":"Scaffolding complet des controllers, services et repositories pour 12 entites du domaine e-commerce.","estimatedImpact":"2 jours de developpement economises sur le setup initial","caseDate":"2026-04-01"}'},
  @{app="ecommerce-frontend"; body='{"title":"Accessibilite WCAG assistee par IA","tool":"Claude","profile":"DEV","description":"Audit et correction automatisee des problemes accessibilite sur 80 composants Angular.","estimatedImpact":"Conformite WCAG 2.1 AA atteinte en 1 sprint vs 3 estimes","caseDate":"2026-05-15"}'},
  @{app="scada-dashboard"; body='{"title":"Optimisation requetes SQL complexes","tool":"ChatGPT","profile":"DEV","description":"Rewrite de 15 requetes SQL agregation IoT avec indices et materialized views.","estimatedImpact":"Temps de reponse dashboard reduit de 8s a 400ms","caseDate":"2026-05-20"}'}
)

foreach($ai in $aiCases) {
  $appId = $appIds[$ai.app]
  if(-not $appId) { Write-Host "  AI SKIP: $($ai.app)" -ForegroundColor Yellow; continue }
  try {
    Invoke-RestMethod -Uri "$baseUrl/applications/$appId/ai-success-cases" -Method POST -Headers $h -Body $ai.body | Out-Null
    Write-Host "  AI OK: $($ai.app) - $(($ai.body | ConvertFrom-Json).title)"
  } catch {
    Write-Host "  AI FAIL: $($ai.app) - $($_.Exception.Message)" -ForegroundColor Red
  }
}

# =============================================================================
# VERIFICATION
# =============================================================================
Write-Host "`n=== VERIFICATION - DASHBOARD ===" -ForegroundColor Green
$dash = Invoke-RestMethod -Uri "$baseUrl/dashboard/global" -Headers $h
Write-Host "  Total Clients:       $($dash.totalClients)"
Write-Host "  Total Projects:      $($dash.totalProjects)"
Write-Host "  Total Applications:  $($dash.totalApplications)"
Write-Host "  Overall Average:     $($dash.overallAverage)"
Write-Host "  Overall Status:      $($dash.overallStatus)"
Write-Host "  Doc Up-to-Date:      $($dash.docUpToDateRatio)"
Write-Host "  Critical CVEs:       $($dash.totalCriticalCves)"

Write-Host "`n=== DATASET INJECTION COMPLETE ===" -ForegroundColor Green
Write-Host "Summary:"
Write-Host "  - $($userIds.Count) users created"
Write-Host "  - $($clientIds.Count) clients created"
Write-Host "  - $($projectIds.Count) projects created"
Write-Host "  - $($assignments.Count) assignments created"
Write-Host "  - $($appIds.Count) applications created"
Write-Host "  - $($kpis.Count) KPI sets configured"
Write-Host "  - $($manualRisks.Count) manual risks added"
Write-Host "  - $($aiCases.Count) AI success cases added"
