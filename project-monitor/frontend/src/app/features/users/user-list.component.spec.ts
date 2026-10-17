import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { UserListComponent } from './user-list.component';
import { UserService } from '../../core/services/user.service';

describe('UserListComponent', () => {
    let component: UserListComponent;
    let fixture: ComponentFixture<UserListComponent>;
    let userServiceSpy: jasmine.SpyObj<UserService>;

    beforeEach(async () => {
        userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers']);
        userServiceSpy.getUsers.and.returnValue(of({ content: [], totalElements: 0, totalPages: 0, number: 0, size: 20 }));

        await TestBed.configureTestingModule({
            imports: [UserListComponent, NoopAnimationsModule, TranslateModule.forRoot()],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: UserService, useValue: userServiceSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(UserListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load users on init', () => {
        expect(userServiceSpy.getUsers).toHaveBeenCalledWith({ page: 0, size: 20 });
    });

    it('should have correct displayed columns', () => {
        expect(component.displayedColumns).toEqual(['username', 'name', 'email', 'role', 'active', 'actions']);
    });

    it('should update page on page change', () => {
        component.onPageChange({ pageIndex: 2, pageSize: 50, length: 100 });
        expect(component.currentPage()).toBe(2);
        expect(component.pageSize()).toBe(50);
    });
});
