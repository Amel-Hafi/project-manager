import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RiskDTO, RiskCreateDTO, RiskUpdateDTO, RiskType, RiskSeverity } from '../../core/models';
import { RiskService, NotificationService } from '../../core/services';

export interface RiskDialogData {
    applicationId: number;
    riskData?: RiskDTO;
}

@Component({
    selector: 'app-risk-dialog',
    standalone: true,
    imports: [
        ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule,
        MatSelectModule, MatButtonModule, TranslateModule
    ],
    template: `
    <h2 mat-dialog-title>{{ (isEdit ? 'risks.editRisk' : 'risks.addRisk') | translate }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form">
        <mat-form-field appearance="outline">
          <mat-label>{{ 'risks.type.label' | translate }}</mat-label>
          <mat-select formControlName="type">
            @for (t of riskTypes; track t) {
              <mat-option [value]="t">{{ 'risks.type.' + t | translate }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>{{ 'risks.severity.label' | translate }}</mat-label>
          <mat-select formControlName="severity">
            @for (s of severities; track s) {
              <mat-option [value]="s">{{ 'risks.severity.' + s | translate }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>{{ 'risks.fields.description' | translate }}</mat-label>
          <textarea matInput formControlName="description" rows="4"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>{{ 'risks.fields.actionPlan' | translate }}</mat-label>
          <textarea matInput formControlName="actionPlan" rows="3"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{ 'common.cancel' | translate }}</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="form.invalid">
        {{ 'common.save' | translate }}
      </button>
    </mat-dialog-actions>
  `,
    styles: [`
    .dialog-form { display: flex; flex-direction: column; min-width: 400px; gap: 8px; }
  `]
})
export class RiskDialogComponent {
    private fb = inject(FormBuilder);
    private dialogRef = inject(MatDialogRef<RiskDialogComponent>);
    private data: RiskDialogData = inject(MAT_DIALOG_DATA);
    private riskService = inject(RiskService);
    private notificationService = inject(NotificationService);
    private translateService = inject(TranslateService);

    isEdit = !!this.data.riskData;
    riskTypes: RiskType[] = ['SECURITY', 'OPERATIONAL', 'QUALITY', 'AVAILABILITY'];
    severities: RiskSeverity[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

    form = this.fb.group({
        type: [this.data.riskData?.type || '' as string, Validators.required],
        severity: [this.data.riskData?.severity || '' as string, Validators.required],
        description: [this.data.riskData?.description || '', [Validators.required, Validators.maxLength(1000)]],
        actionPlan: [this.data.riskData?.actionPlan || '', Validators.maxLength(2000)]
    });

    onSubmit(): void {
        if (this.form.invalid) return;

        const rawValue = this.form.getRawValue();

        if (this.isEdit) {
            const dto: RiskUpdateDTO = {
                severity: rawValue.severity as RiskSeverity,
                description: rawValue.description || undefined,
                actionPlan: rawValue.actionPlan || undefined
            };
            this.riskService.updateRisk(this.data.applicationId, this.data.riskData!.id, dto).subscribe({
                next: (result) => {
                    this.notificationService.success(this.translateService.instant('common.save'));
                    this.dialogRef.close(result);
                },
                error: () => this.notificationService.error(this.translateService.instant('common.error.update'))
            });
        } else {
            const dto: RiskCreateDTO = {
                type: rawValue.type as RiskType,
                severity: rawValue.severity as RiskSeverity,
                description: rawValue.description!,
                actionPlan: rawValue.actionPlan || undefined
            };
            this.riskService.createRisk(this.data.applicationId, dto).subscribe({
                next: (result) => {
                    this.notificationService.success(this.translateService.instant('common.save'));
                    this.dialogRef.close(result);
                },
                error: () => this.notificationService.error(this.translateService.instant('common.error.create'))
            });
        }
    }
}
