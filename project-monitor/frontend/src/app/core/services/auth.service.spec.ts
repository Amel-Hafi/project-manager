import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { UserDTO } from '../models/user.model';

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;

    const mockUser: UserDTO = {
        id: 1,
        username: 'admin',
        email: 'admin@test.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        active: true,
        createdAt: '2024-01-01'
    };

    beforeEach(() => {
        localStorage.clear();
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
        localStorage.clear();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should login and store token', () => {
        const mockResponse = { token: 'jwt-token', user: mockUser };

        service.login('admin', 'password').subscribe(response => {
            expect(response.token).toBe('jwt-token');
            expect(response.user).toEqual(mockUser);
        });

        const req = httpMock.expectOne('/api/v1/auth/login');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({ username: 'admin', password: 'password' });
        req.flush(mockResponse);

        expect(localStorage.getItem('auth_token')).toBe('jwt-token');
        expect(service.isAuthenticated()).toBe(true);
        expect(service.getCurrentUser()).toEqual(mockUser);
    });

    it('should logout and clear storage', () => {
        localStorage.setItem('auth_token', 'token');
        localStorage.setItem('auth_user', JSON.stringify(mockUser));

        service.logout();

        expect(localStorage.getItem('auth_token')).toBeNull();
        expect(localStorage.getItem('auth_user')).toBeNull();
        expect(service.isAuthenticated()).toBe(false);
        expect(service.getCurrentUser()).toBeNull();
    });

    it('should check role correctly', () => {
        const mockResponse = { token: 'jwt-token', user: mockUser };
        service.login('admin', 'password').subscribe();
        const req = httpMock.expectOne('/api/v1/auth/login');
        req.flush(mockResponse);

        expect(service.hasRole('ADMIN')).toBe(true);
        expect(service.hasRole('MANAGER')).toBe(false);
    });

    it('should check hasAnyRole correctly', () => {
        const mockResponse = { token: 'jwt-token', user: mockUser };
        service.login('admin', 'password').subscribe();
        const req = httpMock.expectOne('/api/v1/auth/login');
        req.flush(mockResponse);

        expect(service.hasAnyRole(['ADMIN', 'DIRECTOR'])).toBe(true);
        expect(service.hasAnyRole(['MANAGER', 'DT_REFERENT'])).toBe(false);
    });
});
