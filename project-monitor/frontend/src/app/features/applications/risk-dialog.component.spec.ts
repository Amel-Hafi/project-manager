import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { RiskDialogComponent } from './risk-dialog.component';
import { RiskService, NotificationService } from '../../core/services';

describe('RiskDialogComponent', () => {
    let component: RiskDialogComponent;
    let fixture: ComponentFixture<RiskDialogComponent>;
    let riskServiceSpy: jasmine.SpyObj<RiskService>;
    let dialogRefSpy: jasmine.SpyObj<MatDialogRef<RiskDialogComponent>>;

    beforeEach(async () => {
        riskServiceSpy = jasmine.createSpyObj('RiskService', ['createRisk', 'updateRisk']);
        dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
        const notificationSpy = jasmine.createSpyObj('NotificationService', ['success', 'error']);

        await TestBed.configureTestingModule({
            imports: [
                RiskDialogComponent,
                NoopAnimationsModule,
                TranslateModule.forRoot()
            ],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: { applicationId: 10 } },
                { provide: MatDialogRef, useValue: dialogRefSpy },
                { provide: RiskService, useValue: riskServiceSpy },
                { provide: NotificationService, useValue: notificationSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(RiskDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have invalid form when description is empty', () => {
        component.form.patchValue({ type: 'SECURITY', severity: 'HIGH', description: '' });
        expect(component.form.invalid).toBeTruthy();
    });

    it('should have valid form when required fields filled', () => {
        component.form.patchValue({ type: 'SECURITY', severity: 'HIGH', description: 'A risk' });
        expect(component.form.valid).toBeTruthy();
    });

    it('should call createRisk on submit for new risk', () => {
        const mockResult = {
            id: 1, applicationId: 10, applicationName: 'App', type: 'SECURITY' as const,
            source: 'MANUAL' as const, severity: 'HIGH' as const, description: 'A risk',
            actionPlan: null, resolved: false, createdBy: 'admin',
            createdAt: '2025-01-01T00:00:00', updatedAt: '2025-01-01T00:00:00'
        };
        riskServiceSpy.createRisk.and.returnValue(of(mockResult));

        component.form.patchValue({ type: 'SECURITY', severity: 'HIGH', description: 'A risk' });
        component.onSubmit();

        expect(riskServiceSpy.createRisk).toHaveBeenCalledWith(10, {
            type: 'SECURITY',
            severity: 'HIGH',
            description: 'A risk',
            actionPlan: undefined
        });
        expect(dialogRefSpy.close).toHaveBeenCalledWith(mockResult);
    });

    it('should not submit when form is invalid', () => {
        component.form.patchValue({ type: '', severity: '', description: '' });
        component.onSubmit();
        expect(riskServiceSpy.createRisk).not.toHaveBeenCalled();
    });
});
