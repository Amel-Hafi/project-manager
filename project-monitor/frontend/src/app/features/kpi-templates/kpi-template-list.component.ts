import { Component, inject, signal, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { KpiTemplateService } from '../../core/services/kpi-template.service';
import { NotificationService } from '../../core/services';
import { AuthService } from '../../core/services/auth.service';
import { KpiTemplate, KpiDimension } from '../../core/models';
import { KpiTemplateDialogComponent } from './kpi-template-dialog.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-kpi-template-list',
    standalone: true,
    imports: [
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule,
        MatSelectModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatDialogModule,
        MatSnackBarModule,
        TranslateModule
    ],
    template: `
    <div class="page-container">
      <div class="panel-header">
        <h2>{{ 'kpi_templates.title' | translate }}</h2>
        <div class="header-actions">
          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>{{ 'kpi_templates.dimension' | translate }}</mat-label>
            <mat-select (selectionChange)="filterByDimension($event.value)" [value]="selectedDimension()">
              <mat-option [value]="''">{{ 'common.all' | translate }}</mat-option>
              @for (dim of dimensions; track dim) {
              <mat-option [value]="dim">{{ 'kpi_templates.dimensions.' + dim | translate }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
          @if (isAdmin()) {
          <button mat-raised-button color="primary" (click)="openCreateDialog()">
            <mat-icon>add</mat-icon> {{ 'kpi_templates.create' | translate }}
          </button>
          }
        </div>
      </div>

      <table mat-table [dataSource]="templates()">
        <ng-container matColumnDef="dimension">
          <th mat-header-cell *matHeaderCellDef>{{ 'kpi_templates.dimension' | translate }}</th>
          <td mat-cell *matCellDef="let tpl">{{ 'kpi_templates.dimensions.' + tpl.dimension | translate }}</td>
        </ng-container>

        <ng-container matColumnDef="version">
          <th mat-header-cell *matHeaderCellDef>{{ 'kpi_templates.version' | translate }}</th>
          <td mat-cell *matCellDef="let tpl">{{ tpl.version }}</td>
        </ng-container>

        <ng-container matColumnDef="active">
          <th mat-header-cell *matHeaderCellDef>{{ 'kpi_templates.active' | translate }}</th>
          <td mat-cell *matCellDef="let tpl">
            <mat-chip-set>
              <mat-chip [highlighted]="tpl.active" [class.active-chip]="tpl.active" [class.inactive-chip]="!tpl.active">
                {{ (tpl.active ? 'common.yes' : 'common.no') | translate }}
              </mat-chip>
            </mat-chip-set>
          </td>
        </ng-container>

        @if (isAdmin()) {
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>{{ 'kpi_templates.actions' | translate }}</th>
          <td mat-cell *matCellDef="let tpl">
            <div class="action-buttons">
              <button mat-icon-button color="primary" (click)="openEditDialog(tpl)">
                <mat-icon>edit</mat-icon>
              </button>
              @if (!tpl.active) {
              <button mat-icon-button color="accent" (click)="activateTemplate(tpl)">
                <mat-icon>check_circle</mat-icon>
              </button>
              }
              <button mat-icon-button color="warn" (click)="confirmDelete(tpl)">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </td>
        </ng-container>
        }

        <tr mat-header-row *matHeaderRowDef="displayedColumns()"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns();"></tr>
      </table>

      <mat-paginator [length]="templates().length"
                     [pageSize]="10"
                     [pageSizeOptions]="[5, 10, 25]"
                     (page)="onPageChange($event)">
      </mat-paginator>
    </div>
  `,
    styles: [`
    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .header-actions {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .filter-field {
      width: 200px;
    }
    .action-buttons { display: flex; }
    .active-chip { background-color: #c8e6c9 !important; }
    .inactive-chip { background-color: #ffcdd2 !important; }
  `]
})
export class KpiTemplateListComponent implements OnInit {
    private templateService = inject(KpiTemplateService);
    private notificationService = inject(NotificationService);
    private translateService = inject(TranslateService);
    private authService = inject(AuthService);
    private dialog = inject(MatDialog);

    templates = signal<KpiTemplate[]>([]);
    selectedDimension = signal<string>('');
    dimensions: KpiDimension[] = ['INDUSTRIALIZATION', 'CODE_QUALITY', 'TESTING', 'DEPLOYMENT', 'OBSOLESCENCE', 'AI_ADOPTION'];

    displayedColumns = signal<string[]>([]);

    ngOnInit(): void {
        this.updateColumns();
        this.loadTemplates();
    }

    isAdmin(): boolean {
        return this.authService.hasRole('ADMIN');
    }

    private updateColumns(): void {
        const cols = ['dimension', 'version', 'active'];
        if (this.isAdmin()) {
            cols.push('actions');
        }
        this.displayedColumns.set(cols);
    }

    loadTemplates(): void {
        const dimension = this.selectedDimension() as KpiDimension | '';
        this.templateService.getAll(dimension ? dimension as KpiDimension : undefined).subscribe({
            next: (templates) => this.templates.set(templates),
            error: () => this.notificationService.error(this.translateService.instant('common.error.loading'))
        });
    }

    filterByDimension(dimension: string): void {
        this.selectedDimension.set(dimension);
        this.loadTemplates();
    }

    openCreateDialog(): void {
        const dialogRef = this.dialog.open(KpiTemplateDialogComponent, { width: '700px', data: {} });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.templateService.create(result).subscribe({
                    next: () => {
                        this.notificationService.success(this.translateService.instant('kpi_templates.created_success'));
                        this.loadTemplates();
                    },
                    error: () => this.notificationService.error(this.translateService.instant('common.error.create'))
                });
            }
        });
    }

    openEditDialog(template: KpiTemplate): void {
        const dialogRef = this.dialog.open(KpiTemplateDialogComponent, { width: '700px', data: { template } });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.templateService.update(template.id, result).subscribe({
                    next: () => {
                        this.notificationService.success(this.translateService.instant('kpi_templates.updated_success'));
                        this.loadTemplates();
                    },
                    error: () => this.notificationService.error(this.translateService.instant('common.error.update'))
                });
            }
        });
    }

    activateTemplate(template: KpiTemplate): void {
        this.templateService.activate(template.id).subscribe({
            next: () => {
                this.notificationService.success(this.translateService.instant('kpi_templates.activated_success'));
                this.loadTemplates();
            },
            error: () => this.notificationService.error(this.translateService.instant('common.error.update'))
        });
    }

    confirmDelete(template: KpiTemplate): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                title: this.translateService.instant('common.delete'),
                message: this.translateService.instant('kpi_templates.delete_confirm')
            }
        });
        dialogRef.afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.templateService.delete(template.id).subscribe({
                    next: () => {
                        this.notificationService.success(this.translateService.instant('kpi_templates.deleted_success'));
                        this.loadTemplates();
                    },
                    error: () => this.notificationService.error(this.translateService.instant('common.error.deletion'))
                });
            }
        });
    }

    onPageChange(event: PageEvent): void {
        // Pagination handled by MatPaginator with client-side data
    }
}
