import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApplicationDTO, ApplicationCreateDTO, ApplicationUpdateDTO } from '../models';
import { Page, PageRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class ApplicationService {
    private http = inject(HttpClient);
    private baseUrl = environment.apiUrl;

    getById(id: number): Observable<ApplicationDTO> {
        return this.http.get<ApplicationDTO>(`${this.baseUrl}/applications/${id}`);
    }

    getApplicationsByProject(projectId: number, pageRequest: PageRequest): Observable<Page<ApplicationDTO>> {
        const params = new HttpParams()
            .set('page', pageRequest.page.toString())
            .set('size', pageRequest.size.toString());
        return this.http.get<Page<ApplicationDTO>>(`${this.baseUrl}/projects/${projectId}/applications`, { params });
    }

    createApplication(dto: ApplicationCreateDTO): Observable<ApplicationDTO> {
        return this.http.post<ApplicationDTO>(`${this.baseUrl}/applications`, dto);
    }

    updateApplication(id: number, dto: ApplicationUpdateDTO): Observable<ApplicationDTO> {
        return this.http.put<ApplicationDTO>(`${this.baseUrl}/applications/${id}`, dto);
    }

    deleteApplication(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/applications/${id}`);
    }

    updateTechnologies(id: number, technologyIds: number[]): Observable<ApplicationDTO> {
        return this.http.put<ApplicationDTO>(`${this.baseUrl}/applications/${id}/technologies`, technologyIds);
    }
}
