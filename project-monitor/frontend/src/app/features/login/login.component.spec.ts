import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { LoginComponent } from './login.component';
import { AuthService } from '../../core/services/auth.service';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let authService: jasmine.SpyObj<AuthService>;

    beforeEach(async () => {
        authService = jasmine.createSpyObj('AuthService', ['login']);

        await TestBed.configureTestingModule({
            imports: [
                LoginComponent,
                HttpClientTestingModule,
                NoopAnimationsModule,
                RouterTestingModule,
                TranslateModule.forRoot()
            ],
            providers: [
                { provide: AuthService, useValue: authService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should not call login if fields are empty', () => {
        component.username = '';
        component.password = '';
        component.onSubmit();
        expect(authService.login).not.toHaveBeenCalled();
    });

    it('should call login with credentials', () => {
        const mockResponse = { token: 'token', user: { id: 1, username: 'admin', email: '', firstName: 'A', lastName: 'B', role: 'ADMIN' as const, active: true, createdAt: '' } };
        authService.login.and.returnValue(of(mockResponse));

        component.username = 'admin';
        component.password = 'pass';
        component.onSubmit();

        expect(authService.login).toHaveBeenCalledWith('admin', 'pass');
    });

    it('should set errorMessage on login failure', () => {
        authService.login.and.returnValue(throwError(() => ({ status: 401 })));

        component.username = 'admin';
        component.password = 'wrong';
        component.onSubmit();

        expect(component.errorMessage).toBe('auth.error');
        expect(component.loading).toBe(false);
    });
});
