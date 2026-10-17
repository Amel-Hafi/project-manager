import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ApplicationDetailComponent } from './application-detail.component';
import { ApplicationService } from '../../core/services/application.service';
import { TechnologyService } from '../../core/services/technology.service';
import { AuthService } from '../../core/services/auth.service';

describe('ApplicationDetailComponent', () => {
    let component: ApplicationDetailComponent;
    let fixture: ComponentFixture<ApplicationDetailComponent>;
    let technologyServiceSpy: jasmine.SpyObj<TechnologyService>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;

    beforeEach(async () => {
        const applicationServiceSpy = jasmine.createSpyObj('ApplicationService', ['updateTechnologies', 'getById']);
        applicationServiceSpy.getById.and.returnValue(of({
            id: 3, name: 'Test App', client: { id: 1, name: 'Client' },
            repositoryUrls: [], technologies: [], createdAt: '', updatedAt: ''
        }));
        technologyServiceSpy = jasmine.createSpyObj('TechnologyService', ['getCategories']);
        technologyServiceSpy.getCategories.and.returnValue(of([]));
        authServiceSpy = jasmine.createSpyObj('AuthService', ['hasAnyRole']);
        authServiceSpy.hasAnyRole.and.returnValue(true);

        await TestBed.configureTestingModule({
            imports: [ApplicationDetailComponent, NoopAnimationsModule, TranslateModule.forRoot()],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                provideRouter([]),
                { provide: ApplicationService, useValue: applicationServiceSpy },
                { provide: TechnologyService, useValue: technologyServiceSpy },
                { provide: AuthService, useValue: authServiceSpy },
                { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '3' } } } }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ApplicationDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set appId from route', () => {
        expect(component.appId).toBe(3);
    });

    it('should load categories on init', () => {
        expect(technologyServiceSpy.getCategories).toHaveBeenCalled();
    });
});
