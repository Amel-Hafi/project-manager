export interface ProjectDTO {
    id: number;
    name: string;
    description: string;
    clientId: number;
    clientName: string;
    createdAt: string;
    updatedAt: string;
}

export interface ProjectCreateDTO {
    name: string;
    description?: string;
    clientId: number;
}

export interface ProjectUpdateDTO {
    name: string;
    description?: string;
    clientId: number;
}
