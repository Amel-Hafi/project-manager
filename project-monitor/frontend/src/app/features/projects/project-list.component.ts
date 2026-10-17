import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ClientService, ProjectService, NotificationService, AuthService } from '../../core/services';
import { ProjectDTO, ClientDTO } from '../../core/models';
import { ProjectDialogComponent } from './project-dialog.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-project-list',
    standalone: true,
    imports: [MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule, MatDialogModule, TranslateModule],
    template: `
    <div class="page-container">
      <div class="panel-header">
        <h2>{{ 'projects.title' | translate }}</h2>
        @if (hasWriteAccess()) {
        <button mat-raised-button color="primary" (click)="openAddDialog()">
          <mat-icon>add</mat-icon> {{ 'projects.actions.add' | translate }}
        </button>
        }
      </div>

      <table mat-table [dataSource]="projects()">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>{{ 'projects.table.columnName' | translate }}</th>
          <td mat-cell *matCellDef="let project">{{ project.name }}</td>
        </ng-container>
        <ng-container matColumnDef="clientName">
          <th mat-header-cell *matHeaderCellDef>{{ 'projects.table.columnClient' | translate }}</th>
          <td mat-cell *matCellDef="let project">{{ project.clientName }}</td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>{{ 'projects.table.columnActions' | translate }}</th>
          <td mat-cell *matCellDef="let project">
            <div class="action-buttons">
              @if (hasWriteAccess()) {
              <button mat-icon-button color="primary" (click)="openEditDialog(project); $event.stopPropagation()">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="confirmDelete(project); $event.stopPropagation()">
                <mat-icon>delete</mat-icon>
              </button>
              }
            </div>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;" (click)="goToDetail(row)" class="clickable-row"></tr>
      </table>

      <mat-paginator
        [length]="totalElements()"
        [pageSize]="pageSize()"
        [pageSizeOptions]="[10, 20, 50]"
        (page)="onPageChange($event)"
        showFirstLastButtons>
      </mat-paginator>
    </div>
  `,
    styles: [`
    .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .clickable-row { cursor: pointer; }
    .clickable-row:hover { background-color: rgba(0, 0, 0, 0.04); }
  `]
})
export class ProjectListComponent implements OnInit {
    private clientService = inject(ClientService);
    private projectService = inject(ProjectService);
    private notificationService = inject(NotificationService);
    private authService = inject(AuthService);
    private translateService = inject(TranslateService);
    private dialog = inject(MatDialog);
    private router = inject(Router);

    clients = signal<ClientDTO[]>([]);
    projects = signal<ProjectDTO[]>([]);
    totalElements = signal(0);
    pageSize = signal(20);
    currentPage = signal(0);
    displayedColumns = ['name', 'clientName', 'actions'];

    hasWriteAccess(): boolean {
        return this.authService.hasAnyRole(['ADMIN', 'MANAGER', 'DT_REFERENT']);
    }

    ngOnInit(): void {
        this.loadClients();
        this.loadProjects();
    }

    loadClients(): void {
        this.clientService.getClients({ page: 0, size: 1000 }).subscribe({
            next: (page) => this.clients.set(page.content),
            error: () => this.notificationService.error(this.translateService.instant('projects.errors.loadClients'))
        });
    }

    loadProjects(): void {
        this.clientService.getClients({ page: 0, size: 100 }).subscribe({
            next: (clientPage) => {
                const allProjects: ProjectDTO[] = [];
                if (clientPage.content.length === 0) {
                    this.projects.set([]);
                    this.totalElements.set(0);
                    return;
                }
                let completed = 0;
                clientPage.content.forEach(client => {
                    this.projectService.getProjectsByClient(client.id, { page: 0, size: 100 }).subscribe({
                        next: (projectPage) => {
                            allProjects.push(...projectPage.content);
                            completed++;
                            if (completed === clientPage.content.length) {
                                this.projects.set(allProjects.slice(this.currentPage() * this.pageSize(), (this.currentPage() + 1) * this.pageSize()));
                                this.totalElements.set(allProjects.length);
                            }
                        },
                        error: () => { completed++; }
                    });
                });
            },
            error: () => this.notificationService.error(this.translateService.instant('projects.errors.loading'))
        });
    }

    onPageChange(event: PageEvent): void {
        this.currentPage.set(event.pageIndex);
        this.pageSize.set(event.pageSize);
        this.loadProjects();
    }

    goToDetail(project: ProjectDTO): void {
        this.router.navigate(['/projects', project.id]);
    }

    openAddDialog(): void {
        const dialogRef = this.dialog.open(ProjectDialogComponent, {
            width: '500px',
            data: { clients: this.clients() }
        });
        dialogRef.afterClosed().subscribe((result) => { if (result) this.loadProjects(); });
    }

    openEditDialog(project: ProjectDTO): void {
        const dialogRef = this.dialog.open(ProjectDialogComponent, {
            width: '500px',
            data: { project, clients: this.clients() }
        });
        dialogRef.afterClosed().subscribe((result) => { if (result) this.loadProjects(); });
    }

    confirmDelete(project: ProjectDTO): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                title: this.translateService.instant('projects.confirm.deleteTitle'),
                message: this.translateService.instant('projects.confirm.deleteMessage', { name: project.name })
            }
        });
        dialogRef.afterClosed().subscribe((confirmed) => {
            if (confirmed) {
                this.projectService.deleteProject(project.id).subscribe({
                    next: () => { this.notificationService.success(this.translateService.instant('projects.notifications.deleted')); this.loadProjects(); },
                    error: () => this.notificationService.error(this.translateService.instant('projects.errors.delete'))
                });
            }
        });
    }
}
