import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TechnologyItemDialogComponent } from './technology-item-dialog.component';

describe('TechnologyItemDialogComponent', () => {
    let component: TechnologyItemDialogComponent;
    let fixture: ComponentFixture<TechnologyItemDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TechnologyItemDialogComponent, NoopAnimationsModule, TranslateModule.forRoot()],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: MAT_DIALOG_DATA, useValue: { categoryCode: 'LANG' } },
                { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(TechnologyItemDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have an invalid form when name is empty', () => {
        component.form.controls['name'].setValue('');
        expect(component.form.invalid).toBeTrue();
    });

    it('should have a valid form when name is provided', () => {
        component.form.controls['name'].setValue('Java');
        expect(component.form.valid).toBeTrue();
    });
});
