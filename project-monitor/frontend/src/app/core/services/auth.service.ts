import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserDTO } from '../models/user.model';
import { AuthResponse } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly TOKEN_KEY = 'auth_token';
    private readonly USER_KEY = 'auth_user';
    private currentUserSubject = new BehaviorSubject<UserDTO | null>(this.getStoredUser());
    currentUser$ = this.currentUserSubject.asObservable();

    private http = inject(HttpClient);

    login(username: string, password: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>('/api/v1/auth/login', { username, password }).pipe(
            tap(response => {
                localStorage.setItem(this.TOKEN_KEY, response.token);
                localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
                this.currentUserSubject.next(response.user);
            })
        );
    }

    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        this.currentUserSubject.next(null);
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    getCurrentUser(): UserDTO | null {
        return this.currentUserSubject.value;
    }

    hasRole(role: string): boolean {
        return this.getCurrentUser()?.role === role;
    }

    hasAnyRole(roles: string[]): boolean {
        return roles.includes(this.getCurrentUser()?.role || '');
    }

    private getStoredUser(): UserDTO | null {
        const stored = localStorage.getItem(this.USER_KEY);
        return stored ? JSON.parse(stored) : null;
    }
}
