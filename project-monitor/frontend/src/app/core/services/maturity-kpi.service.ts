import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MaturityKpiDTO, MaturityKpiUpdateDTO, ProjectKpiSummaryDTO } from '../models';

@Injectable({ providedIn: 'root' })
export class MaturityKpiService {
    private http = inject(HttpClient);
    private baseUrl = environment.apiUrl;

    getByApplication(appId: number): Observable<MaturityKpiDTO> {
        return this.http.get<MaturityKpiDTO>(`${this.baseUrl}/applications/${appId}/kpis`);
    }

    updateKpis(appId: number, dto: MaturityKpiUpdateDTO): Observable<MaturityKpiDTO> {
        return this.http.put<MaturityKpiDTO>(`${this.baseUrl}/applications/${appId}/kpis`, dto);
    }

    getProjectSummary(projectId: number): Observable<ProjectKpiSummaryDTO> {
        return this.http.get<ProjectKpiSummaryDTO>(`${this.baseUrl}/projects/${projectId}/kpis/summary`);
    }
}
