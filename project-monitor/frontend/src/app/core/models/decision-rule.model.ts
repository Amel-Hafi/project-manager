export type KpiDimension = 'INDUSTRIALIZATION' | 'CODE_QUALITY' | 'TESTING' | 'DEPLOYMENT' | 'OBSOLESCENCE' | 'AI_ADOPTION';
export type ConditionType = 'VALUE_BELOW_THRESHOLD' | 'PERCENTAGE_BELOW_THRESHOLD';
export type AggregationLevel = 'APPLICATION' | 'PROJECT' | 'CLIENT' | 'GLOBAL';
export type TrafficLightResult = 'GREEN' | 'YELLOW' | 'RED';

export interface DecisionRuleDTO {
    id: number;
    name: string;
    description?: string;
    dimension?: KpiDimension;
    conditionType: ConditionType;
    threshold: number;
    aggregationLevel: AggregationLevel;
    trafficLightResult: TrafficLightResult;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface EvaluationResult {
    evaluated: number;
    risksCreated: number;
    risksResolved: number;
}
