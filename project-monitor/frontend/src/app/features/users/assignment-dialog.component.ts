import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserService, ClientService, ProjectService, NotificationService } from '../../core/services';
import { UserDTO, ProjectDTO, ProjectAssignmentDTO } from '../../core/models';

interface DialogData {
  user: UserDTO;
}

@Component({
  selector: 'app-assignment-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatIconModule, MatListModule, TranslateModule],
  template: `
    <h2 mat-dialog-title>{{ 'users.assignment.title' | translate:{ username: data.user.username } }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form-fields">
        <mat-form-field appearance="outline">
          <mat-label>{{ 'users.assignment.project' | translate }}</mat-label>
          <mat-select formControlName="projectId">
            @for (project of projects(); track project.id) {
              <mat-option [value]="project.id">{{ project.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>{{ 'users.assignment.role' | translate }}</mat-label>
          <mat-select formControlName="role">
            <mat-option value="MANAGER">{{ 'users.assignment.roleManager' | translate }}</mat-option>
            <mat-option value="DT_REFERENT">{{ 'users.assignment.roleDtReferent' | translate }}</mat-option>
          </mat-select>
        </mat-form-field>
        <button mat-raised-button color="primary" [disabled]="form.invalid" (click)="assign()">
          <mat-icon>add</mat-icon> {{ 'users.assignment.assign' | translate }}
        </button>
      </form>

      @if (assignments().length > 0) {
        <h3>{{ 'users.assignment.currentTitle' | translate }}</h3>
        <mat-list>
          @for (a of assignments(); track a.id) {
            <mat-list-item>
              <span matListItemTitle>{{ a.projectName }} — {{ a.role }}</span>
              <button matListItemMeta mat-icon-button color="warn" (click)="removeAssignment(a.id)">
                <mat-icon>delete</mat-icon>
              </button>
            </mat-list-item>
          }
        </mat-list>
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">{{ 'common.close' | translate }}</button>
    </mat-dialog-actions>
  `,
  styles: [`.form-fields { display: flex; flex-direction: column; min-width: 400px; gap: 8px; }`]
})
export class AssignmentDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private clientService = inject(ClientService);
  private projectService = inject(ProjectService);
  private notificationService = inject(NotificationService);
  private translateService = inject(TranslateService);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<AssignmentDialogComponent>);

  projects = signal<ProjectDTO[]>([]);
  assignments = signal<ProjectAssignmentDTO[]>([]);

  form = this.fb.group({
    projectId: [null as number | null, Validators.required],
    role: ['MANAGER', Validators.required]
  });

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.clientService.getClients({ page: 0, size: 100 }).subscribe({
      next: (clientPage) => {
        const allProjects: ProjectDTO[] = [];
        let completed = 0;
        if (clientPage.content.length === 0) return;
        clientPage.content.forEach(client => {
          this.projectService.getProjectsByClient(client.id, { page: 0, size: 100 }).subscribe({
            next: (projectPage) => {
              allProjects.push(...projectPage.content);
              completed++;
              if (completed === clientPage.content.length) {
                this.projects.set(allProjects);
              }
            },
            error: () => { completed++; }
          });
        });
      }
    });
  }

  assign(): void {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    this.userService.createAssignment({
      userId: this.data.user.id,
      projectId: value.projectId!,
      role: value.role!
    }).subscribe({
      next: (assignment) => {
        this.notificationService.success(this.translateService.instant('users.notifications.assignmentCreated'));
        this.assignments.update(list => [...list, assignment]);
      },
      error: () => this.notificationService.error(this.translateService.instant('users.notifications.assignmentError'))
    });
  }

  removeAssignment(id: number): void {
    this.userService.deleteAssignment(id).subscribe({
      next: () => {
        this.notificationService.success(this.translateService.instant('users.notifications.assignmentDeleted'));
        this.assignments.update(list => list.filter(a => a.id !== id));
      },
      error: () => this.notificationService.error(this.translateService.instant('users.notifications.assignmentDeleteError'))
    });
  }
}
