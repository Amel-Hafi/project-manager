import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MaturityKpiDTO, MaturityKpiUpdateDTO } from '../../core/models';
import { MaturityKpiService, NotificationService } from '../../core/services';

export interface KpiEditDialogData {
  applicationId: number;
  kpi: MaturityKpiDTO | null;
}

@Component({
  selector: 'app-kpi-edit-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, TranslateModule],
  template: `
    <h2 mat-dialog-title>{{ 'kpis.dialog.title' | translate }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="kpi-form">
        <mat-form-field appearance="outline">
          <mat-label>{{ 'kpis.industrialization' | translate }}</mat-label>
          <input matInput type="number" formControlName="industrialization" min="1" max="10">
          <mat-hint>{{ 'kpis.dialog.hint' | translate }}</mat-hint>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>{{ 'kpis.justification' | translate }}</mat-label>
          <textarea matInput formControlName="justificationIndustrialization" maxlength="2000" rows="2"
            [placeholder]="'kpis.justification_placeholder' | translate"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>{{ 'kpis.codeQuality' | translate }}</mat-label>
          <input matInput type="number" formControlName="codeQuality" min="1" max="10">
          <mat-hint>{{ 'kpis.dialog.hint' | translate }}</mat-hint>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>{{ 'kpis.justification' | translate }}</mat-label>
          <textarea matInput formControlName="justificationCodeQuality" maxlength="2000" rows="2"
            [placeholder]="'kpis.justification_placeholder' | translate"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>{{ 'kpis.testing' | translate }}</mat-label>
          <input matInput type="number" formControlName="testing" min="1" max="10">
          <mat-hint>{{ 'kpis.dialog.hint' | translate }}</mat-hint>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>{{ 'kpis.justification' | translate }}</mat-label>
          <textarea matInput formControlName="justificationTesting" maxlength="2000" rows="2"
            [placeholder]="'kpis.justification_placeholder' | translate"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>{{ 'kpis.deployment' | translate }}</mat-label>
          <input matInput type="number" formControlName="deployment" min="1" max="10">
          <mat-hint>{{ 'kpis.dialog.hint' | translate }}</mat-hint>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>{{ 'kpis.justification' | translate }}</mat-label>
          <textarea matInput formControlName="justificationDeployment" maxlength="2000" rows="2"
            [placeholder]="'kpis.justification_placeholder' | translate"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>{{ 'kpis.obsolescence' | translate }}</mat-label>
          <input matInput type="number" formControlName="obsolescence" min="1" max="10">
          <mat-hint>{{ 'kpis.dialog.hint' | translate }}</mat-hint>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>{{ 'kpis.justification' | translate }}</mat-label>
          <textarea matInput formControlName="justificationObsolescence" maxlength="2000" rows="2"
            [placeholder]="'kpis.justification_placeholder' | translate"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>{{ 'kpis.aiAdoption' | translate }}</mat-label>
          <input matInput type="number" formControlName="aiAdoption" min="1" max="10">
          <mat-hint>{{ 'kpis.dialog.hint' | translate }}</mat-hint>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>{{ 'kpis.justification' | translate }}</mat-label>
          <textarea matInput formControlName="justificationAiAdoption" maxlength="2000" rows="2"
            [placeholder]="'kpis.justification_placeholder' | translate"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{ 'common.cancel' | translate }}</button>
      <button mat-raised-button color="primary" [disabled]="form.invalid" (click)="onSubmit()">
        {{ 'common.save' | translate }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .kpi-form { display: flex; flex-direction: column; gap: 8px; min-width: 350px; }
  `]
})
export class KpiEditDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<KpiEditDialogComponent>);
  private data: KpiEditDialogData = inject(MAT_DIALOG_DATA);
  private kpiService = inject(MaturityKpiService);
  private notificationService = inject(NotificationService);
  private translateService = inject(TranslateService);

  form = this.fb.group({
    industrialization: [this.data.kpi?.industrialization ?? null as number | null, [Validators.min(1), Validators.max(10)]],
    codeQuality: [this.data.kpi?.codeQuality ?? null as number | null, [Validators.min(1), Validators.max(10)]],
    testing: [this.data.kpi?.testing ?? null as number | null, [Validators.min(1), Validators.max(10)]],
    deployment: [this.data.kpi?.deployment ?? null as number | null, [Validators.min(1), Validators.max(10)]],
    obsolescence: [this.data.kpi?.obsolescence ?? null as number | null, [Validators.min(1), Validators.max(10)]],
    aiAdoption: [this.data.kpi?.aiAdoption ?? null as number | null, [Validators.min(1), Validators.max(10)]],
    justificationIndustrialization: [this.data.kpi?.justificationIndustrialization ?? null as string | null, [Validators.maxLength(2000)]],
    justificationCodeQuality: [this.data.kpi?.justificationCodeQuality ?? null as string | null, [Validators.maxLength(2000)]],
    justificationTesting: [this.data.kpi?.justificationTesting ?? null as string | null, [Validators.maxLength(2000)]],
    justificationDeployment: [this.data.kpi?.justificationDeployment ?? null as string | null, [Validators.maxLength(2000)]],
    justificationObsolescence: [this.data.kpi?.justificationObsolescence ?? null as string | null, [Validators.maxLength(2000)]],
    justificationAiAdoption: [this.data.kpi?.justificationAiAdoption ?? null as string | null, [Validators.maxLength(2000)]]
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    const dto: MaturityKpiUpdateDTO = {
      industrialization: this.form.value.industrialization ?? null,
      codeQuality: this.form.value.codeQuality ?? null,
      testing: this.form.value.testing ?? null,
      deployment: this.form.value.deployment ?? null,
      obsolescence: this.form.value.obsolescence ?? null,
      aiAdoption: this.form.value.aiAdoption ?? null,
      justificationIndustrialization: this.form.value.justificationIndustrialization ?? null,
      justificationCodeQuality: this.form.value.justificationCodeQuality ?? null,
      justificationTesting: this.form.value.justificationTesting ?? null,
      justificationDeployment: this.form.value.justificationDeployment ?? null,
      justificationObsolescence: this.form.value.justificationObsolescence ?? null,
      justificationAiAdoption: this.form.value.justificationAiAdoption ?? null
    };
    this.kpiService.updateKpis(this.data.applicationId, dto).subscribe({
      next: (result) => {
        this.notificationService.success(this.translateService.instant('kpis.notifications.updated'));
        this.dialogRef.close(result);
      },
      error: () => {
        this.notificationService.error(this.translateService.instant('kpis.notifications.updateError'));
      }
    });
  }
}
