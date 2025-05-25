import {Role} from "./role.interface";

export interface Center {
    id: number;
    name: string;
    direction?: string;
    cp?: string;
    email?: string;
    phone?: string;
    role_id?: Role;
}