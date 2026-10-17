export interface UserDTO {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'ADMIN' | 'DIRECTOR' | 'MANAGER' | 'DT_REFERENT';
    active: boolean;
    createdAt: string;
}

export interface UserCreateDTO {
    username: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    role: string;
}

export interface ProjectAssignmentDTO {
    id: number;
    userId: number;
    username: string;
    projectId: number;
    projectName: string;
    role: 'MANAGER' | 'DT_REFERENT';
}

export interface ProjectAssignmentCreateDTO {
    userId: number;
    projectId: number;
    role: string;
}
