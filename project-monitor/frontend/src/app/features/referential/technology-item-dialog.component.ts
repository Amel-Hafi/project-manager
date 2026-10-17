import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TechnologyService, NotificationService } from '../../core/services';
import { TechnologyItemDTO } from '../../core/models';

interface DialogData {
  item?: TechnologyItemDTO;
  categoryCode: string;
}

@Component({
  selector: 'app-technology-item-dialog',
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
    <h2 mat-dialog-title>{{ (data.item ? 'referential.dialog.titleEdit' : 'referential.dialog.titleAdd') | translate }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form-fields">
        <mat-form-field appearance="outline">
          <mat-label>{{ 'referential.dialog.name' | translate }}</mat-label>
          <input matInput formControlName="name" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>{{ 'referential.dialog.version' | translate }}</mat-label>
          <input matInput formControlName="version" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>{{ 'referential.dialog.description' | translate }}</mat-label>
          <textarea matInput formControlName="description" rows="3"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>{{ 'referential.dialog.status' | translate }}</mat-label>
          <mat-select formControlName="status">
            <mat-option value="ACTIVE">{{ 'referential.dialog.statusActive' | translate }}</mat-option>
            <mat-option value="OBSOLETE">{{ 'referential.dialog.statusObsolete' | translate }}</mat-option>
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
    .form-fields {
      display: flex;
      flex-direction: column;
      min-width: 400px;
      gap: 8px;
    }
  `]
})
export class TechnologyItemDialogComponent {
  private fb = inject(FormBuilder);
  private technologyService = inject(TechnologyService);
  private notificationService = inject(NotificationService);
  private translateService = inject(TranslateService);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<TechnologyItemDialogComponent>);

  form = this.fb.group({
    name: [this.data.item?.name ?? '', Validators.required],
    version: [this.data.item?.version ?? ''],
    description: [this.data.item?.description ?? ''],
    status: [this.data.item?.status ?? 'ACTIVE', Validators.required]
  });

  save(): void {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();

    if (this.data.item) {
      this.technologyService.updateItem(this.data.item.id, {
        name: value.name!,
        version: value.version || undefined,
        description: value.description || undefined,
        status: value.status!
      }).subscribe({
        next: () => {
          this.notificationService.success(this.translateService.instant('referential.notifications.updated'));
          this.dialogRef.close(true);
        },
        error: () => this.notificationService.error(this.translateService.instant('referential.notifications.updateError'))
      });
    } else {
      this.technologyService.createItem({
        name: value.name!,
        version: value.version || undefined,
        description: value.description || undefined,
        status: value.status || undefined,
        categoryCode: this.data.categoryCode
      }).subscribe({
        next: () => {
          this.notificationService.success(this.translateService.instant('referential.notifications.created'));
          this.dialogRef.close(true);
        },
        error: () => this.notificationService.error(this.translateService.instant('referential.notifications.createError'))
      });
    }
  }
}
