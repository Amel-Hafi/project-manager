import { Component, inject, signal, input, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AiSuccessCaseService, AuthService, NotificationService } from '../../core/services';
import { AiSuccessCaseDTO } from '../../core/models';
import { AiSuccessCaseDialogComponent } from './ai-success-case-dialog.component';

@Component({
    selector: 'app-ai-success-cases-list',
    standalone: true,
    imports: [MatTableModule, MatButtonModule, MatIconModule, MatChipsModule, MatDialogModule, TranslateModule],
    template: `
    <div class="ai-cases-container">
      <div class="header-row">
        @if (hasWriteAccess()) {
          <button mat-raised-button color="primary" (click)="openCreateDialog()">
            <mat-icon>add</mat-icon> {{ 'aiCases.add' | translate }}
          </button>
        }
      </div>

      @if (cases().length === 0) {
        <p class="no-cases">{{ 'aiCases.noCases' | translate }}</p>
      } @else {
        <table mat-table [dataSource]="cases()" class="cases-table">
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>{{ 'aiCases.fields.title' | translate }}</th>
            <td mat-cell *matCellDef="let c">{{ c.title }}</td>
          </ng-container>

          <ng-container matColumnDef="tool">
            <th mat-header-cell *matHeaderCellDef>{{ 'aiCases.fields.tool' | translate }}</th>
            <td mat-cell *matCellDef="let c">{{ c.tool }}</td>
          </ng-container>

          <ng-container matColumnDef="profile">
            <th mat-header-cell *matHeaderCellDef>{{ 'aiCases.fields.profile' | translate }}</th>
            <td mat-cell *matCellDef="let c">{{ 'aiCases.profiles.' + c.profile | translate }}</td>
          </ng-container>

          <ng-container matColumnDef="caseDate">
            <th mat-header-cell *matHeaderCellDef>{{ 'aiCases.fields.caseDate' | translate }}</th>
            <td mat-cell *matCellDef="let c">{{ c.caseDate || '-' }}</td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>{{ 'aiCases.fields.status' | translate }}</th>
            <td mat-cell *matCellDef="let c">
              <mat-chip [color]="c.status === 'PENDING' ? 'warn' : 'primary'" selected>
                {{ 'aiCases.status.' + c.status | translate }}
              </mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>{{ 'common.actions' | translate }}</th>
            <td mat-cell *matCellDef="let c">
              @if (hasWriteAccess()) {
                <button mat-icon-button (click)="openEditDialog(c)">
                  <mat-icon>edit</mat-icon>
                </button>
              }
              @if (c.status === 'PENDING' && hasValidateAccess()) {
                <button mat-icon-button color="primary" (click)="validateCase(c)">
                  <mat-icon>check_circle</mat-icon>
                </button>
              }
              @if (isAdmin()) {
                <button mat-icon-button color="warn" (click)="deleteCase(c)">
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
    .ai-cases-container { margin-top: 16px; }
    .header-row { display: flex; justify-content: flex-end; margin-bottom: 16px; }
    .cases-table { width: 100%; }
    .no-cases { text-align: center; color: rgba(0,0,0,0.54); padding: 24px 0; }
  `]
})
export class AiSuccessCasesListComponent implements OnInit {
    applicationId = input.required<number>();

    private aiCaseService = inject(AiSuccessCaseService);
    private authService = inject(AuthService);
    private notificationService = inject(NotificationService);
    private translateService = inject(TranslateService);
    private dialog = inject(MatDialog);

    cases = signal<AiSuccessCaseDTO[]>([]);
    displayedColumns = ['title', 'tool', 'profile', 'caseDate', 'status', 'actions'];

    ngOnInit(): void {
        this.loadCases();
    }

    loadCases(): void {
        this.aiCaseService.getByApplication(this.applicationId()).subscribe({
            next: (data) => this.cases.set(data),
            error: () => this.notificationService.error(this.translateService.instant('aiCases.notifications.error'))
        });
    }

    hasWriteAccess(): boolean {
        return this.authService.hasAnyRole(['ADMIN', 'MANAGER', 'DT_REFERENT']);
    }

    hasValidateAccess(): boolean {
        return this.authService.hasAnyRole(['ADMIN', 'MANAGER']);
    }

    isAdmin(): boolean {
        return this.authService.hasRole('ADMIN');
    }

    openCreateDialog(): void {
        const dialogRef = this.dialog.open(AiSuccessCaseDialogComponent, {
            width: '600px',
            data: { applicationId: this.applicationId() }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) this.loadCases();
        });
    }

    openEditDialog(caseItem: AiSuccessCaseDTO): void {
        const dialogRef = this.dialog.open(AiSuccessCaseDialogComponent, {
            width: '600px',
            data: { applicationId: this.applicationId(), caseData: caseItem }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result) this.loadCases();
        });
    }

    validateCase(caseItem: AiSuccessCaseDTO): void {
        this.aiCaseService.validate(caseItem.id).subscribe({
            next: () => {
                this.notificationService.success(this.translateService.instant('aiCases.notifications.validated'));
                this.loadCases();
            },
            error: () => this.notificationService.error(this.translateService.instant('aiCases.notifications.error'))
        });
    }

    deleteCase(caseItem: AiSuccessCaseDTO): void {
        if (!confirm(this.translateService.instant('aiCases.confirmDelete'))) return;
        this.aiCaseService.delete(caseItem.id).subscribe({
            next: () => {
                this.notificationService.success(this.translateService.instant('aiCases.notifications.deleted'));
                this.loadCases();
            },
            error: () => this.notificationService.error(this.translateService.instant('aiCases.notifications.error'))
        });
    }
}
