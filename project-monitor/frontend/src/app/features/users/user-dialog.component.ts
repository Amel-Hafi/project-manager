import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserService, NotificationService } from '../../core/services';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, TranslateModule],
  template: `
    <h2 mat-dialog-title>{{ 'users.dialog.title' | translate }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form-fields">
        <mat-form-field appearance="outline">
          <mat-label>{{ 'users.dialog.username' | translate }}</mat-label>
          <input matInput formControlName="username" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>{{ 'users.dialog.email' | translate }}</mat-label>
          <input matInput formControlName="email" type="email" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>{{ 'users.dialog.firstName' | translate }}</mat-label>
          <input matInput formControlName="firstName" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>{{ 'users.dialog.lastName' | translate }}</mat-label>
          <input matInput formControlName="lastName" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>{{ 'users.dialog.role' | translate }}</mat-label>
          <mat-select formControlName="role">
            <mat-option value="ADMIN">{{ 'users.dialog.roleAdmin' | translate }}</mat-option>
            <mat-option value="DIRECTOR">{{ 'users.dialog.roleDirector' | translate }}</mat-option>
            <mat-option value="MANAGER">{{ 'users.dialog.roleManager' | translate }}</mat-option>
            <mat-option value="DT_REFERENT">{{ 'users.dialog.roleDtReferent' | translate }}</mat-option>
          </mat-select>
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
export class UserDialogComponent {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private notificationService = inject(NotificationService);
  private translateService = inject(TranslateService);
  dialogRef = inject(MatDialogRef<UserDialogComponent>);

  form = this.fb.group({
    username: ['', Validators.required],
    email: [''],
    firstName: [''],
    lastName: [''],
    role: ['MANAGER', Validators.required]
  });

  save(): void {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    this.userService.createUser({
      username: value.username!,
      email: value.email || undefined,
      firstName: value.firstName || undefined,
      lastName: value.lastName || undefined,
      role: value.role!
    }).subscribe({
      next: () => { this.notificationService.success(this.translateService.instant('users.notifications.created')); this.dialogRef.close(true); },
      error: () => this.notificationService.error(this.translateService.instant('users.notifications.createError'))
    });
  }
}
