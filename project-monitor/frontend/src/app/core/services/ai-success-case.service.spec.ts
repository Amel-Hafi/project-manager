import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AiSuccessCaseService } from './ai-success-case.service';
import { AiSuccessCaseDTO, AiSuccessCaseCreateDTO, AiSuccessCaseUpdateDTO } from '../models';
import { environment } from '../../../environments/environment';

describe('AiSuccessCaseService', () => {
    let service: AiSuccessCaseService;
    let httpMock: HttpTestingController;

    const mockCase: AiSuccessCaseDTO = {
        id: 1,
        applicationId: 10,
        applicationName: 'TestApp',
        title: 'Test Case',
        tool: 'Copilot',
        profile: 'dev',
        description: 'desc',
        estimatedImpact: 'high',
        caseDate: '2025-01-01',
        status: 'PENDING',
        createdAt: '2025-01-01T00:00:00',
        updatedAt: '2025-01-01T00:00:00'
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
        service = TestBed.inject(AiSuccessCaseService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get cases by application', () => {
        service.getByApplication(10).subscribe(cases => {
            expect(cases).toEqual([mockCase]);
        });
        const req = httpMock.expectOne(`${environment.apiUrl}/applications/10/ai-success-cases`);
        expect(req.request.method).toBe('GET');
        req.flush([mockCase]);
    });

    it('should create a case', () => {
        const dto: AiSuccessCaseCreateDTO = { title: 'New', tool: 'Copilot', profile: 'dev' };
        service.create(10, dto).subscribe(result => {
            expect(result).toEqual(mockCase);
        });
        const req = httpMock.expectOne(`${environment.apiUrl}/applications/10/ai-success-cases`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(dto);
        req.flush(mockCase);
    });

    it('should update a case', () => {
        const dto: AiSuccessCaseUpdateDTO = { title: 'Updated' };
        service.update(1, dto).subscribe(result => {
            expect(result).toEqual(mockCase);
        });
        const req = httpMock.expectOne(`${environment.apiUrl}/ai-success-cases/1`);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual(dto);
        req.flush(mockCase);
    });

    it('should validate a case', () => {
        service.validate(1).subscribe(result => {
            expect(result).toEqual(mockCase);
        });
        const req = httpMock.expectOne(`${environment.apiUrl}/ai-success-cases/1/validate`);
        expect(req.request.method).toBe('PATCH');
        req.flush(mockCase);
    });

    it('should delete a case', () => {
        service.delete(1).subscribe();
        const req = httpMock.expectOne(`${environment.apiUrl}/ai-success-cases/1`);
        expect(req.request.method).toBe('DELETE');
        req.flush(null);
    });

    it('should get all cases', () => {
        service.getAll().subscribe(cases => {
            expect(cases).toEqual([mockCase]);
        });
        const req = httpMock.expectOne(`${environment.apiUrl}/ai-success-cases`);
        expect(req.request.method).toBe('GET');
        req.flush([mockCase]);
    });

    it('should get all cases with status filter', () => {
        service.getAll('PENDING').subscribe(cases => {
            expect(cases).toEqual([mockCase]);
        });
        const req = httpMock.expectOne(`${environment.apiUrl}/ai-success-cases?status=PENDING`);
        expect(req.request.method).toBe('GET');
        req.flush([mockCase]);
    });
});
