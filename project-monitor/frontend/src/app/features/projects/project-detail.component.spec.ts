import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ProjectDetailComponent } from './project-detail.component';
import { ApplicationService } from '../../core/services/application.service';

describe('ProjectDetailComponent', () => {
    let component: ProjectDetailComponent;
    let fixture: ComponentFixture<ProjectDetailComponent>;
    let applicationServiceSpy: jasmine.SpyObj<ApplicationService>;

    beforeEach(async () => {
        applicationServiceSpy = jasmine.createSpyObj('ApplicationService', ['getApplicationsByProject', 'deleteApplication']);
        applicationServiceSpy.getApplicationsByProject.and.returnValue(of({ content: [], totalElements: 0, totalPages: 0, number: 0, size: 20 }));

        await TestBed.configureTestingModule({
            imports: [ProjectDetailComponent, NoopAnimationsModule, TranslateModule.forRoot()],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                provideRouter([]),
                { provide: ApplicationService, useValue: applicationServiceSpy },
                { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '5' } } } }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ProjectDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load applications on init', () => {
        expect(applicationServiceSpy.getApplicationsByProject).toHaveBeenCalled();
    });

    it('should have correct displayed columns', () => {
        expect(component.displayedColumns).toEqual(['name', 'status', 'actions']);
    });
});
