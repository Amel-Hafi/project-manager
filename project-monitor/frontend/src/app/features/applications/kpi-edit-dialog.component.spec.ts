import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { KpiEditDialogComponent, KpiEditDialogData } from './kpi-edit-dialog.component';
import { MaturityKpiService } from '../../core/services/maturity-kpi.service';
import { NotificationService } from '../../core/services/notification.service';
import { MaturityKpiDTO } from '../../core/models';

describe('KpiEditDialogComponent', () => {
    let component: KpiEditDialogComponent;
    let fixture: ComponentFixture<KpiEditDialogComponent>;
    let kpiServiceSpy: jasmine.SpyObj<MaturityKpiService>;
    let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
    let dialogRefSpy: jasmine.SpyObj<MatDialogRef<KpiEditDialogComponent>>;

    const dialogData: KpiEditDialogData = {
        applicationId: 5,
        kpi: {
            id: 1, applicationId: 5, applicationName: 'App',
            industrialization: 7, codeQuality: 8, testing: 6,
            deployment: 5, obsolescence: 4, aiAdoption: 3, updatedAt: '2026-01-01',
            justificationIndustrialization: 'Good',
            justificationCodeQuality: null,
            justificationTesting: null,
            justificationDeployment: null,
            justificationObsolescence: null,
            justificationAiAdoption: null,
            evaluatedAt: '2026-01-01T10:00:00'
        }
    };

    beforeEach(async () => {
        kpiServiceSpy = jasmine.createSpyObj('MaturityKpiService', ['updateKpis']);
        notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['success', 'error']);
        dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

        await TestBed.configureTestingModule({
            imports: [KpiEditDialogComponent, NoopAnimationsModule, TranslateModule.forRoot()],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: MAT_DIALOG_DATA, useValue: dialogData },
                { provide: MatDialogRef, useValue: dialogRefSpy },
                { provide: MaturityKpiService, useValue: kpiServiceSpy },
                { provide: NotificationService, useValue: notificationServiceSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(KpiEditDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize form with existing KPI values', () => {
        expect(component.form.value.industrialization).toBe(7);
        expect(component.form.value.codeQuality).toBe(8);
        expect(component.form.value.testing).toBe(6);
        expect(component.form.value.deployment).toBe(5);
        expect(component.form.value.obsolescence).toBe(4);
        expect(component.form.value.aiAdoption).toBe(3);
    });

    it('should be invalid when value exceeds 10', () => {
        component.form.patchValue({ industrialization: 11 });
        expect(component.form.valid).toBeFalse();
    });

    it('should be invalid when value is less than 1', () => {
        component.form.patchValue({ codeQuality: 0 });
        expect(component.form.valid).toBeFalse();
    });

    it('should be valid with values between 1 and 10', () => {
        component.form.patchValue({
            industrialization: 5, codeQuality: 5, testing: 5,
            deployment: 5, obsolescence: 5, aiAdoption: 5
        });
        expect(component.form.valid).toBeTrue();
    });

    it('should be valid with null values', () => {
        component.form.patchValue({
            industrialization: null, codeQuality: null, testing: null,
            deployment: null, obsolescence: null, aiAdoption: null
        });
        expect(component.form.valid).toBeTrue();
    });

    it('should call updateKpis on submit', () => {
        const mockResponse: MaturityKpiDTO = { ...dialogData.kpi! };
        kpiServiceSpy.updateKpis.and.returnValue(of(mockResponse));

        component.onSubmit();

        expect(kpiServiceSpy.updateKpis).toHaveBeenCalledWith(5, jasmine.objectContaining({
            industrialization: 7,
            codeQuality: 8
        }));
        expect(dialogRefSpy.close).toHaveBeenCalledWith(mockResponse);
        expect(notificationServiceSpy.success).toHaveBeenCalled();
    });

    it('should show error notification on update failure', () => {
        kpiServiceSpy.updateKpis.and.returnValue(throwError(() => new Error('fail')));

        component.onSubmit();

        expect(notificationServiceSpy.error).toHaveBeenCalled();
        expect(dialogRefSpy.close).not.toHaveBeenCalled();
    });
});
