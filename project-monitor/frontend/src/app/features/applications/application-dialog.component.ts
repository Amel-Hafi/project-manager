import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ApplicationService, NotificationService } from '../../core/services';
import { ApplicationDTO, ProjectDTO } from '../../core/models';

interface DialogData {
  application?: ApplicationDTO;
  projectId?: number;
  projects?: ProjectDTO[];
}

@Component({
  selector: 'app-application-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TranslateModule
  ],
  template: `
    <h2 mat-dialog-title>{{ (data.application ? 'applications.dialog.titleEdit' : 'applications.dialog.titleAdd') | translate }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form-fields">
        <mat-form-field appearance="outline">
          <mat-label>{{ 'applications.dialog.name' | translate }}</mat-label>
          <input matInput formControlName="name" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>{{ 'applications.dialog.description' | translate }}</mat-label>
          <textarea matInput formControlName="description" rows="2"></textarea>
        </mat-form-field>

        @if (data.projects && data.projects.length > 0) {
          <mat-form-field appearance="outline">
            <mat-label>{{ 'applications.dialog.project' | translate }}</mat-label>
            <mat-select formControlName="projectId">
              @for (project of data.projects; track project.id) {
                <mat-option [value]="project.id">{{ project.name }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        }

        <mat-form-field appearance="outline">
          <mat-label>{{ 'applications.dialog.status' | translate }}</mat-label>
          <mat-select formControlName="status">
            <mat-option value="BUILDING">{{ 'applications.dialog.statusBuilding' | translate }}</mat-option>
            <mat-option value="ACTIVE">{{ 'applications.dialog.statusActive' | translate }}</mat-option>
            <mat-option value="MAINTENANCE">{{ 'applications.dialog.statusMaintenance' | translate }}</mat-option>
            <mat-option value="OBSOLETE">{{ 'applications.dialog.statusObsolete' | translate }}</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>{{ 'applications.dialog.startDate' | translate }}</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="startDate" />
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <div class="repo-section">
          <label>{{ 'applications.dialog.repoUrls' | translate }}</label>
          @for (control of repoUrls.controls; track $index) {
            <div class="repo-row">
              <mat-form-field appearance="outline" class="repo-field">
                <input matInput [formControl]="$any(control)" placeholder="https://..." />
              </mat-form-field>
              <button mat-icon-button color="warn" (click)="removeRepo($index)">
                <mat-icon>remove_circle</mat-icon>
              </button>
            </div>
          }
          <button mat-button color="primary" (click)="addRepo()">
            <mat-icon>add</mat-icon> {{ 'applications.dialog.addRepo' | translate }}
          </button>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">{{ 'common.cancel' | translate }}</button>
      <button mat-raised-button color="primary" [disabled]="form.invalid" (click)="save()">{{ 'common.save' | translate }}</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .form-fields { display: flex; flex-direction: column; min-width: 500px; gap: 8px; }
    .repo-section { margin-top: 8px; }
    .repo-row { display: flex; align-items: center; gap: 8px; }
    .repo-field { flex: 1; }
  `]
})
export class ApplicationDialogComponent {
  private fb = inject(FormBuilder);
  private applicationService = inject(ApplicationService);
  private notificationService = inject(NotificationService);
  private translateService = inject(TranslateService);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<ApplicationDialogComponent>);

  form = this.fb.group({
    name: [this.data.application?.name ?? '', Validators.required],
    description: [this.data.application?.description ?? ''],
    projectId: [this.data.application?.projectId ?? this.data.projectId ?? null, Validators.required],
    status: [this.data.application?.status ?? 'BUILDING'],
    startDate: [this.data.application?.startDate ?? ''],
    repositoryUrls: this.fb.array(
      (this.data.application?.repositoryUrls ?? []).map(url => this.fb.control(url))
    )
  });

  get repoUrls(): FormArray {
    return this.form.get('repositoryUrls') as FormArray;
  }

  addRepo(): void {
    this.repoUrls.push(this.fb.control(''));
  }

  removeRepo(index: number): void {
    this.repoUrls.removeAt(index);
  }

  save(): void {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    const urls = (value.repositoryUrls?.filter((u): u is string => u != null && u.trim() !== '') ?? []) as string[];

    if (this.data.application) {
      this.applicationService.updateApplication(this.data.application.id, {
        name: value.name!,
        description: value.description || undefined,
        projectId: value.projectId!,
        status: value.status || undefined,
        startDate: value.startDate || undefined,
        repositoryUrls: urls.length > 0 ? urls : undefined
      }).subscribe({
        next: () => { this.notificationService.success(this.translateService.instant('applications.notifications.updated')); this.dialogRef.close(true); },
        error: () => this.notificationService.error(this.translateService.instant('applications.notifications.updateError'))
      });
    } else {
      this.applicationService.createApplication({
        name: value.name!,
        description: value.description || undefined,
        projectId: value.projectId!,
        status: value.status || undefined,
        startDate: value.startDate || undefined,
        repositoryUrls: urls.length > 0 ? urls : undefined
      }).subscribe({
        next: () => { this.notificationService.success(this.translateService.instant('applications.notifications.created')); this.dialogRef.close(true); },
        error: () => this.notificationService.error(this.translateService.instant('applications.notifications.createError'))
      });
    }
  }
}
