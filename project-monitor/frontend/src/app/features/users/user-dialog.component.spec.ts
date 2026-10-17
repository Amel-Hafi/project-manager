import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserDialogComponent } from './user-dialog.component';

describe('UserDialogComponent', () => {
    let component: UserDialogComponent;
    let fixture: ComponentFixture<UserDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UserDialogComponent, NoopAnimationsModule, TranslateModule.forRoot()],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(UserDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have an invalid form when username is empty', () => {
        component.form.controls['username'].setValue('');
        expect(component.form.invalid).toBeTrue();
    });

    it('should have a valid form when username and role are provided', () => {
        component.form.controls['username'].setValue('testuser');
        component.form.controls['role'].setValue('MANAGER');
        expect(component.form.valid).toBeTrue();
    });

    it('should not save when form is invalid', () => {
        component.form.controls['username'].setValue('');
        component.save();
        expect(component.form.invalid).toBeTrue();
    });
});
