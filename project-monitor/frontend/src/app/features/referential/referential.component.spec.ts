import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ReferentialComponent } from './referential.component';
import { TechnologyService } from '../../core/services/technology.service';
import { AuthService } from '../../core/services/auth.service';

describe('ReferentialComponent', () => {
    let component: ReferentialComponent;
    let fixture: ComponentFixture<ReferentialComponent>;
    let technologyServiceSpy: jasmine.SpyObj<TechnologyService>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;

    beforeEach(async () => {
        technologyServiceSpy = jasmine.createSpyObj('TechnologyService', [
            'getCategories', 'getItemsByCategory', 'deleteItem', 'deactivateItem', 'reactivateItem'
        ]);
        technologyServiceSpy.getCategories.and.returnValue(of([{ id: 1, code: 'LANG', name: 'Languages', description: 'Programming languages' }]));

        authServiceSpy = jasmine.createSpyObj('AuthService', ['hasRole']);
        authServiceSpy.hasRole.and.returnValue(true);

        await TestBed.configureTestingModule({
            imports: [ReferentialComponent, NoopAnimationsModule, TranslateModule.forRoot()],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: TechnologyService, useValue: technologyServiceSpy },
                { provide: AuthService, useValue: authServiceSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ReferentialComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load categories on init', () => {
        expect(technologyServiceSpy.getCategories).toHaveBeenCalled();
        expect(component.categories().length).toBe(1);
    });

    it('should have correct displayed columns', () => {
        expect(component.displayedColumns).toEqual(['name', 'version', 'status', 'actions']);
    });

    it('should have no selected category initially', () => {
        expect(component.selectedCategory()).toBeNull();
    });

    it('should return true for isAdmin when user has ADMIN role', () => {
        authServiceSpy.hasRole.and.returnValue(true);
        expect(component.isAdmin()).toBe(true);
        expect(authServiceSpy.hasRole).toHaveBeenCalledWith('ADMIN');
    });

    it('should return false for isAdmin when user does not have ADMIN role', () => {
        authServiceSpy.hasRole.and.returnValue(false);
        expect(component.isAdmin()).toBe(false);
    });
});
