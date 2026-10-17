import { ProjectKpiSummaryDTO } from './maturity-kpi.model';

export type TrafficLightStatus = 'GREEN' | 'YELLOW' | 'RED';

export interface ClientKpiSummaryDTO {
    clientId: number;
    clientName: string;
    averageIndustrialization: number | null;
    averageCodeQuality: number | null;
    averageTesting: number | null;
    averageDeployment: number | null;
    averageObsolescence: number | null;
    averageAiAdoption: number | null;
    overallAverage: number | null;
    overallStatus: TrafficLightStatus;
    projectCount: number;
    applicationCount: number;
    projectSummaries: ProjectKpiSummaryDTO[];
}

export interface GlobalDashboardDTO {
    totalClients: number;
    totalProjects: number;
    totalApplications: number;
    averageIndustrialization: number | null;
    averageCodeQuality: number | null;
    averageTesting: number | null;
    averageDeployment: number | null;
    averageObsolescence: number | null;
    averageAiAdoption: number | null;
    overallAverage: number | null;
    overallStatus: TrafficLightStatus;
    clientSummaries: ClientKpiSummaryDTO[];
    docUpToDateRatio: number | null;
    totalCriticalCves: number | null;
}

export interface ReferentWorkloadDTO {
    userId: number;
    username: string;
    fullName: string;
    applicationCount: number;
    projectCount: number;
}
