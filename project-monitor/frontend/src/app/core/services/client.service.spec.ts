import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ClientService } from './client.service';
import { environment } from '../../../environments/environment';

describe('ClientService', () => {
    let service: ClientService;
    let httpMock: HttpTestingController;
    const baseUrl = environment.apiUrl;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()]
        });
        service = TestBed.inject(ClientService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => httpMock.verify());

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get clients with pagination', () => {
        const mockPage = { content: [{ id: 1, name: 'Client1' }], totalElements: 1, totalPages: 1, number: 0, size: 20 };
        service.getClients({ page: 0, size: 20 }).subscribe(result => {
            expect(result.content.length).toBe(1);
        });
        const req = httpMock.expectOne(`${baseUrl}/clients?page=0&size=20`);
        expect(req.request.method).toBe('GET');
        req.flush(mockPage);
    });

    it('should create a client', () => {
        const dto = { name: 'NewClient' };
        service.createClient(dto).subscribe(result => {
            expect(result.name).toBe('NewClient');
        });
        const req = httpMock.expectOne(`${baseUrl}/clients`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(dto);
        req.flush({ id: 1, name: 'NewClient' });
    });

    it('should update a client', () => {
        const dto = { name: 'Updated' };
        service.updateClient(1, dto).subscribe();
        const req = httpMock.expectOne(`${baseUrl}/clients/1`);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual(dto);
        req.flush({});
    });

    it('should delete a client', () => {
        service.deleteClient(1).subscribe();
        const req = httpMock.expectOne(`${baseUrl}/clients/1`);
        expect(req.request.method).toBe('DELETE');
        req.flush(null);
    });
});
