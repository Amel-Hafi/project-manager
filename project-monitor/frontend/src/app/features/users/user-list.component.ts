import { Component, inject, signal, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserService, NotificationService } from '../../core/services';
import { UserDTO } from '../../core/models';
import { UserDialogComponent } from './user-dialog.component';
import { AssignmentDialogComponent } from './assignment-dialog.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule, MatDialogModule, MatChipsModule, MatTooltipModule, TranslateModule],
  template: `
    <div class="page-container">
      <div class="panel-header">
        <h2>{{ 'users.title' | translate }}</h2>
        <button mat-raised-button color="primary" (click)="openAddDialog()">
          <mat-icon>add</mat-icon> {{ 'users.actions.add' | translate }}
        </button>
      </div>

      <table mat-table [dataSource]="users()">
        <ng-container matColumnDef="username">
          <th mat-header-cell *matHeaderCellDef>{{ 'users.table.columnUsername' | translate }}</th>
          <td mat-cell *matCellDef="let user">{{ user.username }}</td>
        </ng-container>
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>{{ 'users.table.columnName' | translate }}</th>
          <td mat-cell *matCellDef="let user">{{ user.firstName }} {{ user.lastName }}</td>
        </ng-container>
        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef>{{ 'users.table.columnEmail' | translate }}</th>
          <td mat-cell *matCellDef="let user">{{ user.email }}</td>
        </ng-container>
        <ng-container matColumnDef="role">
          <th mat-header-cell *matHeaderCellDef>{{ 'users.table.columnRole' | translate }}</th>
          <td mat-cell *matCellDef="let user">{{ user.role }}</td>
        </ng-container>
        <ng-container matColumnDef="active">
          <th mat-header-cell *matHeaderCellDef>{{ 'users.table.columnActive' | translate }}</th>
          <td mat-cell *matCellDef="let user">
            <mat-icon [style.color]="user.active ? 'green' : 'red'">
              {{ user.active ? 'check_circle' : 'cancel' }}
            </mat-icon>
          </td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>{{ 'users.table.columnActions' | translate }}</th>
          <td mat-cell *matCellDef="let user">
            <div class="action-buttons">
              <button mat-icon-button color="primary" (click)="openAssignmentDialog(user)" [matTooltip]="'users.table.assignTooltip' | translate">
                <mat-icon>assignment_ind</mat-icon>
              </button>
            </div>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
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
  `]
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  private notificationService = inject(NotificationService);
  private translateService = inject(TranslateService);
  private dialog = inject(MatDialog);

  users = signal<UserDTO[]>([]);
  totalElements = signal(0);
  pageSize = signal(20);
  currentPage = signal(0);
  displayedColumns = ['username', 'name', 'email', 'role', 'active', 'actions'];

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers({ page: this.currentPage(), size: this.pageSize() }).subscribe({
      next: (page) => { this.users.set(page.content); this.totalElements.set(page.totalElements); },
      error: () => this.notificationService.error(this.translateService.instant('users.errors.loading'))
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadUsers();
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(UserDialogComponent, { width: '500px' });
    dialogRef.afterClosed().subscribe((result) => { if (result) this.loadUsers(); });
  }

  openAssignmentDialog(user: UserDTO): void {
    this.dialog.open(AssignmentDialogComponent, {
      width: '500px',
      data: { user }
    });
  }
}
