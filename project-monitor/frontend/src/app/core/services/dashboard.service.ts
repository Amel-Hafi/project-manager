import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClientKpiSummaryDTO, GlobalDashboardDTO, ReferentWorkloadDTO } from '../models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
    private http = inject(HttpClient);

    getClientSummary(clientId: number): Observable<ClientKpiSummaryDTO> {
        return this.http.get<ClientKpiSummaryDTO>(`/api/v1/dashboard/clients/${clientId}`);
    }

    getGlobalDashboard(): Observable<GlobalDashboardDTO> {
        return this.http.get<GlobalDashboardDTO>(`/api/v1/dashboard/global`);
    }

    getReferentWorkload(): Observable<ReferentWorkloadDTO[]> {
        return this.http.get<ReferentWorkloadDTO[]>('/api/v1/dashboard/referent-workload');
    }
}
