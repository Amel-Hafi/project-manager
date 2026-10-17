import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProjectDTO, ProjectCreateDTO, ProjectUpdateDTO } from '../models';
import { Page, PageRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class ProjectService {
    private http = inject(HttpClient);
    private baseUrl = environment.apiUrl;

    getProjectsByClient(clientId: number, pageRequest: PageRequest): Observable<Page<ProjectDTO>> {
        const params = new HttpParams()
            .set('page', pageRequest.page.toString())
            .set('size', pageRequest.size.toString());
        return this.http.get<Page<ProjectDTO>>(`${this.baseUrl}/clients/${clientId}/projects`, { params });
    }

    createProject(dto: ProjectCreateDTO): Observable<ProjectDTO> {
        return this.http.post<ProjectDTO>(`${this.baseUrl}/projects`, dto);
    }

    updateProject(id: number, dto: ProjectUpdateDTO): Observable<ProjectDTO> {
        return this.http.put<ProjectDTO>(`${this.baseUrl}/projects/${id}`, dto);
    }

    deleteProject(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/projects/${id}`);
    }
}
