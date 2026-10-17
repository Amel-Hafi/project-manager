import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TechnologyService } from './technology.service';
import { environment } from '../../../environments/environment';

describe('TechnologyService', () => {
    let service: TechnologyService;
    let httpMock: HttpTestingController;
    const baseUrl = environment.apiUrl;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()]
        });
        service = TestBed.inject(TechnologyService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => httpMock.verify());

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get categories', () => {
        const mockCategories = [{ id: 1, code: 'LANG', name: 'Languages' }];
        service.getCategories().subscribe(result => {
            expect(result.length).toBe(1);
            expect(result[0].code).toBe('LANG');
        });
        const req = httpMock.expectOne(`${baseUrl}/technology-categories`);
        expect(req.request.method).toBe('GET');
        req.flush(mockCategories);
    });

    it('should get items by category', () => {
        const mockPage = { content: [{ id: 1, name: 'Java' }], totalElements: 1, totalPages: 1, number: 0, size: 20 };
        service.getItemsByCategory('LANG', { page: 0, size: 20 }).subscribe(result => {
            expect(result.content.length).toBe(1);
        });
        const req = httpMock.expectOne(`${baseUrl}/technology-categories/LANG/items?page=0&size=20`);
        expect(req.request.method).toBe('GET');
        req.flush(mockPage);
    });

    it('should create an item', () => {
        const dto = { name: 'Angular', categoryCode: 'FRAMEWORK' };
        service.createItem(dto).subscribe();
        const req = httpMock.expectOne(`${baseUrl}/technology-items`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(dto);
        req.flush({ id: 1, name: 'Angular' });
    });

    it('should update an item', () => {
        const dto = { name: 'Angular Updated', status: 'ACTIVE' };
        service.updateItem(1, dto).subscribe();
        const req = httpMock.expectOne(`${baseUrl}/technology-items/1`);
        expect(req.request.method).toBe('PUT');
        req.flush({});
    });

    it('should delete an item', () => {
        service.deleteItem(1).subscribe();
        const req = httpMock.expectOne(`${baseUrl}/technology-items/1`);
        expect(req.request.method).toBe('DELETE');
        req.flush(null);
    });

    it('should deactivate an item', () => {
        service.deactivateItem(1).subscribe(result => {
            expect(result.status).toBe('DEPRECATED');
        });
        const req = httpMock.expectOne(`${baseUrl}/technology-items/1/deactivate`);
        expect(req.request.method).toBe('PATCH');
        req.flush({ id: 1, name: 'Java', status: 'DEPRECATED' });
    });

    it('should reactivate an item', () => {
        service.reactivateItem(1).subscribe(result => {
            expect(result.status).toBe('ACTIVE');
        });
        const req = httpMock.expectOne(`${baseUrl}/technology-items/1/reactivate`);
        expect(req.request.method).toBe('PATCH');
        req.flush({ id: 1, name: 'Java', status: 'ACTIVE' });
    });

    it('should get active items by category', () => {
        service.getActiveItemsByCategory('LANG').subscribe(result => {
            expect(result.length).toBe(2);
        });
        const req = httpMock.expectOne(`${baseUrl}/technology-categories/LANG/items/active`);
        expect(req.request.method).toBe('GET');
        req.flush([{ id: 1, name: 'Java' }, { id: 2, name: 'Python' }]);
    });
});
