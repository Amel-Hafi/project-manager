import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DashboardService } from './dashboard.service';
import { ClientKpiSummaryDTO, GlobalDashboardDTO, ReferentWorkloadDTO } from '../models';

describe('DashboardService', () => {
    let service: DashboardService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
        service = TestBed.inject(DashboardService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get client summary', () => {
        const mockResponse: ClientKpiSummaryDTO = {
            clientId: 1,
            clientName: 'Test Client',
            averageIndustrialization: 7,
            averageCodeQuality: 8,
            averageTesting: 6,
            averageDeployment: 7,
            averageObsolescence: 5,
            averageAiAdoption: 4,
            overallAverage: 6.2,
            overallStatus: 'GREEN',
            projectCount: 3,
            applicationCount: 10,
            projectSummaries: []
        };

        service.getClientSummary(1).subscribe(result => {
            expect(result).toEqual(mockResponse);
        });

        const req = httpMock.expectOne('/api/v1/dashboard/clients/1');
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should get global dashboard', () => {
        const mockResponse: GlobalDashboardDTO = {
            totalClients: 5,
            totalProjects: 15,
            totalApplications: 50,
            averageIndustrialization: 6,
            averageCodeQuality: 7,
            averageTesting: 5,
            averageDeployment: 6,
            averageObsolescence: 4,
            averageAiAdoption: 3,
            overallAverage: 5.2,
            overallStatus: 'YELLOW',
            clientSummaries: [],
            docUpToDateRatio: null,
            totalCriticalCves: null
        };

        service.getGlobalDashboard().subscribe(result => {
            expect(result).toEqual(mockResponse);
        });

        const req = httpMock.expectOne('/api/v1/dashboard/global');
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should get referent workload', () => {
        const mockResponse: ReferentWorkloadDTO[] = [
            { userId: 1, username: 'jdoe', fullName: 'John Doe', applicationCount: 5, projectCount: 2 }
        ];

        service.getReferentWorkload().subscribe(result => {
            expect(result).toEqual(mockResponse);
        });

        const req = httpMock.expectOne('/api/v1/dashboard/referent-workload');
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });
});
