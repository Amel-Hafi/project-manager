import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ApplicationService } from './application.service';
import { environment } from '../../../environments/environment';

describe('ApplicationService', () => {
    let service: ApplicationService;
    let httpMock: HttpTestingController;
    const baseUrl = environment.apiUrl;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()]
        });
        service = TestBed.inject(ApplicationService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => httpMock.verify());

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get applications by project', () => {
        const mockPage = { content: [], totalElements: 0, totalPages: 0, number: 0, size: 20 };
        service.getApplicationsByProject(1, { page: 0, size: 20 }).subscribe(result => {
            expect(result).toEqual(mockPage);
        });
        const req = httpMock.expectOne(`${baseUrl}/projects/1/applications?page=0&size=20`);
        expect(req.request.method).toBe('GET');
        req.flush(mockPage);
    });

    it('should create an application', () => {
        const dto = { name: 'App1', projectId: 1 };
        const mockResponse = { id: 1, name: 'App1', projectId: 1 };
        service.createApplication(dto).subscribe(result => {
            expect(result.name).toBe('App1');
        });
        const req = httpMock.expectOne(`${baseUrl}/applications`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(dto);
        req.flush(mockResponse);
    });

    it('should update an application', () => {
        const dto = { name: 'Updated', projectId: 1 };
        service.updateApplication(1, dto).subscribe();
        const req = httpMock.expectOne(`${baseUrl}/applications/1`);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual(dto);
        req.flush({});
    });

    it('should delete an application', () => {
        service.deleteApplication(1).subscribe();
        const req = httpMock.expectOne(`${baseUrl}/applications/1`);
        expect(req.request.method).toBe('DELETE');
        req.flush(null);
    });

    it('should update technologies', () => {
        const techIds = [1, 2, 3];
        service.updateTechnologies(5, techIds).subscribe();
        const req = httpMock.expectOne(`${baseUrl}/applications/5/technologies`);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual(techIds);
        req.flush({});
    });
});
