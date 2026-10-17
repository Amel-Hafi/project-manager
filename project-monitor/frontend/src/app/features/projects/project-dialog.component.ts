import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProjectService, NotificationService } from '../../core/services';
import { ProjectDTO, ClientDTO } from '../../core/models';

interface DialogData {
  project?: ProjectDTO;
  clientId?: number;
  clients?: ClientDTO[];
}

@Component({
  selector: 'app-project-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, TranslateModule],
  template: `
    <h2 mat-dialog-title>{{ (data.project ? 'projects.dialog.titleEdit' : 'projects.dialog.titleAdd') | translate }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form-fields">
        <mat-form-field appearance="outline">
          <mat-label>{{ 'projects.dialog.name' | translate }}</mat-label>
          <input matInput formControlName="name" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>{{ 'projects.dialog.description' | translate }}</mat-label>
          <textarea matInput formControlName="description" rows="3"></textarea>
        </mat-form-field>
        @if (data.clients && data.clients.length > 0) {
          <mat-form-field appearance="outline">
            <mat-label>{{ 'projects.dialog.client' | translate }}</mat-label>
            <mat-select formControlName="clientId">
              @for (client of data.clients; track client.id) {
                <mat-option [value]="client.id">{{ client.name }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        }
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">{{ 'common.cancel' | translate }}</button>
      <button mat-raised-button color="primary" [disabled]="form.invalid" (click)="save()">{{ 'common.save' | translate }}</button>
    </mat-dialog-actions>
  `,
  styles: [`.form-fields { display: flex; flex-direction: column; min-width: 400px; gap: 8px; }`]
})
export class ProjectDialogComponent {
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);
  private notificationService = inject(NotificationService);
  private translateService = inject(TranslateService);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<ProjectDialogComponent>);

  form = this.fb.group({
    name: [this.data.project?.name ?? '', Validators.required],
    description: [this.data.project?.description ?? ''],
    clientId: [this.data.project?.clientId ?? this.data.clientId ?? null, Validators.required]
  });

  save(): void {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();

    if (this.data.project) {
      this.projectService.updateProject(this.data.project.id, {
        name: value.name!,
        description: value.description || undefined,
        clientId: value.clientId!
      }).subscribe({
        next: () => { this.notificationService.success(this.translateService.instant('projects.notifications.updated')); this.dialogRef.close(true); },
        error: () => this.notificationService.error(this.translateService.instant('projects.notifications.updateError'))
      });
    } else {
      this.projectService.createProject({
        name: value.name!,
        description: value.description || undefined,
        clientId: value.clientId!
      }).subscribe({
        next: () => { this.notificationService.success(this.translateService.instant('projects.notifications.created')); this.dialogRef.close(true); },
        error: () => this.notificationService.error(this.translateService.instant('projects.notifications.createError'))
      });
    }
  }
}
