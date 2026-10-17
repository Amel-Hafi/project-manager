import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ProjectListComponent } from './project-list.component';
import { ClientService } from '../../core/services/client.service';
import { ProjectService } from '../../core/services/project.service';
import { AuthService } from '../../core/services/auth.service';

describe('ProjectListComponent', () => {
    let component: ProjectListComponent;
    let fixture: ComponentFixture<ProjectListComponent>;
    let clientServiceSpy: jasmine.SpyObj<ClientService>;
    let projectServiceSpy: jasmine.SpyObj<ProjectService>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;

    beforeEach(async () => {
        clientServiceSpy = jasmine.createSpyObj('ClientService', ['getClients']);
        projectServiceSpy = jasmine.createSpyObj('ProjectService', ['getProjectsByClient', 'deleteProject']);
        clientServiceSpy.getClients.and.returnValue(of({ content: [], totalElements: 0, totalPages: 0, number: 0, size: 20 }));
        authServiceSpy = jasmine.createSpyObj('AuthService', ['hasAnyRole']);
        authServiceSpy.hasAnyRole.and.returnValue(true);

        await TestBed.configureTestingModule({
            imports: [ProjectListComponent, NoopAnimationsModule, TranslateModule.forRoot()],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                provideRouter([]),
                { provide: ClientService, useValue: clientServiceSpy },
                { provide: ProjectService, useValue: projectServiceSpy },
                { provide: AuthService, useValue: authServiceSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ProjectListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have correct displayed columns', () => {
        expect(component.displayedColumns).toEqual(['name', 'clientName', 'actions']);
    });

    it('should load clients on init', () => {
        expect(clientServiceSpy.getClients).toHaveBeenCalled();
    });

    it('should hide action buttons for DIRECTOR role', () => {
        authServiceSpy.hasAnyRole.and.returnValue(false);
        fixture.detectChanges();
        expect(component.hasWriteAccess()).toBeFalse();
    });

    it('should show action buttons for ADMIN role', () => {
        authServiceSpy.hasAnyRole.and.returnValue(true);
        fixture.detectChanges();
        expect(component.hasWriteAccess()).toBeTrue();
    });
});
