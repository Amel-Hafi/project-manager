import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserDTO, UserCreateDTO, ProjectAssignmentDTO, ProjectAssignmentCreateDTO } from '../models';
import { Page, PageRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class UserService {
    private http = inject(HttpClient);
    private baseUrl = environment.apiUrl;

    getUsers(pageRequest: PageRequest): Observable<Page<UserDTO>> {
        const params = new HttpParams()
            .set('page', pageRequest.page.toString())
            .set('size', pageRequest.size.toString());
        return this.http.get<Page<UserDTO>>(`${this.baseUrl}/users`, { params });
    }

    createUser(dto: UserCreateDTO): Observable<UserDTO> {
        return this.http.post<UserDTO>(`${this.baseUrl}/users`, dto);
    }

    createAssignment(dto: ProjectAssignmentCreateDTO): Observable<ProjectAssignmentDTO> {
        return this.http.post<ProjectAssignmentDTO>(`${this.baseUrl}/project-assignments`, dto);
    }

    deleteAssignment(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/project-assignments/${id}`);
    }
}
