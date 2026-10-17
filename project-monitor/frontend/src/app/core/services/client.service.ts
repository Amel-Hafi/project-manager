import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ClientDTO, ClientCreateDTO, ClientUpdateDTO } from '../models';
import { Page, PageRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class ClientService {
    private http = inject(HttpClient);
    private baseUrl = environment.apiUrl;

    getClients(pageRequest: PageRequest): Observable<Page<ClientDTO>> {
        const params = new HttpParams()
            .set('page', pageRequest.page.toString())
            .set('size', pageRequest.size.toString());
        return this.http.get<Page<ClientDTO>>(`${this.baseUrl}/clients`, { params });
    }

    createClient(dto: ClientCreateDTO): Observable<ClientDTO> {
        return this.http.post<ClientDTO>(`${this.baseUrl}/clients`, dto);
    }

    updateClient(id: number, dto: ClientUpdateDTO): Observable<ClientDTO> {
        return this.http.put<ClientDTO>(`${this.baseUrl}/clients/${id}`, dto);
    }

    deleteClient(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/clients/${id}`);
    }
}
