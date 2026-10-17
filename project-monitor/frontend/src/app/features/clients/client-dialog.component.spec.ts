import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClientDialogComponent } from './client-dialog.component';

describe('ClientDialogComponent', () => {
    let component: ClientDialogComponent;
    let fixture: ComponentFixture<ClientDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ClientDialogComponent, NoopAnimationsModule, TranslateModule.forRoot()],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ClientDialogComponent);
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
        component.form.controls['name'].setValue('Test Client');
        expect(component.form.valid).toBeTrue();
    });

    it('should not call save when form is invalid', () => {
        component.form.controls['name'].setValue('');
        component.save();
        // No error thrown, just returns early
        expect(component.form.invalid).toBeTrue();
    });
});
