import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { DecisionRuleDTO, KpiDimension, ConditionType, AggregationLevel, TrafficLightResult } from '../../core/models';

export interface DecisionRuleDialogData {
    rule?: DecisionRuleDTO;
}

@Component({
    selector: 'app-decision-rule-dialog',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        TranslateModule
    ],
    template: `
    <h2 mat-dialog-title>{{ (data.rule ? 'decision_rules.edit' : 'decision_rules.add') | translate }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form-container">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'decision_rules.name' | translate }}</mat-label>
          <input matInput formControlName="name">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'decision_rules.description' | translate }}</mat-label>
          <textarea matInput formControlName="description" rows="3"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'decision_rules.dimension' | translate }}</mat-label>
          <mat-select formControlName="dimension">
            <mat-option [value]="null">{{ 'decision_rules.dimension_global' | translate }}</mat-option>
            @for (dim of dimensions; track dim) {
            <mat-option [value]="dim">{{ 'kpi_dimensions.' + dim | translate }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'decision_rules.condition_type' | translate }}</mat-label>
          <mat-select formControlName="conditionType">
            <mat-option value="VALUE_BELOW_THRESHOLD">{{ 'decision_rules.condition_value_below' | translate }}</mat-option>
            <mat-option value="PERCENTAGE_BELOW_THRESHOLD">{{ 'decision_rules.condition_percentage_below' | translate }}</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'decision_rules.threshold' | translate }}</mat-label>
          <input matInput type="number" formControlName="threshold">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'decision_rules.aggregation_level' | translate }}</mat-label>
          <mat-select formControlName="aggregationLevel">
            <mat-option value="APPLICATION">{{ 'decision_rules.level_application' | translate }}</mat-option>
            <mat-option value="PROJECT">{{ 'decision_rules.level_project' | translate }}</mat-option>
            <mat-option value="CLIENT">{{ 'decision_rules.level_client' | translate }}</mat-option>
            <mat-option value="GLOBAL">{{ 'decision_rules.level_global' | translate }}</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'decision_rules.traffic_light_result' | translate }}</mat-label>
          <mat-select formControlName="trafficLightResult">
            <mat-option value="GREEN">
              <span class="traffic-light green"></span> {{ 'dashboard.status.GREEN' | translate }}
            </mat-option>
            <mat-option value="YELLOW">
              <span class="traffic-light yellow"></span> {{ 'dashboard.status.YELLOW' | translate }}
            </mat-option>
            <mat-option value="RED">
              <span class="traffic-light red"></span> {{ 'dashboard.status.RED' | translate }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">{{ 'common.cancel' | translate }}</button>
      <button mat-raised-button color="primary" [disabled]="form.invalid" (click)="save()">{{ 'common.save' | translate }}</button>
    </mat-dialog-actions>
  `,
    styles: [`
    .form-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 400px;
    }
    .full-width { width: 100%; }
    .traffic-light {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-right: 8px;
    }
    .green { background-color: #4caf50; }
    .yellow { background-color: #ff9800; }
    .red { background-color: #f44336; }
  `]
})
export class DecisionRuleDialogComponent implements OnInit {
    data = inject<DecisionRuleDialogData>(MAT_DIALOG_DATA);
    dialogRef = inject(MatDialogRef<DecisionRuleDialogComponent>);
    private fb = inject(FormBuilder);

    dimensions: KpiDimension[] = ['INDUSTRIALIZATION', 'CODE_QUALITY', 'TESTING', 'DEPLOYMENT', 'OBSOLESCENCE', 'AI_ADOPTION'];

    form!: FormGroup;

    ngOnInit(): void {
        const rule = this.data.rule;
        this.form = this.fb.group({
            name: [rule?.name || '', Validators.required],
            description: [rule?.description || ''],
            dimension: [rule?.dimension || null],
            conditionType: [rule?.conditionType || 'VALUE_BELOW_THRESHOLD', Validators.required],
            threshold: [rule?.threshold ?? 5, [Validators.required, Validators.min(0)]],
            aggregationLevel: [rule?.aggregationLevel || 'APPLICATION', Validators.required],
            trafficLightResult: [rule?.trafficLightResult || 'RED', Validators.required]
        });

        this.form.get('conditionType')!.valueChanges.subscribe(type => {
            this.updateThresholdValidation(type);
        });
        this.updateThresholdValidation(this.form.get('conditionType')!.value);
    }

    private updateThresholdValidation(conditionType: ConditionType): void {
        const thresholdCtrl = this.form.get('threshold')!;
        const max = conditionType === 'VALUE_BELOW_THRESHOLD' ? 10 : 100;
        thresholdCtrl.setValidators([Validators.required, Validators.min(0), Validators.max(max)]);
        thresholdCtrl.updateValueAndValidity();
    }

    save(): void {
        if (this.form.valid) {
            this.dialogRef.close(this.form.value);
        }
    }
}
