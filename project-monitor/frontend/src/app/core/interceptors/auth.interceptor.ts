import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { TranslateService } from '@ngx-translate/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const notificationService = inject(NotificationService);
    const translateService = inject(TranslateService);
    const token = authService.getToken();

    if (token) {
        req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }

    return next(req).pipe(
        catchError(error => {
            if (error.status === 401) {
                authService.logout();
                router.navigate(['/login']);
            } else if (error.status === 403) {
                notificationService.error(translateService.instant('errors.forbidden'));
            }
            return throwError(() => error);
        })
    );
};
