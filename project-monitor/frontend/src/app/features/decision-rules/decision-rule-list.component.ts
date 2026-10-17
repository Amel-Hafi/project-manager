import { Component, inject, signal, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DecisionRuleService } from '../../core/services/decision-rule.service';
import { NotificationService } from '../../core/services';
import { DecisionRuleDTO } from '../../core/models';
import { DecisionRuleDialogComponent } from './decision-rule-dialog.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-decision-rule-list',
    standalone: true,
    imports: [
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatSlideToggleModule,
        MatDialogModule,
        MatSnackBarModule,
        TranslateModule
    ],
    template: `
    <div class="page-container">
      <div class="panel-header">
        <h2>{{ 'decision_rules.title' | translate }}</h2>
        <div class="header-actions">
          <button mat-raised-button color="accent" (click)="evaluateRules()">
            <mat-icon>play_arrow</mat-icon> {{ 'decision_rules.evaluate' | translate }}
          </button>
          <button mat-raised-button color="primary" (click)="openAddDialog()">
            <mat-icon>add</mat-icon> {{ 'decision_rules.add' | translate }}
          </button>
        </div>
      </div>

      <table mat-table [dataSource]="rules()">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>{{ 'decision_rules.name' | translate }}</th>
          <td mat-cell *matCellDef="let rule">{{ rule.name }}</td>
        </ng-container>

        <ng-container matColumnDef="dimension">
          <th mat-header-cell *matHeaderCellDef>{{ 'decision_rules.dimension' | translate }}</th>
          <td mat-cell *matCellDef="let rule">
            {{ rule.dimension ? ('kpi_dimensions.' + rule.dimension | translate) : ('decision_rules.dimension_global' | translate) }}
          </td>
        </ng-container>

        <ng-container matColumnDef="conditionType">
          <th mat-header-cell *matHeaderCellDef>{{ 'decision_rules.condition_type' | translate }}</th>
          <td mat-cell *matCellDef="let rule">
            {{ rule.conditionType === 'VALUE_BELOW_THRESHOLD' ? ('decision_rules.condition_value_below' | translate) : ('decision_rules.condition_percentage_below' | translate) }}
          </td>
        </ng-container>

        <ng-container matColumnDef="threshold">
          <th mat-header-cell *matHeaderCellDef>{{ 'decision_rules.threshold' | translate }}</th>
          <td mat-cell *matCellDef="let rule">{{ rule.threshold }}</td>
        </ng-container>

        <ng-container matColumnDef="aggregationLevel">
          <th mat-header-cell *matHeaderCellDef>{{ 'decision_rules.aggregation_level' | translate }}</th>
          <td mat-cell *matCellDef="let rule">{{ 'decision_rules.level_' + rule.aggregationLevel.toLowerCase() | translate }}</td>
        </ng-container>

        <ng-container matColumnDef="trafficLightResult">
          <th mat-header-cell *matHeaderCellDef>{{ 'decision_rules.traffic_light_result' | translate }}</th>
          <td mat-cell *matCellDef="let rule">
            <span class="traffic-light" [class]="rule.trafficLightResult.toLowerCase()"></span>
          </td>
        </ng-container>

        <ng-container matColumnDef="active">
          <th mat-header-cell *matHeaderCellDef>{{ 'decision_rules.active' | translate }}</th>
          <td mat-cell *matCellDef="let rule">
            <mat-slide-toggle [checked]="rule.active" (change)="toggleActive(rule)"></mat-slide-toggle>
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>{{ 'common.actions' | translate }}</th>
          <td mat-cell *matCellDef="let rule">
            <div class="action-buttons">
              <button mat-icon-button color="primary" (click)="openEditDialog(rule)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="confirmDelete(rule)">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
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
    }
    .traffic-light {
      display: inline-block;
      width: 16px;
      height: 16px;
      border-radius: 50%;
    }
    .green { background-color: #4caf50; }
    .yellow { background-color: #ff9800; }
    .red { background-color: #f44336; }
    .action-buttons { display: flex; }
  `]
})
export class DecisionRuleListComponent implements OnInit {
    private ruleService = inject(DecisionRuleService);
    private notificationService = inject(NotificationService);
    private translateService = inject(TranslateService);
    private dialog = inject(MatDialog);
    private snackBar = inject(MatSnackBar);

    rules = signal<DecisionRuleDTO[]>([]);
    displayedColumns = ['name', 'dimension', 'conditionType', 'threshold', 'aggregationLevel', 'trafficLightResult', 'active', 'actions'];

    ngOnInit(): void {
        this.loadRules();
    }

    loadRules(): void {
        this.ruleService.getAll().subscribe({
            next: (rules) => this.rules.set(rules),
            error: () => this.notificationService.error(this.translateService.instant('common.error.loading'))
        });
    }

    openAddDialog(): void {
        const dialogRef = this.dialog.open(DecisionRuleDialogComponent, { width: '550px', data: {} });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.ruleService.create(result).subscribe({
                    next: () => {
                        this.notificationService.success(this.translateService.instant('decision_rules.created'));
                        this.loadRules();
                    },
                    error: () => this.notificationService.error(this.translateService.instant('common.error.create'))
                });
            }
        });
    }

    openEditDialog(rule: DecisionRuleDTO): void {
        const dialogRef = this.dialog.open(DecisionRuleDialogComponent, { width: '550px', data: { rule } });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.ruleService.update(rule.id, result).subscribe({
                    next: () => {
                        this.notificationService.success(this.translateService.instant('decision_rules.updated'));
                        this.loadRules();
                    },
                    error: () => this.notificationService.error(this.translateService.instant('common.error.update'))
                });
            }
        });
    }

    toggleActive(rule: DecisionRuleDTO): void {
        const action = rule.active ? this.ruleService.deactivate(rule.id) : this.ruleService.activate(rule.id);
        action.subscribe({
            next: () => {
                const msg = rule.active ? 'decision_rules.deactivated' : 'decision_rules.activated';
                this.notificationService.success(this.translateService.instant(msg));
                this.loadRules();
            },
            error: () => this.notificationService.error(this.translateService.instant('common.error.update'))
        });
    }

    confirmDelete(rule: DecisionRuleDTO): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                title: this.translateService.instant('decision_rules.delete'),
                message: this.translateService.instant('decision_rules.confirm_delete')
            }
        });
        dialogRef.afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.ruleService.delete(rule.id).subscribe({
                    next: () => {
                        this.notificationService.success(this.translateService.instant('decision_rules.deleted'));
                        this.loadRules();
                    },
                    error: () => this.notificationService.error(this.translateService.instant('common.error.deletion'))
                });
            }
        });
    }

    evaluateRules(): void {
        this.ruleService.evaluate().subscribe({
            next: (result) => {
                const msg = this.translateService.instant('decision_rules.evaluate_result', {
                    evaluated: result.evaluated,
                    created: result.risksCreated,
                    resolved: result.risksResolved
                });
                this.snackBar.open(msg, this.translateService.instant('common.close'), { duration: 5000 });
            },
            error: () => this.notificationService.error(this.translateService.instant('common.error.loading'))
        });
    }
}
