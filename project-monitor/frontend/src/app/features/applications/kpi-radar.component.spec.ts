import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { KpiRadarComponent } from './kpi-radar.component';
import { MaturityKpiDTO } from '../../core/models';

// Register Chart.js components
import { Chart, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
Chart.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

describe('KpiRadarComponent', () => {
    let component: KpiRadarComponent;
    let fixture: ComponentFixture<KpiRadarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [KpiRadarComponent, TranslateModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(KpiRadarComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should show no-data message when kpi is null', () => {
        fixture.detectChanges();
        const el: HTMLElement = fixture.nativeElement;
        expect(el.querySelector('.no-data')).toBeTruthy();
        expect(el.querySelector('canvas')).toBeFalsy();
    });

    it('should show no-data message when all values are null', () => {
        const kpi: MaturityKpiDTO = {
            id: 1, applicationId: 1, applicationName: 'App',
            industrialization: null, codeQuality: null, testing: null,
            deployment: null, obsolescence: null, aiAdoption: null, updatedAt: null,
            justificationIndustrialization: null, justificationCodeQuality: null,
            justificationTesting: null, justificationDeployment: null,
            justificationObsolescence: null, justificationAiAdoption: null, evaluatedAt: null
        };
        fixture.componentRef.setInput('kpi', kpi);
        fixture.detectChanges();
        const el: HTMLElement = fixture.nativeElement;
        expect(el.querySelector('.no-data')).toBeTruthy();
    });

    it('should render canvas when data is present', () => {
        const kpi: MaturityKpiDTO = {
            id: 1, applicationId: 1, applicationName: 'App',
            industrialization: 7, codeQuality: 8, testing: 6,
            deployment: 5, obsolescence: 4, aiAdoption: 3, updatedAt: '2026-01-01',
            justificationIndustrialization: null, justificationCodeQuality: null,
            justificationTesting: null, justificationDeployment: null,
            justificationObsolescence: null, justificationAiAdoption: null, evaluatedAt: null
        };
        fixture.componentRef.setInput('kpi', kpi);
        fixture.detectChanges();
        const el: HTMLElement = fixture.nativeElement;
        expect(el.querySelector('canvas')).toBeTruthy();
        expect(el.querySelector('.no-data')).toBeFalsy();
    });

    it('should detect hasData correctly with partial values', () => {
        const kpi: MaturityKpiDTO = {
            id: 1, applicationId: 1, applicationName: 'App',
            industrialization: 5, codeQuality: null, testing: null,
            deployment: null, obsolescence: null, aiAdoption: null, updatedAt: null,
            justificationIndustrialization: null, justificationCodeQuality: null,
            justificationTesting: null, justificationDeployment: null,
            justificationObsolescence: null, justificationAiAdoption: null, evaluatedAt: null
        };
        fixture.componentRef.setInput('kpi', kpi);
        fixture.detectChanges();
        expect(component.hasData()).toBeTrue();
    });
});
