export interface TechnologyCategoryDTO {
    id: number;
    code: string;
    name: string;
    description: string;
}

export interface TechnologyItemDTO {
    id: number;
    name: string;
    version: string;
    description: string;
    status: 'ACTIVE' | 'OBSOLETE' | 'DEPRECATED';
    categoryCode: string;
    categoryName: string;
    createdAt: string;
    updatedAt: string;
}

export interface TechnologyItemCreateDTO {
    name: string;
    version?: string;
    description?: string;
    status?: string;
    categoryCode: string;
}

export interface TechnologyItemUpdateDTO {
    name: string;
    version?: string;
    description?: string;
    status: string;
}
