import { Province } from "./province.interface";

export interface Locality {
    id: number;
    name: string;
    province_id?: Province;
}