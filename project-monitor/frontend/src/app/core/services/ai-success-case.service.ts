import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AiSuccessCaseDTO, AiSuccessCaseCreateDTO, AiSuccessCaseUpdateDTO, AiCaseStatus } from '../models';

@Injectable({ providedIn: 'root' })
export class AiSuccessCaseService {
    private http = inject(HttpClient);
    private baseUrl = environment.apiUrl;

    getByApplication(appId: number): Observable<AiSuccessCaseDTO[]> {
        return this.http.get<AiSuccessCaseDTO[]>(`${this.baseUrl}/applications/${appId}/ai-success-cases`);
    }

    create(appId: number, dto: AiSuccessCaseCreateDTO): Observable<AiSuccessCaseDTO> {
        return this.http.post<AiSuccessCaseDTO>(`${this.baseUrl}/applications/${appId}/ai-success-cases`, dto);
    }

    update(id: number, dto: AiSuccessCaseUpdateDTO): Observable<AiSuccessCaseDTO> {
        return this.http.put<AiSuccessCaseDTO>(`${this.baseUrl}/ai-success-cases/${id}`, dto);
    }

    validate(id: number): Observable<AiSuccessCaseDTO> {
        return this.http.patch<AiSuccessCaseDTO>(`${this.baseUrl}/ai-success-cases/${id}/validate`, {});
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/ai-success-cases/${id}`);
    }

    getAll(status?: AiCaseStatus): Observable<AiSuccessCaseDTO[]> {
        let params: { [key: string]: string } = {};
        if (status) {
            params = { status };
        }
        return this.http.get<AiSuccessCaseDTO[]>(`${this.baseUrl}/ai-success-cases`, { params });
    }
}
