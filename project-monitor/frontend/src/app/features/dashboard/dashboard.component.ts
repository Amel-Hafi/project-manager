import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardService } from '../../core/services';
import { GlobalDashboardDTO, ReferentWorkloadDTO } from '../../core/models';
import { TrafficLightComponent } from '../../shared/components/traffic-light.component';
import { KpiRadarComponent } from '../applications/kpi-radar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatTableModule, MatCardModule, MatIconModule, MatProgressBarModule, DecimalPipe, TranslateModule, TrafficLightComponent, KpiRadarComponent],
  template: `
    <div class="page-container">
      <h1>{{ 'dashboard.title' | translate }}</h1>

      @if (dashboardData()) {
        <div class="stats-cards">
          <mat-card>
            <mat-card-content>
              <div class="stat-value">{{ dashboardData()!.totalClients }}</div>
              <div class="stat-label">{{ 'dashboard.totalClients' | translate }}</div>
            </mat-card-content>
          </mat-card>
          <mat-card>
            <mat-card-content>
              <div class="stat-value">{{ dashboardData()!.totalProjects }}</div>
              <div class="stat-label">{{ 'dashboard.totalProjects' | translate }}</div>
            </mat-card-content>
          </mat-card>
          <mat-card>
            <mat-card-content>
              <div class="stat-value">{{ dashboardData()!.totalApplications }}</div>
              <div class="stat-label">{{ 'dashboard.totalApplications' | translate }}</div>
            </mat-card-content>
          </mat-card>
          <mat-card>
            <mat-card-content>
              <div class="stat-value">
                {{ dashboardData()!.overallAverage ?? '-' }}
                <app-traffic-light [status]="dashboardData()!.overallStatus" />
              </div>
              <div class="stat-label">{{ 'dashboard.overallAverage' | translate }}</div>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="extra-stats-cards">
          <mat-card>
            <mat-card-content>
              <div class="stat-label">{{ 'dashboardExtra.docRatio' | translate }}</div>
              <div class="stat-value">{{ dashboardData()!.docUpToDateRatio !== null ? (dashboardData()!.docUpToDateRatio! | number:'1.0-0') + '%' : '-' }}</div>
              @if (dashboardData()!.docUpToDateRatio !== null) {
                <mat-progress-bar mode="determinate" [value]="dashboardData()!.docUpToDateRatio!"></mat-progress-bar>
              }
            </mat-card-content>
          </mat-card>
          <mat-card>
            <mat-card-content>
              <div class="stat-label">{{ 'dashboardExtra.totalCves' | translate }}</div>
              <div class="stat-value cve-badge">{{ dashboardData()!.totalCriticalCves ?? '-' }}</div>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="radar-section">
          <app-kpi-radar [kpi]="radarData()" />
        </div>

        <h2>{{ 'dashboard.globalStats' | translate }}</h2>
        <table mat-table [dataSource]="dashboardData()!.clientSummaries" class="clients-table">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>{{ 'dashboard.columns.name' | translate }}</th>
            <td mat-cell *matCellDef="let client">{{ client.clientName }}</td>
          </ng-container>
          <ng-container matColumnDef="average">
            <th mat-header-cell *matHeaderCellDef>{{ 'dashboard.columns.average' | translate }}</th>
            <td mat-cell *matCellDef="let client">{{ client.overallAverage ?? '-' }}</td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>{{ 'dashboard.columns.status' | translate }}</th>
            <td mat-cell *matCellDef="let client">
              <app-traffic-light [status]="client.overallStatus" />
            </td>
          </ng-container>
          <ng-container matColumnDef="projects">
            <th mat-header-cell *matHeaderCellDef>{{ 'dashboard.columns.projects' | translate }}</th>
            <td mat-cell *matCellDef="let client">{{ client.projectCount }}</td>
          </ng-container>
          <ng-container matColumnDef="applications">
            <th mat-header-cell *matHeaderCellDef>{{ 'dashboard.columns.applications' | translate }}</th>
            <td mat-cell *matCellDef="let client">{{ client.applicationCount }}</td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" (click)="goToClient(row)" class="clickable-row"></tr>
        </table>

        <h2>{{ 'referentWorkload.title' | translate }}</h2>
        @if (referentWorkload().length > 0) {
          <table mat-table [dataSource]="referentWorkload()" class="workload-table">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>{{ 'referentWorkload.columns.name' | translate }}</th>
              <td mat-cell *matCellDef="let ref">{{ ref.fullName }}</td>
            </ng-container>
            <ng-container matColumnDef="projects">
              <th mat-header-cell *matHeaderCellDef>{{ 'referentWorkload.columns.projects' | translate }}</th>
              <td mat-cell *matCellDef="let ref">{{ ref.projectCount }}</td>
            </ng-container>
            <ng-container matColumnDef="applications">
              <th mat-header-cell *matHeaderCellDef>{{ 'referentWorkload.columns.applications' | translate }}</th>
              <td mat-cell *matCellDef="let ref">{{ ref.applicationCount }}</td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="workloadColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: workloadColumns;"></tr>
          </table>
        } @else {
          <p class="no-data">{{ 'referentWorkload.noData' | translate }}</p>
        }
      } @else {
        <p class="no-data">{{ 'dashboard.noKpis' | translate }}</p>
      }
    </div>
  `,
  styles: [`
    .stats-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .stat-value { font-size: 28px; font-weight: bold; text-align: center; display: flex; align-items: center; justify-content: center; gap: 8px; }
    .stat-label { text-align: center; color: rgba(0,0,0,0.54); margin-top: 4px; }
    .radar-section { max-width: 450px; margin: 24px auto; }
    .clients-table { width: 100%; }
    .clickable-row { cursor: pointer; }
    .clickable-row:hover { background-color: rgba(0, 0, 0, 0.04); }
    .no-data { text-align: center; color: rgba(0,0,0,0.54); font-style: italic; }
    .page-container { padding: 24px; }
    .extra-stats-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .cve-badge { color: #f44336; }
    .workload-table { width: 100%; margin-bottom: 24px; }
  `]
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private router = inject(Router);

  dashboardData = signal<GlobalDashboardDTO | null>(null);
  referentWorkload = signal<ReferentWorkloadDTO[]>([]);
  displayedColumns = ['name', 'average', 'status', 'projects', 'applications'];
  workloadColumns = ['name', 'projects', 'applications'];

  ngOnInit(): void {
    this.dashboardService.getGlobalDashboard().subscribe({
      next: (data) => this.dashboardData.set(data),
      error: () => this.dashboardData.set(null)
    });
    this.dashboardService.getReferentWorkload().subscribe({
      next: (data) => this.referentWorkload.set(data),
      error: () => this.referentWorkload.set([])
    });
  }

  radarData() {
    const d = this.dashboardData();
    if (!d) return null;
    return {
      id: null, applicationId: 0, applicationName: 'Global', updatedAt: null,
      industrialization: d.averageIndustrialization,
      codeQuality: d.averageCodeQuality,
      testing: d.averageTesting,
      deployment: d.averageDeployment,
      obsolescence: d.averageObsolescence,
      aiAdoption: d.averageAiAdoption,
      justificationIndustrialization: null,
      justificationCodeQuality: null,
      justificationTesting: null,
      justificationDeployment: null,
      justificationObsolescence: null,
      justificationAiAdoption: null,
      evaluatedAt: null
    };
  }

  goToClient(client: { clientId: number }): void {
    this.router.navigate(['/clients', client.clientId]);
  }
}
