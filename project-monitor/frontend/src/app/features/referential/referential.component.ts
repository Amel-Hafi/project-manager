import { Component, inject, signal, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TechnologyService, NotificationService, AuthService } from '../../core/services';
import { TechnologyCategoryDTO, TechnologyItemDTO, Page } from '../../core/models';
import { TechnologyItemDialogComponent } from './technology-item-dialog.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-referential',
  standalone: true,
  imports: [
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
    MatChipsModule,
    TranslateModule
  ],
  template: `
    <div class="page-container referential-layout">
      <mat-card class="categories-panel">
        <mat-card-header>
          <mat-card-title>{{ 'referential.categories.title' | translate }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-nav-list>
            @for (cat of categories(); track cat.id) {
              <a mat-list-item
                 [class.selected]="selectedCategory()?.code === cat.code"
                 (click)="selectCategory(cat)">
                {{ 'categories.' + cat.code | translate }}
              </a>
            }
          </mat-nav-list>
        </mat-card-content>
      </mat-card>

      <div class="items-panel">
        @if (selectedCategory()) {
          <div class="panel-header">
            <h2>{{ 'categories.' + selectedCategory()!.code | translate }}</h2>
            <button mat-raised-button color="primary" (click)="openAddDialog()">
              <mat-icon>add</mat-icon> {{ 'referential.actions.add' | translate }}
            </button>
          </div>

          <table mat-table [dataSource]="items()">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>{{ 'referential.table.columnName' | translate }}</th>
              <td mat-cell *matCellDef="let item">{{ item.name }}</td>
            </ng-container>
            <ng-container matColumnDef="version">
              <th mat-header-cell *matHeaderCellDef>{{ 'referential.table.columnVersion' | translate }}</th>
              <td mat-cell *matCellDef="let item">{{ item.version }}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>{{ 'referential.table.columnStatus' | translate }}</th>
              <td mat-cell *matCellDef="let item">
                <mat-chip-set>
                  <mat-chip [class.deprecated-chip]="item.status === 'DEPRECATED'"
                            [class.active-chip]="item.status === 'ACTIVE'"
                            [class.obsolete-chip]="item.status === 'OBSOLETE'">
                    @if (item.status === 'DEPRECATED') {
                      {{ 'referential.status_deprecated' | translate }}
                    } @else if (item.status === 'ACTIVE') {
                      {{ 'referential.status_active' | translate }}
                    } @else {
                      {{ 'referential.status_obsolete' | translate }}
                    }
                  </mat-chip>
                </mat-chip-set>
              </td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>{{ 'referential.table.columnActions' | translate }}</th>
              <td mat-cell *matCellDef="let item">
                <div class="action-buttons">
                  <button mat-icon-button color="primary" (click)="openEditDialog(item)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="confirmDelete(item)">
                    <mat-icon>delete</mat-icon>
                  </button>
                  @if (isAdmin() && item.status === 'ACTIVE') {
                    <button mat-icon-button color="accent" (click)="confirmDeactivate(item)"
                            [title]="'referential.deactivate' | translate">
                      <mat-icon>archive</mat-icon>
                    </button>
                  }
                  @if (isAdmin() && item.status === 'DEPRECATED') {
                    <button mat-icon-button color="primary" (click)="confirmReactivate(item)"
                            [title]="'referential.reactivate' | translate">
                      <mat-icon>unarchive</mat-icon>
                    </button>
                  }
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
        } @else {
          <p class="placeholder-text">{{ 'referential.placeholder' | translate }}</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .referential-layout {
      display: flex;
      gap: 24px;
      height: calc(100vh - 100px);
    }
    .categories-panel {
      width: 280px;
      flex-shrink: 0;
    }
    .items-panel {
      flex: 1;
      overflow: auto;
    }
    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .selected {
      background-color: rgba(63, 81, 181, 0.1);
    }
    .placeholder-text {
      color: rgba(0, 0, 0, 0.54);
      font-size: 16px;
      text-align: center;
      margin-top: 48px;
    }
    .deprecated-chip {
      background-color: #fff3e0 !important;
      color: #e65100 !important;
    }
    .active-chip {
      background-color: #e8f5e9 !important;
      color: #2e7d32 !important;
    }
    .obsolete-chip {
      background-color: #fbe9e7 !important;
      color: #bf360c !important;
    }
    .action-buttons {
      display: flex;
      gap: 4px;
    }
  `]
})
export class ReferentialComponent implements OnInit {
  private technologyService = inject(TechnologyService);
  private notificationService = inject(NotificationService);
  private translateService = inject(TranslateService);
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);

  categories = signal<TechnologyCategoryDTO[]>([]);
  selectedCategory = signal<TechnologyCategoryDTO | null>(null);
  items = signal<TechnologyItemDTO[]>([]);
  totalElements = signal(0);
  pageSize = signal(20);
  currentPage = signal(0);

  displayedColumns = ['name', 'version', 'status', 'actions'];

  ngOnInit(): void {
    this.technologyService.getCategories().subscribe({
      next: (cats) => this.categories.set(cats),
      error: () => this.notificationService.error(this.translateService.instant('referential.errors.loadCategories'))
    });
  }

  selectCategory(category: TechnologyCategoryDTO): void {
    this.selectedCategory.set(category);
    this.currentPage.set(0);
    this.loadItems();
  }

  loadItems(): void {
    const cat = this.selectedCategory();
    if (!cat) return;
    this.technologyService.getItemsByCategory(cat.code, { page: this.currentPage(), size: this.pageSize() }).subscribe({
      next: (page) => {
        this.items.set(page.content);
        this.totalElements.set(page.totalElements);
      },
      error: () => this.notificationService.error(this.translateService.instant('referential.errors.loadItems'))
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadItems();
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(TechnologyItemDialogComponent, {
      width: '500px',
      data: { categoryCode: this.selectedCategory()!.code }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadItems();
    });
  }

  openEditDialog(item: TechnologyItemDTO): void {
    const dialogRef = this.dialog.open(TechnologyItemDialogComponent, {
      width: '500px',
      data: { item, categoryCode: this.selectedCategory()!.code }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadItems();
    });
  }

  confirmDelete(item: TechnologyItemDTO): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translateService.instant('referential.confirm.deleteTitle'),
        message: this.translateService.instant('referential.confirm.deleteMessage', { name: item.name })
      }
    });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.technologyService.deleteItem(item.id).subscribe({
          next: () => {
            this.notificationService.success(this.translateService.instant('referential.notifications.deleted'));
            this.loadItems();
          },
          error: () => this.notificationService.error(this.translateService.instant('referential.errors.delete'))
        });
      }
    });
  }

  isAdmin(): boolean {
    return this.authService.hasRole('ADMIN');
  }

  confirmDeactivate(item: TechnologyItemDTO): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translateService.instant('referential.deactivate'),
        message: this.translateService.instant('referential.confirm_deactivate')
      }
    });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.technologyService.deactivateItem(item.id).subscribe({
          next: () => {
            this.notificationService.success(this.translateService.instant('referential.deactivated_success'));
            this.loadItems();
          },
          error: () => this.notificationService.error(this.translateService.instant('common.error.update'))
        });
      }
    });
  }

  confirmReactivate(item: TechnologyItemDTO): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translateService.instant('referential.reactivate'),
        message: this.translateService.instant('referential.confirm_reactivate')
      }
    });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.technologyService.reactivateItem(item.id).subscribe({
          next: () => {
            this.notificationService.success(this.translateService.instant('referential.reactivated_success'));
            this.loadItems();
          },
          error: () => this.notificationService.error(this.translateService.instant('common.error.update'))
        });
      }
    });
  }
}
