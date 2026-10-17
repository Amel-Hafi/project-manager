import { Component, inject, signal, input, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RiskService, AuthService, NotificationService } from '../../core/services';
import { RiskDTO } from '../../core/models';
import { RiskDialogComponent } from './risk-dialog.component';

@Component({
    selector: 'app-risk-list',
    standalone: true,
    imports: [MatTableModule, MatButtonModule, MatIconModule, MatChipsModule, MatDialogModule, TranslateModule],
    template: `
    <div class="risk-list-container">
      <div class="header-row">
        <button mat-raised-button (click)="computeRisks()">
          <mat-icon>autorenew</mat-icon> {{ 'risks.computeRisks' | translate }}
        </button>
        @if (hasWriteAccess()) {
          <button mat-raised-button color="primary" (click)="openCreateDialog()">
            <mat-icon>add</mat-icon> {{ 'risks.addRisk' | translate }}
          </button>
        }
      </div>

      @if (risks().length === 0) {
        <p class="no-risks">{{ 'risks.noRisks' | translate }}</p>
      } @else {
        <table mat-table [dataSource]="risks()" class="risks-table">
          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef>{{ 'risks.type.label' | translate }}</th>
            <td mat-cell *matCellDef="let r">{{ 'risks.type.' + r.type | translate }}</td>
          </ng-container>

          <ng-container matColumnDef="source">
            <th mat-header-cell *matHeaderCellDef>{{ 'risks.source.label' | translate }}</th>
            <td mat-cell *matCellDef="let r">
              <mat-chip>{{ 'risks.source.' + r.source | translate }}</mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="severity">
            <th mat-header-cell *matHeaderCellDef>{{ 'risks.severity.label' | translate }}</th>
            <td mat-cell *matCellDef="let r">
              <span class="severity-badge" [class]="'severity-' + r.severity">
                {{ 'risks.severity.' + r.severity | translate }}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef>{{ 'risks.fields.description' | translate }}</th>
            <td mat-cell *matCellDef="let r">{{ r.description }}</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>{{ 'risks.fields.status' | translate }}</th>
            <td mat-cell *matCellDef="let r">
              <mat-chip [color]="r.resolved ? 'primary' : 'warn'" selected>
                {{ (r.resolved ? 'risks.resolved' : 'risks.active') | translate }}
              </mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>{{ 'common.actions' | translate }}</th>
            <td mat-cell *matCellDef="let r">
              @if (r.source === 'MANUAL' && hasWriteAccess()) {
                <button mat-icon-button (click)="toggleResolve(r)" [title]="(r.resolved ? 'risks.unresolve' : 'risks.resolve') | translate">
                  <mat-icon>{{ r.resolved ? 'undo' : 'check_circle' }}</mat-icon>
                </button>
                <button mat-icon-button (click)="openEditDialog(r)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteRisk(r)">
                  <mat-icon>delete</mat-icon>
                </button>
              }
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      }
    </div>
  `,
    styles: [`
    .risk-list-container { margin-top: 16px; }
    .header-row { display: flex; justify-content: flex-end; gap: 8px; margin-bottom: 16px; }
    .risks-table { width: 100%; }
    .no-risks { text-align: center; color: rgba(0,0,0,0.54); padding: 24px 0; }
    .severity-badge { padding: 4px 8px; border-radius: 4px; font-weight: 500; font-size: 12px; }
    .severity-CRITICAL { background-color: #f44336; color: white; }
    .severity-HIGH { background-color: #ff9800; color: white; }
    .severity-MEDIUM { background-color: #ffeb3b; color: rgba(0,0,0,0.87); }
    .severity-LOW { background-color: #4caf50; color: white; }
  `]
})
export class RiskListComponent implements OnInit {
    applicationId = input.required<number>();

    private riskService = inject(RiskService);
    private authService = inject(AuthService);
    private notificationService = inject(NotificationService);
    private translateService = inject(TranslateService);
    private dialog = inject(MatDialog);

    risks = signal<RiskDTO[]>([]);
    displayedColumns = ['type', 'source', 'severity', 'description', 'status', 'actions'];

    ngOnInit(): void {
        this.loadRisks();
    }

    loadRisks(): void {
        this.riskService.getApplicationRisks(this.applicationId()).subscribe({
            next: (data) => this.risks.set(data),
            error: () => this.notificationService.error(this.translateService.instant('common.error.loading'))
        });
    }

    hasWriteAccess(): boolean {
        return this.authService.hasAnyRole(['ADMIN', 'MANAGER', 'DT_REFERENT']);
    }

    computeRisks(): void {
        this.riskService.computeRisks(this.applicationId()).subscribe({
            next: () => this.loadRisks(),
            error: () => this.notificationService.error(this.translateService.instant('common.error.loading'))
        });
    }

    toggleResolve(risk: RiskDTO): void {
        this.riskService.updateRisk(this.applicationId(), risk.id, { resolved: !risk.resolved }).subscribe({
            next: () => this.loadRisks(),
            error: () => this.notificationService.error(this.translateService.instant('common.error.update'))
        });
    }

    deleteRisk(risk: RiskDTO): void {
        if (confirm(this.translateService.instant('risks.deleteConfirm'))) {
            this.riskService.deleteRisk(this.applicationId(), risk.id).subscribe({
                next: () => this.loadRisks(),
                error: () => this.notificationService.error(this.translateService.instant('common.error.deletion'))
            });
        }
    }

    openCreateDialog(): void {
        const dialogRef = this.dialog.open(RiskDialogComponent, {
            width: '600px',
            data: { applicationId: this.applicationId() }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) this.loadRisks();
        });
    }

    openEditDialog(risk: RiskDTO): void {
        const dialogRef = this.dialog.open(RiskDialogComponent, {
            width: '600px',
            data: { applicationId: this.applicationId(), riskData: risk }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) this.loadRisks();
        });
    }
}
