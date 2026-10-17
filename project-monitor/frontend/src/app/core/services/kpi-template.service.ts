import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { KpiTemplate, KpiTemplateCreate } from '../models/kpi-template.model';
import { KpiDimension } from '../models/decision-rule.model';

@Injectable({ providedIn: 'root' })
export class KpiTemplateService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/kpi-templates`;

    getAll(dimension?: KpiDimension): Observable<KpiTemplate[]> {
        let params = new HttpParams();
        if (dimension) {
            params = params.set('dimension', dimension);
        }
        return this.http.get<KpiTemplate[]>(this.baseUrl, { params });
    }

    getById(id: number): Observable<KpiTemplate> {
        return this.http.get<KpiTemplate>(`${this.baseUrl}/${id}`);
    }

    getActiveByDimension(dimension: KpiDimension): Observable<KpiTemplate> {
        return this.http.get<KpiTemplate>(`${this.baseUrl}/active/${dimension}`);
    }

    create(dto: KpiTemplateCreate): Observable<KpiTemplate> {
        return this.http.post<KpiTemplate>(this.baseUrl, dto);
    }

    update(id: number, dto: KpiTemplateCreate): Observable<KpiTemplate> {
        return this.http.put<KpiTemplate>(`${this.baseUrl}/${id}`, dto);
    }

    activate(id: number): Observable<KpiTemplate> {
        return this.http.patch<KpiTemplate>(`${this.baseUrl}/${id}/activate`, {});
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}
