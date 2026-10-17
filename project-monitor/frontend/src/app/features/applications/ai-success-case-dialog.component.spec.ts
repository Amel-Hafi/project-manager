import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { AiSuccessCaseDialogComponent } from './ai-success-case-dialog.component';
import { AiSuccessCaseService, NotificationService } from '../../core/services';

describe('AiSuccessCaseDialogComponent', () => {
    let component: AiSuccessCaseDialogComponent;
    let fixture: ComponentFixture<AiSuccessCaseDialogComponent>;
    let aiCaseServiceSpy: jasmine.SpyObj<AiSuccessCaseService>;
    let dialogRefSpy: jasmine.SpyObj<MatDialogRef<AiSuccessCaseDialogComponent>>;
    let notificationSpy: jasmine.SpyObj<NotificationService>;

    const mockResult = {
        id: 1, applicationId: 10, applicationName: 'App', title: 'T',
        tool: 'Copilot', profile: 'dev', description: null, estimatedImpact: null,
        caseDate: null, status: 'PENDING' as const, createdAt: '', updatedAt: ''
    };

    beforeEach(async () => {
        aiCaseServiceSpy = jasmine.createSpyObj('AiSuccessCaseService', ['create', 'update']);
        dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
        notificationSpy = jasmine.createSpyObj('NotificationService', ['success', 'error']);

        aiCaseServiceSpy.create.and.returnValue(of(mockResult));
        aiCaseServiceSpy.update.and.returnValue(of(mockResult));

        await TestBed.configureTestingModule({
            imports: [
                AiSuccessCaseDialogComponent,
                NoopAnimationsModule,
                TranslateModule.forRoot()
            ],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: { applicationId: 10 } },
                { provide: MatDialogRef, useValue: dialogRefSpy },
                { provide: AiSuccessCaseService, useValue: aiCaseServiceSpy },
                { provide: NotificationService, useValue: notificationSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AiSuccessCaseDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create in create mode', () => {
        expect(component).toBeTruthy();
        expect(component.isEdit).toBeFalse();
    });

    it('should have invalid form when required fields are empty', () => {
        expect(component.form.valid).toBeFalse();
    });

    it('should have valid form when required fields are filled', () => {
        component.form.patchValue({ title: 'Test', tool: 'Copilot', profile: 'dev' });
        expect(component.form.valid).toBeTrue();
    });

    it('should call create on submit in create mode', () => {
        component.form.patchValue({ title: 'Test', tool: 'Copilot', profile: 'dev' });
        component.onSubmit();
        expect(aiCaseServiceSpy.create).toHaveBeenCalledWith(10, jasmine.objectContaining({
            title: 'Test', tool: 'Copilot', profile: 'dev'
        }));
        expect(dialogRefSpy.close).toHaveBeenCalledWith(mockResult);
    });

    it('should call update on submit in edit mode', async () => {
        // Recreate with edit data
        await TestBed.resetTestingModule();
        aiCaseServiceSpy = jasmine.createSpyObj('AiSuccessCaseService', ['create', 'update']);
        dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
        notificationSpy = jasmine.createSpyObj('NotificationService', ['success', 'error']);
        aiCaseServiceSpy.update.and.returnValue(of(mockResult));

        await TestBed.configureTestingModule({
            imports: [AiSuccessCaseDialogComponent, NoopAnimationsModule, TranslateModule.forRoot()],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: { applicationId: 10, caseData: mockResult } },
                { provide: MatDialogRef, useValue: dialogRefSpy },
                { provide: AiSuccessCaseService, useValue: aiCaseServiceSpy },
                { provide: NotificationService, useValue: notificationSpy }
            ]
        }).compileComponents();

        const editFixture = TestBed.createComponent(AiSuccessCaseDialogComponent);
        const editComponent = editFixture.componentInstance;
        editFixture.detectChanges();

        expect(editComponent.isEdit).toBeTrue();
        editComponent.form.patchValue({ title: 'Updated' });
        editComponent.onSubmit();
        expect(aiCaseServiceSpy.update).toHaveBeenCalled();
    });
});
