import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { MaturityKpiDTO } from '../../core/models';

interface KpiDimensionRow {
    dimensionKey: string;
    value: number | null;
    justification: string | null;
}

@Component({
    selector: 'app-kpi-history',
    standalone: true,
    imports: [MatTableModule, MatCardModule, TranslateModule, DatePipe],
    template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ 'kpi_history.title' | translate }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <table mat-table [dataSource]="dimensions" class="kpi-history-table">
          <ng-container matColumnDef="dimension">
            <th mat-header-cell *matHeaderCellDef>{{ 'kpi_history.dimension' | translate }}</th>
            <td mat-cell *matCellDef="let row">{{ 'kpi_templates.dimensions.' + row.dimensionKey | translate }}</td>
          </ng-container>

          <ng-container matColumnDef="value">
            <th mat-header-cell *matHeaderCellDef>{{ 'kpi_history.value' | translate }}</th>
            <td mat-cell *matCellDef="let row">
              {{ row.value !== null ? row.value : ('kpi_history.not_evaluated' | translate) }}
            </td>
          </ng-container>

          <ng-container matColumnDef="justification">
            <th mat-header-cell *matHeaderCellDef>{{ 'kpi_history.justification' | translate }}</th>
            <td mat-cell *matCellDef="let row">
              {{ row.justification || ('kpi_history.no_justification' | translate) }}
            </td>
          </ng-container>

          <ng-container matColumnDef="evaluatedAt">
            <th mat-header-cell *matHeaderCellDef>{{ 'kpi_history.evaluated_at' | translate }}</th>
            <td mat-cell *matCellDef="let row">
              @if (kpi?.evaluatedAt) {
                {{ kpi!.evaluatedAt | date:'short' }}
              } @else {
                —
              }
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <p class="kpi-history-note">{{ 'kpi_history.note' | translate }}</p>
      </mat-card-content>
    </mat-card>
  `,
    styles: [`
    .kpi-history-table { width: 100%; margin-top: 16px; }
    .kpi-history-note { margin-top: 16px; font-style: italic; color: rgba(0,0,0,0.54); font-size: 0.85em; }
  `]
})
export class KpiHistoryComponent {
    @Input() set kpi(value: MaturityKpiDTO | null) {
        this._kpi = value;
        this.buildDimensions();
    }
    get kpi(): MaturityKpiDTO | null { return this._kpi; }

    private _kpi: MaturityKpiDTO | null = null;
    dimensions: KpiDimensionRow[] = [];
    displayedColumns = ['dimension', 'value', 'justification', 'evaluatedAt'];

    private buildDimensions(): void {
        if (!this._kpi) {
            this.dimensions = [];
            return;
        }
        this.dimensions = [
            { dimensionKey: 'INDUSTRIALIZATION', value: this._kpi.industrialization, justification: this._kpi.justificationIndustrialization },
            { dimensionKey: 'CODE_QUALITY', value: this._kpi.codeQuality, justification: this._kpi.justificationCodeQuality },
            { dimensionKey: 'TESTING', value: this._kpi.testing, justification: this._kpi.justificationTesting },
            { dimensionKey: 'DEPLOYMENT', value: this._kpi.deployment, justification: this._kpi.justificationDeployment },
            { dimensionKey: 'OBSOLESCENCE', value: this._kpi.obsolescence, justification: this._kpi.justificationObsolescence },
            { dimensionKey: 'AI_ADOPTION', value: this._kpi.aiAdoption, justification: this._kpi.justificationAiAdoption }
        ];
    }
}
