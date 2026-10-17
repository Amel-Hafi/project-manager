import { Component, inject, signal, OnInit } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TechnologyService, ApplicationService, NotificationService } from '../../core/services';
import { TechnologyCategoryDTO, TechnologyItemDTO } from '../../core/models';

interface DialogData {
  applicationId: number;
  currentTechIds: number[];
  categories: TechnologyCategoryDTO[];
}

interface TechSelection {
  item: TechnologyItemDTO;
  selected: boolean;
}

@Component({
  selector: 'app-technology-select-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatCheckboxModule, MatExpansionModule, FormsModule, TranslateModule],
  template: `
    <h2 mat-dialog-title>{{ 'applications.techSelect.title' | translate }}</h2>
    <mat-dialog-content class="tech-content">
      <mat-accordion>
        @for (cat of data.categories; track cat.id) {
          <mat-expansion-panel>
            <mat-expansion-panel-header>
              <mat-panel-title>{{ cat.name }}</mat-panel-title>
            </mat-expansion-panel-header>
            @for (sel of getCategoryItems(cat.code); track sel.item.id) {
              <div class="tech-item">
                <mat-checkbox [(ngModel)]="sel.selected">
                  {{ sel.item.name }} {{ sel.item.version ? '(' + sel.item.version + ')' : '' }}
                </mat-checkbox>
              </div>
            }
            @if (getCategoryItems(cat.code).length === 0) {
              <p class="no-items">{{ 'applications.techSelect.noItems' | translate }}</p>
            }
          </mat-expansion-panel>
        }
      </mat-accordion>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">{{ 'common.cancel' | translate }}</button>
      <button mat-raised-button color="primary" (click)="save()">{{ 'common.save' | translate }}</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .tech-content { min-width: 600px; max-height: 500px; overflow: auto; }
    .tech-item { padding: 4px 16px; }
    .no-items { color: rgba(0,0,0,0.5); padding: 8px 16px; }
  `]
})
export class TechnologySelectDialogComponent implements OnInit {
  private technologyService = inject(TechnologyService);
  private applicationService = inject(ApplicationService);
  private notificationService = inject(NotificationService);
  private translateService = inject(TranslateService);
  data = inject<DialogData>(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<TechnologySelectDialogComponent>);

  itemsByCategory = signal<Map<string, TechSelection[]>>(new Map());

  ngOnInit(): void {
    const map = new Map<string, TechSelection[]>();
    this.data.categories.forEach(cat => {
      this.technologyService.getActiveItemsByCategory(cat.code).subscribe({
        next: (items) => {
          map.set(cat.code, items.map(item => ({
            item,
            selected: this.data.currentTechIds.includes(item.id)
          })));
          this.itemsByCategory.set(new Map(map));
        }
      });
    });
  }

  getCategoryItems(code: string): TechSelection[] {
    return this.itemsByCategory().get(code) ?? [];
  }

  save(): void {
    const selectedIds: number[] = [];
    this.itemsByCategory().forEach(items => {
      items.filter(s => s.selected).forEach(s => selectedIds.push(s.item.id));
    });

    this.applicationService.updateTechnologies(this.data.applicationId, selectedIds).subscribe({
      next: () => {
        this.notificationService.success(this.translateService.instant('applications.notifications.techUpdated'));
        this.dialogRef.close(true);
      },
      error: () => this.notificationService.error(this.translateService.instant('applications.notifications.techUpdateError'))
    });
  }
}
