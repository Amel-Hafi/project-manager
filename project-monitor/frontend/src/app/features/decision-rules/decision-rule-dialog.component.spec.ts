import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { DecisionRuleDialogComponent } from './decision-rule-dialog.component';

describe('DecisionRuleDialogComponent', () => {
    let component: DecisionRuleDialogComponent;
    let fixture: ComponentFixture<DecisionRuleDialogComponent>;
    let dialogRefSpy: jasmine.SpyObj<MatDialogRef<DecisionRuleDialogComponent>>;

    beforeEach(async () => {
        dialogRefSpy = { close: jasmine.createSpy('close') } as any;

        await TestBed.configureTestingModule({
            imports: [
                DecisionRuleDialogComponent,
                NoopAnimationsModule,
                TranslateModule.forRoot()
            ],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: MatDialogRef, useValue: dialogRefSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(DecisionRuleDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have invalid form when name is empty', () => {
        component.form.patchValue({ name: '' });
        expect(component.form.invalid).toBeTruthy();
    });

    it('should have valid form with required fields', () => {
        component.form.patchValue({
            name: 'Test Rule',
            conditionType: 'VALUE_BELOW_THRESHOLD',
            threshold: 5,
            aggregationLevel: 'APPLICATION',
            trafficLightResult: 'RED'
        });
        expect(component.form.valid).toBeTruthy();
    });

    it('should validate threshold max 10 for VALUE_BELOW_THRESHOLD', () => {
        component.form.patchValue({
            name: 'Test',
            conditionType: 'VALUE_BELOW_THRESHOLD',
            threshold: 15
        });
        expect(component.form.get('threshold')!.hasError('max')).toBeTruthy();
    });

    it('should validate threshold max 100 for PERCENTAGE_BELOW_THRESHOLD', () => {
        component.form.patchValue({
            conditionType: 'PERCENTAGE_BELOW_THRESHOLD',
            threshold: 50
        });
        expect(component.form.get('threshold')!.hasError('max')).toBeFalsy();
    });

    it('should close dialog with form value on save', () => {
        component.form.patchValue({
            name: 'Test Rule',
            conditionType: 'VALUE_BELOW_THRESHOLD',
            threshold: 5,
            aggregationLevel: 'APPLICATION',
            trafficLightResult: 'RED'
        });
        component.save();
        expect(dialogRefSpy.close).toHaveBeenCalledWith(jasmine.objectContaining({ name: 'Test Rule' }));
    });

    it('should not close dialog if form is invalid', () => {
        component.form.patchValue({ name: '' });
        component.save();
        expect(dialogRefSpy.close).not.toHaveBeenCalled();
    });
});
