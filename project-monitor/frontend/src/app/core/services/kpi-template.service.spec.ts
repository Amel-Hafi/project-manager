import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { KpiTemplateService } from './kpi-template.service';
import { KpiTemplate, KpiTemplateCreate } from '../models/kpi-template.model';

describe('KpiTemplateService', () => {
    let service: KpiTemplateService;
    let httpMock: HttpTestingController;

    const mockTemplate: KpiTemplate = {
        id: 1,
        dimension: 'CODE_QUALITY',
        version: '1.0',
        content: { 1: 'Level 1', 2: 'Level 2', 3: 'Level 3', 4: 'Level 4', 5: 'Level 5', 6: 'Level 6', 7: 'Level 7', 8: 'Level 8', 9: 'Level 9', 10: 'Level 10' },
        active: true,
        createdAt: '2025-01-01T00:00:00',
        updatedAt: '2025-01-01T00:00:00'
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [KpiTemplateService]
        });
        service = TestBed.inject(KpiTemplateService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get all templates', () => {
        service.getAll().subscribe(templates => {
            expect(templates).toEqual([mockTemplate]);
        });
        const req = httpMock.expectOne('/api/v1/kpi-templates');
        expect(req.request.method).toBe('GET');
        req.flush([mockTemplate]);
    });

    it('should get all templates filtered by dimension', () => {
        service.getAll('CODE_QUALITY').subscribe(templates => {
            expect(templates).toEqual([mockTemplate]);
        });
        const req = httpMock.expectOne('/api/v1/kpi-templates?dimension=CODE_QUALITY');
        expect(req.request.method).toBe('GET');
        req.flush([mockTemplate]);
    });

    it('should get template by id', () => {
        service.getById(1).subscribe(template => {
            expect(template).toEqual(mockTemplate);
        });
        const req = httpMock.expectOne('/api/v1/kpi-templates/1');
        expect(req.request.method).toBe('GET');
        req.flush(mockTemplate);
    });

    it('should get active template by dimension', () => {
        service.getActiveByDimension('CODE_QUALITY').subscribe(template => {
            expect(template).toEqual(mockTemplate);
        });
        const req = httpMock.expectOne('/api/v1/kpi-templates/active/CODE_QUALITY');
        expect(req.request.method).toBe('GET');
        req.flush(mockTemplate);
    });

    it('should create a template', () => {
        const dto: KpiTemplateCreate = {
            dimension: 'CODE_QUALITY',
            version: '1.0',
            content: mockTemplate.content,
            active: true
        };
        service.create(dto).subscribe(template => {
            expect(template).toEqual(mockTemplate);
        });
        const req = httpMock.expectOne('/api/v1/kpi-templates');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(dto);
        req.flush(mockTemplate);
    });

    it('should update a template', () => {
        const dto: KpiTemplateCreate = {
            dimension: 'CODE_QUALITY',
            version: '2.0',
            content: mockTemplate.content,
            active: true
        };
        service.update(1, dto).subscribe(template => {
            expect(template).toEqual(mockTemplate);
        });
        const req = httpMock.expectOne('/api/v1/kpi-templates/1');
        expect(req.request.method).toBe('PUT');
        req.flush(mockTemplate);
    });

    it('should activate a template', () => {
        service.activate(1).subscribe(template => {
            expect(template).toEqual(mockTemplate);
        });
        const req = httpMock.expectOne('/api/v1/kpi-templates/1/activate');
        expect(req.request.method).toBe('PATCH');
        req.flush(mockTemplate);
    });

    it('should delete a template', () => {
        service.delete(1).subscribe();
        const req = httpMock.expectOne('/api/v1/kpi-templates/1');
        expect(req.request.method).toBe('DELETE');
        req.flush(null);
    });
});
