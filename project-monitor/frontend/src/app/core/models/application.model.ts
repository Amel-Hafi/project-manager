import { TechnologyItemDTO } from './technology.model';

export interface ApplicationDTO {
    id: number;
    name: string;
    description: string;
    startDate: string;
    status: 'ACTIVE' | 'MAINTENANCE' | 'OBSOLETE' | 'BUILDING';
    projectId: number;
    projectName: string;
    repositoryUrls: string[];
    technologies: TechnologyItemDTO[];
    createdAt: string;
    updatedAt: string;
    lastProductionDeploymentDate: string | null;
    activeCriticalCves: number | null;
    technicalDocUpToDate: boolean | null;
}

export interface ApplicationCreateDTO {
    name: string;
    description?: string;
    startDate?: string;
    status?: string;
    projectId: number;
    repositoryUrls?: string[];
    technologyIds?: number[];
}

export interface ApplicationUpdateDTO {
    name: string;
    description?: string;
    startDate?: string;
    status?: string;
    projectId: number;
    repositoryUrls?: string[];
}
