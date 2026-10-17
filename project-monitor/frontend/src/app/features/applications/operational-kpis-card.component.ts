import { Component, input, output, signal, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ApplicationService } from '../../core/services';
import { ApplicationDTO } from '../../core/models';

@Component({
    selector: 'app-operational-kpis-card',
    standalone: true,
    imports: [
        MatCardModule, MatButtonModule, MatIconModule, MatFormFieldModule,
        MatInputModule, MatDatepickerModule, MatNativeDateModule,
        MatSlideToggleModule, FormsModule, TranslateModule
    ],
    template: `
    @if (application()) {
      <mat-card class="operational-kpis-card">
        <mat-card-header>
          <mat-card-title>{{ 'operationalKpis.title' | translate }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          @if (!editing()) {
            <div class="kpi-grid">
              <div class="kpi-item">
                <span class="kpi-label">{{ 'operationalKpis.lastDeployment' | translate }}</span>
                <span class="kpi-value">
                  @if (application()!.lastProductionDeploymentDate) {
                    {{ application()!.lastProductionDeploymentDate }}
                  } @else {
                    {{ 'operationalKpis.noDeployment' | translate }}
                  }
                </span>
              </div>
              <div class="kpi-item">
                <span class="kpi-label">{{ 'operationalKpis.criticalCves' | translate }}</span>
                <span class="kpi-value" [class]="getCveClass()">
                  {{ application()!.activeCriticalCves ?? '-' }}
                </span>
              </div>
              <div class="kpi-item">
                <span class="kpi-label">{{ 'operationalKpis.docUpToDate' | translate }}</span>
                <span class="kpi-value">
                  @if (application()!.technicalDocUpToDate !== null) {
                    <mat-icon>{{ application()!.technicalDocUpToDate ? 'check_circle' : 'cancel' }}</mat-icon>
                  } @else {
                    -
                  }
                </span>
              </div>
            </div>
          } @else {
            <div class="edit-grid">
              <mat-form-field>
                <mat-label>{{ 'operationalKpis.lastDeployment' | translate }}</mat-label>
                <input matInput [matDatepicker]="picker" [(ngModel)]="editDeploymentDate">
                <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>
              <mat-form-field>
                <mat-label>{{ 'operationalKpis.criticalCves' | translate }}</mat-label>
                <input matInput type="number" [(ngModel)]="editCves" min="0">
              </mat-form-field>
              <mat-slide-toggle [(ngModel)]="editDocUpToDate">
                {{ 'operationalKpis.docUpToDate' | translate }}
              </mat-slide-toggle>
            </div>
          }
        </mat-card-content>
        <mat-card-actions>
          @if (!editing() && canEdit()) {
            <button mat-button color="primary" (click)="startEdit()">
              <mat-icon>edit</mat-icon> {{ 'operationalKpis.edit' | translate }}
            </button>
          }
          @if (editing()) {
            <button mat-button color="primary" (click)="save()">
              {{ 'operationalKpis.save' | translate }}
            </button>
            <button mat-button (click)="cancelEdit()">
              {{ 'operationalKpis.cancel' | translate }}
            </button>
          }
        </mat-card-actions>
      </mat-card>
    }
  `,
    styles: [`
    .operational-kpis-card { margin-bottom: 24px; }
    .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-top: 16px; }
    .kpi-item { display: flex; flex-direction: column; }
    .kpi-label { font-size: 12px; color: rgba(0,0,0,0.6); margin-bottom: 4px; }
    .kpi-value { font-size: 18px; font-weight: 500; }
    .cve-green { color: #4caf50; }
    .cve-orange { color: #ff9800; }
    .cve-red { color: #f44336; }
    .edit-grid { display: flex; flex-direction: column; gap: 16px; margin-top: 16px; }
  `]
})
export class OperationalKpisCardComponent {
    application = input<ApplicationDTO | null>(null);
    canEdit = input<boolean>(false);
    updated = output<void>();

    private applicationService = inject(ApplicationService);

    editing = signal(false);
    editDeploymentDate: Date | null = null;
    editCves: number | null = null;
    editDocUpToDate = false;

    getCveClass(): string {
        const cves = this.application()?.activeCriticalCves;
        if (cves === null || cves === undefined) return '';
        if (cves === 0) return 'cve-green';
        if (cves <= 5) return 'cve-orange';
        return 'cve-red';
    }

    startEdit(): void {
        const app = this.application();
        if (!app) return;
        this.editDeploymentDate = app.lastProductionDeploymentDate ? new Date(app.lastProductionDeploymentDate) : null;
        this.editCves = app.activeCriticalCves;
        this.editDocUpToDate = app.technicalDocUpToDate ?? false;
        this.editing.set(true);
    }

    cancelEdit(): void {
        this.editing.set(false);
    }

    save(): void {
        const app = this.application();
        if (!app) return;
        const dto = {
            name: app.name,
            description: app.description,
            startDate: app.startDate,
            status: app.status,
            projectId: app.projectId,
            repositoryUrls: app.repositoryUrls,
            lastProductionDeploymentDate: this.editDeploymentDate ? this.editDeploymentDate.toISOString().split('T')[0] : null,
            activeCriticalCves: this.editCves,
            technicalDocUpToDate: this.editDocUpToDate
        };
        this.applicationService.updateApplication(app.id, dto as any).subscribe({
            next: () => {
                this.editing.set(false);
                this.updated.emit();
            }
        });
    }
}
