import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RiskDTO, RiskCreateDTO, RiskUpdateDTO } from '../models';

@Injectable({ providedIn: 'root' })
export class RiskService {
    private http = inject(HttpClient);
    private baseUrl = environment.apiUrl;

    getApplicationRisks(applicationId: number): Observable<RiskDTO[]> {
        return this.http.get<RiskDTO[]>(`${this.baseUrl}/applications/${applicationId}/risks`);
    }

    getProjectRisks(projectId: number): Observable<RiskDTO[]> {
        return this.http.get<RiskDTO[]>(`${this.baseUrl}/projects/${projectId}/risks`);
    }

    createRisk(applicationId: number, dto: RiskCreateDTO): Observable<RiskDTO> {
        return this.http.post<RiskDTO>(`${this.baseUrl}/applications/${applicationId}/risks`, dto);
    }

    updateRisk(applicationId: number, riskId: number, dto: RiskUpdateDTO): Observable<RiskDTO> {
        return this.http.put<RiskDTO>(`${this.baseUrl}/applications/${applicationId}/risks/${riskId}`, dto);
    }

    deleteRisk(applicationId: number, riskId: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/applications/${applicationId}/risks/${riskId}`);
    }

    computeRisks(applicationId: number): Observable<RiskDTO[]> {
        return this.http.post<RiskDTO[]>(`${this.baseUrl}/applications/${applicationId}/risks/compute`, {});
    }
}
