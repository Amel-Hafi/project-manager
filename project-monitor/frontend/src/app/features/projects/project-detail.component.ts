import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ApplicationService, NotificationService, MaturityKpiService } from '../../core/services';
import { ApplicationDTO, ProjectKpiSummaryDTO } from '../../core/models';
import { ApplicationDialogComponent } from '../applications/application-dialog.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { TrafficLightComponent } from '../../shared/components/traffic-light.component';
import { KpiRadarComponent } from '../applications/kpi-radar.component';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule, MatDialogModule, MatCardModule, TranslateModule, TrafficLightComponent, KpiRadarComponent],
  template: `
    <div class="page-container">
      <button mat-button (click)="goBack()">
        <mat-icon>arrow_back</mat-icon> {{ 'projects.detail.backToProjects' | translate }}
      </button>

      <div class="panel-header">
        <h2>{{ 'projects.detail.applicationsTitle' | translate }}</h2>
        <button mat-raised-button color="primary" (click)="openAddDialog()">
          <mat-icon>add</mat-icon> {{ 'projects.detail.addApplication' | translate }}
        </button>
      </div>

      <table mat-table [dataSource]="applications()">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>{{ 'projects.table.columnName' | translate }}</th>
          <td mat-cell *matCellDef="let app">{{ app.name }}</td>
        </ng-container>
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>{{ 'projects.table.columnActions' | translate }}</th>
          <td mat-cell *matCellDef="let app">{{ app.status }}</td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>{{ 'common.actions' | translate }}</th>
          <td mat-cell *matCellDef="let app">
            <div class="action-buttons">
              <button mat-icon-button color="primary" (click)="goToApp(app); $event.stopPropagation()">
                <mat-icon>visibility</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="confirmDelete(app); $event.stopPropagation()">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;" (click)="goToApp(row)" class="clickable-row"></tr>
      </table>

      <mat-paginator
        [length]="totalElements()"
        [pageSize]="pageSize()"
        [pageSizeOptions]="[10, 20, 50]"
        (page)="onPageChange($event)"
        showFirstLastButtons>
      </mat-paginator>

      <!-- KPI Summary Section -->
      @if (kpiSummary()) {
      <mat-card class="kpi-section">
        <mat-card-header>
          <mat-card-title>
            {{ 'dashboard.projectKpis' | translate }}
            <app-traffic-light [status]="kpiSummary()!.overallStatus" />
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="kpi-radar-container">
            <app-kpi-radar [kpi]="kpiAsRadarData()" />
          </div>
          <table mat-table [dataSource]="kpiSummary()!.applicationKpis" class="kpi-table">
            <ng-container matColumnDef="appName">
              <th mat-header-cell *matHeaderCellDef>{{ 'dashboard.columns.name' | translate }}</th>
              <td mat-cell *matCellDef="let kpi">{{ kpi.applicationName }}</td>
            </ng-container>
            <ng-container matColumnDef="industrialization">
              <th mat-header-cell *matHeaderCellDef>{{ 'kpis.industrialization' | translate }}</th>
              <td mat-cell *matCellDef="let kpi">{{ kpi.industrialization ?? '-' }}</td>
            </ng-container>
            <ng-container matColumnDef="codeQuality">
              <th mat-header-cell *matHeaderCellDef>{{ 'kpis.codeQuality' | translate }}</th>
              <td mat-cell *matCellDef="let kpi">{{ kpi.codeQuality ?? '-' }}</td>
            </ng-container>
            <ng-container matColumnDef="testing">
              <th mat-header-cell *matHeaderCellDef>{{ 'kpis.testing' | translate }}</th>
              <td mat-cell *matCellDef="let kpi">{{ kpi.testing ?? '-' }}</td>
            </ng-container>
            <ng-container matColumnDef="deployment">
              <th mat-header-cell *matHeaderCellDef>{{ 'kpis.deployment' | translate }}</th>
              <td mat-cell *matCellDef="let kpi">{{ kpi.deployment ?? '-' }}</td>
            </ng-container>
            <ng-container matColumnDef="obsolescence">
              <th mat-header-cell *matHeaderCellDef>{{ 'kpis.obsolescence' | translate }}</th>
              <td mat-cell *matCellDef="let kpi">{{ kpi.obsolescence ?? '-' }}</td>
            </ng-container>
            <ng-container matColumnDef="aiAdoption">
              <th mat-header-cell *matHeaderCellDef>{{ 'kpis.aiAdoption' | translate }}</th>
              <td mat-cell *matCellDef="let kpi">{{ kpi.aiAdoption ?? '-' }}</td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="kpiColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: kpiColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
      } @else {
        <p class="no-kpi-data">{{ 'dashboard.noKpis' | translate }}</p>
      }
    </div>
  `,
  styles: [`
    .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .clickable-row { cursor: pointer; }
    .clickable-row:hover { background-color: rgba(0, 0, 0, 0.04); }
    .kpi-section { margin-top: 24px; }
    .kpi-radar-container { max-width: 400px; margin: 16px auto; }
    .kpi-table { width: 100%; margin-top: 16px; }
    .no-kpi-data { text-align: center; color: rgba(0,0,0,0.54); font-style: italic; margin-top: 24px; }
  `]
})
export class ProjectDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private applicationService = inject(ApplicationService);
  private notificationService = inject(NotificationService);
  private translateService = inject(TranslateService);
  private dialog = inject(MatDialog);
  private maturityKpiService = inject(MaturityKpiService);

  projectId = 0;
  applications = signal<ApplicationDTO[]>([]);
  totalElements = signal(0);
  pageSize = signal(20);
  currentPage = signal(0);
  displayedColumns = ['name', 'status', 'actions'];
  kpiSummary = signal<ProjectKpiSummaryDTO | null>(null);
  kpiColumns = ['appName', 'industrialization', 'codeQuality', 'testing', 'deployment', 'obsolescence', 'aiAdoption'];

  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadApplications();
    this.loadKpiSummary();
  }

  kpiAsRadarData() {
    const s = this.kpiSummary();
    if (!s) return null;
    return {
      id: null, applicationId: 0, applicationName: s.projectName, updatedAt: null,
      industrialization: s.averageIndustrialization,
      codeQuality: s.averageCodeQuality,
      testing: s.averageTesting,
      deployment: s.averageDeployment,
      obsolescence: s.averageObsolescence,
      aiAdoption: s.averageAiAdoption,
      justificationIndustrialization: null,
      justificationCodeQuality: null,
      justificationTesting: null,
      justificationDeployment: null,
      justificationObsolescence: null,
      justificationAiAdoption: null,
      evaluatedAt: null
    };
  }

  loadKpiSummary(): void {
    this.maturityKpiService.getProjectSummary(this.projectId).subscribe({
      next: (summary) => this.kpiSummary.set(summary),
      error: () => this.kpiSummary.set(null)
    });
  }

  loadApplications(): void {
    this.applicationService.getApplicationsByProject(this.projectId, { page: this.currentPage(), size: this.pageSize() }).subscribe({
      next: (page) => { this.applications.set(page.content); this.totalElements.set(page.totalElements); },
      error: () => this.notificationService.error(this.translateService.instant('projects.detail.errors.loadApplications'))
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadApplications();
  }

  goBack(): void {
    this.router.navigate(['/projects']);
  }

  goToApp(app: ApplicationDTO): void {
    this.router.navigate(['/applications', app.id]);
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(ApplicationDialogComponent, {
      width: '600px',
      data: { projectId: this.projectId }
    });
    dialogRef.afterClosed().subscribe((result) => { if (result) this.loadApplications(); });
  }

  confirmDelete(app: ApplicationDTO): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translateService.instant('applications.confirm.deleteTitle'),
        message: this.translateService.instant('applications.confirm.deleteMessage', { name: app.name })
      }
    });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.applicationService.deleteApplication(app.id).subscribe({
          next: () => { this.notificationService.success(this.translateService.instant('applications.notifications.deleted')); this.loadApplications(); },
          error: () => this.notificationService.error(this.translateService.instant('applications.errors.delete'))
        });
      }
    });
  }
}
