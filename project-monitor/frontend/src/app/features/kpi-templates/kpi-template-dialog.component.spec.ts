import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { KpiTemplateDialogComponent } from './kpi-template-dialog.component';
import { KpiTemplate } from '../../core/models';

describe('KpiTemplateDialogComponent', () => {
    let component: KpiTemplateDialogComponent;
    let fixture: ComponentFixture<KpiTemplateDialogComponent>;
    let dialogRefSpy: jasmine.SpyObj<MatDialogRef<KpiTemplateDialogComponent>>;

    const mockTemplate: KpiTemplate = {
        id: 1,
        dimension: 'CODE_QUALITY',
        version: '1.0',
        content: { 1: 'L1', 2: 'L2', 3: 'L3', 4: 'L4', 5: 'L5', 6: 'L6', 7: 'L7', 8: 'L8', 9: 'L9', 10: 'L10' },
        active: true,
        createdAt: '2025-01-01T00:00:00',
        updatedAt: '2025-01-01T00:00:00'
    };

    function createComponent(data: any) {
        dialogRefSpy = { close: jasmine.createSpy('close') } as any;

        TestBed.configureTestingModule({
            imports: [
                KpiTemplateDialogComponent,
                NoopAnimationsModule,
                MatDialogModule,
                TranslateModule.forRoot()
            ],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: data },
                { provide: MatDialogRef, useValue: dialogRefSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(KpiTemplateDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }

    describe('Create mode', () => {
        beforeEach(async () => {
            await createComponent({});
        });

        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should have invalid form when empty', () => {
            expect(component.form.invalid).toBeTruthy();
        });

        it('should require all 10 levels', () => {
            component.form.patchValue({
                dimension: 'CODE_QUALITY',
                version: '1.0'
            });
            // Only dimension and version filled, levels empty
            expect(component.form.invalid).toBeTruthy();

            // Fill all levels
            for (let i = 1; i <= 10; i++) {
                component.form.get(`level_${i}`)!.setValue(`Level ${i} content`);
            }
            expect(component.form.valid).toBeTruthy();
        });

        it('should require version', () => {
            component.form.patchValue({ dimension: 'CODE_QUALITY' });
            for (let i = 1; i <= 10; i++) {
                component.form.get(`level_${i}`)!.setValue(`Level ${i}`);
            }
            expect(component.form.get('version')!.invalid).toBeTruthy();
        });

        it('should require dimension', () => {
            component.form.patchValue({ version: '1.0' });
            for (let i = 1; i <= 10; i++) {
                component.form.get(`level_${i}`)!.setValue(`Level ${i}`);
            }
            expect(component.form.get('dimension')!.invalid).toBeTruthy();
        });

        it('should close dialog with data on save', () => {
            component.form.patchValue({
                dimension: 'TESTING',
                version: '2.0',
                active: true
            });
            for (let i = 1; i <= 10; i++) {
                component.form.get(`level_${i}`)!.setValue(`Content ${i}`);
            }
            component.save();
            expect(dialogRefSpy.close).toHaveBeenCalledWith({
                dimension: 'TESTING',
                version: '2.0',
                content: { 1: 'Content 1', 2: 'Content 2', 3: 'Content 3', 4: 'Content 4', 5: 'Content 5', 6: 'Content 6', 7: 'Content 7', 8: 'Content 8', 9: 'Content 9', 10: 'Content 10' },
                active: true
            });
        });
    });

    describe('Edit mode', () => {
        beforeEach(async () => {
            await createComponent({ template: mockTemplate });
        });

        it('should populate form with template data', () => {
            expect(component.form.get('dimension')!.value).toBe('CODE_QUALITY');
            expect(component.form.get('version')!.value).toBe('1.0');
            expect(component.form.get('active')!.value).toBe(true);
            expect(component.form.get('level_1')!.value).toBe('L1');
            expect(component.form.get('level_10')!.value).toBe('L10');
        });

        it('should have valid form with existing data', () => {
            expect(component.form.valid).toBeTruthy();
        });
    });
});
