import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ClientService, ProjectService, ApplicationService, NotificationService, AuthService } from '../../core/services';
import { ApplicationDTO, ClientDTO, ProjectDTO } from '../../core/models';
import { ApplicationDialogComponent } from './application-dialog.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-application-list',
    standalone: true,
    imports: [MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule, MatDialogModule, MatChipsModule, TranslateModule],
    template: `
    <div class="page-container">
      <div class="panel-header">
        <h2>{{ 'applications.title' | translate }}</h2>
        @if (hasWriteAccess()) {
        <button mat-raised-button color="primary" (click)="openAddDialog()">
          <mat-icon>add</mat-icon> {{ 'applications.actions.add' | translate }}
        </button>
        }
      </div>

      <table mat-table [dataSource]="applications()">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>{{ 'applications.table.columnName' | translate }}</th>
          <td mat-cell *matCellDef="let app">{{ app.name }}</td>
        </ng-container>
        <ng-container matColumnDef="projectName">
          <th mat-header-cell *matHeaderCellDef>{{ 'applications.table.columnProject' | translate }}</th>
          <td mat-cell *matCellDef="let app">{{ app.projectName }}</td>
        </ng-container>
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>{{ 'applications.table.columnStatus' | translate }}</th>
          <td mat-cell *matCellDef="let app">{{ app.status }}</td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>{{ 'applications.table.columnActions' | translate }}</th>
          <td mat-cell *matCellDef="let app">
            <div class="action-buttons">
              <button mat-icon-button color="primary" (click)="goToDetail(app); $event.stopPropagation()">
                <mat-icon>visibility</mat-icon>
              </button>
              @if (hasWriteAccess()) {
              <button mat-icon-button (click)="openEditDialog(app); $event.stopPropagation()">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="confirmDelete(app); $event.stopPropagation()">
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
export class ApplicationListComponent implements OnInit {
    private clientService = inject(ClientService);
    private projectService = inject(ProjectService);
    private applicationService = inject(ApplicationService);
    private notificationService = inject(NotificationService);
    private authService = inject(AuthService);
    private translateService = inject(TranslateService);
    private dialog = inject(MatDialog);
    private router = inject(Router);

    applications = signal<ApplicationDTO[]>([]);
    projects = signal<ProjectDTO[]>([]);
    totalElements = signal(0);
    pageSize = signal(20);
    currentPage = signal(0);
    displayedColumns = ['name', 'projectName', 'status', 'actions'];

    hasWriteAccess(): boolean {
        return this.authService.hasAnyRole(['ADMIN', 'MANAGER', 'DT_REFERENT']);
    }

    ngOnInit(): void {
        this.loadAll();
    }

    loadAll(): void {
        this.clientService.getClients({ page: 0, size: 100 }).subscribe({
            next: (clientPage) => {
                const allProjects: ProjectDTO[] = [];
                const allApps: ApplicationDTO[] = [];
                if (clientPage.content.length === 0) {
                    this.applications.set([]);
                    this.totalElements.set(0);
                    return;
                }
                let clientsCompleted = 0;
                clientPage.content.forEach(client => {
                    this.projectService.getProjectsByClient(client.id, { page: 0, size: 100 }).subscribe({
                        next: (projectPage) => {
                            allProjects.push(...projectPage.content);
                            let projectsCompleted = 0;
                            if (projectPage.content.length === 0) {
                                clientsCompleted++;
                                if (clientsCompleted === clientPage.content.length) {
                                    this.projects.set(allProjects);
                                    this.applications.set(allApps);
                                    this.totalElements.set(allApps.length);
                                }
                                return;
                            }
                            projectPage.content.forEach(project => {
                                this.applicationService.getApplicationsByProject(project.id, { page: 0, size: 100 }).subscribe({
                                    next: (appPage) => {
                                        allApps.push(...appPage.content);
                                        projectsCompleted++;
                                        if (projectsCompleted === projectPage.content.length) {
                                            clientsCompleted++;
                                            if (clientsCompleted === clientPage.content.length) {
                                                this.projects.set(allProjects);
                                                this.applications.set(allApps);
                                                this.totalElements.set(allApps.length);
                                            }
                                        }
                                    },
                                    error: () => { projectsCompleted++; }
                                });
                            });
                        },
                        error: () => { clientsCompleted++; }
                    });
                });
            },
            error: () => this.notificationService.error(this.translateService.instant('applications.errors.loading'))
        });
    }

    onPageChange(event: PageEvent): void {
        this.currentPage.set(event.pageIndex);
        this.pageSize.set(event.pageSize);
    }

    goToDetail(app: ApplicationDTO): void {
        this.router.navigate(['/applications', app.id]);
    }

    openAddDialog(): void {
        const dialogRef = this.dialog.open(ApplicationDialogComponent, {
            width: '600px',
            data: { projects: this.projects() }
        });
        dialogRef.afterClosed().subscribe((result) => { if (result) this.loadAll(); });
    }

    openEditDialog(app: ApplicationDTO): void {
        const dialogRef = this.dialog.open(ApplicationDialogComponent, {
            width: '600px',
            data: { application: app, projects: this.projects() }
        });
        dialogRef.afterClosed().subscribe((result) => { if (result) this.loadAll(); });
    }

    confirmDelete(app: ApplicationDTO): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                title: this.translateService.instant('applications.confirm.deleteTitle'),
                message: this.translateService.instant('applications.confirm.deleteMessage', { name: app.name })
            }
        });
        dialogRef.afterClosed().subscribe((confirmed) => {
            if (confirmed) {
                this.applicationService.deleteApplication(app.id).subscribe({
                    next: () => { this.notificationService.success(this.translateService.instant('applications.notifications.deleted')); this.loadAll(); },
                    error: () => this.notificationService.error(this.translateService.instant('applications.errors.delete'))
                });
            }
        });
    }
}
