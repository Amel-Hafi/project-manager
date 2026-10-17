import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ClientListComponent } from './client-list.component';
import { ClientService } from '../../core/services/client.service';
import { AuthService } from '../../core/services/auth.service';

describe('ClientListComponent', () => {
    let component: ClientListComponent;
    let fixture: ComponentFixture<ClientListComponent>;
    let clientServiceSpy: jasmine.SpyObj<ClientService>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;

    beforeEach(async () => {
        clientServiceSpy = jasmine.createSpyObj('ClientService', ['getClients', 'deleteClient']);
        clientServiceSpy.getClients.and.returnValue(of({ content: [], totalElements: 0, totalPages: 0, number: 0, size: 20 }));
        authServiceSpy = jasmine.createSpyObj('AuthService', ['hasAnyRole']);
        authServiceSpy.hasAnyRole.and.returnValue(true);

        await TestBed.configureTestingModule({
            imports: [ClientListComponent, NoopAnimationsModule, TranslateModule.forRoot()],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                provideRouter([]),
                { provide: ClientService, useValue: clientServiceSpy },
                { provide: AuthService, useValue: authServiceSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ClientListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load clients on init', () => {
        expect(clientServiceSpy.getClients).toHaveBeenCalledWith({ page: 0, size: 20 });
    });

    it('should have correct displayed columns', () => {
        expect(component.displayedColumns).toEqual(['name', 'description', 'actions']);
    });

    it('should update page on page change', () => {
        component.onPageChange({ pageIndex: 1, pageSize: 10, length: 50 });
        expect(component.currentPage()).toBe(1);
        expect(component.pageSize()).toBe(10);
    });

    it('should hide action buttons for DIRECTOR role', () => {
        authServiceSpy.hasAnyRole.and.returnValue(false);
        fixture.detectChanges();
        expect(component.hasWriteAccess()).toBeFalse();
    });

    it('should show action buttons for ADMIN role', () => {
        authServiceSpy.hasAnyRole.and.returnValue(true);
        fixture.detectChanges();
        expect(component.hasWriteAccess()).toBeTrue();
    });
});
