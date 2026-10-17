import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslateModule } from '@ngx-translate/core';
import { KpiTemplate, KpiDimension } from '../../core/models';

export interface KpiTemplateDialogData {
    template?: KpiTemplate;
}

@Component({
    selector: 'app-kpi-template-dialog',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatCheckboxModule,
        TranslateModule
    ],
    template: `
    <h2 mat-dialog-title>{{ (data.template ? 'kpi_templates.edit' : 'kpi_templates.create') | translate }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form-container">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'kpi_templates.dimension' | translate }}</mat-label>
          <mat-select formControlName="dimension">
            @for (dim of dimensions; track dim) {
            <mat-option [value]="dim">{{ 'kpi_templates.dimensions.' + dim | translate }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'kpi_templates.version' | translate }}</mat-label>
          <input matInput formControlName="version" maxlength="20">
        </mat-form-field>

        <mat-checkbox formControlName="active">{{ 'kpi_templates.active' | translate }}</mat-checkbox>

        <h3>{{ 'kpi_templates.content' | translate }}</h3>
        @for (level of levels; track level) {
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'kpi_templates.level' | translate }} {{ level }}</mat-label>
          <textarea matInput [formControlName]="'level_' + level" rows="2"></textarea>
        </mat-form-field>
        }
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
      min-width: 500px;
      max-height: 70vh;
      overflow-y: auto;
    }
    .full-width { width: 100%; }
    h3 { margin: 16px 0 8px; }
  `]
})
export class KpiTemplateDialogComponent implements OnInit {
    data = inject<KpiTemplateDialogData>(MAT_DIALOG_DATA);
    dialogRef = inject(MatDialogRef<KpiTemplateDialogComponent>);
    private fb = inject(FormBuilder);

    dimensions: KpiDimension[] = ['INDUSTRIALIZATION', 'CODE_QUALITY', 'TESTING', 'DEPLOYMENT', 'OBSOLESCENCE', 'AI_ADOPTION'];
    levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    form!: FormGroup;

    ngOnInit(): void {
        const tpl = this.data.template;
        const formConfig: any = {
            dimension: [tpl?.dimension || '', Validators.required],
            version: [tpl?.version || '', [Validators.required, Validators.maxLength(20)]],
            active: [tpl?.active ?? false]
        };

        for (const level of this.levels) {
            formConfig[`level_${level}`] = [tpl?.content?.[level] || '', Validators.required];
        }

        this.form = this.fb.group(formConfig);
    }

    save(): void {
        if (this.form.valid) {
            const value = this.form.value;
            const content: { [level: number]: string } = {};
            for (const level of this.levels) {
                content[level] = value[`level_${level}`];
            }
            this.dialogRef.close({
                dimension: value.dimension,
                version: value.version,
                content,
                active: value.active
            });
        }
    }
}
