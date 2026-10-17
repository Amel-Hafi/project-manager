export type AiCaseStatus = 'PENDING' | 'VALIDATED';

export interface AiSuccessCaseDTO {
    id: number;
    applicationId: number;
    applicationName: string;
    title: string;
    tool: string;
    profile: string;
    description: string | null;
    estimatedImpact: string | null;
    caseDate: string | null;
    status: AiCaseStatus;
    createdAt: string;
    updatedAt: string;
}

export interface AiSuccessCaseCreateDTO {
    title: string;
    tool: string;
    profile: string;
    description?: string;
    estimatedImpact?: string;
    caseDate?: string;
}

export interface AiSuccessCaseUpdateDTO {
    title?: string;
    tool?: string;
    profile?: string;
    description?: string;
    estimatedImpact?: string;
    caseDate?: string;
}
