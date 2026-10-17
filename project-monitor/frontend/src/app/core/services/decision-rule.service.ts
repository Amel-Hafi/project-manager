import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DecisionRuleDTO, EvaluationResult } from '../models';

@Injectable({ providedIn: 'root' })
export class DecisionRuleService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/decision-rules`;

    getAll(): Observable<DecisionRuleDTO[]> {
        return this.http.get<DecisionRuleDTO[]>(this.baseUrl);
    }

    getById(id: number): Observable<DecisionRuleDTO> {
        return this.http.get<DecisionRuleDTO>(`${this.baseUrl}/${id}`);
    }

    create(rule: Partial<DecisionRuleDTO>): Observable<DecisionRuleDTO> {
        return this.http.post<DecisionRuleDTO>(this.baseUrl, rule);
    }

    update(id: number, rule: Partial<DecisionRuleDTO>): Observable<DecisionRuleDTO> {
        return this.http.put<DecisionRuleDTO>(`${this.baseUrl}/${id}`, rule);
    }

    activate(id: number): Observable<DecisionRuleDTO> {
        return this.http.patch<DecisionRuleDTO>(`${this.baseUrl}/${id}/activate`, {});
    }

    deactivate(id: number): Observable<DecisionRuleDTO> {
        return this.http.patch<DecisionRuleDTO>(`${this.baseUrl}/${id}/deactivate`, {});
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }

    evaluate(): Observable<EvaluationResult> {
        return this.http.post<EvaluationResult>(`${this.baseUrl}/evaluate`, {});
    }
}
