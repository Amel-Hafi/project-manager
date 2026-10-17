import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ClientService, NotificationService } from '../../core/services';
import { ClientDTO } from '../../core/models';

interface DialogData {
    client?: ClientDTO;
}

@Component({
    selector: 'app-client-dialog',
    standalone: true,
    imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, TranslateModule],
    template: `
    <h2 mat-dialog-title>{{ (data.client ? 'clients.dialog.titleEdit' : 'clients.dialog.titleAdd') | translate }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form-fields">
        <mat-form-field appearance="outline">
          <mat-label>{{ 'clients.dialog.name' | translate }}</mat-label>
          <input matInput formControlName="name" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>{{ 'clients.dialog.description' | translate }}</mat-label>
          <textarea matInput formControlName="description" rows="3"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">{{ 'common.cancel' | translate }}</button>
      <button mat-raised-button color="primary" [disabled]="form.invalid" (click)="save()">{{ 'common.save' | translate }}</button>
    </mat-dialog-actions>
  `,
    styles: [`.form-fields { display: flex; flex-direction: column; min-width: 400px; gap: 8px; }`]
})
export class ClientDialogComponent {
    private fb = inject(FormBuilder);
    private clientService = inject(ClientService);
    private notificationService = inject(NotificationService);
    private translateService = inject(TranslateService);
    data = inject<DialogData>(MAT_DIALOG_DATA);
    dialogRef = inject(MatDialogRef<ClientDialogComponent>);

    form = this.fb.group({
        name: [this.data.client?.name ?? '', Validators.required],
        description: [this.data.client?.description ?? '']
    });

    save(): void {
        if (this.form.invalid) return;
        const value = this.form.getRawValue();

        if (this.data.client) {
            this.clientService.updateClient(this.data.client.id, {
                name: value.name!,
                description: value.description || undefined
            }).subscribe({
                next: () => { this.notificationService.success(this.translateService.instant('clients.notifications.updated')); this.dialogRef.close(true); },
                error: () => this.notificationService.error(this.translateService.instant('clients.notifications.updateError'))
            });
        } else {
            this.clientService.createClient({
                name: value.name!,
                description: value.description || undefined
            }).subscribe({
                next: () => { this.notificationService.success(this.translateService.instant('clients.notifications.created')); this.dialogRef.close(true); },
                error: () => this.notificationService.error(this.translateService.instant('clients.notifications.createError'))
            });
        }
    }
}
