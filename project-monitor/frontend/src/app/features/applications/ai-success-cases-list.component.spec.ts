import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { Component } from '@angular/core';
import { AiSuccessCasesListComponent } from './ai-success-cases-list.component';
import { AiSuccessCaseService, AuthService } from '../../core/services';
import { AiSuccessCaseDTO } from '../../core/models';

const mockCases: AiSuccessCaseDTO[] = [
    {
        id: 1, applicationId: 10, applicationName: 'App', title: 'Case 1',
        tool: 'Copilot', profile: 'dev', description: null, estimatedImpact: null,
        caseDate: '2025-01-01', status: 'PENDING', createdAt: '2025-01-01T00:00:00', updatedAt: '2025-01-01T00:00:00'
    },
    {
        id: 2, applicationId: 10, applicationName: 'App', title: 'Case 2',
        tool: 'ChatGPT', profile: 'ba', description: null, estimatedImpact: null,
        caseDate: null, status: 'VALIDATED', createdAt: '2025-01-02T00:00:00', updatedAt: '2025-01-02T00:00:00'
    }
];

@Component({
    standalone: true,
    imports: [AiSuccessCasesListComponent],
    template: `<app-ai-success-cases-list [applicationId]="appId" />`
})
class TestHostComponent {
    appId = 10;
}

describe('AiSuccessCasesListComponent', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let aiCaseServiceSpy: jasmine.SpyObj<AiSuccessCaseService>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;

    beforeEach(async () => {
        aiCaseServiceSpy = jasmine.createSpyObj('AiSuccessCaseService', ['getByApplication', 'validate', 'delete']);
        authServiceSpy = jasmine.createSpyObj('AuthService', ['hasAnyRole', 'hasRole']);

        aiCaseServiceSpy.getByApplication.and.returnValue(of(mockCases));
        authServiceSpy.hasAnyRole.and.returnValue(false);
        authServiceSpy.hasRole.and.returnValue(false);

        await TestBed.configureTestingModule({
            imports: [
                TestHostComponent,
                HttpClientTestingModule,
                NoopAnimationsModule,
                MatDialogModule,
                TranslateModule.forRoot()
            ],
            providers: [
                { provide: AiSuccessCaseService, useValue: aiCaseServiceSpy },
                { provide: AuthService, useValue: authServiceSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
    });

    it('should create', () => {
        const listEl = fixture.nativeElement.querySelector('app-ai-success-cases-list');
        expect(listEl).toBeTruthy();
    });

    it('should load cases on init', () => {
        expect(aiCaseServiceSpy.getByApplication).toHaveBeenCalledWith(10);
    });

    it('should display table when cases exist', () => {
        const table = fixture.nativeElement.querySelector('table');
        expect(table).toBeTruthy();
    });

    it('should show empty message when no cases', () => {
        aiCaseServiceSpy.getByApplication.and.returnValue(of([]));
        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
        const noMsg = fixture.nativeElement.querySelector('.no-cases');
        expect(noMsg).toBeTruthy();
    });

    it('should hide add button when user has no write access', () => {
        authServiceSpy.hasAnyRole.and.returnValue(false);
        fixture.detectChanges();
        const addBtn = fixture.nativeElement.querySelector('button[color="primary"]');
        // The raised button for add should not appear in header
        const headerRow = fixture.nativeElement.querySelector('.header-row');
        expect(headerRow.querySelector('button')).toBeNull();
    });

    it('should show add button when user has write access', () => {
        authServiceSpy.hasAnyRole.and.callFake((roles: string[]) => {
            return roles.includes('ADMIN');
        });
        authServiceSpy.hasRole.and.callFake((role: string) => role === 'ADMIN');
        fixture.detectChanges();
        const headerRow = fixture.nativeElement.querySelector('.header-row');
        expect(headerRow.querySelector('button')).toBeTruthy();
    });
});
