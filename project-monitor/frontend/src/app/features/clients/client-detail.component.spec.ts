import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ClientDetailComponent } from './client-detail.component';
import { ProjectService } from '../../core/services/project.service';

describe('ClientDetailComponent', () => {
    let component: ClientDetailComponent;
    let fixture: ComponentFixture<ClientDetailComponent>;
    let projectServiceSpy: jasmine.SpyObj<ProjectService>;

    beforeEach(async () => {
        projectServiceSpy = jasmine.createSpyObj('ProjectService', ['getProjectsByClient', 'deleteProject']);
        projectServiceSpy.getProjectsByClient.and.returnValue(of({ content: [], totalElements: 0, totalPages: 0, number: 0, size: 20 }));

        await TestBed.configureTestingModule({
            imports: [ClientDetailComponent, NoopAnimationsModule, TranslateModule.forRoot()],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                provideRouter([]),
                { provide: ProjectService, useValue: projectServiceSpy },
                { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ClientDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set clientId from route', () => {
        expect(component.clientId).toBe(1);
    });

    it('should load projects on init', () => {
        expect(projectServiceSpy.getProjectsByClient).toHaveBeenCalledWith(1, { page: 0, size: 20 });
    });
});
