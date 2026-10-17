import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ClientService, NotificationService, AuthService } from '../../core/services';
import { ClientDTO } from '../../core/models';
import { ClientDialogComponent } from './client-dialog.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule, MatDialogModule, TranslateModule],
  template: `
    <div class="page-container">
      <div class="panel-header">
        <h2>{{ 'clients.title' | translate }}</h2>
        @if (hasWriteAccess()) {
        <button mat-raised-button color="primary" (click)="openAddDialog()">
          <mat-icon>add</mat-icon> {{ 'clients.actions.add' | translate }}
        </button>
        }
      </div>

      <table mat-table [dataSource]="clients()">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>{{ 'clients.table.columnName' | translate }}</th>
          <td mat-cell *matCellDef="let client">{{ client.name }}</td>
        </ng-container>
        <ng-container matColumnDef="description">
          <th mat-header-cell *matHeaderCellDef>{{ 'clients.table.columnDescription' | translate }}</th>
          <td mat-cell *matCellDef="let client">{{ client.description }}</td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>{{ 'clients.table.columnActions' | translate }}</th>
          <td mat-cell *matCellDef="let client">
            <div class="action-buttons">
              @if (hasWriteAccess()) {
              <button mat-icon-button color="primary" (click)="openEditDialog(client); $event.stopPropagation()">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="confirmDelete(client); $event.stopPropagation()">
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
    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .clickable-row { cursor: pointer; }
    .clickable-row:hover { background-color: rgba(0, 0, 0, 0.04); }
  `]
})
export class ClientListComponent implements OnInit {
  private clientService = inject(ClientService);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);
  private translateService = inject(TranslateService);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  clients = signal<ClientDTO[]>([]);
  totalElements = signal(0);
  pageSize = signal(20);
  currentPage = signal(0);
  displayedColumns = ['name', 'description', 'actions'];

  hasWriteAccess(): boolean {
    return this.authService.hasAnyRole(['ADMIN', 'MANAGER', 'DT_REFERENT']);
  }

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getClients({ page: this.currentPage(), size: this.pageSize() }).subscribe({
      next: (page) => {
        this.clients.set(page.content);
        this.totalElements.set(page.totalElements);
      },
      error: () => this.notificationService.error(this.translateService.instant('clients.errors.loading'))
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadClients();
  }

  goToDetail(client: ClientDTO): void {
    this.router.navigate(['/clients', client.id]);
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(ClientDialogComponent, { width: '500px', data: {} });
    dialogRef.afterClosed().subscribe((result) => { if (result) this.loadClients(); });
  }

  openEditDialog(client: ClientDTO): void {
    const dialogRef = this.dialog.open(ClientDialogComponent, { width: '500px', data: { client } });
    dialogRef.afterClosed().subscribe((result) => { if (result) this.loadClients(); });
  }

  confirmDelete(client: ClientDTO): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translateService.instant('clients.confirm.deleteTitle'),
        message: this.translateService.instant('clients.confirm.deleteMessage', { name: client.name })
      }
    });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.clientService.deleteClient(client.id).subscribe({
          next: () => { this.notificationService.success(this.translateService.instant('clients.notifications.deleted')); this.loadClients(); },
          error: () => this.notificationService.error(this.translateService.instant('clients.errors.delete'))
        });
      }
    });
  }
}
