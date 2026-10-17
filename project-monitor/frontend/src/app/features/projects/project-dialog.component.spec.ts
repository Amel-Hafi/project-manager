import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProjectDialogComponent } from './project-dialog.component';

describe('ProjectDialogComponent', () => {
    let component: ProjectDialogComponent;
    let fixture: ComponentFixture<ProjectDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProjectDialogComponent, NoopAnimationsModule, TranslateModule.forRoot()],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: MAT_DIALOG_DATA, useValue: { clientId: 1 } },
                { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ProjectDialogComponent);
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

    it('should have a valid form when name and clientId are provided', () => {
        component.form.controls['name'].setValue('Test Project');
        component.form.controls['clientId'].setValue(1);
        expect(component.form.valid).toBeTrue();
    });
});
