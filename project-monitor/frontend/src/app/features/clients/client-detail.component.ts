import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProjectService, NotificationService, DashboardService } from '../../core/services';
import { ProjectDTO, ClientKpiSummaryDTO } from '../../core/models';
import { ProjectDialogComponent } from '../projects/project-dialog.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { TrafficLightComponent } from '../../shared/components/traffic-light.component';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule, MatDialogModule, MatCardModule, TranslateModule, TrafficLightComponent],
  template: `
    <div class="page-container">
      <button mat-button (click)="goBack()">
        <mat-icon>arrow_back</mat-icon> {{ 'clients.detail.backToClients' | translate }}
      </button>

      <div class="panel-header">
        <h2>{{ 'clients.detail.projectsTitle' | translate }}</h2>
        <button mat-raised-button color="primary" (click)="openAddDialog()">
          <mat-icon>add</mat-icon> {{ 'clients.detail.addProject' | translate }}
        </button>
      </div>

      <table mat-table [dataSource]="projects()">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>{{ 'clients.table.columnName' | translate }}</th>
          <td mat-cell *matCellDef="let project">{{ project.name }}</td>
        </ng-container>
        <ng-container matColumnDef="description">
          <th mat-header-cell *matHeaderCellDef>{{ 'clients.table.columnDescription' | translate }}</th>
          <td mat-cell *matCellDef="let project">{{ project.description }}</td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>{{ 'clients.table.columnActions' | translate }}</th>
          <td mat-cell *matCellDef="let project">
            <div class="action-buttons">
              <button mat-icon-button color="primary" (click)="openEditDialog(project); $event.stopPropagation()">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="confirmDelete(project); $event.stopPropagation()">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;" (click)="goToProject(row)" class="clickable-row"></tr>
      </table>

      <mat-paginator
        [length]="totalElements()"
        [pageSize]="pageSize()"
        [pageSizeOptions]="[10, 20, 50]"
        (page)="onPageChange($event)"
        showFirstLastButtons>
      </mat-paginator>

      <!-- Client KPI Summary Section -->
      @if (clientKpiSummary()) {
      <mat-card class="kpi-section">
        <mat-card-header>
          <mat-card-title>
            {{ 'dashboard.clientKpis' | translate }}
            <app-traffic-light [status]="clientKpiSummary()!.overallStatus" />
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p class="overall-average">{{ 'dashboard.overallAverage' | translate }}: {{ clientKpiSummary()!.overallAverage ?? '-' }}</p>
          <table mat-table [dataSource]="clientKpiSummary()!.projectSummaries" class="kpi-table">
            <ng-container matColumnDef="projectName">
              <th mat-header-cell *matHeaderCellDef>{{ 'dashboard.columns.name' | translate }}</th>
              <td mat-cell *matCellDef="let proj">{{ proj.projectName }}</td>
            </ng-container>
            <ng-container matColumnDef="average">
              <th mat-header-cell *matHeaderCellDef>{{ 'dashboard.columns.average' | translate }}</th>
              <td mat-cell *matCellDef="let proj">{{ proj.overallAverage ?? '-' }}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>{{ 'dashboard.columns.status' | translate }}</th>
              <td mat-cell *matCellDef="let proj">
                @if (proj.overallStatus) {
                  <app-traffic-light [status]="proj.overallStatus" />
                }
              </td>
            </ng-container>
            <ng-container matColumnDef="applications">
              <th mat-header-cell *matHeaderCellDef>{{ 'dashboard.columns.applications' | translate }}</th>
              <td mat-cell *matCellDef="let proj">{{ proj.applicationCount }}</td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="clientKpiColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: clientKpiColumns;"></tr>
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
    .kpi-table { width: 100%; margin-top: 16px; }
    .overall-average { font-size: 16px; font-weight: 500; margin: 16px 0; }
    .no-kpi-data { text-align: center; color: rgba(0,0,0,0.54); font-style: italic; margin-top: 24px; }
  `]
})
export class ClientDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private projectService = inject(ProjectService);
  private notificationService = inject(NotificationService);
  private translateService = inject(TranslateService);
  private dialog = inject(MatDialog);
  private dashboardService = inject(DashboardService);

  clientId = 0;
  projects = signal<ProjectDTO[]>([]);
  totalElements = signal(0);
  pageSize = signal(20);
  currentPage = signal(0);
  displayedColumns = ['name', 'description', 'actions'];
  clientKpiSummary = signal<ClientKpiSummaryDTO | null>(null);
  clientKpiColumns = ['projectName', 'average', 'status', 'applications'];

  ngOnInit(): void {
    this.clientId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProjects();
    this.loadClientKpiSummary();
  }

  loadClientKpiSummary(): void {
    this.dashboardService.getClientSummary(this.clientId).subscribe({
      next: (summary) => this.clientKpiSummary.set(summary),
      error: () => this.clientKpiSummary.set(null)
    });
  }

  loadProjects(): void {
    this.projectService.getProjectsByClient(this.clientId, { page: this.currentPage(), size: this.pageSize() }).subscribe({
      next: (page) => { this.projects.set(page.content); this.totalElements.set(page.totalElements); },
      error: () => this.notificationService.error(this.translateService.instant('clients.detail.errors.loadProjects'))
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadProjects();
  }

  goBack(): void {
    this.router.navigate(['/clients']);
  }

  goToProject(project: ProjectDTO): void {
    this.router.navigate(['/projects', project.id]);
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(ProjectDialogComponent, {
      width: '500px',
      data: { clientId: this.clientId }
    });
    dialogRef.afterClosed().subscribe((result) => { if (result) this.loadProjects(); });
  }

  openEditDialog(project: ProjectDTO): void {
    const dialogRef = this.dialog.open(ProjectDialogComponent, {
      width: '500px',
      data: { project, clientId: this.clientId }
    });
    dialogRef.afterClosed().subscribe((result) => { if (result) this.loadProjects(); });
  }

  confirmDelete(project: ProjectDTO): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translateService.instant('projects.confirm.deleteTitle'),
        message: this.translateService.instant('projects.confirm.deleteMessage', { name: project.name })
      }
    });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.projectService.deleteProject(project.id).subscribe({
          next: () => { this.notificationService.success(this.translateService.instant('projects.notifications.deleted')); this.loadProjects(); },
          error: () => this.notificationService.error(this.translateService.instant('projects.errors.delete'))
        });
      }
    });
  }
}
