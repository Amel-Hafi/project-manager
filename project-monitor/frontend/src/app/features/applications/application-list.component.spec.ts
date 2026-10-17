import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ApplicationListComponent } from './application-list.component';
import { ClientService } from '../../core/services/client.service';
import { ProjectService } from '../../core/services/project.service';
import { ApplicationService } from '../../core/services/application.service';
import { AuthService } from '../../core/services/auth.service';

describe('ApplicationListComponent', () => {
    let component: ApplicationListComponent;
    let fixture: ComponentFixture<ApplicationListComponent>;
    let clientServiceSpy: jasmine.SpyObj<ClientService>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;

    beforeEach(async () => {
        clientServiceSpy = jasmine.createSpyObj('ClientService', ['getClients']);
        const projectServiceSpy = jasmine.createSpyObj('ProjectService', ['getProjectsByClient']);
        const applicationServiceSpy = jasmine.createSpyObj('ApplicationService', ['getApplicationsByProject', 'deleteApplication']);
        clientServiceSpy.getClients.and.returnValue(of({ content: [], totalElements: 0, totalPages: 0, number: 0, size: 20 }));
        authServiceSpy = jasmine.createSpyObj('AuthService', ['hasAnyRole']);
        authServiceSpy.hasAnyRole.and.returnValue(true);

        await TestBed.configureTestingModule({
            imports: [ApplicationListComponent, NoopAnimationsModule, TranslateModule.forRoot()],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                provideRouter([]),
                { provide: ClientService, useValue: clientServiceSpy },
                { provide: ProjectService, useValue: projectServiceSpy },
                { provide: ApplicationService, useValue: applicationServiceSpy },
                { provide: AuthService, useValue: authServiceSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ApplicationListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have correct displayed columns', () => {
        expect(component.displayedColumns).toEqual(['name', 'projectName', 'status', 'actions']);
    });

    it('should load data on init', () => {
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
