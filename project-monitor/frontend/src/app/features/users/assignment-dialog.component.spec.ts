import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { AssignmentDialogComponent } from './assignment-dialog.component';
import { ClientService } from '../../core/services/client.service';
import { ProjectService } from '../../core/services/project.service';

describe('AssignmentDialogComponent', () => {
    let component: AssignmentDialogComponent;
    let fixture: ComponentFixture<AssignmentDialogComponent>;

    beforeEach(async () => {
        const clientServiceSpy = jasmine.createSpyObj('ClientService', ['getClients']);
        const projectServiceSpy = jasmine.createSpyObj('ProjectService', ['getProjectsByClient']);
        clientServiceSpy.getClients.and.returnValue(of({ content: [], totalElements: 0, totalPages: 0, number: 0, size: 100 }));

        await TestBed.configureTestingModule({
            imports: [AssignmentDialogComponent, NoopAnimationsModule, TranslateModule.forRoot()],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: ClientService, useValue: clientServiceSpy },
                { provide: ProjectService, useValue: projectServiceSpy },
                { provide: MAT_DIALOG_DATA, useValue: { user: { id: 1, username: 'testuser', assignments: [] } } },
                { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AssignmentDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have an invalid form initially (no project selected)', () => {
        expect(component.form.invalid).toBeTrue();
    });

    it('should have a valid form when project and role are selected', () => {
        component.form.controls['projectId'].setValue(1);
        component.form.controls['role'].setValue('MANAGER');
        expect(component.form.valid).toBeTrue();
    });
});
