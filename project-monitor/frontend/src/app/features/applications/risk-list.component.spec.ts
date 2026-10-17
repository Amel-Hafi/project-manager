import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { Component } from '@angular/core';
import { RiskListComponent } from './risk-list.component';
import { RiskService, AuthService } from '../../core/services';
import { RiskDTO } from '../../core/models';

const mockRisks: RiskDTO[] = [
    {
        id: 1, applicationId: 10, applicationName: 'App', type: 'SECURITY',
        source: 'MANUAL', severity: 'HIGH', description: 'Risk 1',
        actionPlan: null, resolved: false, createdBy: 'admin',
        createdAt: '2025-01-01T00:00:00', updatedAt: '2025-01-01T00:00:00'
    },
    {
        id: 2, applicationId: 10, applicationName: 'App', type: 'OPERATIONAL',
        source: 'AUTO', severity: 'MEDIUM', description: 'Risk 2',
        actionPlan: 'Plan', resolved: true, createdBy: 'system',
        createdAt: '2025-01-02T00:00:00', updatedAt: '2025-01-02T00:00:00'
    }
];

@Component({
    standalone: true,
    imports: [RiskListComponent],
    template: `<app-risk-list [applicationId]="appId" />`
})
class TestHostComponent {
    appId = 10;
}

describe('RiskListComponent', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let riskServiceSpy: jasmine.SpyObj<RiskService>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;

    beforeEach(async () => {
        riskServiceSpy = jasmine.createSpyObj('RiskService', ['getApplicationRisks', 'computeRisks', 'updateRisk', 'deleteRisk']);
        authServiceSpy = jasmine.createSpyObj('AuthService', ['hasAnyRole', 'hasRole']);

        riskServiceSpy.getApplicationRisks.and.returnValue(of(mockRisks));
        riskServiceSpy.computeRisks.and.returnValue(of(mockRisks));
        authServiceSpy.hasAnyRole.and.returnValue(false);

        await TestBed.configureTestingModule({
            imports: [
                TestHostComponent,
                HttpClientTestingModule,
                NoopAnimationsModule,
                MatDialogModule,
                TranslateModule.forRoot()
            ],
            providers: [
                { provide: RiskService, useValue: riskServiceSpy },
                { provide: AuthService, useValue: authServiceSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
    });

    it('should create', () => {
        const listEl = fixture.nativeElement.querySelector('app-risk-list');
        expect(listEl).toBeTruthy();
    });

    it('should load risks on init', () => {
        expect(riskServiceSpy.getApplicationRisks).toHaveBeenCalledWith(10);
    });

    it('should display table when risks exist', () => {
        const table = fixture.nativeElement.querySelector('table');
        expect(table).toBeTruthy();
    });

    it('should show empty message when no risks', () => {
        riskServiceSpy.getApplicationRisks.and.returnValue(of([]));
        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
        const noMsg = fixture.nativeElement.querySelector('.no-risks');
        expect(noMsg).toBeTruthy();
    });

    it('should show compute button', () => {
        const buttons = fixture.nativeElement.querySelectorAll('.header-row button');
        expect(buttons.length).toBeGreaterThanOrEqual(1);
    });

    it('should show add button when hasWriteAccess', () => {
        authServiceSpy.hasAnyRole.and.returnValue(true);
        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
        const headerRow = fixture.nativeElement.querySelector('.header-row');
        const buttons = headerRow.querySelectorAll('button');
        expect(buttons.length).toBe(2);
    });

    it('should hide add button when no write access', () => {
        authServiceSpy.hasAnyRole.and.returnValue(false);
        fixture.detectChanges();
        const headerRow = fixture.nativeElement.querySelector('.header-row');
        const buttons = headerRow.querySelectorAll('button');
        expect(buttons.length).toBe(1);
    });
});
