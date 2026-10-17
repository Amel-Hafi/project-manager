import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProjectService } from './project.service';
import { environment } from '../../../environments/environment';

describe('ProjectService', () => {
    let service: ProjectService;
    let httpMock: HttpTestingController;
    const baseUrl = environment.apiUrl;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()]
        });
        service = TestBed.inject(ProjectService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => httpMock.verify());

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get projects by client', () => {
        const mockPage = { content: [], totalElements: 0, totalPages: 0, number: 0, size: 20 };
        service.getProjectsByClient(1, { page: 0, size: 20 }).subscribe(result => {
            expect(result).toEqual(mockPage);
        });
        const req = httpMock.expectOne(`${baseUrl}/clients/1/projects?page=0&size=20`);
        expect(req.request.method).toBe('GET');
        req.flush(mockPage);
    });

    it('should create a project', () => {
        const dto = { name: 'Project1', clientId: 1 };
        service.createProject(dto).subscribe(result => {
            expect(result.name).toBe('Project1');
        });
        const req = httpMock.expectOne(`${baseUrl}/projects`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(dto);
        req.flush({ id: 1, name: 'Project1', clientId: 1 });
    });

    it('should update a project', () => {
        const dto = { name: 'Updated', clientId: 1 };
        service.updateProject(1, dto).subscribe();
        const req = httpMock.expectOne(`${baseUrl}/projects/1`);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual(dto);
        req.flush({});
    });

    it('should delete a project', () => {
        service.deleteProject(1).subscribe();
        const req = httpMock.expectOne(`${baseUrl}/projects/1`);
        expect(req.request.method).toBe('DELETE');
        req.flush(null);
    });
});
