export interface ClientDTO {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface ClientCreateDTO {
    name: string;
    description?: string;
}

export interface ClientUpdateDTO {
    name: string;
    description?: string;
}
