import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { baseUrlInterceptor } from './base-url.interceptor';
import { environment } from '../../../environments/environment';

describe('baseUrlInterceptor', () => {
    let httpMock: HttpTestingController;
    let httpClient: HttpClient;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(withInterceptors([baseUrlInterceptor])),
                provideHttpClientTesting()
            ]
        });
        httpMock = TestBed.inject(HttpTestingController);
        httpClient = TestBed.inject(HttpClient);
    });

    afterEach(() => httpMock.verify());

    it('should not modify absolute URLs', () => {
        httpClient.get('http://example.com/api').subscribe();
        const req = httpMock.expectOne('http://example.com/api');
        expect(req.request.url).toBe('http://example.com/api');
        req.flush({});
    });

    it('should not modify URLs starting with /', () => {
        httpClient.get('/assets/i18n/es.json').subscribe();
        const req = httpMock.expectOne('/assets/i18n/es.json');
        expect(req.request.url).toBe('/assets/i18n/es.json');
        req.flush({});
    });

    it('should prepend base URL to relative URLs', () => {
        httpClient.get('some-endpoint').subscribe();
        const req = httpMock.expectOne(`${environment.apiUrl}/some-endpoint`);
        expect(req.request.url).toBe(`${environment.apiUrl}/some-endpoint`);
        req.flush({});
    });
});
