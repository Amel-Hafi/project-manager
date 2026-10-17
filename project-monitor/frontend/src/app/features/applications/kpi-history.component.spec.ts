import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { KpiHistoryComponent } from './kpi-history.component';
import { MaturityKpiDTO } from '../../core/models';

describe('KpiHistoryComponent', () => {
    let component: KpiHistoryComponent;
    let fixture: ComponentFixture<KpiHistoryComponent>;

    const fullKpi: MaturityKpiDTO = {
        id: 1,
        applicationId: 10,
        applicationName: 'TestApp',
        industrialization: 8,
        codeQuality: 7,
        testing: 6,
        deployment: 5,
        obsolescence: 4,
        aiAdoption: 3,
        updatedAt: '2026-01-15T10:00:00',
        justificationIndustrialization: 'Good CI/CD pipeline',
        justificationCodeQuality: 'SonarQube gate passed',
        justificationTesting: 'Coverage at 70%',
        justificationDeployment: 'Manual deployment',
        justificationObsolescence: 'Some legacy libs',
        justificationAiAdoption: 'Copilot used',
        evaluatedAt: '2026-01-15T10:00:00'
    };

    const nullKpi: MaturityKpiDTO = {
        id: 2,
        applicationId: 11,
        applicationName: 'NullApp',
        industrialization: null,
        codeQuality: null,
        testing: null,
        deployment: null,
        obsolescence: null,
        aiAdoption: null,
        updatedAt: null,
        justificationIndustrialization: null,
        justificationCodeQuality: null,
        justificationTesting: null,
        justificationDeployment: null,
        justificationObsolescence: null,
        justificationAiAdoption: null,
        evaluatedAt: null
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [KpiHistoryComponent, NoopAnimationsModule, TranslateModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(KpiHistoryComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display 6 dimension rows when kpi is provided', () => {
        component.kpi = fullKpi;
        fixture.detectChanges();
        const rows = fixture.nativeElement.querySelectorAll('tr.mat-mdc-row');
        expect(rows.length).toBe(6);
    });

    it('should populate dimensions with correct values', () => {
        component.kpi = fullKpi;
        fixture.detectChanges();
        expect(component.dimensions[0].value).toBe(8);
        expect(component.dimensions[0].justification).toBe('Good CI/CD pipeline');
    });

    it('should handle null kpi gracefully', () => {
        component.kpi = null;
        fixture.detectChanges();
        expect(component.dimensions.length).toBe(0);
    });

    it('should handle kpi with all null values', () => {
        component.kpi = nullKpi;
        fixture.detectChanges();
        expect(component.dimensions.length).toBe(6);
        expect(component.dimensions[0].value).toBeNull();
        expect(component.dimensions[0].justification).toBeNull();
    });

    it('should have correct displayed columns', () => {
        expect(component.displayedColumns).toEqual(['dimension', 'value', 'justification', 'evaluatedAt']);
    });
});
