import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DecisionRuleService } from './decision-rule.service';
import { DecisionRuleDTO, EvaluationResult } from '../models';
import { environment } from '../../../environments/environment';

describe('DecisionRuleService', () => {
    let service: DecisionRuleService;
    let httpMock: HttpTestingController;
    const baseUrl = `${environment.apiUrl}/decision-rules`;

    const mockRule: DecisionRuleDTO = {
        id: 1,
        name: 'Test Rule',
        description: 'A test rule',
        dimension: 'CODE_QUALITY',
        conditionType: 'VALUE_BELOW_THRESHOLD',
        threshold: 5,
        aggregationLevel: 'APPLICATION',
        trafficLightResult: 'RED',
        active: true,
        createdAt: '2025-01-01T00:00:00',
        updatedAt: '2025-01-01T00:00:00'
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
        service = TestBed.inject(DecisionRuleService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get all rules', () => {
        service.getAll().subscribe(rules => {
            expect(rules).toEqual([mockRule]);
        });
        const req = httpMock.expectOne(baseUrl);
        expect(req.request.method).toBe('GET');
        req.flush([mockRule]);
    });

    it('should get rule by id', () => {
        service.getById(1).subscribe(rule => {
            expect(rule).toEqual(mockRule);
        });
        const req = httpMock.expectOne(`${baseUrl}/1`);
        expect(req.request.method).toBe('GET');
        req.flush(mockRule);
    });

    it('should create a rule', () => {
        const newRule = { name: 'New', conditionType: 'VALUE_BELOW_THRESHOLD' as const, threshold: 3, aggregationLevel: 'PROJECT' as const, trafficLightResult: 'YELLOW' as const };
        service.create(newRule).subscribe(rule => {
            expect(rule).toEqual(mockRule);
        });
        const req = httpMock.expectOne(baseUrl);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(newRule);
        req.flush(mockRule);
    });

    it('should update a rule', () => {
        const updates = { name: 'Updated' };
        service.update(1, updates).subscribe(rule => {
            expect(rule).toEqual(mockRule);
        });
        const req = httpMock.expectOne(`${baseUrl}/1`);
        expect(req.request.method).toBe('PUT');
        req.flush(mockRule);
    });

    it('should activate a rule', () => {
        service.activate(1).subscribe(rule => {
            expect(rule).toEqual(mockRule);
        });
        const req = httpMock.expectOne(`${baseUrl}/1/activate`);
        expect(req.request.method).toBe('PATCH');
        req.flush(mockRule);
    });

    it('should deactivate a rule', () => {
        service.deactivate(1).subscribe(rule => {
            expect(rule).toEqual(mockRule);
        });
        const req = httpMock.expectOne(`${baseUrl}/1/deactivate`);
        expect(req.request.method).toBe('PATCH');
        req.flush(mockRule);
    });

    it('should delete a rule', () => {
        service.delete(1).subscribe();
        const req = httpMock.expectOne(`${baseUrl}/1`);
        expect(req.request.method).toBe('DELETE');
        req.flush(null);
    });

    it('should evaluate rules', () => {
        const result: EvaluationResult = { evaluated: 10, risksCreated: 2, risksResolved: 1 };
        service.evaluate().subscribe(res => {
            expect(res).toEqual(result);
        });
        const req = httpMock.expectOne(`${baseUrl}/evaluate`);
        expect(req.request.method).toBe('POST');
        req.flush(result);
    });
});
