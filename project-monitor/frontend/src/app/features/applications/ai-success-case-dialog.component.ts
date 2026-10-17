import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AiSuccessCaseDTO, AiSuccessCaseCreateDTO, AiSuccessCaseUpdateDTO } from '../../core/models';
import { AiSuccessCaseService, NotificationService } from '../../core/services';

export interface AiSuccessCaseDialogData {
    applicationId: number;
    caseData?: AiSuccessCaseDTO;
}

@Component({
    selector: 'app-ai-success-case-dialog',
    standalone: true,
    imports: [
        ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule,
        MatSelectModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, TranslateModule
    ],
    template: `
    <h2 mat-dialog-title>{{ (isEdit ? 'aiCases.dialog.titleEdit' : 'aiCases.dialog.titleCreate') | translate }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form">
        <mat-form-field appearance="outline">
          <mat-label>{{ 'aiCases.fields.title' | translate }}</mat-label>
          <input matInput formControlName="title">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>{{ 'aiCases.fields.tool' | translate }}</mat-label>
          <input matInput formControlName="tool">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>{{ 'aiCases.fields.profile' | translate }}</mat-label>
          <mat-select formControlName="profile">
            <mat-option value="dev">{{ 'aiCases.profiles.dev' | translate }}</mat-option>
            <mat-option value="ba">{{ 'aiCases.profiles.ba' | translate }}</mat-option>
            <mat-option value="pm">{{ 'aiCases.profiles.pm' | translate }}</mat-option>
            <mat-option value="otro">{{ 'aiCases.profiles.otro' | translate }}</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>{{ 'aiCases.fields.description' | translate }}</mat-label>
          <textarea matInput formControlName="description" rows="3"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>{{ 'aiCases.fields.estimatedImpact' | translate }}</mat-label>
          <textarea matInput formControlName="estimatedImpact" rows="2"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>{{ 'aiCases.fields.caseDate' | translate }}</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="caseDate">
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
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
export class AiSuccessCaseDialogComponent {
    private fb = inject(FormBuilder);
    private dialogRef = inject(MatDialogRef<AiSuccessCaseDialogComponent>);
    private data: AiSuccessCaseDialogData = inject(MAT_DIALOG_DATA);
    private aiCaseService = inject(AiSuccessCaseService);
    private notificationService = inject(NotificationService);
    private translateService = inject(TranslateService);

    isEdit = !!this.data.caseData;

    form = this.fb.group({
        title: [this.data.caseData?.title || '', Validators.required],
        tool: [this.data.caseData?.tool || '', Validators.required],
        profile: [this.data.caseData?.profile || '', Validators.required],
        description: [this.data.caseData?.description || ''],
        estimatedImpact: [this.data.caseData?.estimatedImpact || ''],
        caseDate: [this.data.caseData?.caseDate ? new Date(this.data.caseData.caseDate) : null]
    });

    onSubmit(): void {
        if (this.form.invalid) return;

        const rawValue = this.form.getRawValue();
        const caseDate = rawValue.caseDate ? this.formatDate(rawValue.caseDate) : undefined;

        if (this.isEdit) {
            const dto: AiSuccessCaseUpdateDTO = {
                title: rawValue.title || undefined,
                tool: rawValue.tool || undefined,
                profile: rawValue.profile || undefined,
                description: rawValue.description || undefined,
                estimatedImpact: rawValue.estimatedImpact || undefined,
                caseDate
            };
            this.aiCaseService.update(this.data.caseData!.id, dto).subscribe({
                next: (result) => {
                    this.notificationService.success(this.translateService.instant('aiCases.notifications.updated'));
                    this.dialogRef.close(result);
                },
                error: () => this.notificationService.error(this.translateService.instant('aiCases.notifications.error'))
            });
        } else {
            const dto: AiSuccessCaseCreateDTO = {
                title: rawValue.title!,
                tool: rawValue.tool!,
                profile: rawValue.profile!,
                description: rawValue.description || undefined,
                estimatedImpact: rawValue.estimatedImpact || undefined,
                caseDate
            };
            this.aiCaseService.create(this.data.applicationId, dto).subscribe({
                next: (result) => {
                    this.notificationService.success(this.translateService.instant('aiCases.notifications.created'));
                    this.dialogRef.close(result);
                },
                error: () => this.notificationService.error(this.translateService.instant('aiCases.notifications.error'))
            });
        }
    }

    private formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}
