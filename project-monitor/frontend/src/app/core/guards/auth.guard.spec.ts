import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
    let authService: jasmine.SpyObj<AuthService>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(() => {
        authService = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
        router = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            providers: [
                { provide: AuthService, useValue: authService },
                { provide: Router, useValue: router }
            ]
        });
    });

    it('should allow access when authenticated', () => {
        authService.isAuthenticated.and.returnValue(true);
        const route = {} as ActivatedRouteSnapshot;
        const state = { url: '/referential' } as RouterStateSnapshot;

        const result = TestBed.runInInjectionContext(() => authGuard(route, state));

        expect(result).toBe(true);
    });

    it('should redirect to login when not authenticated', () => {
        authService.isAuthenticated.and.returnValue(false);
        const route = {} as ActivatedRouteSnapshot;
        const state = { url: '/referential' } as RouterStateSnapshot;

        const result = TestBed.runInInjectionContext(() => authGuard(route, state));

        expect(result).toBe(false);
        expect(router.navigate).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: '/referential' } });
    });
});
