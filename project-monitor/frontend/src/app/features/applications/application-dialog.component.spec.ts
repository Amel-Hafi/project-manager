import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApplicationDialogComponent } from './application-dialog.component';

describe('ApplicationDialogComponent', () => {
    let component: ApplicationDialogComponent;
    let fixture: ComponentFixture<ApplicationDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ApplicationDialogComponent, NoopAnimationsModule, TranslateModule.forRoot()],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: MAT_DIALOG_DATA, useValue: { projectId: 1, projects: [] } },
                { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ApplicationDialogComponent);
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

    it('should have a valid form when required fields are filled', () => {
        component.form.controls['name'].setValue('Test App');
        component.form.controls['projectId'].setValue(1);
        expect(component.form.valid).toBeTrue();
    });
});
