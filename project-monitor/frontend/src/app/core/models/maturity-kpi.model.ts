import { TrafficLightStatus } from './dashboard.model';

export interface MaturityKpiDTO {
    id: number | null;
    applicationId: number;
    applicationName: string;
    industrialization: number | null;
    codeQuality: number | null;
    testing: number | null;
    deployment: number | null;
    obsolescence: number | null;
    aiAdoption: number | null;
    updatedAt: string | null;
    justificationIndustrialization: string | null;
    justificationCodeQuality: string | null;
    justificationTesting: string | null;
    justificationDeployment: string | null;
    justificationObsolescence: string | null;
    justificationAiAdoption: string | null;
    evaluatedAt: string | null;
}

export interface MaturityKpiUpdateDTO {
    industrialization: number | null;
    codeQuality: number | null;
    testing: number | null;
    deployment: number | null;
    obsolescence: number | null;
    aiAdoption: number | null;
    justificationIndustrialization?: string | null;
    justificationCodeQuality?: string | null;
    justificationTesting?: string | null;
    justificationDeployment?: string | null;
    justificationObsolescence?: string | null;
    justificationAiAdoption?: string | null;
}

export interface ProjectKpiSummaryDTO {
    projectId: number;
    projectName: string;
    averageIndustrialization: number | null;
    averageCodeQuality: number | null;
    averageTesting: number | null;
    averageDeployment: number | null;
    averageObsolescence: number | null;
    averageAiAdoption: number | null;
    overallAverage: number | null;
    overallStatus: TrafficLightStatus;
    applicationCount: number;
    applicationKpis: MaturityKpiDTO[];
}
