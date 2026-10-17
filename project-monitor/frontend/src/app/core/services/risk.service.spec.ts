import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RiskService } from './risk.service';
import { RiskDTO, RiskCreateDTO, RiskUpdateDTO } from '../models';
import { environment } from '../../../environments/environment';

describe('RiskService', () => {
    let service: RiskService;
    let httpMock: HttpTestingController;

    const mockRisk: RiskDTO = {
        id: 1,
        applicationId: 10,
        applicationName: 'TestApp',
        type: 'SECURITY',
        source: 'MANUAL',
        severity: 'HIGH',
        description: 'Test risk',
        actionPlan: null,
        resolved: false,
        createdBy: 'admin',
        createdAt: '2025-01-01T00:00:00',
        updatedAt: '2025-01-01T00:00:00'
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
        service = TestBed.inject(RiskService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get application risks', () => {
        service.getApplicationRisks(10).subscribe(risks => {
            expect(risks).toEqual([mockRisk]);
        });
        const req = httpMock.expectOne(`${environment.apiUrl}/applications/10/risks`);
        expect(req.request.method).toBe('GET');
        req.flush([mockRisk]);
    });

    it('should get project risks', () => {
        service.getProjectRisks(5).subscribe(risks => {
            expect(risks).toEqual([mockRisk]);
        });
        const req = httpMock.expectOne(`${environment.apiUrl}/projects/5/risks`);
        expect(req.request.method).toBe('GET');
        req.flush([mockRisk]);
    });

    it('should create a risk', () => {
        const dto: RiskCreateDTO = { type: 'SECURITY', severity: 'HIGH', description: 'New risk' };
        service.createRisk(10, dto).subscribe(result => {
            expect(result).toEqual(mockRisk);
        });
        const req = httpMock.expectOne(`${environment.apiUrl}/applications/10/risks`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(dto);
        req.flush(mockRisk);
    });

    it('should update a risk', () => {
        const dto: RiskUpdateDTO = { severity: 'MEDIUM', resolved: true };
        service.updateRisk(10, 1, dto).subscribe(result => {
            expect(result).toEqual(mockRisk);
        });
        const req = httpMock.expectOne(`${environment.apiUrl}/applications/10/risks/1`);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual(dto);
        req.flush(mockRisk);
    });

    it('should delete a risk', () => {
        service.deleteRisk(10, 1).subscribe();
        const req = httpMock.expectOne(`${environment.apiUrl}/applications/10/risks/1`);
        expect(req.request.method).toBe('DELETE');
        req.flush(null);
    });

    it('should compute risks', () => {
        service.computeRisks(10).subscribe(risks => {
            expect(risks).toEqual([mockRisk]);
        });
        const req = httpMock.expectOne(`${environment.apiUrl}/applications/10/risks/compute`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({});
        req.flush([mockRisk]);
    });
});
