import { KpiDimension } from './decision-rule.model';

export interface KpiTemplate {
    id: number;
    dimension: KpiDimension;
    version: string;
    content: { [level: number]: string };
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface KpiTemplateCreate {
    dimension: KpiDimension;
    version: string;
    content: { [level: number]: string };
    active: boolean;
}
