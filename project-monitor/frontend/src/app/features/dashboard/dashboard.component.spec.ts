import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardService } from '../../core/services/dashboard.service';
import { of } from 'rxjs';
import { GlobalDashboardDTO, ReferentWorkloadDTO } from '../../core/models';

describe('DashboardComponent', () => {
    let component: DashboardComponent;
    let fixture: ComponentFixture<DashboardComponent>;
    let dashboardServiceSpy: jasmine.SpyObj<DashboardService>;

    const mockWorkload: ReferentWorkloadDTO[] = [
        { userId: 1, username: 'jdoe', fullName: 'John Doe', applicationCount: 5, projectCount: 2 }
    ];

    const mockDashboard: GlobalDashboardDTO = {
        totalClients: 3,
        totalProjects: 10,
        totalApplications: 25,
        averageIndustrialization: 7,
        averageCodeQuality: 8,
        averageTesting: 6,
        averageDeployment: 7,
        averageObsolescence: 5,
        averageAiAdoption: 4,
        overallAverage: 6.2,
        overallStatus: 'GREEN',
        clientSummaries: [
            {
                clientId: 1,
                clientName: 'Client A',
                averageIndustrialization: 7,
                averageCodeQuality: 8,
                averageTesting: 6,
                averageDeployment: 7,
                averageObsolescence: 5,
                averageAiAdoption: 4,
                overallAverage: 6.2,
                overallStatus: 'GREEN',
                projectCount: 5,
                applicationCount: 12,
                projectSummaries: []
            }
        ],
        docUpToDateRatio: 75,
        totalCriticalCves: 12
    };

    beforeEach(async () => {
        dashboardServiceSpy = jasmine.createSpyObj('DashboardService', ['getGlobalDashboard', 'getClientSummary', 'getReferentWorkload']);
        dashboardServiceSpy.getGlobalDashboard.and.returnValue(of(mockDashboard));
        dashboardServiceSpy.getReferentWorkload.and.returnValue(of(mockWorkload));

        await TestBed.configureTestingModule({
            imports: [DashboardComponent, HttpClientTestingModule, TranslateModule.forRoot(), NoopAnimationsModule],
            providers: [
                { provide: DashboardService, useValue: dashboardServiceSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load dashboard data on init', () => {
        expect(dashboardServiceSpy.getGlobalDashboard).toHaveBeenCalled();
        expect(component.dashboardData()).toEqual(mockDashboard);
    });

    it('should display stats cards', () => {
        const cards = fixture.nativeElement.querySelectorAll('.stat-value');
        expect(cards.length).toBe(6);
    });

    it('should display client table', () => {
        const rows = fixture.nativeElement.querySelectorAll('tr.mat-mdc-row');
        expect(rows.length).toBe(2);
    });

    it('should generate radar data from dashboard', () => {
        const radar = component.radarData();
        expect(radar).toBeTruthy();
        expect(radar!.industrialization).toBe(7);
        expect(radar!.codeQuality).toBe(8);
    });

    it('should load referent workload data', () => {
        expect(dashboardServiceSpy.getReferentWorkload).toHaveBeenCalled();
        expect(component.referentWorkload()).toEqual(mockWorkload);
    });

    it('should display referent workload table', () => {
        const tables = fixture.nativeElement.querySelectorAll('table');
        expect(tables.length).toBeGreaterThanOrEqual(2);
    });
});
