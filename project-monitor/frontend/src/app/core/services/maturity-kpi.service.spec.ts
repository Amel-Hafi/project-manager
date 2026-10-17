import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { MaturityKpiService } from './maturity-kpi.service';
import { MaturityKpiDTO, MaturityKpiUpdateDTO, ProjectKpiSummaryDTO } from '../models';

describe('MaturityKpiService', () => {
    let service: MaturityKpiService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()]
        });
        service = TestBed.inject(MaturityKpiService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get KPIs by application', () => {
        const mockKpi: MaturityKpiDTO = {
            id: 1, applicationId: 5, applicationName: 'App1',
            industrialization: 7, codeQuality: 8, testing: 6,
            deployment: 5, obsolescence: 4, aiAdoption: 3, updatedAt: '2026-01-01',
            justificationIndustrialization: null, justificationCodeQuality: null,
            justificationTesting: null, justificationDeployment: null,
            justificationObsolescence: null, justificationAiAdoption: null, evaluatedAt: null
        };

        service.getByApplication(5).subscribe(kpi => {
            expect(kpi).toEqual(mockKpi);
        });

        const req = httpMock.expectOne('/api/v1/applications/5/kpis');
        expect(req.request.method).toBe('GET');
        req.flush(mockKpi);
    });

    it('should update KPIs', () => {
        const updateDto: MaturityKpiUpdateDTO = {
            industrialization: 8, codeQuality: 9, testing: 7,
            deployment: 6, obsolescence: 5, aiAdoption: 4
        };
        const mockResponse: MaturityKpiDTO = {
            id: 1, applicationId: 5, applicationName: 'App1',
            ...updateDto, updatedAt: '2026-01-02',
            justificationIndustrialization: null, justificationCodeQuality: null,
            justificationTesting: null, justificationDeployment: null,
            justificationObsolescence: null, justificationAiAdoption: null, evaluatedAt: null
        };

        service.updateKpis(5, updateDto).subscribe(result => {
            expect(result).toEqual(mockResponse);
        });

        const req = httpMock.expectOne('/api/v1/applications/5/kpis');
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual(updateDto);
        req.flush(mockResponse);
    });

    it('should get project summary', () => {
        const mockSummary: ProjectKpiSummaryDTO = {
            projectId: 1, projectName: 'Project1',
            averageIndustrialization: 7, averageCodeQuality: 8, averageTesting: 6,
            averageDeployment: 5, averageObsolescence: 4, averageAiAdoption: 3,
            overallAverage: 5.5, overallStatus: 'YELLOW',
            applicationCount: 2, applicationKpis: []
        };

        service.getProjectSummary(1).subscribe(summary => {
            expect(summary).toEqual(mockSummary);
        });

        const req = httpMock.expectOne('/api/v1/projects/1/kpis/summary');
        expect(req.request.method).toBe('GET');
        req.flush(mockSummary);
    });
});
