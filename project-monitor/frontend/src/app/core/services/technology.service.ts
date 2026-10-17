import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
    TechnologyCategoryDTO,
    TechnologyItemDTO,
    TechnologyItemCreateDTO,
    TechnologyItemUpdateDTO
} from '../models';
import { Page, PageRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class TechnologyService {
    private http = inject(HttpClient);
    private baseUrl = environment.apiUrl;

    getCategories(): Observable<TechnologyCategoryDTO[]> {
        return this.http.get<TechnologyCategoryDTO[]>(`${this.baseUrl}/technology-categories`);
    }

    getItemsByCategory(categoryCode: string, pageRequest: PageRequest): Observable<Page<TechnologyItemDTO>> {
        const params = new HttpParams()
            .set('page', pageRequest.page.toString())
            .set('size', pageRequest.size.toString());
        return this.http.get<Page<TechnologyItemDTO>>(
            `${this.baseUrl}/technology-categories/${categoryCode}/items`,
            { params }
        );
    }

    createItem(dto: TechnologyItemCreateDTO): Observable<TechnologyItemDTO> {
        return this.http.post<TechnologyItemDTO>(`${this.baseUrl}/technology-items`, dto);
    }

    updateItem(id: number, dto: TechnologyItemUpdateDTO): Observable<TechnologyItemDTO> {
        return this.http.put<TechnologyItemDTO>(`${this.baseUrl}/technology-items/${id}`, dto);
    }

    deleteItem(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/technology-items/${id}`);
    }

    deactivateItem(id: number): Observable<TechnologyItemDTO> {
        return this.http.patch<TechnologyItemDTO>(`${this.baseUrl}/technology-items/${id}/deactivate`, {});
    }

    reactivateItem(id: number): Observable<TechnologyItemDTO> {
        return this.http.patch<TechnologyItemDTO>(`${this.baseUrl}/technology-items/${id}/reactivate`, {});
    }

    getActiveItemsByCategory(categoryCode: string): Observable<TechnologyItemDTO[]> {
        return this.http.get<TechnologyItemDTO[]>(
            `${this.baseUrl}/technology-categories/${categoryCode}/items/active`
        );
    }
}
