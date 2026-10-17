import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ApplicationService, TechnologyService, NotificationService, MaturityKpiService, AuthService } from '../../core/services';
import { ApplicationDTO, TechnologyCategoryDTO, TechnologyItemDTO, MaturityKpiDTO } from '../../core/models';
import { TechnologySelectDialogComponent } from './technology-select-dialog.component';
import { ApplicationDialogComponent } from './application-dialog.component';
import { KpiRadarComponent } from './kpi-radar.component';
import { AiSuccessCasesListComponent } from './ai-success-cases-list.component';
import { KpiEditDialogComponent } from './kpi-edit-dialog.component';
import { KpiHistoryComponent } from './kpi-history.component';
import { RiskListComponent } from './risk-list.component';
import { OperationalKpisCardComponent } from './operational-kpis-card.component';

@Component({
  selector: 'app-application-detail',
  standalone: true,
  imports: [MatCardModule, MatChipsModule, MatButtonModule, MatIconModule, MatDialogModule, MatListModule, TranslateModule, KpiRadarComponent, AiSuccessCasesListComponent, RiskListComponent, OperationalKpisCardComponent, KpiHistoryComponent],
  template: `
    <div class="page-container">
      <button mat-button (click)="goBack()">
        <mat-icon>arrow_back</mat-icon> {{ 'applications.detail.back' | translate }}
      </button>

      @if (application()) {
        <mat-card class="detail-card">
          <mat-card-header>
            <mat-card-title>{{ application()!.name }}</mat-card-title>
            <mat-card-subtitle>{{ application()!.projectName }} — {{ application()!.status }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="detail-grid">
              <div class="detail-item">
                <strong>{{ 'applications.detail.description' | translate }}:</strong>
                <p>{{ application()!.description || ('applications.detail.none' | translate) }}</p>
              </div>
              <div class="detail-item">
                <strong>{{ 'applications.detail.startDate' | translate }}:</strong>
                <p>{{ application()!.startDate || ('applications.detail.none' | translate) }}</p>
              </div>
              <div class="detail-item">
                <strong>{{ 'applications.detail.repositories' | translate }}:</strong>
                @if (application()!.repositoryUrls.length > 0) {
                  <mat-list>
                    @for (url of application()!.repositoryUrls; track url) {
                      <mat-list-item>{{ url }}</mat-list-item>
                    }
                  </mat-list>
                } @else {
                  <p>{{ 'applications.detail.none' | translate }}</p>
                }
              </div>
            </div>
          </mat-card-content>
          <mat-card-actions>
            @if (hasWriteAccess()) {
              <button mat-button color="primary" (click)="openEditDialog()">
                <mat-icon>edit</mat-icon> {{ 'applications.detail.edit' | translate }}
              </button>
            }
          </mat-card-actions>
        </mat-card>

        <mat-card class="tech-card">
          <mat-card-header>
            <mat-card-title>{{ 'applications.detail.techTitle' | translate }}</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <mat-chip-set>
              @for (tech of application()!.technologies; track tech.id) {
                <mat-chip>{{ tech.name }} {{ tech.version ? '(' + tech.version + ')' : '' }}</mat-chip>
              }
            </mat-chip-set>
            @if (application()!.technologies.length === 0) {
              <p>{{ 'applications.detail.noTech' | translate }}</p>
            }
          </mat-card-content>
          <mat-card-actions>
            @if (hasWriteAccess()) {
              <button mat-raised-button color="primary" (click)="openTechSelectDialog()">
                <mat-icon>settings</mat-icon> {{ 'applications.detail.manageTech' | translate }}
              </button>
            }
          </mat-card-actions>
        </mat-card>

        <app-operational-kpis-card
            [application]="application()"
            [canEdit]="hasWriteAccess()"
            (updated)="loadApplication()" />

        <mat-card class="kpi-card">
          <mat-card-header>
            <mat-card-title>{{ 'kpis.title' | translate }}</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <app-kpi-radar [kpi]="kpiData()" />
          </mat-card-content>
          <mat-card-actions>
            @if (hasWriteAccess()) {
              <button mat-raised-button color="primary" (click)="openKpiEditDialog()">
                <mat-icon>edit</mat-icon> {{ 'kpis.edit' | translate }}
              </button>
            }
          </mat-card-actions>
        </mat-card>

        <app-kpi-history [kpi]="kpiData()" />

        <mat-card class="ai-cases-card">
          <mat-card-header>
            <mat-card-title>{{ 'risks.title' | translate }}</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <app-risk-list [applicationId]="appId" />
          </mat-card-content>
        </mat-card>

        <mat-card class="ai-cases-card">
          <mat-card-header>
            <mat-card-title>{{ 'aiCases.title' | translate }}</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <app-ai-success-cases-list [applicationId]="appId" />
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .detail-card, .tech-card, .kpi-card, .ai-cases-card { margin-bottom: 24px; }
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px; }
    .detail-item strong { display: block; margin-bottom: 4px; color: rgba(0,0,0,0.6); }
  `]
})
export class ApplicationDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private applicationService = inject(ApplicationService);
  private technologyService = inject(TechnologyService);
  private notificationService = inject(NotificationService);
  private translateService = inject(TranslateService);
  private dialog = inject(MatDialog);
  private kpiService = inject(MaturityKpiService);
  private authService = inject(AuthService);

  application = signal<ApplicationDTO | null>(null);
  categories = signal<TechnologyCategoryDTO[]>([]);
  kpiData = signal<MaturityKpiDTO | null>(null);
  appId = 0;

  ngOnInit(): void {
    this.appId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadApplication();
    this.loadKpis();
    this.technologyService.getCategories().subscribe({
      next: (cats) => this.categories.set(cats)
    });
  }

  loadKpis(): void {
    this.kpiService.getByApplication(this.appId).subscribe({
      next: (kpi) => this.kpiData.set(kpi),
      error: () => this.kpiData.set(null)
    });
  }

  loadApplication(): void {
    this.applicationService.getById(this.appId).subscribe({
      next: (app) => this.application.set(app),
      error: () => this.notificationService.error(this.translateService.instant('applications.errors.loadFailed'))
    });
  }

  goBack(): void {
    this.router.navigate(['/applications']);
  }

  openEditDialog(): void {
    const app = this.application();
    if (!app) return;
    const dialogRef = this.dialog.open(ApplicationDialogComponent, {
      width: '600px',
      data: { application: app }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadApplication();
    });
  }

  openTechSelectDialog(): void {
    const app = this.application();
    if (!app) return;
    const dialogRef = this.dialog.open(TechnologySelectDialogComponent, {
      width: '700px',
      data: { applicationId: app.id, currentTechIds: app.technologies.map(t => t.id), categories: this.categories() }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadApplication();
    });
  }

  hasWriteAccess(): boolean {
    return this.authService.hasAnyRole(['ADMIN', 'MANAGER', 'DT_REFERENT']);
  }

  openKpiEditDialog(): void {
    const dialogRef = this.dialog.open(KpiEditDialogComponent, {
      width: '500px',
      data: { applicationId: this.appId, kpi: this.kpiData() }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadKpis();
    });
  }
}
