import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OperationalKpisCardComponent } from './operational-kpis-card.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ApplicationService } from '../../core/services';
import { ApplicationDTO } from '../../core/models';
import { Component, signal } from '@angular/core';

@Component({
    standalone: true,
    imports: [OperationalKpisCardComponent],
    template: `<app-operational-kpis-card [application]="app()" [canEdit]="canEdit()" />`
})
class TestHostComponent {
    app = signal<ApplicationDTO | null>(null);
    canEdit = signal(false);
}

describe('OperationalKpisCardComponent', () => {
    let hostComponent: TestHostComponent;
    let fixture: ComponentFixture<TestHostComponent>;

    const mockApp: ApplicationDTO = {
        id: 1,
        name: 'Test App',
        description: 'desc',
        startDate: '2024-01-01',
        status: 'ACTIVE',
        projectId: 1,
        projectName: 'Project A',
        repositoryUrls: [],
        technologies: [],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        lastProductionDeploymentDate: '2024-06-15',
        activeCriticalCves: 3,
        technicalDocUpToDate: true
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent, HttpClientTestingModule, TranslateModule.forRoot(), NoopAnimationsModule],
            providers: [
                { provide: ApplicationService, useValue: jasmine.createSpyObj('ApplicationService', ['updateApplication']) }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        hostComponent = fixture.componentInstance;
    });

    it('should create', () => {
        hostComponent.app.set(mockApp);
        fixture.detectChanges();
        const card = fixture.nativeElement.querySelector('mat-card');
        expect(card).toBeTruthy();
    });

    it('should display last deployment date', () => {
        hostComponent.app.set(mockApp);
        fixture.detectChanges();
        const text = fixture.nativeElement.textContent;
        expect(text).toContain('2024-06-15');
    });

    it('should display CVE count with correct color class', () => {
        hostComponent.app.set(mockApp);
        fixture.detectChanges();
        const cveEl = fixture.nativeElement.querySelector('.cve-orange');
        expect(cveEl).toBeTruthy();
        expect(cveEl.textContent.trim()).toContain('3');
    });

    it('should show edit button when canEdit=true', () => {
        hostComponent.app.set(mockApp);
        hostComponent.canEdit.set(true);
        fixture.detectChanges();
        const buttons = fixture.nativeElement.querySelectorAll('button');
        const editButton = Array.from(buttons).find((b: any) => b.textContent.includes('edit'));
        expect(editButton).toBeTruthy();
    });

    it('should hide edit button when canEdit=false', () => {
        hostComponent.app.set(mockApp);
        hostComponent.canEdit.set(false);
        fixture.detectChanges();
        const buttons = fixture.nativeElement.querySelectorAll('button');
        const editButton = Array.from(buttons).find((b: any) => b.textContent.includes('operationalKpis.edit'));
        expect(editButton).toBeFalsy();
    });
});
