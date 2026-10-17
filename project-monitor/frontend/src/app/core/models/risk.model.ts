export type RiskType = 'SECURITY' | 'OPERATIONAL' | 'QUALITY' | 'AVAILABILITY';
export type RiskSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type RiskSource = 'AUTO' | 'MANUAL';

export interface RiskDTO {
    id: number;
    applicationId: number;
    applicationName: string;
    type: RiskType;
    source: RiskSource;
    severity: RiskSeverity;
    description: string;
    actionPlan: string | null;
    resolved: boolean;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface RiskCreateDTO {
    type: RiskType;
    severity: RiskSeverity;
    description: string;
    actionPlan?: string;
}

export interface RiskUpdateDTO {
    severity?: RiskSeverity;
    description?: string;
    actionPlan?: string;
    resolved?: boolean;
}
