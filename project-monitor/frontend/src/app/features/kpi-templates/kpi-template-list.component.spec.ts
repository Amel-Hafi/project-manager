import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { KpiTemplateListComponent } from './kpi-template-list.component';
import { KpiTemplateService } from '../../core/services/kpi-template.service';
import { AuthService } from '../../core/services/auth.service';
import { KpiTemplate } from '../../core/models';

describe('KpiTemplateListComponent', () => {
    let component: KpiTemplateListComponent;
    let fixture: ComponentFixture<KpiTemplateListComponent>;
    let templateServiceSpy: jasmine.SpyObj<KpiTemplateService>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;

    const mockTemplates: KpiTemplate[] = [
        {
            id: 1,
            dimension: 'CODE_QUALITY',
            version: '1.0',
            content: { 1: 'L1', 2: 'L2', 3: 'L3', 4: 'L4', 5: 'L5', 6: 'L6', 7: 'L7', 8: 'L8', 9: 'L9', 10: 'L10' },
            active: true,
            createdAt: '2025-01-01T00:00:00',
            updatedAt: '2025-01-01T00:00:00'
        },
        {
            id: 2,
            dimension: 'TESTING',
            version: '1.0',
            content: { 1: 'L1', 2: 'L2', 3: 'L3', 4: 'L4', 5: 'L5', 6: 'L6', 7: 'L7', 8: 'L8', 9: 'L9', 10: 'L10' },
            active: false,
            createdAt: '2025-01-01T00:00:00',
            updatedAt: '2025-01-01T00:00:00'
        }
    ];

    function createComponent(isAdmin: boolean) {
        const serviceSpy = {
            getAll: jasmine.createSpy('getAll').and.returnValue(of(mockTemplates)),
            create: jasmine.createSpy('create').and.returnValue(of(mockTemplates[0])),
            update: jasmine.createSpy('update').and.returnValue(of(mockTemplates[0])),
            activate: jasmine.createSpy('activate').and.returnValue(of(mockTemplates[0])),
            delete: jasmine.createSpy('delete').and.returnValue(of(void 0))
        };

        const authSpy = {
            hasRole: jasmine.createSpy('hasRole').and.callFake((role: string) => isAdmin && role === 'ADMIN'),
            isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValue(true),
            getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue({ firstName: 'Test', lastName: 'User', role: isAdmin ? 'ADMIN' : 'USER' }),
            hasAnyRole: jasmine.createSpy('hasAnyRole').and.returnValue(isAdmin)
        };

        TestBed.configureTestingModule({
            imports: [
                KpiTemplateListComponent,
                HttpClientTestingModule,
                NoopAnimationsModule,
                MatDialogModule,
                MatSnackBarModule,
                TranslateModule.forRoot()
            ],
            providers: [
                { provide: KpiTemplateService, useValue: serviceSpy },
                { provide: AuthService, useValue: authSpy }
            ]
        }).compileComponents();

        templateServiceSpy = TestBed.inject(KpiTemplateService) as jasmine.SpyObj<KpiTemplateService>;
        authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        fixture = TestBed.createComponent(KpiTemplateListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }

    describe('Admin user', () => {
        beforeEach(async () => {
            await createComponent(true);
        });

        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should load templates on init', () => {
            expect(templateServiceSpy.getAll).toHaveBeenCalled();
            expect(component.templates()).toEqual(mockTemplates);
        });

        it('should render table', () => {
            const table = fixture.nativeElement.querySelector('table');
            expect(table).toBeTruthy();
        });

        it('should display actions column for admin', () => {
            expect(component.displayedColumns()).toContain('actions');
        });

        it('should have create button', () => {
            const buttons = fixture.nativeElement.querySelectorAll('button');
            const createBtn = Array.from(buttons).find((b: any) => b.textContent.includes('add'));
            expect(createBtn).toBeTruthy();
        });
    });

    describe('Non-admin user', () => {
        beforeEach(async () => {
            await createComponent(false);
        });

        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should not display actions column', () => {
            expect(component.displayedColumns()).not.toContain('actions');
        });

        it('should not have create button', () => {
            const buttons = fixture.nativeElement.querySelectorAll('button[color="primary"]');
            const createBtn = Array.from(buttons).find((b: any) => b.textContent.includes('add'));
            expect(createBtn).toBeFalsy();
        });
    });
});
