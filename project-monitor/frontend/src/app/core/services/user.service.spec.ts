import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { environment } from '../../../environments/environment';

describe('UserService', () => {
    let service: UserService;
    let httpMock: HttpTestingController;
    const baseUrl = environment.apiUrl;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()]
        });
        service = TestBed.inject(UserService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => httpMock.verify());

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get users with pagination', () => {
        const mockPage = { content: [{ id: 1, username: 'user1' }], totalElements: 1, totalPages: 1, number: 0, size: 20 };
        service.getUsers({ page: 0, size: 20 }).subscribe(result => {
            expect(result.content.length).toBe(1);
        });
        const req = httpMock.expectOne(`${baseUrl}/users?page=0&size=20`);
        expect(req.request.method).toBe('GET');
        req.flush(mockPage);
    });

    it('should create a user', () => {
        const dto = { username: 'newuser', role: 'MANAGER' };
        service.createUser(dto).subscribe();
        const req = httpMock.expectOne(`${baseUrl}/users`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(dto);
        req.flush({ id: 1, username: 'newuser' });
    });

    it('should create an assignment', () => {
        const dto = { userId: 1, projectId: 2, role: 'MANAGER' as const };
        service.createAssignment(dto).subscribe();
        const req = httpMock.expectOne(`${baseUrl}/project-assignments`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(dto);
        req.flush({ id: 1 });
    });

    it('should delete an assignment', () => {
        service.deleteAssignment(1).subscribe();
        const req = httpMock.expectOne(`${baseUrl}/project-assignments/1`);
        expect(req.request.method).toBe('DELETE');
        req.flush(null);
    });
});
