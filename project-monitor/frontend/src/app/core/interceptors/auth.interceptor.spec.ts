import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

describe('authInterceptor', () => {
    let httpClient: HttpClient;
    let httpMock: HttpTestingController;
    let authService: jasmine.SpyObj<AuthService>;
    let notificationService: jasmine.SpyObj<NotificationService>;
    let translateService: jasmine.SpyObj<TranslateService>;
    let router: Router;

    beforeEach(() => {
        const authSpy = jasmine.createSpyObj('AuthService', ['getToken', 'logout']);
        const notifSpy = jasmine.createSpyObj('NotificationService', ['error']);
        const translateSpy = jasmine.createSpyObj('TranslateService', ['instant']);

        TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            providers: [
                provideHttpClient(withInterceptors([authInterceptor])),
                provideHttpClientTesting(),
                provideRouter([{ path: 'login', component: class { } as any }]),
                { provide: AuthService, useValue: authSpy },
                { provide: NotificationService, useValue: notifSpy },
                { provide: TranslateService, useValue: translateSpy }
            ]
        });

        httpClient = TestBed.inject(HttpClient);
        httpMock = TestBed.inject(HttpTestingController);
        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
        translateService = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
        router = TestBed.inject(Router);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should add Authorization header when token exists', () => {
        authService.getToken.and.returnValue('test-token');

        httpClient.get('/api/test').subscribe();

        const req = httpMock.expectOne('/api/test');
        expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
        req.flush({});
    });

    it('should not add Authorization header when no token', () => {
        authService.getToken.and.returnValue(null);

        httpClient.get('/api/test').subscribe();

        const req = httpMock.expectOne('/api/test');
        expect(req.request.headers.has('Authorization')).toBeFalse();
        req.flush({});
    });

    it('should call logout and navigate to login on 401', () => {
        authService.getToken.and.returnValue('token');
        spyOn(router, 'navigate');

        httpClient.get('/api/test').subscribe({
            error: () => { }
        });

        const req = httpMock.expectOne('/api/test');
        req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

        expect(authService.logout).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should show notification on 403 without redirect', () => {
        authService.getToken.and.returnValue('token');
        translateService.instant.and.returnValue('No tienes acceso a este recurso');
        spyOn(router, 'navigate');

        httpClient.get('/api/test').subscribe({
            error: () => { }
        });

        const req = httpMock.expectOne('/api/test');
        req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });

        expect(translateService.instant).toHaveBeenCalledWith('errors.forbidden');
        expect(notificationService.error).toHaveBeenCalledWith('No tienes acceso a este recurso');
        expect(authService.logout).not.toHaveBeenCalled();
        expect(router.navigate).not.toHaveBeenCalled();
    });
});
